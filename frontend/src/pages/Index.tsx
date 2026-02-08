import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBarDesktop } from "@/components/layout/TopBarDesktop";
import { SOSModal } from "@/components/modals/SOSModal";
import { TherapyScreen } from "@/components/screens/TherapyScreen";
import { WellnessScreen } from "@/components/screens/WellnessScreen";
import { CommunityScreen } from "@/components/screens/CommunityScreen";
import { GardenScreen } from "@/components/screens/GardenScreen";
import { TherapistsScreen } from "@/components/screens/TherapistsScreen";

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  enter: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeInOut" as const,
  duration: 0.3,
};

const pageTitles: Record<string, string> = {
  therapy: "Your Calm Space",
  wellness: "Wellness Center",
  therapists: "Find a Therapist",
  community: "Community",
  garden: "Healing Garden",
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("therapy");
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case "therapy":
        return <TherapyScreen key="therapy" />;
      case "wellness":
        return <WellnessScreen key="wellness" />;
      case "therapists":
        return <TherapistsScreen key="therapists" />;
      case "community":
        return <CommunityScreen key="community" />;
      case "garden":
        return <GardenScreen key="garden" />;
      default:
        return <TherapyScreen key="therapy" />;
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Floating Vertical Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Top Bar */}
      <TopBarDesktop
        onSOSClick={() => setIsSOSOpen(true)}
        title={pageTitles[activeTab]}
      />

      {/* Main Content */}
      <main className="ml-24 pt-24 pb-6 pr-6 h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={pageTransition}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* SOS Modal */}
      <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
    </div>
  );
};

export default Index;
