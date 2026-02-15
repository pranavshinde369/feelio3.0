import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { X, Play, Pause, Volume2, VolumeX, Waves, Music2 } from "lucide-react";

type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
};

type CategoryId = "anxiety" | "sleep" | "focus" | "meditation";

const TRACKS: Record<CategoryId, Track[]> = {
  anxiety: [
    {
      id: "a1",
      title: "Soft Shorelines",
      artist: "Feelio Studio",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: "6:12",
    },
    {
      id: "a2",
      title: "Breath Between Thoughts",
      artist: "Feelio Studio",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: "4:45",
    },
  ],
  sleep: [
    {
      id: "s1",
      title: "Moonlight Drift",
      artist: "Feelio Studio",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      duration: "8:03",
    },
    {
      id: "s2",
      title: "Night Rain Echoes",
      artist: "Feelio Studio",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      duration: "7:11",
    },
  ],
  focus: [
    {
      id: "f1",
      title: "Deep Work Stream",
      artist: "Feelio Studio",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      duration: "5:32",
    },
    {
      id: "f2",
      title: "Clarity Grid",
      artist: "Feelio Studio",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      duration: "5:58",
    },
  ],
  meditation: [
    {
      id: "m1",
      title: "Quiet River Mind",
      artist: "Feelio Studio",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      duration: "9:20",
    },
    {
      id: "m2",
      title: "Inner Sky",
      artist: "Feelio Studio",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      duration: "10:05",
    },
  ],
};

type Props = {
  onClose: () => void;
};

type PlayerState = {
  activeCategory: CategoryId;
  activeTrackId: string | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
};

const HealingMusic = ({ onClose }: Props) => {
  const [player, setPlayer] = useState<PlayerState>({
    activeCategory: "anxiety",
    activeTrackId: null,
    isPlaying: false,
    volume: 0.8,
    progress: 0,
    duration: 0,
  });
  const [suggestedCategory, setSuggestedCategory] = useState<CategoryId>("anxiety");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack: Track | null =
    player.activeTrackId &&
    TRACKS[player.activeCategory].find((t) => t.id === player.activeTrackId)
      ? TRACKS[player.activeCategory].find((t) => t.id === player.activeTrackId) || null
      : null;

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setPlayer((prev) => ({
        ...prev,
        progress: audio.currentTime,
        duration: audio.duration || prev.duration,
      }));
    };

    const handleEnded = () => {
      setPlayer((prev) => ({ ...prev, isPlaying: false, progress: 0 }));
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Restore last used category and volume, or suggest one by time of day
  useEffect(() => {
    try {
      const storedCategory = localStorage.getItem("feelio-music-category") as CategoryId | null;
      const storedVolume = localStorage.getItem("feelio-music-volume");
      let nextCategory: CategoryId = "anxiety";

      if (storedCategory && TRACKS[storedCategory]) {
        nextCategory = storedCategory;
      } else {
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 6) {
          nextCategory = "sleep";
        } else if (hour >= 10 && hour < 18) {
          nextCategory = "focus";
        } else {
          nextCategory = "anxiety";
        }
      }

      const nextVolume = storedVolume ? Math.min(1, Math.max(0, parseFloat(storedVolume))) : 0.8;

      setPlayer((prev) => ({
        ...prev,
        activeCategory: nextCategory,
        volume: Number.isFinite(nextVolume) ? nextVolume : prev.volume,
      }));
      setSuggestedCategory(nextCategory);

      if (audioRef.current && Number.isFinite(nextVolume)) {
        audioRef.current.volume = nextVolume;
      }
    } catch {
      // ignore storage issues
    }
  }, []);

  const loadTrack = (category: CategoryId, track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.url;
    audio.currentTime = 0;
    audio.volume = player.volume;
    setPlayer({
      activeCategory: category,
      activeTrackId: track.id,
      isPlaying: false,
      progress: 0,
      duration: 0,
      volume: player.volume,
    });
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (player.isPlaying) {
      audio.pause();
      setPlayer((prev) => ({ ...prev, isPlaying: false }));
    } else {
      audio.play();
      setPlayer((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || player.duration === 0) return;
    const nextTime = value[0];
    audio.currentTime = nextTime;
    setPlayer((prev) => ({ ...prev, progress: nextTime }));
  };

  const handleVolumeChange = (value: number[]) => {
    const vol = value[0];
    const audio = audioRef.current;
    if (audio) {
      audio.volume = vol;
    }
    setPlayer((prev) => ({ ...prev, volume: vol }));
    try {
      localStorage.setItem("feelio-music-volume", String(vol));
    } catch {
      // ignore
    }
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Calm animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.18),_transparent_55%)] opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      <div className="relative z-10 p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="mr-2 h-4 w-4" /> Back to Hub
          </Button>
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
            Prototype · Healing Music
          </span>
        </div>

        <header className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-700/60">
            <Waves className="w-4 h-4 text-teal-300" />
            <span className="text-xs font-medium tracking-[0.25em] text-slate-300 uppercase">
              Healing Music
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-slate-50">
            Soundscapes for anxiety, sleep, focus & calm.
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            All tracks are prototype placeholders. The layout, controls and flow are
            production-ready, but no licensing or real catalogue is wired yet.
          </p>
          <div className="flex justify-center mt-1">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700 text-[11px] text-slate-300 hover:bg-slate-800"
              onClick={() =>
                setPlayer((prev) => ({ ...prev, activeCategory: suggestedCategory }))
              }
            >
              <span className="uppercase tracking-[0.2em] text-slate-500">Today</span>
              <span>
                Try{" "}
                {suggestedCategory === "sleep"
                  ? "Sleep"
                  : suggestedCategory === "focus"
                  ? "Focus"
                  : suggestedCategory === "meditation"
                  ? "Meditation"
                  : "Anxiety Relief"}{" "}
                playlist
              </span>
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto w-full grid gap-6 md:grid-cols-[1.6fr,1.2fr] items-start">
          <Card className="bg-slate-900/70 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Music2 className="w-4 h-4 text-indigo-400" />
                Healing Playlists
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-slate-400">
                Pick a category and tap any track to load it into the player on the
                right.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={player.activeCategory}
                onValueChange={(value) => {
                  const cat = value as CategoryId;
                  setPlayer((prev) => ({ ...prev, activeCategory: cat }));
                  try {
                    localStorage.setItem("feelio-music-category", cat);
                  } catch {
                    // ignore
                  }
                }}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-4 bg-slate-900/80 border border-slate-800">
                  <TabsTrigger value="anxiety" className="text-xs">
                    Anxiety Relief
                  </TabsTrigger>
                  <TabsTrigger value="sleep" className="text-xs">
                    Sleep
                  </TabsTrigger>
                  <TabsTrigger value="focus" className="text-xs">
                    Focus
                  </TabsTrigger>
                  <TabsTrigger value="meditation" className="text-xs">
                    Meditation
                  </TabsTrigger>
                </TabsList>

                {(Object.keys(TRACKS) as CategoryId[]).map((category) => (
                  <TabsContent key={category} value={category} className="space-y-2">
                    {TRACKS[category].map((track) => {
                      const isActive =
                        player.activeCategory === category &&
                        player.activeTrackId === track.id;
                      return (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => loadTrack(category, track)}
                          className={`w-full flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                            isActive
                              ? "bg-slate-800/80 border-teal-500/60 shadow-[0_0_25px_rgba(45,212,191,0.25)]"
                              : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-800">
                              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500/40 to-indigo-500/30 blur-md" />
                              <div className="relative w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center">
                                <Waves className="w-3 h-3 text-teal-300" />
                              </div>
                            </div>
                            <div>
                              <p className="text-slate-50 text-xs md:text-sm">
                                {track.title}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {track.artist} · {track.duration}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Tap to load
                          </span>
                        </button>
                      );
                    })}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800/80 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.3),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.25),_transparent_55%)]" />
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Waves className="w-4 h-4 text-teal-300" />
                Player
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-slate-300">
                Minimal custom controls using the native audio element under the hood.
                This is wired for a prototype catalogue only.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-2">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Now Playing
                </p>
                {currentTrack ? (
                  <>
                    <p className="text-sm md:text-base text-slate-50">
                      {currentTrack.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {currentTrack.artist} ·{" "}
                      {
                        TRACKS[player.activeCategory].find(
                          (t) => t.id === currentTrack.id
                        )?.duration
                      }
                    </p>
                    <p className="text-[11px] text-teal-300/80">
                      Mood: {player.activeCategory === "anxiety"
                        ? "Calming anxious spikes"
                        : player.activeCategory === "sleep"
                        ? "Soothing you toward rest"
                        : player.activeCategory === "focus"
                        ? "Gentle background for deep work"
                        : "Breath-friendly meditation bed"}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-slate-400">
                    Pick any track on the left to load it here. Nothing will stream
                    until you press play.
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    disabled={!currentTrack}
                    className="h-12 w-12 rounded-full bg-teal-500 hover:bg-teal-600 text-slate-950 disabled:bg-slate-800 disabled:text-slate-500"
                    onClick={togglePlayPause}
                  >
                    {player.isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 pl-0.5" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <Slider
                      min={0}
                      max={player.duration || 1}
                      step={0.5}
                      value={[player.progress]}
                      onValueChange={handleSeek}
                      disabled={!currentTrack}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>{formatTime(player.progress)}</span>
                      <span>
                        {formatTime(player.duration || 0)}
                        {!currentTrack ? "" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="uppercase tracking-[0.2em]">Volume</span>
                  </div>
                  <div className="flex items-center gap-2 w-40">
                    <button
                      type="button"
                      className="text-slate-300 hover:text-white"
                      onClick={() =>
                        handleVolumeChange([player.volume > 0.05 ? 0 : 0.6])
                      }
                    >
                      {player.volume > 0.05 ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4" />
                      )}
                    </button>
                    <Slider
                      min={0}
                      max={1}
                      step={0.05}
                      value={[player.volume]}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                This is a non-production prototype. In a real deployment, tracks would
                be replaced with fully licensed, curated audio and streamed from a
                dedicated CDN, keeping this same interface intact.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Hidden audio element powering the player */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default HealingMusic;

