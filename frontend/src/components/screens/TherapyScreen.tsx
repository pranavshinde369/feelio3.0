import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Video, Phone, Sparkles, User, Heart } from "lucide-react";

export const TherapyScreen = () => {
  const [mode, setMode] = useState<"guided" | "reflection">("guided");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex gap-6"
    >
      {/* Left - Video/Talk Area */}
      <div className="flex-1 flex flex-col">
        {/* Mode Toggle - Gentle wording */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setMode("guided")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              mode === "guided"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Guided Support
          </button>
          <button
            onClick={() => setMode("reflection")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              mode === "reflection"
                ? "bg-accent text-accent-foreground shadow-soft"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Heart className="w-4 h-4" />
            Self Reflection
          </button>
        </div>

        {/* Main Space */}
        <div className="flex-1 calm-card p-8 flex flex-col items-center justify-center">
          {/* Calming visual */}
          <motion.div
            className="relative w-32 h-32 mb-8"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 rounded-full bg-primary/10" />
            <div className="absolute inset-3 rounded-full bg-primary/15" />
            <div className="absolute inset-6 rounded-full bg-primary/20 flex items-center justify-center">
              {mode === "guided" ? (
                <Sparkles className="w-10 h-10 text-primary" />
              ) : (
                <Heart className="w-10 h-10 text-accent" />
              )}
            </div>
          </motion.div>

          {/* Welcoming message */}
          <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">
            {mode === "guided" ? "Hi, I'm here to listen" : "Time for yourself"}
          </h2>
          <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
            {mode === "guided"
              ? "Whenever you're ready, share what's on your mind. There's no rush, no judgment—just a safe space to talk."
              : "This is your quiet moment. Reflect, journal, or simply breathe. Whatever feels right."}
          </p>

          {/* Controls - Simple and clear */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <Video className="w-5 h-5 text-muted-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-soft hover:shadow-gentle transition-shadow"
            >
              <Mic className="w-6 h-6 text-primary-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <Phone className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Right - Simple support panel */}
      <div className="w-80 flex flex-col gap-4">
        {/* Mood check */}
        <div className="calm-card p-5">
          <h3 className="font-medium text-foreground mb-3">How are you feeling?</h3>
          <div className="flex gap-2">
            {["😊", "😐", "😔", "😰", "😤"].map((emoji, i) => (
              <button
                key={i}
                className="flex-1 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-lg flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="calm-card p-5 flex-1">
          <h3 className="font-medium text-foreground mb-3">Gentle suggestions</h3>
          <div className="space-y-2">
            {[
              "Take three deep breaths",
              "Notice something beautiful around you",
              "Write one thing you're grateful for",
              "Drink some water",
            ].map((suggestion, i) => (
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

        {/* Professional option */}
        {mode === "guided" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="calm-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Talk to a professional</p>
                <p className="text-xs text-muted-foreground">Licensed therapists available</p>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-lg bg-accent/10 text-accent-foreground text-sm font-medium hover:bg-accent/20 transition-colors">
              Find a therapist
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
