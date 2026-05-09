import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Play, Copy, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function VoiceToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [convertToSigns, setConvertToSigns] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isListening) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  // 🎤 START LISTENING
  const handleStartListening = () => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        toast.error('Speech recognition is not supported in your browser');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        toast.success('Listening... Speak now');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            final += text;
          } else {
            interim += text;
          }
        }

        if (final) {
          setTranscript(prev => (prev + ' ' + final).trim());
        }

        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.error(event.error);
        toast.error('Speech recognition error');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (error) {
      toast.error('Could not access microphone');
      setIsListening(false);
    }
  };

  // 🛑 STOP LISTENING
  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setInterimTranscript('');
    toast.info('Stopped listening');
  };

  const handleClear = () => {
    setTranscript('');
    setInterimTranscript('');
    setConvertToSigns(false);
  };

 
  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    // { value: 'es-ES', label: 'Spanish' },
    // { value: 'fr-FR', label: 'French' },
    // { value: 'de-DE', label: 'German' },
    // { value: 'it-IT', label: 'Italian' },
    // { value: 'ja-JP', label: 'Japanese' },
   // { value: 'zh-CN', label: 'Chinese' },
  ];

  return (
    <div className="relative max-w-6xl mx-auto space-y-6 px-4">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Voice to text
        </h1>
        <p className="text-gray-600">
          Speak and convert voice to text instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* INPUT */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Input</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* MIC */}
            <div className="text-center">
              {isListening ? (
                <Mic className="w-16 h-16 text-red-500 mx-auto" />
              ) : (
                <MicOff className="w-16 h-16 text-gray-400 mx-auto" />
              )}
              <p className="mt-2">
                {isListening ? 'Listening...' : 'Click to start'}
              </p>
            </div>

            {/* AUDIO LEVEL */}
            {isListening && (
              <div>
                <p className="text-sm">Audio Level</p>
                <Progress value={audioLevel} />
              </div>
            )}

            {/* LANGUAGE */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          <div className="flex gap-2 w-full">
  {!isListening ? (
    <Button 
      onClick={handleStartListening} 
      className="flex-1"
    >
      <Mic className="w-4 h-4 mr-2" />
      Start
    </Button>
  ) : (
    <Button 
      onClick={handleStopListening} 
      variant="destructive" 
      className="flex-1"
    >
      <MicOff className="w-4 h-4 mr-2" />
      Stop
    </Button>
  )}

  <Button 
    variant="outline" 
    onClick={handleClear}
    className="px-4 whitespace-nowrap"
  >
    Clear
  </Button>
</div>

          </CardContent>
        </Card>

        {/* OUTPUT */}
        <Card>
          <CardHeader>
            <CardTitle>text </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <div className="min-h-[150px] p-4 bg-gray-100 rounded">
              {transcript || interimTranscript ? (
                <>
                  <p className="text-lg">{transcript}</p>
                  <p className="text-gray-500 italic">{interimTranscript}</p>
                </>
              ) : (
                <p className="text-gray-400 text-center">
                  Your text will appear here
                </p>
              )}
            </div>

            {transcript && (
              <>
                <div className="flex justify-between text-sm">
                  <span>{transcript.split(' ').length} words</span>
                  <Badge>
                    ~{(transcript.split(' ').length * 1.5).toFixed(0)}s
                  </Badge>
                </div>

            
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(transcript);
                    toast.success('Copied!');
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  );
}