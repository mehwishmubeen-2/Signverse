import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Play, Send, Bot, User as UserIcon, Sparkles, Volume2, VolumeX, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';
import { searchSigns, videoUrl, type SearchResult } from '../../lib/signverseApi';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  results?: SearchResult[];   // one entry per word in the query
  timestamp: Date;
  isError?: boolean;
}

// ── Video Card ─────────────────────────────────────────────────────────────────
// Shows a real <video> from the Flask /api/video/<id> endpoint.

function SignVideoCard({ result }: { result: SearchResult }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else           { v.pause(); setPlaying(false); }
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const matchColor =
    result.match_type === 'exact'  ? 'bg-green-100 text-green-700 border-green-300' :
    result.match_type === 'fuzzy'  ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                                     'bg-red-100 text-red-700 border-red-300';

  // Word not found — show a simple tile
  if (!result.video || result.match_type === 'none') {
    return (
      <div className="bg-white rounded-xl p-3 flex items-center gap-3 border border-red-100">
        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
          <span className="text-lg">🤷</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 capitalize">{result.input_word}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${matchColor}`}>not found</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
    >
      {/* Word + badge */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <div>
          <p className="text-sm font-semibold text-gray-800 capitalize">{result.matched_word}</p>
          {result.matched_word !== result.input_word && (
            <p className="text-xs text-gray-400">for "{result.input_word}"</p>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${matchColor}`}>
          {result.match_type}
        </span>
      </div>

      {/* Video */}
      <div ref={containerRef} className={`relative overflow-hidden bg-gray-900 ${isFullscreen ? 'w-screen h-screen' : 'mx-3 mb-3 rounded-lg aspect-video'}`}>
        <video
          ref={videoRef}
          src={videoUrl(result.video.id)}
          muted={muted}
          loop
          playsInline
          className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
          onEnded={() => setPlaying(false)}
        />

        {/* Overlay controls */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence>
            {!playing && (
              <motion.button
                key="play"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={toggle}
                className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <Play className="w-5 h-5 text-blue-600 ml-0.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-gradient-to-t from-black/60 to-transparent">
          <button onClick={toggle} className="text-white/80 hover:text-white text-xs">
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setMuted(m => !m)} className="text-white/80 hover:text-white">
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button onClick={toggleFullscreen} className="text-white/80 hover:text-white" title="Fullscreen">
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Sentence result — carousel of word cards ──────────────────────────────────

function SentenceResults({ results }: { results: SearchResult[] }) {
  const [index, setIndex] = useState(0);
  const matched = results.filter(r => r.match_type !== 'none');
  const total   = results.length;

  if (total === 0) return null;

  // Single word — no carousel chrome needed
  if (total === 1) return <SignVideoCard result={results[0]} />;

  return (
    <div className="space-y-2">
      {/* Word pill strip */}
      <div className="flex flex-wrap gap-1">
        {results.map((r, i) => (
          <button key={i} onClick={() => setIndex(i)}
            className={`text-xs px-2 py-0.5 rounded-full border transition-all capitalize ${
              i === index
                ? 'bg-blue-500 text-white border-blue-500'
                : r.match_type === 'none'
                  ? 'bg-red-50 text-red-500 border-red-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-blue-50'
            }`}>
            {r.input_word}
          </button>
        ))}
      </div>

      {/* Current card */}
      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <SignVideoCard result={results[index]} />
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}
          className="flex items-center gap-1 disabled:opacity-30 hover:text-gray-600">
          <ChevronLeft className="w-3 h-3" /> Prev
        </button>
        <span>{index + 1} / {total} · {matched.length} found</span>
        <button onClick={() => setIndex(i => Math.min(total - 1, i + 1))} disabled={index === total - 1}
          className="flex items-center gap-1 disabled:opacity-30 hover:text-gray-600">
          Next <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function SignDictionary() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: "Hello! 👋 I'm your AI sign language assistant powered by the SignVerse database. Type any word or full sentence and I'll show you the signs!",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText]   = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // ── Send message ──────────────────────────────────────────

  const handleSend = useCallback(async () => {
    const query = inputText.trim();
    if (!query || isTyping) return;

    // Add user bubble immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: query,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const data = await searchSigns(query);
      const found = data.total_matched;
      const total = data.results.length;

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: found > 0
          ? total === 1
            ? `Here's the sign for "${data.results[0].matched_word}"!`
            : `Found ${found} of ${total} words in your sentence. Tap each word to see its sign.`
          : `Sorry, I couldn't find any signs for "${query}". Try a different word!`,
        results: data.results,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMsg]);
      if (found > 0) toast.success(`Found ${found} sign${found > 1 ? 's' : ''}!`);

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Backend unreachable';
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: `⚠️ Couldn't reach the backend: ${msg}. Make sure your Flask server is running on port 5000.`,
        timestamp: new Date(),
        isError: true,
      }]);
      toast.error('Backend error — is Flask running?');
    } finally {
      setIsTyping(false);
    }
  }, [inputText, isTyping]);

  const suggestedQueries = ['hello', 'thank you', 'please help me', 'good morning', 'my name is'];

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="relative">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[
          { color: 'bg-blue-500/10', anim: { x:[0,100,0], y:[0,-50,0], scale:[1,1.2,1] }, dur: 20 },
          { color: 'bg-purple-500/10', anim: { x:[0,-100,0], y:[0,50,0], scale:[1,1.3,1] }, dur: 25 },
          { color: 'bg-pink-500/10', anim: { scale:[1,1.5,1], rotate:[0,180,360] }, dur: 30 },
        ].map((b, i) => (
          <motion.div key={i}
            className={`absolute w-96 h-96 rounded-full blur-3xl ${b.color} ${i === 0 ? 'top-0 left-0' : i === 1 ? 'bottom-0 right-0' : 'top-1/2 left-1/2'}`}
            animate={b.anim as object} transition={{ duration: b.dur, repeat: Infinity, ease: 'linear' }} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-5xl mx-auto space-y-6 px-4 sm:px-0">

        {/* Header */}
        <div className="space-y-2 text-center">
          <motion.h1 initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-600 to-pink-600 bg-clip-text text-transparent px-4">
            AI Sign Language Assistant
          </motion.h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">Type any word or sentence and I'll show you the signs!</p>


        </div>

        {/* Chat Container */}
        <Card className="shadow-2xl border-2 border-blue-100">
          <CardContent className="p-0">

            {/* Messages */}
            <ScrollArea className="h-[400px] sm:h-[500px] p-4 sm:p-6" ref={scrollRef}>
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map(message => (
                    <motion.div key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                      {/* Avatar */}
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-br from-blue-400 to-purple-400'
                            : message.isError
                              ? 'bg-gradient-to-br from-red-400 to-orange-400'
                              : 'bg-gradient-to-br from-green-600 to-emerald-600'
                        }`}>
                        {message.type === 'user'
                          ? <UserIcon className="w-5 h-5 text-white" />
                          : <Bot className="w-5 h-5 text-white" />}
                      </motion.div>

                      {/* Bubble */}
                      <div className={`flex-1 min-w-0 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        <motion.div whileHover={{ scale: 1.01 }}
                          className={`inline-block max-w-[85%] rounded-2xl p-4 ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white'
                              : message.isError
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-gray-100 text-gray-900'
                          }`}>
                          <p className="text-sm leading-relaxed">{message.text}</p>

                          {/* Sign results */}
                          {message.results && message.results.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15 }} className="mt-3">
                              <SentenceResults results={message.results} />
                            </motion.div>
                          )}
                        </motion.div>

                        <p className="text-xs text-gray-500 mt-1 px-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <div className="flex gap-1">
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <motion.div key={i} animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay }}
                            className="w-2 h-2 bg-gray-400 rounded-full" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4 bg-gray-50">
              {/* Suggested queries — only shown at start */}
              {messages.length <= 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Try asking:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQueries.map((q, i) => (
                      <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge variant="outline"
                          className="cursor-pointer hover:bg-blue-100 hover:border-blue-300"
                          onClick={() => setInputText(q)}>
                          {q}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Type a word or sentence…"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    className="pl-10 pr-4 py-6"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={handleSend} disabled={!inputText.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-400 to-purple-400 hover:opacity-90 h-full px-6">
                    <Send className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }} className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Bot, color: 'blue', title: 'Real Sign Database', desc: 'Backed by WLASL — thousands of real ASL signs' },
            { icon: Play, color: 'purple', title: 'Video Demonstrations', desc: 'Watch real video examples of every sign' },
            { icon: Sparkles, color: 'green', title: 'Full Sentences', desc: 'Type whole sentences and see each word signed' },
          ].map(({ icon: Icon, color, title, desc }, i) => (
            <Card key={i} className={`bg-gradient-to-br from-${color}-50 to-${color === 'blue' ? 'cyan' : color === 'purple' ? 'pink' : 'emerald'}-50 border-${color}-200`}>
              <CardContent className="pt-6 text-center">
                <Icon className={`w-10 h-10 text-${color}-600 mx-auto mb-3`} />
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
}