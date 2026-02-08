import { motion } from "framer-motion";
import { MessageCircle, Flower2, Users, Leaf, Heart, UserSearch } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "therapy", label: "Talk", icon: MessageCircle },
  { id: "wellness", label: "Wellness", icon: Flower2 },
  { id: "therapists", label: "Find Therapist", icon: UserSearch },
  { id: "community", label: "Community", icon: Users },
  { id: "garden", label: "Garden", icon: Leaf },
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <motion.nav
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 glass-card p-3 flex flex-col gap-2"
    >
      {/* Logo - Heart icon for mental health */}
      <div className="flex items-center justify-center w-11 h-11 mb-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Heart className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Navigation Items */}
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`sidebar-nav-item ${isActive ? "active" : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={tab.label}
          >
            <Icon
              className={`w-5 h-5 transition-colors duration-300 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </motion.button>
        );
      })}
    </motion.nav>
  );
};
