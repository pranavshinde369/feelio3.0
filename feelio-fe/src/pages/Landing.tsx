import { useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Video, Book, Calendar, Play, Save, MapPin, X, Sparkles, ArrowRight, Shield, Sprout, Camera, Trophy, Music2, UserSquare2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Session from "./Session"; 
import Garden from "./Garden"; 
import SmileChallenge from "./SmileChallenge"; // 📸 Import the Smile Quest Page
import ParticleBackground from "@/components/ParticleBackground";
import Therapists from "./Therapists";
const HealingMusic = lazy(() => import("./HealingMusic"));

// --- MOCK DATA ---
const YOGA_ROUTINES = [
  { 
    title: "Morning Sunshine Flow", 
    duration: "10 min", 
    level: "Beginner", 
    videoId: "sTANio_2E0Q", 
    steps: ["Mountain Pose", "Forward Fold", "Cat-Cow", "Child's Pose"] 
  },
  { 
    title: "Bedtime Release", 
    duration: "20 min", 
    level: "Relaxing", 
    videoId: "M0u_8XWa2og", 
    steps: ["Legs Up Wall", "Reclined Butterfly", "Corpse Pose"] 
  }
];

const EVENTS = [
  { title: "Sunset Meditation Group", date: "Tomorrow, 6:00 PM", location: "City Park", type: "Peace" },
  { title: "Art Therapy Workshop", date: "Sat, 2:00 PM", location: "Community Center", type: "Creativity" },
  { title: "Silent Walking Club", date: "Sun, 8:00 AM", location: "River Trail", type: "Nature" }
];

const Landing = () => {
  const { toast } = useToast();
  
  // State: Added 'smile', 'therapists', 'healingMusic'
  const [activeFeature, setActiveFeature] = useState<'home' | 'yoga' | 'diary' | 'events' | 'session' | 'garden' | 'smile' | 'therapists' | 'healingMusic'>('home');
  const [diaryEntry, setDiaryEntry] = useState("");
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load Diary and emotional continuity / onboarding state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("feelio-diary-draft");
      if (saved) setDiaryEntry(saved);

      const storedEmotion = localStorage.getItem("feelio-last-emotion");
      if (storedEmotion) setLastEmotion(storedEmotion);

      const onboarded = localStorage.getItem("feelio-onboarded");
      if (!onboarded) setShowOnboarding(true);
    } catch {
      // ignore storage issues
    }
  }, []);

  const saveDiary = () => {
    localStorage.setItem("feelio-diary-draft", diaryEntry);
    
    // --- GAMIFICATION: Earn a Water Drop! ---
    const currentDrops = parseInt(localStorage.getItem("feelio-drops") || "0");
    localStorage.setItem("feelio-drops", (currentDrops + 1).toString());

    toast({ title: "Journal Saved & Drop Earned! 💧", description: "Use it in your Gratitude Garden." });
  };

  // --- SUB-PAGES ---

  if (activeFeature === 'session') return <Session onBack={() => setActiveFeature('home')} />;
  if (activeFeature === 'garden') return <Garden onClose={() => setActiveFeature('home')} />;
  if (activeFeature === 'smile') return <SmileChallenge onClose={() => setActiveFeature('home')} />; // 📸 New Route
  if (activeFeature === 'therapists') return <Therapists onClose={() => setActiveFeature('home')} />;
  if (activeFeature === 'healingMusic') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
            <div className="animate-pulse text-sm text-slate-400">Loading Healing Music...</div>
          </div>
        }
      >
        <HealingMusic onClose={() => setActiveFeature('home')} />
      </Suspense>
    );
  }

  // 2. YOGA PAGE
  if (activeFeature === 'yoga') {
    const todayRoutine = YOGA_ROUTINES[new Date().getDay() % YOGA_ROUTINES.length];
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 animate-in fade-in flex flex-col">
        <Button variant="ghost" onClick={() => setActiveFeature('home')} className="self-start mb-6 text-slate-400 hover:text-white"><X className="mr-2 h-4 w-4"/> Back to Hub</Button>
        <div className="max-w-4xl mx-auto w-full">
           <div className="text-center mb-8">
             <h2 className="text-4xl font-light mb-2 text-teal-100">{todayRoutine.title}</h2>
             <div className="flex justify-center gap-4 text-slate-400">
               <span>⏱️ {todayRoutine.duration}</span><span>•</span><span>🌱 {todayRoutine.level}</span>
             </div>
           </div>
           <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 mb-8">
             <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/ZiQh8jA5tVM`} title="Yoga Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
           </div>
           <Card className="bg-slate-900 border-slate-800 text-left">
             <CardHeader><CardTitle className="text-teal-400">Today's Focus</CardTitle></CardHeader>
             <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {todayRoutine.steps.map((step, i) => (
                 <div key={i} className="flex items-center justify-center p-4 rounded-lg bg-slate-800/50 text-center border border-slate-700/50"><span className="text-sm font-medium text-slate-200">{step}</span></div>
               ))}
             </CardContent>
           </Card>
        </div>
      </div>
    );
  }

  // 3. DIARY PAGE
  if (activeFeature === 'diary') {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 animate-in fade-in flex flex-col">
        <Button variant="ghost" onClick={() => setActiveFeature('home')} className="self-start mb-6 text-slate-400 hover:text-white"><X className="mr-2 h-4 w-4"/> Back to Hub</Button>
        <div className="max-w-3xl mx-auto w-full">
           <h2 className="text-3xl font-light mb-2 flex items-center gap-3"><Book className="text-purple-400"/> Mindful Journal</h2>
           <p className="text-slate-400 mb-6">Write freely. This space is private and encrypted locally.</p>
           <textarea className="w-full h-[60vh] bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none text-slate-200 placeholder:text-slate-600 leading-relaxed" placeholder="How are you feeling right now?" value={diaryEntry} onChange={(e) => setDiaryEntry(e.target.value)} />
           <div className="flex justify-end mt-4"><Button onClick={saveDiary} className="bg-purple-600 hover:bg-purple-700"><Save className="mr-2 h-4 w-4"/> Save Entry (+1 Drop)</Button></div>
        </div>
      </div>
    );
  }

  // 4. EVENTS PAGE
  if (activeFeature === 'events') {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 animate-in fade-in flex flex-col">
        <Button variant="ghost" onClick={() => setActiveFeature('home')} className="self-start mb-6 text-slate-400 hover:text-white"><X className="mr-2 h-4 w-4"/> Back to Hub</Button>
        <div className="max-w-4xl mx-auto w-full">
           <h2 className="text-3xl font-light mb-8 flex items-center gap-3"><Calendar className="text-orange-400"/> Local Wellness Events</h2>
           <div className="grid gap-4">{EVENTS.map((evt, i) => (<Card key={i} className="bg-slate-900 border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer group"><CardContent className="p-6 flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-1">{evt.type}</div><h3 className="text-xl font-semibold text-white mb-1 group-hover:text-orange-200">{evt.title}</h3><div className="flex items-center gap-4 text-slate-400 text-sm"><span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {evt.date}</span><span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {evt.location}</span></div></div><Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">Join</Button></CardContent></Card>))}</div>
        </div>
      </div>
    );
  }

  // --- HOME DASHBOARD ---
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 font-sans selection:bg-teal-500/30">
      <ParticleBackground />
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {showOnboarding && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
              <h2 className="text-xl font-semibold text-slate-50">Welcome to Feelio</h2>
              <p className="text-sm text-slate-300">
                This is your calm corner. You can talk to Dr. Libra, grow your Gratitude Garden,
                and use Healing Music when your nervous system feels loud.
              </p>
              <ul className="text-sm text-slate-200 space-y-2 list-disc list-inside">
                <li><span className="font-semibold">Dr. Libra</span> &mdash; AI therapist for gentle, short conversations.</li>
                <li><span className="font-semibold">Healing Music</span> &mdash; soundscapes for anxiety, sleep and focus.</li>
                <li><span className="font-semibold">My Garden</span> &mdash; water plants with your self-care streak.</li>
              </ul>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setShowOnboarding(false);
                    try {
                      localStorage.setItem("feelio-onboarded", "1");
                    } catch {
                      // ignore
                    }
                  }}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Got it, take me in
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <div className="relative"><div className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl animate-pulse" /><div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-teal-500 to-slate-800 flex items-center justify-center border border-teal-500/30"><Heart className="h-8 w-8 text-white" /></div></div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Feelio</h1>
          </div>
          <p className="text-xl text-slate-400 font-light">Your Safe Space to Feel</p>
          {lastEmotion && (
            <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
              <span className="uppercase tracking-[0.22em] text-slate-500">Last session</span>
              <span className="flex items-center gap-1">
                You looked
                <span className="font-semibold text-slate-100">{lastEmotion}</span>
              </span>
              <Button
                size="xs"
                variant="outline"
                className="border-slate-700 bg-slate-950/60 text-slate-100"
                onClick={() => setActiveFeature('session')}
              >
                Continue with Dr. Libra
              </Button>
            </div>
          )}
        </div>

        {/* Dashboard Grid - UPDATED with Smile Quest, Therapists, Healing Music */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6 max-w-7xl w-full animate-fade-in" style={{ animationDelay: "0.2s" }}>
          
          <Card className="lg:col-span-2 bg-gradient-to-br from-teal-900/40 to-slate-900 border-teal-500/30 hover:border-teal-400/50 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] transition-all hover:scale-[1.02] cursor-pointer group h-72 flex flex-col justify-between" onClick={() => setActiveFeature('session')}>
            <CardHeader><div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mb-4 group-hover:bg-teal-500/30 transition-colors"><Video className="w-6 h-6 text-teal-400" /></div><CardTitle className="text-white text-2xl">Dr. Libra</CardTitle><CardDescription className="text-teal-200/60 text-base">Talk to your compassionate AI therapist.</CardDescription></CardHeader>
            <CardContent><div className="flex items-center text-sm font-medium text-teal-400 mt-4 group-hover:translate-x-2 transition-transform">Start Session <ArrowRight className="ml-2 w-4 h-4"/></div></CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-gradient-to-br from-emerald-900/40 to-slate-900 border-emerald-500/30 hover:border-emerald-400/50 transition-all hover:scale-[1.02] cursor-pointer group h-72 flex flex-col justify-between" onClick={() => setActiveFeature('garden')}>
            <CardHeader><div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4"><Sprout className="w-6 h-6 text-emerald-400" /></div><CardTitle className="text-white text-2xl">My Garden</CardTitle><CardDescription className="text-emerald-200/60 text-base">Watch your self-care grow.</CardDescription></CardHeader>
            <CardContent><div className="flex items-center text-sm font-medium text-emerald-400 mt-4 group-hover:translate-x-2 transition-transform">Water Plants <ArrowRight className="ml-2 w-4 h-4"/></div></CardContent>
          </Card>

          {/* 📸 DAILY SMILE QUEST CARD */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-orange-900/40 to-slate-900 border-orange-500/30 hover:border-orange-400/50 transition-all hover:scale-[1.02] cursor-pointer group h-72 flex flex-col justify-between" onClick={() => setActiveFeature('smile')}>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                 <Camera className="w-6 h-6 text-orange-400" />
              </div>
              <CardTitle className="text-white text-2xl">Smile Quest</CardTitle>
              <CardDescription className="text-orange-200/60 text-base">Capture joy & share the streak.</CardDescription>
            </CardHeader>
            <CardContent><div className="flex items-center text-sm font-medium text-orange-400 mt-4 group-hover:translate-x-2 transition-transform">Take Selfie <Trophy className="ml-2 w-4 h-4"/></div></CardContent>
          </Card>

          {/* Secondary Rows */}
          <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800 hover:bg-slate-800/60 hover:border-yellow-500/30 transition-all hover:scale-[1.02] cursor-pointer group h-64 flex flex-col justify-between" onClick={() => setActiveFeature('yoga')}>
            <CardHeader><div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4"><Sparkles className="w-6 h-6 text-yellow-400" /></div><CardTitle className="text-white">Daily Yoga</CardTitle><CardDescription>5-min mood boosters</CardDescription></CardHeader>
            <CardContent><div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-2"><div className="bg-yellow-400 h-full w-2/3" /></div><p className="text-xs text-slate-500">New routine unlocked</p></CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800 hover:bg-slate-800/60 hover:border-purple-500/30 transition-all hover:scale-[1.02] cursor-pointer group h-64 flex flex-col justify-between" onClick={() => setActiveFeature('diary')}>
            <CardHeader><div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4"><Book className="w-6 h-6 text-purple-400" /></div><CardTitle className="text-white">Journal</CardTitle><CardDescription>Safe space for thoughts</CardDescription></CardHeader>
            <CardContent><p className="text-sm text-slate-500 italic">"Writing is the painting of the voice."</p></CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800 hover:bg-slate-800/60 hover:border-orange-500/30 transition-all hover:scale-[1.02] cursor-pointer group h-64 flex flex-col justify-between" onClick={() => setActiveFeature('events')}>
            <CardHeader><div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4"><Calendar className="w-6 h-6 text-orange-400" /></div><CardTitle className="text-white">Joy Events</CardTitle><CardDescription>Community & Peace</CardDescription></CardHeader>
            <CardContent><div className="flex -space-x-2 overflow-hidden">{[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900" />)}<div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-white font-medium">+40</div></div></CardContent>
          </Card>

          <Card className="lg:col-span-3 bg-gradient-to-br from-sky-900/40 to-slate-900 border-sky-500/30 hover:border-sky-400/50 transition-all hover:scale-[1.02] cursor-pointer group h-64 flex flex-col justify-between" onClick={() => setActiveFeature('therapists')}>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mb-4">
                <UserSquare2 className="w-6 h-6 text-sky-400" />
              </div>
              <CardTitle className="text-white">Find a Real Therapist</CardTitle>
              <CardDescription className="text-sky-200/70 text-base">Browse profiles and pick who feels right.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm font-medium text-sky-400 mt-4 group-hover:translate-x-2 transition-transform">
                Explore Therapists <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 bg-gradient-to-br from-indigo-900/40 to-slate-900 border-indigo-500/30 hover:border-indigo-400/50 transition-all hover:scale-[1.02] cursor-pointer group h-64 flex flex-col justify-between" onClick={() => setActiveFeature('healingMusic')}>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                <Music2 className="w-6 h-6 text-indigo-400" />
              </div>
              <CardTitle className="text-white">Healing Music</CardTitle>
              <CardDescription className="text-indigo-200/70 text-base">Soothing audio for anxiety, sleep, focus, and meditation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm font-medium text-indigo-400 mt-4 group-hover:translate-x-2 transition-transform">
                Start Listening <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </CardContent>
          </Card>

        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl w-full text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
           <div><Shield className="h-6 w-6 mx-auto mb-2 text-teal-500/50" /><span className="text-xs text-slate-500 uppercase tracking-wider">Private & Secure</span></div>
           <div><Heart className="h-6 w-6 mx-auto mb-2 text-rose-500/50" /><span className="text-xs text-slate-500 uppercase tracking-wider">Empathetic AI</span></div>
           <div><Sparkles className="h-6 w-6 mx-auto mb-2 text-yellow-500/50" /><span className="text-xs text-slate-500 uppercase tracking-wider">Always Available</span></div>
        </div>

      </div>
    </div>
  );
};

export default Landing;