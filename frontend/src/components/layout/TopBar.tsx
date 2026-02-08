import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface TopBarProps {
  onSOSClick: () => void;
}

export const TopBar = ({ onSOSClick }: TopBarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card-subtle rounded-none border-t-0 border-x-0">
      <div className="container flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-xl font-semibold text-gradient">Feelio</span>
        </motion.div>

        {/* SOS Button */}
        <motion.button
          onClick={onSOSClick}
          className="relative sos-pulse"
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="relative z-10 px-4 py-1.5 bg-destructive text-destructive-foreground text-sm font-semibold rounded-full shadow-lg">
            SOS
          </span>
        </motion.button>
      </div>
    </header>
  );
};
