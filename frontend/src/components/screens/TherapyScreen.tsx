import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam"; // The "Eyes"
import useWebSocket from "react-use-websocket"; // The "Connection"
import { useMediaPipe } from "@/hooks/useMediaPipe"; // The "Vision Logic"
import { Mic, Video, Phone, Sparkles, User, Heart, MicOff, StopCircle } from "lucide-react";

// BACKEND URL
const WS_URL = "ws://localhost:8000/ws/session/user_1";

export const TherapyScreen = () => {
  const [mode, setMode] = useState<"guided" | "reflection">("guided");
  
  // AI Session State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  
  // 1. Setup Vision (The Eyes) - Runs in background
  const { emotion, confidence, videoRef } = useMediaPipe();

  // 2. Setup WebSocket (The Connection)
  const { sendMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    onOpen: () => console.log("Connected to Feelio Brain"),
  });

  // 3. Handle Incoming Data from Backend
  useEffect(() => {
    if (lastJsonMessage) {
      const data = lastJsonMessage as any;
      
      if (data.type === 'token') {
        // Stream text token by token
        setCurrentResponse(prev => prev + data.content);
      } 
      else if (data.type === 'stream_end') {
        // Save completed message
        setMessages(prev => [...prev, { role: 'assistant', text: currentResponse }]);
        setCurrentResponse("");
      }
      else if (data.type === 'crisis') {
        alert("CRISIS ALERT: " + data.text);
        // In a real app, trigger the SOS modal here
      }
    }
  }, [lastJsonMessage]);

  // 4. Speech Logic (The Ears)
  const recognitionRef = useRef<any>(null);

  const toggleSession = () => {
    if (isSessionActive) {
      recognitionRef.current?.stop();
      setIsSessionActive(false);
    } else {
      setIsSessionActive(true);
      startListening();
    }
  };

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser not supported. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // We want turn-taking
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      // Update UI immediately
      setMessages(prev => [...prev, { role: 'user', text: transcript }]);
      
      // SEND TO BACKEND
      sendMessage(JSON.stringify({
        text: transcript,
        emotion: emotion, // Injected from MediaPipe
        confidence: confidence
      }));
    };

    recognition.onend = () => {
      // If session is still active, restart listening (after AI speaks)
      // For this simple version, we might need to manually toggle or wait for TTS
      if (isSessionActive) {
         // recognition.start(); // Uncomment for continuous loop
         setIsSessionActive(false); // For now, stop after one turn to prevent loops
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex gap-6 relative"
    >
      {/* HIDDEN WEBCAM (But functional) */}
      <div className="absolute opacity-0 pointer-events-none">
        <Webcam ref={videoRef as any} width={320} height={240} />
      </div>

      {/* Left - Video/Talk Area */}
      <div className="flex-1 flex flex-col">
        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setMode("guided")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              mode === "guided" ? "bg-primary text-primary-foreground shadow-soft" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Guided Support
          </button>
          <button
            onClick={() => setMode("reflection")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              mode === "reflection" ? "bg-accent text-accent-foreground shadow-soft" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Heart className="w-4 h-4" />
            Self Reflection
          </button>
        </div>

        {/* Main Space (Chat Area) */}
        <div className="flex-1 calm-card p-8 flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Active Session Visualization */}
          {messages.length === 0 ? (
            <>
              {/* Default Welcome State */}
              <motion.div
                className="relative w-32 h-32 mb-8"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 rounded-full bg-primary/10" />
                <div className="absolute inset-3 rounded-full bg-primary/15" />
                <div className="absolute inset-6 rounded-full bg-primary/20 flex items-center justify-center">
                   <Sparkles className="w-10 h-10 text-primary" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">
                Hi, I'm here to listen
              </h2>
              <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
                Whenever you're ready, share what's on your mind. No judgment—just a safe space.
              </p>
            </>
          ) : (
            /* Chat Interface */
            <div className="w-full h-full overflow-y-auto mb-20 space-y-4 px-4 scrollbar-hide">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`p-4 rounded-2xl max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'ml-auto bg-primary text-primary-foreground rounded-br-none' 
                    : 'mr-auto bg-muted text-foreground rounded-bl-none'
                }`}>
                  {msg.text}
                </motion.div>
              ))}
              {currentResponse && (
                <div className="p-4 rounded-2xl mr-auto bg-muted text-foreground max-w-[85%] animate-pulse">
                  {currentResponse}
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4 absolute bottom-8 bg-background/80 backdrop-blur-sm p-2 rounded-full border border-border/50 shadow-sm">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-14 h-14 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <Video className="w-5 h-5 text-muted-foreground" />
            </motion.button>
            
            {/* THE MAIN ACTION BUTTON */}
            <motion.button
              onClick={toggleSession}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-soft transition-all ${
                isSessionActive ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isSessionActive ? (
                <StopCircle className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-primary-foreground" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-14 h-14 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <Phone className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Right - Support Panel */}
      <div className="w-80 flex flex-col gap-4">
        {/* Mood Check - NOW LIVE! */}
        <div className="calm-card p-5">
          <h3 className="font-medium text-foreground mb-3 flex justify-between">
            Your Energy
            <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
              AI Detected
            </span>
          </h3>
          <div className="flex items-center justify-center py-4 bg-muted/30 rounded-xl">
            <div className="text-center">
              <span className="text-4xl block mb-2">
                {emotion === "Happy" ? "😊" : 
                 emotion === "Sad" ? "😔" : 
                 emotion === "Anxious" ? "😰" : "😐"}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {emotion} ({Math.round(confidence * 100)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="calm-card p-5 flex-1">
          <h3 className="font-medium text-foreground mb-3">Gentle suggestions</h3>
          <div className="space-y-2">
            {["Take three deep breaths", "Notice something beautiful", "Write one grateful thing"].map((suggestion, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 4 }}
                className="w-full text-left px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};