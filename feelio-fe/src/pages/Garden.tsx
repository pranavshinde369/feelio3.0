import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplet, Sprout, Flower, TreeDeciduous, CloudRain, X, Trophy, Sun, Gift, Lock, CheckCircle2, RotateCcw } from "lucide-react"; // Added RotateCcw for reset icon
import { useToast } from "@/hooks/use-toast";

// --- 🎁 CONFIG: REWARDS & GROWTH ---
const REWARDS = {
  2: { name: "Zen Wallpaper Pack 🖼️", code: "WALL-ZEN-2024" },
  5: { name: "Premium Audio Track 🎵", code: "SOUND-CALM-55" },
  10: { name: "Feelio Merch 10% Off 👕", code: "FEELIO-10" },
  20: { name: "Free 1-on-1 Session 🎟️", code: "FREE-SESSION-1" }
};

const Garden = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  
  // Game State
  const [drops, setDrops] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [isWatering, setIsWatering] = useState(false);
  const [rewardModal, setRewardModal] = useState<{name: string, code: string} | null>(null);

  // Load Data
  useEffect(() => {
    // Defaulting to 0 drops (was 5) as per request
    const savedDrops = parseInt(localStorage.getItem("feelio-drops") || "0"); 
    const savedXp = parseInt(localStorage.getItem("feelio-xp") || "0");
    const savedLevel = parseInt(localStorage.getItem("feelio-level") || "1");
    setDrops(savedDrops);
    setXp(savedXp);
    setLevel(savedLevel);
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem("feelio-drops", drops.toString());
    localStorage.setItem("feelio-xp", xp.toString());
    localStorage.setItem("feelio-level", level.toString());
  }, [drops, xp, level]);

  // --- 🔴 RESET LOGIC ---
  const resetGarden = () => {
    setDrops(0);
    setXp(0);
    setLevel(1);
    localStorage.removeItem("feelio-drops");
    localStorage.removeItem("feelio-xp");
    localStorage.removeItem("feelio-level");
    toast({ title: "Garden Reset", description: "Started from the beginning!" });
  };

  const XP_TO_LEVEL = 100;
  const progress = (xp % XP_TO_LEVEL);

  // --- 💧 WATERING LOGIC ---
  const waterPlant = () => {
    if (drops <= 0) {
      toast({ title: "No Water Drops!", description: "Complete a Journal entry to earn more.", variant: "destructive" });
      return;
    }

    setIsWatering(true);
    setDrops(d => d - 1);
    const newXp = xp + 25; // 25 XP per drop
    setXp(newXp);

    // Check Level Up
    if (Math.floor(newXp / XP_TO_LEVEL) > Math.floor(xp / XP_TO_LEVEL)) {
      const newLevel = level + 1;
      setLevel(newLevel);
      
      // Check for Goodies
      if (REWARDS[newLevel as keyof typeof REWARDS]) {
        setTimeout(() => {
            setRewardModal(REWARDS[newLevel as keyof typeof REWARDS]);
        }, 1500); 
      } else {
        toast({ title: "Level Up!", description: `Welcome to Level ${newLevel}!` });
      }
    }

    setTimeout(() => setIsWatering(false), 1000);
  };

  // --- 🌳 GROWTH VISUALIZATION ---
  const renderPlant = () => {
    // Dynamic Scale
    const growthFactor = 1 + (level * 0.2) + (progress / 500);
    
    let Icon = Sprout;
    let color = "text-green-400";
    let label = "Seedling";

    if (level >= 2) { Icon = Sprout; label = "Sprout"; }
    if (level >= 3) { Icon = Flower; color = "text-pink-400"; label = "Bloom"; }
    if (level >= 5) { Icon = TreeDeciduous; color = "text-emerald-500"; label = "Young Tree"; }
    if (level >= 10) { Icon = TreeDeciduous; color = "text-teal-400"; label = "Ancient Oak"; }

    return (
      <div className="flex flex-col items-center justify-center transition-all duration-1000 ease-in-out" style={{ transform: `scale(${growthFactor})` }}>
        <Icon className={`w-24 h-24 ${color} drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]`} />
        <div className="w-16 h-4 bg-black/40 rounded-full blur-md mt-2" />
        <span className="absolute -bottom-8 text-xs text-white/50 bg-black/40 px-2 py-1 rounded-full whitespace-nowrap opacity-0 animate-in fade-in zoom-in duration-1000">{label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950/40 to-slate-950 text-white p-6 animate-in fade-in flex flex-col relative overflow-hidden">
      
      {/* 🎁 REWARD MODAL */}
      {rewardModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
           <div className="bg-slate-900 border border-yellow-500/50 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_60px_rgba(234,179,8,0.3)] relative">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setRewardModal(null)}><X /></Button>
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Gift className="w-10 h-10 text-yellow-400 animate-bounce" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Level {level} Reached!</h2>
              <p className="text-slate-400 mb-6">You've unlocked a special reward for your self-care journey.</p>
              
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
                 <p className="text-yellow-400 font-bold text-lg mb-1">{rewardModal.name}</p>
                 <div className="bg-black/40 p-2 rounded text-xs font-mono text-slate-300 select-all cursor-pointer" onClick={() => {navigator.clipboard.writeText(rewardModal.code); toast({title: "Copied!"})}}>
                    CODE: {rewardModal.code}
                 </div>
              </div>
              <Button onClick={() => setRewardModal(null)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12">Claim Reward</Button>
           </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-start mb-8 relative z-20">
         <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white"><X className="mr-2 h-4 w-4"/> Back to Hub</Button>
         <div className="flex gap-2">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-700 px-4 py-2 rounded-full flex items-center gap-2">
               <Droplet className="w-4 h-4 text-blue-400 fill-blue-400" />
               <span className="font-bold">{drops}</span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur border border-yellow-500/30 px-4 py-2 rounded-full flex items-center gap-2">
               <Trophy className="w-4 h-4 text-yellow-400" />
               <span className="font-bold text-yellow-100">Lvl {level}</span>
            </div>
         </div>
      </div>

      {/* MAIN GARDEN AREA */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute top-10 right-10 animate-[spin_20s_linear_infinite] opacity-50"><Sun className="w-40 h-40 text-yellow-500/10 blur-2xl" /></div>
        
        {/* Next Reward Progress */}
        <div className="absolute top-0 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
           <div className="text-xs text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Lock className="w-3 h-3"/> Next Reward</div>
           <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
           </div>
        </div>

        {/* The Plant */}
        <div className="relative z-10 mt-12 mb-24">
           {isWatering && (<div className="absolute -top-32 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-700"><CloudRain className="w-16 h-16 text-blue-400 fill-blue-400/20 animate-bounce" /></div>)}
           {renderPlant()}
        </div>
        
        {/* Ground */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-emerald-900/20 to-transparent pointer-events-none" />
      </div>

      {/* FOOTER CONTROLS */}
      <div className="max-w-md mx-auto w-full bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-2xl relative z-20 backdrop-blur-xl">
         <div className="flex justify-between text-sm text-slate-400 mb-2">
           <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Growth</span>
           <span>{Math.floor(progress)}%</span>
         </div>
         <Progress value={progress} className="h-2 bg-slate-800 mb-6" />
         
         <Button 
           onClick={waterPlant} 
           disabled={isWatering}
           className={`w-full h-16 text-lg font-semibold transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.3)]
             ${drops > 0 ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
           `}
         >
           <Droplet className={`mr-2 h-6 w-6 ${isWatering ? 'animate-ping' : ''}`} /> 
           {drops > 0 ? "Water Plant (+25 XP)" : "No Water Drops Left"}
         </Button>
      </div>

      {/* 🔴 RESET BUTTON (Added at bottom right) */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={resetGarden} 
        className="absolute bottom-4 right-4 text-slate-600 hover:text-red-400 text-xs flex gap-1 z-30"
      >
        <RotateCcw className="w-3 h-3" /> Reset
      </Button>

    </div>
  );
};

export default Garden;