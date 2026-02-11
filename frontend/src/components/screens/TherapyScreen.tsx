import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam"; // The "Eyes"
import useWebSocket from "react-use-websocket"; // The "Connection"
import { useMediaPipe } from "@/hooks/useMediaPipe"; // The "Vision Logic"
import { Mic, Sparkles, Heart, MicOff, StopCircle } from "lucide-react";

// BACKEND URL
const WS_URL = "ws://localhost:8000/ws/session/user_1";

export const TherapyScreen = () => {
  const [mode, setMode] = useState<"guided" | "reflection">("guided");

  // AI Session State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [subtitleText, setSubtitleText] = useState("");
  
  // 1. Setup Vision (The Eyes) - Runs in background
  const { emotion, confidence, videoRef } = useMediaPipe();

  // 2. Audio Engine (Web Audio API)
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<Array<ArrayBuffer>>([]);
  const isPlayingRef = useRef(false);

  // 3. Speech Logic (The Ears)
  const recognitionRef = useRef<any>(null);
  const isSessionActiveRef = useRef<boolean>(false);
  const pendingAssistantMessageRef = useRef<string>("");

  useEffect(() => {
    isSessionActiveRef.current = isSessionActive;
  }, [isSessionActive]);

  const ensureAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    return audioContextRef.current;
  };

  const playNextInQueue = useCallback(async () => {
    const ctx = ensureAudioContext();

    if (isPlayingRef.current) return;

    const nextChunk = audioQueueRef.current.shift();

    if (!nextChunk) {
      // Queue is empty – AI finished talking
      isPlayingRef.current = false;
      setIsAiSpeaking(false);

      const text = pendingAssistantMessageRef.current;
      if (text) {
        setMessages((prev) => [...prev, { role: "assistant", text }]);
        pendingAssistantMessageRef.current = "";
        setSubtitleText("");
      }

      // Hand control back to the user if the session is still active
      if (isSessionActiveRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error("Failed to restart microphone after AI turn:", err);
        }
      }

      return;
    }

    try {
      isPlayingRef.current = true;
      const buffer = await ctx.decodeAudioData(nextChunk.slice(0));
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => {
        isPlayingRef.current = false;
        // Play the next chunk, if any
        void playNextInQueue();
      };
      source.start(0);
    } catch (error) {
      console.error("Error while decoding/playing audio chunk:", error);
      isPlayingRef.current = false;
      // Try to move on to the next chunk
      void playNextInQueue();
    }
  }, []);

  const enqueueAudioChunk = useCallback(
    (chunk: ArrayBuffer) => {
      audioQueueRef.current.push(chunk);
      // Start playback if idle
      if (!isPlayingRef.current) {
        void playNextInQueue();
      }
    },
    [playNextInQueue]
  );

  // 4. WebSocket (The Connection)
  const { sendMessage } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    onOpen: (event) => {
      console.log("Connected to Feelio Brain");
      const socket = event.target as WebSocket;
      socket.binaryType = "arraybuffer";
    },
    onMessage: async (event: WebSocketEventMap["message"]) => {
      const data = event.data;

      if (typeof data === "string") {
        // JSON control / text messages
        try {
          const message = JSON.parse(data);

          if (message.type === "crisis") {
            alert("CRISIS ALERT: " + message.text);
            // In a real app, trigger the SOS modal here
          } else if (message.type === "audio_start") {
            // Lock the mic immediately
            setIsAiSpeaking(true);
            recognitionRef.current?.stop();
          } else if (message.type === "audio_end") {
            // Backend has finished sending audio bytes – actual unlock
            // happens when the queue is fully drained in playNextInQueue.
          } else if (message.type === "subtitles") {
            const text = message.text || "";
            setSubtitleText(text);
            pendingAssistantMessageRef.current = text;
          } else if (message.type === "error") {
            console.error("Backend error:", message.message);
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      } else if (data instanceof ArrayBuffer) {
        // Raw audio bytes from ElevenLabs
        enqueueAudioChunk(data);
      } else if (data instanceof Blob) {
        // Convert Blob to ArrayBuffer
        const arrayBuffer = await data.arrayBuffer();
        enqueueAudioChunk(arrayBuffer);
      }
    },
  });

  const toggleSession = () => {
    if (isSessionActive) {
      recognitionRef.current?.stop();
      setIsSessionActive(false);
      setIsAiSpeaking(false);
      setSubtitleText("");
      audioQueueRef.current = [];
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
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
      // The AI will explicitly re-start listening after it finishes speaking.
      // We intentionally do nothing here to avoid race conditions with the lock.
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
      className="relative h-full w-full overflow-hidden bg-black"
    >
      {/* Full-screen video of the user */}
      <Webcam
        ref={videoRef as any}
        className="absolute inset-0 h-full w-full object-cover"
        videoConstraints={{ facingMode: "user" }}
      />

      {/* Soft gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/60" />

      {/* Top: Mode / mini header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-9 items-center rounded-full bg-white/10 px-3 text-xs font-medium backdrop-blur">
            <span
              className={`mr-2 h-2 w-2 rounded-full ${
                isAiSpeaking ? "bg-blue-400 animate-pulse" : "bg-red-400 animate-pulse"
              }`}
            />
            {isAiSpeaking ? "Feelio is speaking" : isSessionActive ? "Your turn to share" : "Tap to begin"}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium">
          <button
            onClick={() => setMode("guided")}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors ${
              mode === "guided" ? "bg-white text-black" : "bg-white/10 text-white/80"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            Guided
          </button>
          <button
            onClick={() => setMode("reflection")}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors ${
              mode === "reflection" ? "bg-white text-black" : "bg-white/10 text-white/80"
            }`}
          >
            <Heart className="h-3 w-3" />
            Reflect
          </button>
        </div>
      </div>

      {/* Center: subtle welcome when empty */}
      {messages.length === 0 && !subtitleText && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white/90">
          <motion.div
            className="relative mb-6 h-28 w-28"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 rounded-full bg-white/5" />
            <div className="absolute inset-3 rounded-full bg-white/10" />
            <div className="absolute inset-6 flex items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <h2 className="mb-2 text-2xl font-semibold">Hi, I'm here to listen</h2>
          <p className="max-w-md text-sm text-white/80">
            Whenever you're ready, just speak. I’ll listen like a therapist and guide you gently.
          </p>
        </div>
      )}

      {/* Subtitles overlay */}
      {subtitleText && (
        <div className="absolute bottom-28 left-1/2 z-20 w-full max-w-2xl -translate-x-1/2 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={subtitleText}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-black/65 px-4 py-3 text-center text-sm text-white shadow-lg backdrop-blur-md"
            >
              {subtitleText}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Bottom: mic + emotion indicator */}
      <div className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-3 px-4">
        {/* Emotion pill */}
        <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
          <span className="text-lg">
            {emotion === "Happy" ? "😊" : emotion === "Sad" ? "😔" : emotion === "Anxious" ? "😰" : "😐"}
          </span>
          <span className="font-medium">{emotion}</span>
          <span className="text-white/60">({Math.round(confidence * 100)}%)</span>
        </div>

        {/* Main mic button */}
        <motion.button
          onClick={toggleSession}
          whileHover={{ scale: isAiSpeaking ? 1 : 1.05 }}
          whileTap={{ scale: isAiSpeaking ? 1 : 0.95 }}
          disabled={isAiSpeaking}
          className={`flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition-all ${
            !isSessionActive
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : isAiSpeaking
              ? "bg-neutral-500 text-neutral-200 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 animate-pulse"
          }`}
        >
          {!isSessionActive ? (
            <Mic className="h-7 w-7 text-white" />
          ) : isAiSpeaking ? (
            <MicOff className="h-7 w-7 text-white" />
          ) : (
            <StopCircle className="h-8 w-8 text-white" />
          )}
        </motion.button>

        <div className="text-xs text-white/70">
          {isAiSpeaking ? "Listening to Feelio..." : isSessionActive ? "Share what’s on your mind." : "Tap to start a session."}
        </div>
      </div>
    </motion.div>
  );
};