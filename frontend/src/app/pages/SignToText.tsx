import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Camera, StopCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import * as ort from 'onnxruntime-web';
import { Hands } from '@mediapipe/hands';

ort.env.wasm.wasmPaths = '/';
ort.env.wasm.numThreads = 1;

const SMOOTH_N = 6;
const HOLD_FRAMES_REQUIRED = 18;
const COOLDOWN_FRAMES = 25;
const CONFIDENCE_THRESHOLD = 0.55;

export function SignToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [inferenceError, setInferenceError] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [holdPct, setHoldPct] = useState(0);
  const [holdStatus, setHoldStatus] = useState('Hold a sign steady to type');
  const [confPct, setConfPct] = useState(0);
  const [labelName, setLabelName] = useState('No hand detected');
  const [predLabel, setPredLabel] = useState('—');
  const [statusText, setStatusText] = useState('Click Start to begin');
  const [debugLogs, setDebugLogs] = useState<{ msg: string; type: 'info' | 'ok' | 'err' }[]>([
    { msg: 'Log...', type: 'info' },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ortSessionRef = useRef<ort.InferenceSession | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const labelsRef = useRef<Record<string, string>>({});
  const isRunningRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const smoothBufRef = useRef<string[]>([]);
  const holdLabelRef = useRef<string | null>(null);
  const holdCountRef = useRef(0);
  const cooldownRef = useRef(0);
  const handDetectedRef = useRef(false);
  const currentWordRef = useRef('');
  const wordsRef = useRef<string[]>([]);
  const debugBoxRef = useRef<HTMLDivElement>(null);
  const onnxInputNameRef = useRef('float_input');

  currentWordRef.current = currentWord;
  wordsRef.current = words;

  const addLog = useCallback((msg: string, type: 'info' | 'ok' | 'err' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev.slice(-50), { msg: `[${time}] ${msg}`, type }]);
    setTimeout(() => {
      if (debugBoxRef.current) debugBoxRef.current.scrollTop = debugBoxRef.current.scrollHeight;
    }, 50);
  }, []);

  useEffect(() => {
    fetch('/labels.json')
      .then(r => r.json())
      .then((data: { label_map?: Record<string, string>; classes?: string[] }) => {
        if (data.label_map) {
          labelsRef.current = data.label_map;
        } else if (data.classes) {
          data.classes.forEach((c, i) => { labelsRef.current[String(i)] = c; });
        }
        addLog('Labels: ' + Object.values(labelsRef.current).join(', '), 'ok');
      })
      .catch(err => addLog('labels.json error: ' + err.message, 'err'));

    ort.InferenceSession.create('/asl_rf_model.onnx', { executionProviders: ['wasm'] })
      .then(session => {
        ortSessionRef.current = session;
        onnxInputNameRef.current = session.inputNames[0];
        addLog('Model ready. Input="' + session.inputNames[0] + '"', 'ok');
      })
      .catch(err => {
        addLog('Load failed: ' + err.message, 'err');
        setInferenceError('Failed to load AI model: ' + err.message);
      });

    const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.4, minTrackingConfidence: 0.4 });
    hands.onResults((results) => onHandResults(results as any));
    handsRef.current = hands;

    return () => { hands.close(); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') { e.preventDefault(); deleteLetter(); }
      if (e.key === 'Enter') { e.preventDefault(); addSpace(); }
      if (e.key === 'Escape') { e.preventDefault(); clearAll(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function extractFeatures(landmarks: Array<{ x: number; y: number; z: number }>) {
    const coords = landmarks.map(lm => [1 - lm.x, lm.y, lm.z]);
    const wx = coords[0][0], wy = coords[0][1], wz = coords[0][2];
    for (let i = 0; i < 21; i++) {
      coords[i][0] -= wx; coords[i][1] -= wy; coords[i][2] -= wz;
    }
    let scale = 1e-6;
    for (let i = 0; i < 21; i++)
      for (let j = 0; j < 3; j++)
        if (Math.abs(coords[i][j]) > scale) scale = Math.abs(coords[i][j]);
    const features = new Float32Array(63);
    let idx = 0;
    for (let i = 0; i < 21; i++) {
      features[idx++] = coords[i][0] / scale;
      features[idx++] = coords[i][1] / scale;
      features[idx++] = coords[i][2] / scale;
    }
    return features;
  }

  function drawLandmarks(landmarks: Array<{ x: number; y: number }> | null) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!landmarks?.length) return;
    const W = canvas.width, H = canvas.height;
    const pts = landmarks.map(p => ({ x: p.x * W, y: p.y * H }));
    const conns = [
      [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17]
    ];
    ctx.strokeStyle = 'rgba(255,165,0,0.85)'; ctx.lineWidth = 2;
    conns.forEach(([a, b]) => {
      ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
    });
    pts.forEach((p, i) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, i === 0 ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#facc15' : '#00ffff'; ctx.fill();
    });
  }

  async function onHandResults(results: { multiHandLandmarks?: Array<Array<{ x: number; y: number; z: number }>> }) {
    const lmList = results.multiHandLandmarks;

    if (!lmList || lmList.length === 0) {
      drawLandmarks(null);
      if (handDetectedRef.current) {
        setPredLabel('—');
        setLabelName('No hand detected');
        setConfPct(0);
        setHoldPct(0);
        setHoldStatus('Hold a sign steady to type');
        handDetectedRef.current = false;
        smoothBufRef.current = [];
      }
      holdLabelRef.current = null; holdCountRef.current = 0;
      if (cooldownRef.current > 0) cooldownRef.current--;
      return;
    }

    if (!handDetectedRef.current) { addLog('Hand detected', 'ok'); handDetectedRef.current = true; }
    drawLandmarks(lmList[0] as any);

    frameCountRef.current++;
    if (frameCountRef.current % 2 !== 0) return;
    if (!ortSessionRef.current) return;

    const features = extractFeatures(lmList[0]);

    try {
      const tensor = new ort.Tensor('float32', features, [1, 63]);
      const out = await ortSessionRef.current.run(
        { [onnxInputNameRef.current]: tensor },
        [ortSessionRef.current.outputNames[0]]
      );
      const raw = out[ortSessionRef.current.outputNames[0]].data[0];
      const key = typeof raw === 'bigint' ? String(Number(raw)) : String(Math.round(Number(raw)));
      const label = labelsRef.current[key] ?? ('?' + key);

      smoothBufRef.current.push(label);
      if (smoothBufRef.current.length > SMOOTH_N) smoothBufRef.current.shift();
      const freq: Record<string, number> = {};
      smoothBufRef.current.forEach(p => { freq[p] = (freq[p] || 0) + 1; });
      const smoothed = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
      const conf = freq[smoothed] / smoothBufRef.current.length;
      const pct = Math.round(conf * 100);

      setPredLabel(smoothed);
      setLabelName(smoothed === 'Nothing' ? 'No sign' : smoothed === 'Space' ? 'SPACE — hold to end word' : 'Sign: ' + smoothed);
      setConfPct(pct);

      if (cooldownRef.current > 0) {
        cooldownRef.current--;
        holdLabelRef.current = null; holdCountRef.current = 0;
        setHoldPct(0);
        setHoldStatus(`Cooldown... (${cooldownRef.current})`);
        return;
      }

      if (smoothed === 'Nothing' || conf < CONFIDENCE_THRESHOLD) {
        holdLabelRef.current = null; holdCountRef.current = 0;
        setHoldPct(0);
        setHoldStatus('Hold a sign steady to type');
        return;
      }

      if (smoothed === holdLabelRef.current) {
        holdCountRef.current++;
      } else {
        holdLabelRef.current = smoothed;
        holdCountRef.current = 1;
      }

      const hp = Math.min((holdCountRef.current / HOLD_FRAMES_REQUIRED) * 100, 100);
      setHoldPct(hp);
      setHoldStatus(hp >= 100 ? '✓ Held!' : `Holding "${smoothed}"... ${Math.round(hp)}%`);

      if (holdCountRef.current >= HOLD_FRAMES_REQUIRED) {
        holdCountRef.current = 0;
        cooldownRef.current = COOLDOWN_FRAMES;

        if (smoothed === 'Space') {
          const completedWord = currentWordRef.current.trim();
          if (completedWord) {
            setWords(prev => [...prev, completedWord]);
            wordsRef.current = [...wordsRef.current, completedWord];
            setCurrentWord('');
            currentWordRef.current = '';
            toast.success(`Word "${completedWord}" added!`);
            addLog('Word committed: ' + completedWord, 'ok');
          } else {
            toast.info('Space — no word to save');
          }
        } else {
          setCurrentWord(prev => prev + smoothed);
          toast.success(`+ ${smoothed}`);
        }
      }
    } catch (err) {
      if (frameCountRef.current <= 20) addLog('Inference error: ' + (err instanceof Error ? err.message : err), 'err');
    }
  }

  async function processLoop() {
    if (!isRunningRef.current) return;
    const video = videoRef.current;
    if (video && video.readyState >= 2 && video.videoWidth > 0 && handsRef.current) {
      try { await handsRef.current.send({ image: video }); } catch (_) {}
    }
    rafIdRef.current = requestAnimationFrame(processLoop);
  }

  const handleStartRecording = async () => {
    addLog('Loading model...', 'info');
    setStatusText('Loading model...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>(r => { videoRef.current!.onloadedmetadata = () => r(); });
        await videoRef.current.play();
      }
      isRunningRef.current = true;
      frameCountRef.current = 0;
      setIsRecording(true);
      setStatusText('Running — hold a sign steady to type!');
      addLog('Camera ready', 'ok');
      toast.success('Recording started');
      processLoop();
    } catch (err) {
      addLog('Camera error: ' + (err instanceof Error ? err.message : err), 'err');
      setStatusText('Camera error');
      toast.error('Could not access camera.');
    }
  };

  const handleStopRecording = () => {
    isRunningRef.current = false;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    const canvas = canvasRef.current;
    if (canvas) { const ctx = canvas.getContext('2d'); ctx?.clearRect(0, 0, canvas.width, canvas.height); }
    setIsRecording(false);
    setPredLabel('—');
    setLabelName('No hand detected');
    setConfPct(0);
    setHoldPct(0);
    setHoldStatus('Hold a sign steady to type');
    setStatusText('Stopped.');
    holdLabelRef.current = null; holdCountRef.current = 0;
    smoothBufRef.current = [];
    handDetectedRef.current = false;
    addLog('Stopped.', 'info');
  };

  function deleteLetter() {
    if (currentWordRef.current.length > 0) {
      setCurrentWord(prev => prev.slice(0, -1));
      toast.info('Deleted letter');
    } else if (wordsRef.current.length > 0) {
      const last = wordsRef.current[wordsRef.current.length - 1];
      setWords(prev => prev.slice(0, -1));
      setCurrentWord(last);
      toast.info('Restored last word for editing');
    }
  }

  function addSpace() {
    const w = currentWordRef.current.trim();
    if (w) {
      setWords(prev => [...prev, w]);
      setCurrentWord('');
      toast.success(`Word "${w}" added!`);
    } else {
      toast.error('Type a word first');
    }
  }

  function clearWord() {
    setCurrentWord('');
    toast.info('Word cleared');
  }

  function clearAll() {
    setCurrentWord('');
    setWords([]);
    toast.info('Cleared everything');
  }

  function copySentence() {
    const s = (wordsRef.current.join(' ') + (currentWordRef.current ? (wordsRef.current.length > 0 ? ' ' + currentWordRef.current : currentWordRef.current) : '')).trim();
    if (!s) { toast.error('Nothing to copy'); return; }
    navigator.clipboard.writeText(s).then(() => toast.success('Copied!'));
  }

  function speakSentence() {
    const s = (wordsRef.current.join(' ') + (currentWordRef.current ? (wordsRef.current.length > 0 ? ' ' + currentWordRef.current : currentWordRef.current) : '')).trim();
    if (!s) { toast.error('Nothing to speak'); return; }
    const utt = new SpeechSynthesisUtterance(s);
    utt.rate = 0.9;
    speechSynthesis.speak(utt);
    toast.info('Speaking...');
  }

  const sentence = words.join(' ') + (currentWord ? (words.length > 0 ? ' ' + currentWord : currentWord) : '');
  const confBarColor = confPct / 100 > 0.7 ? '#4ade80' : confPct / 100 > 0.4 ? '#facc15' : '#f87171';
  const predColor = predLabel === 'Nothing' ? '#6b7280' : predLabel === 'Space' ? '#ca8a04' : '#16a34a';

  return (
    <div className="relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6 px-4 sm:px-0">

        {/* Header */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Sign to Text Translation
          </h1>
        </motion.div>

        {/* Main two-column layout */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── LEFT ── */}
            <div className="flex flex-col gap-4">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-3 space-y-3">

                  {/* Video container */}
                  <div className="relative rounded-lg overflow-hidden bg-blue-50 border border-blue-200">
                    <video ref={videoRef} className="w-full block" style={{ transform: 'scaleX(-1)' }}
                      autoPlay playsInline muted />
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"
                      style={{ transform: 'scaleX(-1)' }} />
                    {!isRecording && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-blue-700">
                          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                            <Camera className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                          </motion.div>
                          <p className="text-sm font-medium">Click Start to begin</p>
                        </div>
                      </div>
                    )}
                    {isRecording && (
                      <motion.div className="absolute top-3 left-3"
                        animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <Badge variant="destructive">● Recording</Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Hold bar */}
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ background: holdPct >= 100 ? '#4ade80' : '#6366f1' }}
                      animate={{ width: `${holdPct}%` }} transition={{ duration: 0.08 }} />
                  </div>
                  <p className="text-xs text-gray-500">{holdStatus}</p>

                  {/* Prediction box */}
                  <div className="flex items-center gap-4 bg-white border border-blue-200 rounded-xl px-4 py-3 shadow-sm">
                    <span className="text-5xl font-bold min-w-[4rem] text-center leading-none"
                      style={{ color: predColor }}>
                      {predLabel}
                    </span>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm" style={{ color: predLabel === 'Space' ? '#ca8a04' : '#16a34a' }}>
                        {labelName}
                      </p>
                      <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-150"
                          style={{ width: `${confPct}%`, background: confBarColor }} />
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <p className="text-center text-yellow-600 text-sm font-medium">{statusText}</p>

                  {/* Start / Stop */}
                  <div className="flex gap-2">
                    {!isRecording ? (
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={handleStartRecording}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
                          <Camera className="w-4 h-4 mr-2" /> Start Camera
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={handleStopRecording} variant="destructive" className="w-full">
                          <StopCircle className="w-4 h-4 mr-2" /> Stop
                        </Button>
                      </motion.div>
                    )}
                  </div>

                  {inferenceError && (
                    <p className="text-xs text-red-400 bg-red-950 border border-red-800 rounded p-2">⚠ {inferenceError}</p>
                  )}

                </CardContent>
              </Card>
            </div>

            {/* ── RIGHT ── */}
            <div className="flex flex-col gap-4">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Communication Panel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  {/* Current Word */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Current Word</p>
                    <div className="bg-white border border-blue-300 rounded-lg px-4 py-3 min-h-[56px] flex items-center shadow-sm">
                      <span className="text-2xl font-bold tracking-[4px] text-purple-600">{currentWord}</span>
                      <motion.span className="text-2xl text-blue-500"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}>
                        |
                      </motion.span>
                    </div>
                  </div>

                  {/* Word buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline"
                      className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                      onClick={deleteLetter}>
                       Delete Letter
                    </Button>
                    <Button size="sm" variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50"
                      onClick={addSpace}>
                      Add Space / Next Word
                    </Button>
                    <Button size="sm" variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={clearWord}>
                       Clear Word
                    </Button>
                  </div>

                  {/* Sentence */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Sentence</p>
                    <div className="bg-white border border-blue-300 rounded-lg px-4 py-3 min-h-[48px] shadow-sm">
                      <p className="text-blue-600 text-sm leading-relaxed break-words">
                        {sentence || <span className="text-gray-600 italic">(empty)</span>}
                      </p>
                    </div>
                  </div>

                  {/* Sentence buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white"
                      onClick={speakSentence}>
                      🔊 Speak
                    </Button>
                    <Button size="sm" variant="outline" onClick={copySentence}>
                      📋 Copy
                    </Button>
                    <Button size="sm" variant="destructive" onClick={clearAll}>
                      🗑 Clear All
                    </Button>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>

          {/* ── TIPS — full width below both columns ── */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
            <CardContent className="pt-4 pb-4">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" />
                Tips for Better Recognition
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { icon: '💡', text: 'Ensure good lighting' },
                  { icon: '🖐️', text: 'Keep hands visible in frame' },
                  { icon: '⏱️', text: 'Hold each sign for ~1 second' },
                  { icon: '🎨', text: 'Use a plain background' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 bg-white/60 rounded-lg px-3 py-2 border border-blue-100">
                    <span className="text-base leading-none mt-0.5">{tip.icon}</span>
                    <p className="text-xs text-blue-800 leading-snug">{tip.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </motion.div>
      </div>
    </div>
  );
}