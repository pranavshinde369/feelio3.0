import { motion } from "framer-motion";
import { Video, Flower2, Users, Leaf } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "therapy", label: "Therapy", icon: Video },
  { id: "wellness", label: "Wellness", icon: Flower2 },
  { id: "community", label: "Community", icon: Users },
  { id: "garden", label: "Garden", icon: Leaf },
];

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none border-b-0 border-x-0 pb-safe">
      <div className="container flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-item flex-1 ${isActive ? "nav-item-active" : ""}`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0 
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon 
                  className={`nav-icon w-5 h-5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`} 
                />
              </motion.div>
              <span 
                className={`nav-label text-xs transition-colors ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
