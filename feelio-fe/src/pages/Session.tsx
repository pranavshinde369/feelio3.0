// feelio-fe/src/pages/Session.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Camera, Mic, MicOff, Send, Heart, Video, VideoOff, Gamepad2, X, Brain, Wind, Flower, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// --- 🎮 GAME COMPONENTS ---

const ZenBreathGame = ({ onClose }: { onClose: () => void }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  useEffect(() => {
    setPhase('Inhale');
    const loop = setInterval(() => {
      setPhase('Inhale');
      setTimeout(() => {
        setPhase('Hold');
        setTimeout(() => setPhase('Exhale'), 4000); 
      }, 4000); 
    }, 12000); 
    return () => clearInterval(loop);
  }, []);
  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={onClose}><X /></Button>
      <h2 className="text-2xl font-light text-teal-200 mb-8 tracking-widest uppercase">Zen Breath</h2>
      <div className={`relative flex items-center justify-center rounded-full transition-all duration-[4000ms] ease-in-out ${phase === 'Inhale' ? 'w-64 h-64 bg-teal-500/20 shadow-[0_0_100px_rgba(45,212,191,0.3)]' : phase === 'Exhale' ? 'w-24 h-24 bg-teal-900/20' : 'w-64 h-64 bg-teal-500/30'}`}>
         <div className="absolute inset-0 rounded-full border border-teal-500/30 animate-pulse" />
         <span className="text-xl font-medium text-teal-100">{phase}</span>
      </div>
      <p className="mt-8 text-slate-400">Inhale (4s) • Hold (4s) • Exhale (4s)</p>
    </div>
  );
};

const MemoryGame = ({ onClose }: { onClose: () => void }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const startGame = () => { setSequence([]); setUserSequence([]); setLevel(1); setGameState('playing'); startRound(1, []); };
  const startRound = (currentLevel: number, currentSeq: number[]) => {
    setIsUserTurn(false); setUserSequence([]);
    const nextSeq = [...currentSeq, Math.floor(Math.random() * 4)];
    setSequence(nextSeq);
    let i = 0;
    const interval = setInterval(() => {
      setFlashIndex(nextSeq[i]); setTimeout(() => setFlashIndex(null), 500); 
      i++;
      if (i >= nextSeq.length) { clearInterval(interval); setIsUserTurn(true); }
    }, 1000); 
  };
  const handlePadClick = (index: number) => {
    if (!isUserTurn) return;
    setFlashIndex(index); setTimeout(() => setFlashIndex(null), 200);
    const expected = sequence[userSequence.length];
    if (index === expected) {
      const newUserSeq = [...userSequence, index];
      setUserSequence(newUserSeq);
      if (newUserSeq.length === sequence.length) { setTimeout(() => { setLevel(l => l + 1); startRound(level + 1, sequence); }, 1000); }
    } else { setGameState('gameover'); }
  };
  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={onClose}><X /></Button>
      {gameState === 'start' && (<div className="text-center"><h2 className="text-3xl font-light text-purple-200 mb-4 tracking-widest">MEMORY MATRIX</h2><p className="text-slate-400 mb-8">Follow the pattern. How far can you go?</p><Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700 px-8 py-6 text-lg">Start Game</Button></div>)}
      {gameState === 'gameover' && (<div className="text-center"><h2 className="text-3xl font-bold text-red-400 mb-4">GAME OVER</h2><p className="text-white mb-8">You reached Level {level}</p><Button onClick={startGame} className="bg-white text-black hover:bg-slate-200">Try Again</Button></div>)}
      {gameState === 'playing' && (<div className="flex flex-col items-center"><h2 className="text-2xl font-light text-purple-200 mb-2 tracking-widest uppercase">Level {level}</h2><p className="text-slate-400 mb-8 h-6">{isUserTurn ? "Your Turn" : "Watch..."}</p><div className="grid grid-cols-2 gap-4">{[0, 1, 2, 3].map((i) => (<button key={i} onClick={() => handlePadClick(i)} className={`w-24 h-24 rounded-2xl border-2 transition-all duration-200 ${flashIndex === i ? 'bg-white shadow-[0_0_30px_white] scale-105 border-white' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} />))}</div></div>)}
    </div>
  );
};

const YogaGame = ({ onClose, emotion }: { onClose: () => void, emotion: string }) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [isActive, setIsActive] = useState(false);
  const poses: Record<string, { title: string; desc: string; benefit: string }> = {
    sad: { title: "The Cobra", desc: "Lie on stomach, lift chest up. Look at the sky.", benefit: "Opens the heart and counters the 'slump' of sadness." },
    angry: { title: "Child's Pose", desc: "Kneel, sit back on heels, forehead to floor.", benefit: "Grounds active energy and calms the nervous system." },
    fear: { title: "Tree Pose", desc: "Stand on one leg. Hands at heart. Focus on one point.", benefit: "Forces focus. You can't worry if you're trying to balance." },
    happy: { title: "Warrior II", desc: "Wide stance, lunging forward, arms out strong.", benefit: "Channels your positive energy into power." },
    neutral: { title: "Neck Release", desc: "Drop right ear to right shoulder. Breathe deep.", benefit: "Releases the hidden tension of a normal day." }
  };
  const currentPose = poses[emotion] || poses['neutral'];
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) { interval = setInterval(() => setTimeLeft((t) => t - 1), 1000); } 
    else if (timeLeft === 0) { setIsActive(false); }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);
  return (
    <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={onClose}><X /></Button>
      <div className="text-center max-w-md px-6">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/20 text-teal-300"><Flower className="w-8 h-8" /></div>
        <h2 className="text-3xl font-light text-teal-100 mb-2 tracking-widest uppercase">{currentPose.title}</h2>
        <p className="text-slate-400 text-lg mb-6">{currentPose.desc}</p>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-8"><p className="text-sm text-teal-400 font-medium uppercase tracking-wide mb-1">Why this pose?</p><p className="text-slate-300 italic">"Because you look <span className="text-white font-bold uppercase">{emotion}</span> right now. {currentPose.benefit}"</p></div>
        {isActive ? (<div className="text-5xl font-mono text-white mb-8">{timeLeft}s</div>) : (<Button onClick={() => { setTimeLeft(45); setIsActive(true); }} className="bg-teal-600 hover:bg-teal-700 h-12 px-8 text-lg">Start Timer</Button>)}
      </div>
    </div>
  );
};

// --- MAIN SESSION ---
// Added 'onBack' so it works inside the Dashboard
const Session = ({ onBack }: { onBack?: () => void }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false); 
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [displayEmotion, setDisplayEmotion] = useState('neutral');
  const [activeGame, setActiveGame] = useState<'breath' | 'memory' | 'yoga' | null>(null);
  const [showGameMenu, setShowGameMenu] = useState(false);
  const [therapistMode, setTherapistMode] = useState<'ai' | 'human'>('ai');
  const [intention, setIntention] = useState<'be_heard' | 'tools' | 'check_in' | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null); 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null); 

  const handleExit = () => {
    if (onBack) { onBack(); } 
    else { navigate('/'); }
  };

  useEffect(() => {
    // Favicon Assassin
    document.title = "Feelio";
    const blankFavicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const nukeFavicon = () => {
      const links = document.querySelectorAll("link[rel*='icon']");
      links.forEach(l => l.remove());
      const link = document.createElement('link');
      link.type = 'image/png';
      link.rel = 'shortcut icon';
      link.href = blankFavicon;
      document.head.appendChild(link);
    };
    nukeFavicon();
    const interval = setInterval(nukeFavicon, 500);
    setTimeout(() => clearInterval(interval), 5000);
    const observer = new MutationObserver(() => {
       const icons = document.querySelectorAll("link[rel*='icon']");
       let foundEnemy = false;
       icons.forEach(icon => { if ((icon as HTMLLinkElement).href !== blankFavicon) foundEnemy = true; });
       if (foundEnemy) nukeFavicon();
    });
    observer.observe(document.head, { childList: true, subtree: true, attributes: true });
    return () => { clearInterval(interval); observer.disconnect(); };
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  // Persist last detected emotion so Landing can show a gentle continuity pill
  useEffect(() => {
    if (displayEmotion) {
      try {
        localStorage.setItem("feelio-last-emotion", displayEmotion);
      } catch {
        // ignore storage errors
      }
    }
  }, [displayEmotion]);

  // Load available speech synthesis voices and restore preferred choice
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      setAvailableVoices(voices);

      try {
        const storedName = localStorage.getItem("feelio-voice-name");
        if (storedName && voices.some((v) => v.name === storedName)) {
          setSelectedVoiceName(storedName);
        } else {
          const preferred =
            voices.find((v) => v.name.includes("Google US English") || v.name.includes("Samantha")) ||
            voices[0];
          if (preferred) {
            setSelectedVoiceName(preferred.name);
          }
        }
      } catch {
        // ignore storage issues
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (cameraEnabled) { intervalId = setInterval(sendSnapshotToBackend, 200); }
    return () => clearInterval(intervalId);
  }, [cameraEnabled]);

  const sendSnapshotToBackend = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraEnabled) return;
    const context = canvasRef.current.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, 300, 200);
      const imageBase64 = canvasRef.current.toDataURL('image/jpeg', 0.6);
      try {
        const response = await fetch("http://localhost:8000/vision", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: imageBase64 }) });
        const data = await response.json();
        if (data.emotion) setDisplayEmotion(data.emotion.toLowerCase());
      } catch (err) { }
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      if (cameraEnabled) {
        try { stream = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = stream; } 
        catch (err) { setCameraEnabled(false); }
      }
    };
    if (cameraEnabled) startCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [cameraEnabled]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (recognitionRef.current) recognitionRef.current.abort();
    const recognition = new SpeechRecognition();
    recognition.continuous = false; recognition.lang = 'en-US';
    recognition.onresult = (event: any) => { const transcript = event.results[0][0].transcript; if (transcript.trim()) { setChatInput(transcript); handleSendMessage(transcript); } };
    recognition.onstart = () => { setIsListening(true); };
    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Mic issue",
        description: "I lost access to your microphone for a moment. Try again, or check browser permissions.",
        variant: "destructive",
      });
    };
    recognition.onnomatch = () => {
      toast({
        title: "Didn’t catch that",
        description: "I couldn’t understand that snippet. Try speaking a bit slower or closer to the mic.",
      });
    };
    recognition.onend = () => {
      setIsListening(false);
      if (isLiveMode && !isProcessing) startListening();
    };
    recognitionRef.current = recognition; recognition.start();
  };

  const stopLiveMode = () => {
    setIsLiveMode(false);
    setIsListening(false);
    if (recognitionRef.current) recognitionRef.current.abort();
    window.speechSynthesis.cancel();
  };

  const speakAndResume = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      let chosen: SpeechSynthesisVoice | undefined;
      if (selectedVoiceName) {
        chosen = voices.find((v) => v.name === selectedVoiceName);
      }
      if (!chosen) {
        chosen =
          voices.find((v) => v.name.includes("Google US English") || v.name.includes("Samantha")) ||
          voices[0];
      }
      if (chosen) {
        utterance.voice = chosen;
      }

      const mood = displayEmotion.toLowerCase();
      if (["sad", "fear", "angry"].includes(mood)) {
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
      } else if (mood === "happy") {
        utterance.rate = 1.05;
        utterance.pitch = 1.05;
      } else {
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
      }
      utterance.volume = 1.0;
      utterance.onstart = () => { if (recognitionRef.current) recognitionRef.current.abort(); };
      utterance.onend = () => { setIsProcessing(false); if (isLiveMode) startListening(); };
      window.speechSynthesis.speak(utterance);
    } else { setIsProcessing(false); if (isLiveMode) startListening(); }
  };

  const handleSendMessage = async (textOverride?: string) => {
    const messageToSend = textOverride || chatInput;
    if (!messageToSend.trim()) return;
    setIsProcessing(true); if (recognitionRef.current) recognitionRef.current.abort();
    setChatInput(''); setChatMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    try {
      const response = await fetch("http://localhost:8000/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: messageToSend }) });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      speakAndResume(data.reply);
    } catch (err) { setIsProcessing(false); }
  };

  const toggleLiveMode = () => {
    if (isLiveMode) {
      stopLiveMode();
      toast({ title: "Live Mode Paused", description: "Tap Mic to resume." });
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: "Voice not available",
          description: "Your browser does not support in-browser speech recognition yet. You can still type to talk to Dr. Libra.",
          variant: "destructive",
        });
        return;
      }
      setIsLiveMode(true);
      startListening();
      toast({ title: "Gemini Live Mode On", description: "Just keep talking!" });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden text-slate-50 font-sans">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 to-slate-950 opacity-50" />
      <canvas ref={canvasRef} width="300" height="200" className="hidden" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-teal-400" />
          <span className="font-semibold text-lg tracking-wide">Feelio Live</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-700/70 px-3 py-1.5">
            <span className={`text-[11px] font-medium tracking-[0.18em] uppercase ${therapistMode === 'ai' ? 'text-teal-300' : 'text-slate-500'}`}>
              AI Therapist
            </span>
            <Switch
              checked={therapistMode === 'human'}
              onCheckedChange={(checked) => setTherapistMode(checked ? 'human' : 'ai')}
              className="data-[state=checked]:bg-sky-500"
            />
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium tracking-[0.18em] uppercase ${therapistMode === 'human' ? 'text-sky-300' : 'text-slate-500'}`}>
              <User className="w-3 h-3" />
              Human Mode
            </span>
          </div>
          <Button variant="destructive" size="sm" onClick={handleExit}>End Session</Button>
        </div>
      </div>

      {/* Main Stage (Increased Padding for text visibility) */}
      <div className="relative z-10 flex flex-col md:flex-row h-screen pt-20 pb-72 px-4 gap-4">
        <div className="flex-1 bg-slate-800/50 rounded-2xl relative flex flex-col items-center justify-center border border-slate-700/50 overflow-hidden">
           {activeGame === 'breath' && <ZenBreathGame onClose={() => setActiveGame(null)} />}
           {activeGame === 'memory' && <MemoryGame onClose={() => setActiveGame(null)} />}
           {activeGame === 'yoga' && <YogaGame emotion={displayEmotion} onClose={() => setActiveGame(null)} />}
           {therapistMode === 'ai' ? (
             <>
               <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${isProcessing ? 'bg-teal-500/30 scale-110' : 'bg-teal-500/10'}`}>
                  <div className={`w-32 h-32 rounded-full bg-teal-400/30 blur-xl ${isProcessing ? 'animate-pulse' : ''}`} />
                  <span className="absolute text-teal-200 font-light text-xl tracking-widest">Dr. Libra</span>
               </div>
               {isProcessing && <p className="mt-4 text-teal-400 text-sm animate-pulse">Thinking / Speaking...</p>}
             </>
           ) : (
             <div className="max-w-md mx-auto text-center px-6">
               <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sky-500/15 border border-sky-500/40 mb-4">
                 <User className="w-7 h-7 text-sky-300" />
               </div>
               <h2 className="text-2xl font-light text-sky-100 mb-2 tracking-widest uppercase">
                 Human Therapist Mode
               </h2>
               <p className="text-slate-300 text-sm mb-3">
                 This view is a gentle placeholder for talking to a real human therapist.
               </p>
               <p className="text-slate-400 text-xs mb-6">
                 Your AI conversation stays paused in the background. When you switch back
                 to AI Therapist, your previous messages will still be here.
               </p>
               <div className="grid gap-3 text-left text-xs text-slate-200">
                 <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-3">
                   <p className="font-semibold text-slate-100 mb-1">Step 1 · Notice</p>
                   <p className="text-slate-400">
                     Ask yourself: &ldquo;Would this feel better with a real person on the
                     other side?&rdquo;
                   </p>
                 </div>
                 <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-3">
                   <p className="font-semibold text-slate-100 mb-1">Step 2 · Reach Out</p>
                   <p className="text-slate-400">
                     Use the &ldquo;Find a Real Therapist&rdquo; space on the home screen
                     to explore profiles when you are ready.
                   </p>
                 </div>
                 <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-3">
                   <p className="font-semibold text-slate-100 mb-1">Step 3 · Switch Back</p>
                   <p className="text-slate-400">
                     Whenever you toggle back to AI Therapist, Dr. Libra will pick up the
                     conversation from where you left off.
                   </p>
                 </div>
               </div>
               <Button
                 className="mt-6 bg-sky-600 hover:bg-sky-700 text-white w-full"
                 onClick={() => navigate('/therapists')}
               >
                 Browse therapists directory
               </Button>
             </div>
           )}
        </div>

        <div className="flex-1 bg-slate-800/50 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-700/50">
          {cameraEnabled ? (
             <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />
          ) : (
             <div className="text-slate-500 flex flex-col items-center gap-2"><VideoOff className="w-8 h-8 opacity-50"/><span>Camera Off</span></div>
          )}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 z-20">
             <div className={`w-2 h-2 rounded-full ${['sad','fear','angry'].includes(displayEmotion) ? 'bg-blue-500' : 'bg-green-500'}`} />
             <span className="text-xs font-medium uppercase tracking-wider">{displayEmotion}</span>
          </div>
        </div>
      </div>

      {/* Chat Area (Scrollable) */}
      {therapistMode === 'ai' && (
        <div className="absolute bottom-28 left-0 right-0 z-40 px-4">
            <div className="max-w-4xl mx-auto h-48 overflow-y-auto px-2 custom-scrollbar flex flex-col-reverse" style={{ maskImage: 'linear-gradient(to top, black 80%, transparent 100%)' }}>
               <div className="flex flex-col gap-3 justify-end min-h-0">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-lg ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700'}`}>{msg.content}</div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
               </div>
            </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 p-6 z-50">
        {showGameMenu && (
          <div className="absolute bottom-28 left-8 bg-slate-900 border border-slate-700 rounded-xl p-2 flex gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-50">
             <Button variant="ghost" className="flex flex-col h-20 w-24 gap-2 hover:bg-slate-800" onClick={() => { setActiveGame('yoga'); setShowGameMenu(false); }}>
                <Flower className="w-6 h-6 text-pink-400" />
                <span className="text-xs text-slate-300">Yoga</span>
             </Button>
             <div className="w-px bg-slate-800 mx-1" />
             <Button variant="ghost" className="flex flex-col h-20 w-24 gap-2 hover:bg-slate-800" onClick={() => { setActiveGame('breath'); setShowGameMenu(false); }}>
                <Wind className="w-6 h-6 text-teal-400" />
                <span className="text-xs text-slate-300">Zen Breath</span>
             </Button>
             <div className="w-px bg-slate-800 mx-1" />
             <Button variant="ghost" className="flex flex-col h-20 w-24 gap-2 hover:bg-slate-800" onClick={() => { setActiveGame('memory'); setShowGameMenu(false); }}>
                <Brain className="w-6 h-6 text-purple-400" />
                <span className="text-xs text-slate-300">Brain Game</span>
             </Button>
          </div>
        )}
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {therapistMode === 'ai' ? (
            <>
              <div className="flex items-center justify-center gap-3 w-full max-w-3xl mx-auto relative z-50">
                <div className="flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-full border border-slate-700/50 backdrop-blur-md">
                  <Button variant={cameraEnabled ? "default" : "ghost"} size="icon" className={`rounded-full h-10 w-10 transition-all ${!cameraEnabled ? 'text-slate-400' : ''}`} onClick={() => setCameraEnabled(!cameraEnabled)}>
                    {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                  <Button variant={activeGame ? "default" : "ghost"} size="icon" className={`rounded-full h-10 w-10 transition-all ${activeGame ? 'bg-purple-600 hover:bg-purple-700' : 'text-slate-400 hover:text-white'}`} onClick={() => setShowGameMenu(!showGameMenu)}>
                    <Gamepad2 className="w-5 h-5" />
                  </Button>
                </div>
                <Button 
                  className={`rounded-full h-14 w-14 shadow-xl border-4 border-slate-900 transition-all duration-300 ${isLiveMode ? 'bg-rose-500 hover:bg-rose-600 animate-pulse' : 'bg-teal-500 hover:bg-teal-600'}`}
                  onClick={toggleLiveMode}
                >
                  {isLiveMode ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                </Button>
                <div className="flex-1 flex items-center gap-2 bg-slate-800/80 p-1.5 pl-4 rounded-full border border-slate-700/50 backdrop-blur-md focus-within:ring-1 focus-within:ring-teal-500/50 transition-all">
                  <input 
                    type="text"
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    placeholder="Type a message..." 
                    className="bg-transparent border-none focus:outline-none text-slate-200 placeholder:text-slate-500 w-full h-full text-sm font-medium"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  />
                  <Button 
                    size="icon" 
                    onClick={() => handleSendMessage()} 
                    disabled={!chatInput.trim() || isProcessing} 
                    className={`rounded-full h-10 w-10 transition-all ${chatInput.trim() ? 'bg-teal-500 text-white shadow-lg' : 'bg-slate-700/50 text-slate-500'}`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-3xl mx-auto text-[11px] text-slate-400">
                <div className="flex flex-wrap gap-1.5">
                  <span className="uppercase tracking-[0.18em] text-slate-500 mr-2">Quick start</span>
                  <Button
                    size="xs"
                    variant="outline"
                    className="border-slate-700 bg-slate-900/60 hover:bg-slate-800/80"
                    onClick={() => setChatInput("I feel anxious and my mind won’t slow down.")}
                  >
                    I feel anxious
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    className="border-slate-700 bg-slate-900/60 hover:bg-slate-800/80"
                    onClick={() => setChatInput("I can’t sleep and my thoughts keep looping at night.")}
                  >
                    I can’t sleep
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    className="border-slate-700 bg-slate-900/60 hover:bg-slate-800/80"
                    onClick={() => setChatInput("I feel overwhelmed and don’t know where to start.")}
                  >
                    I feel overwhelmed
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="uppercase tracking-[0.18em] text-slate-500">Today’s intention</span>
                  <Button
                    size="xs"
                    variant={intention === 'be_heard' ? 'default' : 'outline'}
                    className={intention === 'be_heard' ? 'bg-teal-600 hover:bg-teal-700 text-white border-none' : 'border-slate-700 bg-slate-900/60 text-slate-300'}
                    onClick={() => setIntention(intention === 'be_heard' ? null : 'be_heard')}
                  >
                    Be heard
                  </Button>
                  <Button
                    size="xs"
                    variant={intention === 'tools' ? 'default' : 'outline'}
                    className={intention === 'tools' ? 'bg-teal-600 hover:bg-teal-700 text-white border-none' : 'border-slate-700 bg-slate-900/60 text-slate-300'}
                    onClick={() => setIntention(intention === 'tools' ? null : 'tools')}
                  >
                    Get tools
                  </Button>
                  <Button
                    size="xs"
                    variant={intention === 'check_in' ? 'default' : 'outline'}
                    className={intention === 'check_in' ? 'bg-teal-600 hover:bg-teal-700 text-white border-none' : 'border-slate-700 bg-slate-900/60 text-slate-300'}
                    onClick={() => setIntention(intention === 'check_in' ? null : 'check_in')}
                  >
                    Quick check‑in
                  </Button>
                </div>
              </div>

              {availableVoices.length > 0 && (
                <div className="flex items-center justify-end gap-2 w-full max-w-3xl mx-auto text-[11px] text-slate-400 mt-1">
                  <span className="uppercase tracking-[0.18em] text-slate-500">
                    Voice
                  </span>
                  <select
                    value={selectedVoiceName || ""}
                    onChange={(e) => {
                      const value = e.target.value || null;
                      setSelectedVoiceName(value);
                      try {
                        if (value) {
                          localStorage.setItem("feelio-voice-name", value);
                        } else {
                          localStorage.removeItem("feelio-voice-name");
                        }
                      } catch {
                        // ignore
                      }
                    }}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-[11px] rounded-md px-2 py-1 max-w-xs"
                  >
                    <option value="">System default</option>
                    {availableVoices.slice(0, 8).map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <div className="w-full max-w-3xl mx-auto text-center text-xs text-slate-400">
              <p>
                Chat, mic and AI controls are paused while you&apos;re in Human
                Therapist mode. Switch back to AI Therapist at the top whenever you want
                to continue your conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Session;