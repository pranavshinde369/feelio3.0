import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface TopBarDesktopProps {
  onSOSClick: () => void;
  title: string;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "Therapy Command Center": { title: "Your Calm Space", subtitle: "A safe place to talk and heal" },
  "Wellness Dashboard": { title: "Wellness", subtitle: "Nurture your mind and body" },
  "Soul Connect": { title: "Community", subtitle: "You're not alone" },
  "The Heal Garden": { title: "Your Garden", subtitle: "Watch yourself grow" },
};

export const TopBarDesktop = ({ onSOSClick, title }: TopBarDesktopProps) => {
  const display = pageTitles[title] || { title, subtitle: "Welcome to your safe space" };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-4 left-24 right-4 z-40 flex items-center justify-between"
    >
      {/* Page Title - Warm and welcoming */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">{display.title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{display.subtitle}</p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Safe Status */}
        <div className="glass-card-subtle px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">You're safe here</span>
        </div>

        {/* Help Button - Gentle, not alarming */}
        <motion.button
          onClick={onSOSClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/15 transition-colors"
        >
          <Heart className="w-4 h-4" />
          <span className="text-sm font-medium">Need Help?</span>
        </motion.button>
      </div>
    </motion.header>
  );
};
