import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Wind, PenLine, Flower2, Moon, Sun } from "lucide-react";

export const WellnessScreen = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full grid grid-cols-3 gap-6"
    >
      {/* Left Column */}
      <div className="flex flex-col gap-6">
        {/* Breathing Exercise */}
        <div className="calm-card p-6 flex-1 flex flex-col items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6"
          >
            <Wind className="w-10 h-10 text-primary" />
          </motion.div>
          <h3 className="font-medium text-foreground mb-2">Breathing</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Follow the circle as it grows and shrinks
          </p>
          <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
            Start 1-minute calm
          </button>
        </div>

        {/* Journal */}
        <div className="calm-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <PenLine className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Journal</h3>
              <p className="text-xs text-muted-foreground">Write freely, no judgment</p>
            </div>
          </div>
          <button className="w-full py-3 rounded-lg bg-muted text-muted-foreground text-sm hover:bg-muted/80 hover:text-foreground transition-colors">
            Start writing...
          </button>
        </div>
      </div>

      {/* Center - Main focus area */}
      <div className="flex flex-col gap-6">
        {/* Today's focus */}
        <div className="calm-card p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-foreground">Today's Focus</h3>
            <span className="text-xs text-muted-foreground">3 of 5 complete</span>
          </div>

          {/* Progress ring */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="fill-none stroke-muted"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="fill-none stroke-primary"
                  strokeWidth="8"
                  strokeDasharray={440}
                  strokeDashoffset={440 * 0.4}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold text-foreground">60%</span>
                <span className="text-xs text-muted-foreground">calm today</span>
              </div>
            </div>
          </div>

          {/* Simple checklist */}
          <div className="space-y-2 mt-6">
            {[
              { text: "Morning check-in", done: true },
              { text: "5-minute breathing", done: true },
              { text: "Gratitude note", done: true },
              { text: "Mindful walk", done: false },
              { text: "Evening reflection", done: false },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  item.done ? "bg-primary/5" : "bg-muted/50"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    item.done
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {item.done && (
                    <span className="text-xs text-primary-foreground">✓</span>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    item.done ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6">
        {/* Sound sanctuary */}
        <div className="calm-card p-6 flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flower2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Sound Sanctuary</h3>
              <p className="text-xs text-muted-foreground">Calming sounds</p>
            </div>
          </div>

          {/* Sound options */}
          <div className="space-y-2 mb-4">
            {[
              { name: "Rain on leaves", icon: "🌧️" },
              { name: "Ocean waves", icon: "🌊" },
              { name: "Forest birds", icon: "🐦" },
              { name: "Gentle piano", icon: "🎹" },
            ].map((sound, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors"
              >
                <span>{sound.icon}</span>
                <span className="text-muted-foreground hover:text-foreground transition-colors">{sound.name}</span>
              </button>
            ))}
          </div>

          {/* Play control */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        {/* Sleep/Wake toggle */}
        <div className="calm-card p-6">
          <h3 className="font-medium text-foreground mb-4">Wind down</h3>
          <div className="flex gap-2">
            <button className="flex-1 flex flex-col items-center gap-2 py-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Sun className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Day mode</span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-2 py-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
              <Moon className="w-5 h-5 text-accent-foreground" />
              <span className="text-xs text-accent-foreground">Night mode</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
