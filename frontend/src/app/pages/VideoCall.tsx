import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  MessageSquare,
  Users,
  Maximize2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export function VideoCall() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [voiceTranscript, setVoiceTranscript] = useState<string[]>([]);
  const [signTranscript, setSignTranscript] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate real-time transcription
  useEffect(() => {
    if (!isCallActive) return;

    const voiceInterval = setInterval(() => {
      const samplePhrases = [
        'Hello, how are you?',
        'Nice to meet you',
        'Can you help me?',
        'Thank you so much',
        'Have a great day'
      ];
      const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
      setVoiceTranscript(prev => [...prev, `User: ${randomPhrase}`].slice(-10));
    }, 8000);

    const signInterval = setInterval(() => {
      const sampleSigns = [
        'hello',
        'thank you',
        'yes',
        'understand',
        'friend'
      ];
      const randomSign = sampleSigns[Math.floor(Math.random() * sampleSigns.length)];
      setSignTranscript(prev => [...prev, `Detected: "${randomSign}"`].slice(-10));
    }, 6000);

    return () => {
      clearInterval(voiceInterval);
      clearInterval(signInterval);
    };
  }, [isCallActive]);

  const handleStartCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCallActive(true);
      toast.success('Call started');
    } catch (error) {
      toast.error('Could not access camera/microphone');
    }
  };

  const handleEndCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCallActive(false);
    setVoiceTranscript([]);
    setSignTranscript([]);
    toast.info('Call ended');
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    toast.info(isCameraOn ? 'Camera turned off' : 'Camera turned on');
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    toast.info(isMicOn ? 'Microphone muted' : 'Microphone unmuted');
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast.info(isSpeakerOn ? 'Speaker muted' : 'Speaker unmuted');
  };


  return (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-4">
      
      <h2 className="text-2xl font-bold text-gray-800">
         Feature Coming Soon
      </h2>

      <p className="text-gray-600">
        Video Call with Live Translation will be implemented in <strong>FYP 2</strong>.
      </p>

      <p className="text-sm text-gray-500">
        This includes real-time voice-to-text and sign language recognition.
      </p>

      <Button
        onClick={() => window.history.back()}
        className="w-full mt-4"
      >
        Go Back
      </Button>

    </div>
  </div>
);
}
//   return (
//     <div className="relative">
//       {/* Animated Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
//           animate={{
//             x: [0, 100, 0],
//             y: [0, -50, 0],
//             scale: [1, 1.2, 1]
//           }}
//           transition={{
//             duration: 20,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//         />
//         <motion.div
//           className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
//           animate={{
//             x: [0, -100, 0],
//             y: [0, 50, 0],
//             scale: [1, 1.3, 1]
//           }}
//           transition={{
//             duration: 25,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//         />
//         <motion.div
//           className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
//           animate={{
//             scale: [1, 1.5, 1],
//             rotate: [0, 180, 360]
//           }}
//           transition={{
//             duration: 30,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//         />
//       </div>

//       <div className="relative z-10 space-y-6 px-4 sm:px-0">
//         {/* Header */}
//         <motion.div
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="space-y-2"
//         >
//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//           Video Call with Live Translation
//         </h1>
//         <p className="text-sm sm:text-base text-gray-600">Connect with real-time voice-to-text and sign-to-text conversion</p>
//       </motion.div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Video Area */}
//         <motion.div
//           initial={{ scale: 0.95, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ delay: 0.1 }}
//           className="lg:col-span-2 space-y-4"
//         >
//           {/* Video Display */}
//           <Card className="overflow-hidden shadow-2xl">
//             <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
//               {isCallActive ? (
//                 <>
//                   {/* Local Video */}
//                   <video
//                     ref={videoRef}
//                     className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
//                     autoPlay
//                     muted
//                   />
//                   {!isCameraOn && (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="text-center text-white">
//                         <VideoOff className="w-20 h-20 mx-auto mb-4 opacity-50" />
//                         <p className="opacity-75">Camera is off</p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Remote Video Placeholder */}
//                   <motion.div
//                     initial={{ scale: 0, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     className="absolute top-4 right-4 w-48 h-36 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg overflow-hidden"
//                   >
//                     <div className="w-full h-full flex items-center justify-center text-white">
//                       <div className="text-center">
//                         <Users className="w-12 h-12 mx-auto mb-2" />
//                         <p className="text-sm">Waiting for participant...</p>
//                       </div>
//                     </div>
//                   </motion.div>

//                   {/* Status Indicators */}
//                   <div className="absolute top-4 left-4 flex gap-2">
//                     <Badge variant="destructive" className="animate-pulse">
//                       ● LIVE
//                     </Badge>
//                     <Badge variant="secondary">
//                       {new Date().toLocaleTimeString()}
//                     </Badge>
//                   </div>

//                   {/* Live Captions */}
//                   {showCaptions && voiceTranscript.length > 0 && (
//                     <motion.div
//                       initial={{ y: 20, opacity: 0 }}
//                       animate={{ y: 0, opacity: 1 }}
//                       className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4"
//                     >
//                       <p className="text-white text-lg font-medium">
//                         {voiceTranscript[voiceTranscript.length - 1]}
//                       </p>
//                     </motion.div>
//                   )}
//                 </>
//               ) : (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="text-center text-white">
//                     <motion.div
//                       animate={{
//                         y: [0, -10, 0],
//                         scale: [1, 1.05, 1]
//                       }}
//                       transition={{
//                         duration: 3,
//                         repeat: Infinity,
//                         ease: "easeInOut"
//                       }}
//                     >
//                       <Video className="w-24 h-24 mx-auto mb-6 opacity-50" />
//                     </motion.div>
//                     <h3 className="text-2xl sm:text-xl font-semibold mb-2">Ready to start a call?</h3>
//                     <p className="text-gray-400 mb-6 px-4">
//                       Connect with live voice and sign language translation
//                     </p>
//                     <Button
//                       onClick={handleStartCall}
//                       size="lg"
//                       className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl"
//                     >
//                       <Video className="w-5 h-5 mr-2" />
//                       Start Call
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </Card>

//           {/* Call Controls */}
//           {isCallActive && (
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//             >
//               <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-0">
//                 <CardContent className="py-6">
//                   <div className="flex items-center justify-center gap-4">
//                     <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                       <Button
//                         variant={isCameraOn ? "secondary" : "destructive"}
//                         size="lg"
//                         onClick={toggleCamera}
//                         className="rounded-full w-14 h-14"
//                       >
//                         {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
//                       </Button>
//                     </motion.div>

//                     <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                       <Button
//                         variant={isMicOn ? "secondary" : "destructive"}
//                         size="lg"
//                         onClick={toggleMic}
//                         className="rounded-full w-14 h-14"
//                       >
//                         {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
//                       </Button>
//                     </motion.div>

//                     <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                       <Button
//                         variant={isSpeakerOn ? "secondary" : "destructive"}
//                         size="lg"
//                         onClick={toggleSpeaker}
//                         className="rounded-full w-14 h-14"
//                       >
//                         {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
//                       </Button>
//                     </motion.div>

//                     <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                       <Button
//                         variant="secondary"
//                         size="lg"
//                         onClick={() => setShowCaptions(!showCaptions)}
//                         className="rounded-full w-14 h-14"
//                       >
//                         <MessageSquare className="w-6 h-6" />
//                       </Button>
//                     </motion.div>

//                     <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                       <Button
//                         variant="secondary"
//                         size="lg"
//                         className="rounded-full w-14 h-14"
//                       >
//                         <Maximize2 className="w-6 h-6" />
//                       </Button>
//                     </motion.div>

//                     <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                       <Button
//                         variant="secondary"
//                         size="lg"
//                         className="rounded-full w-14 h-14"
//                       >
//                         <Settings className="w-6 h-6" />
//                       </Button>
//                     </motion.div>

//                     <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                       <Button
//                         variant="destructive"
//                         size="lg"
//                         onClick={handleEndCall}
//                         className="rounded-full w-14 h-14"
//                       >
//                         <PhoneOff className="w-6 h-6" />
//                       </Button>
//                     </motion.div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Transcription Panel */}
//         <motion.div
//           initial={{ x: 20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="space-y-4"
//         >
//           {/* Voice-to-Text Transcript */}
//           <Card>
//             <CardContent className="p-4 space-y-3">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-semibold flex items-center gap-2">
//                   <Mic className="w-4 h-4 text-blue-600" />
//                   Voice to Text
//                 </h3>
//                 <Badge variant={isCallActive ? "default" : "secondary"}>
//                   {isCallActive ? 'Active' : 'Inactive'}
//                 </Badge>
//               </div>
//               <ScrollArea className="h-64">
//                 <div className="space-y-2 pr-4">
//                   {voiceTranscript.length > 0 ? (
//                     voiceTranscript.map((text, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ x: -20, opacity: 0 }}
//                         animate={{ x: 0, opacity: 1 }}
//                         className="p-3 bg-blue-50 rounded-lg text-sm"
//                       >
//                         {text}
//                       </motion.div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8 text-gray-400">
//                       <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                       <p className="text-sm">Voice transcription will appear here</p>
//                     </div>
//                   )}
//                 </div>
//               </ScrollArea>
//             </CardContent>
//           </Card>

//           {/* Sign-to-Text Transcript */}
//           <Card>
//             <CardContent className="p-4 space-y-3">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-semibold flex items-center gap-2">
//                   <Video className="w-4 h-4 text-purple-600" />
//                   Sign to Text
//                 </h3>
//                 <Badge variant={isCallActive ? "default" : "secondary"}>
//                   {isCallActive ? 'Detecting' : 'Inactive'}
//                 </Badge>
//               </div>
//               <ScrollArea className="h-64">
//                 <div className="space-y-2 pr-4">
//                   {signTranscript.length > 0 ? (
//                     signTranscript.map((text, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ x: -20, opacity: 0 }}
//                         animate={{ x: 0, opacity: 1 }}
//                         className="p-3 bg-purple-50 rounded-lg text-sm"
//                       >
//                         {text}
//                       </motion.div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8 text-gray-400">
//                       <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                       <p className="text-sm">Sign detection will appear here</p>
//                     </div>
//                   )}
//                 </div>
//               </ScrollArea>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Feature Info */}
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.3 }}
//         className="grid md:grid-cols-3 gap-4"
//       >
//         <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
//           <CardContent className="pt-6 text-center">
//             <Mic className="w-10 h-10 text-blue-600 mx-auto mb-3" />
//             <h3 className="font-semibold mb-2">Real-Time Voice Translation</h3>
//             <p className="text-sm text-gray-600">
//               Spoken words are instantly converted to text for accessibility
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
//           <CardContent className="pt-6 text-center">
//             <Video className="w-10 h-10 text-purple-600 mx-auto mb-3" />
//             <h3 className="font-semibold mb-2">Sign Language Recognition</h3>
//             <p className="text-sm text-gray-600">
//               AI detects and translates sign language to text in real-time
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
//           <CardContent className="pt-6 text-center">
//             <MessageSquare className="w-10 h-10 text-green-600 mx-auto mb-3" />
//             <h3 className="font-semibold mb-2">Live Captions</h3>
//             <p className="text-sm text-gray-600">
//               On-screen captions ensure everyone follows the conversation
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>
//       </div>
//     </div>
//   );
// }
