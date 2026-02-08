import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MessageCircle, Heart, ExternalLink } from "lucide-react";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const helplines = [
  {
    name: "National Crisis Line",
    number: "988",
    description: "Free, 24/7 support for anyone in distress",
    icon: Phone,
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "Free, 24/7 text-based support",
    icon: MessageCircle,
  },
  {
    name: "International Association for Suicide Prevention",
    number: "Visit IASP.info",
    description: "Find resources in your country",
    icon: ExternalLink,
  },
];

export const SOSModal = ({ isOpen, onClose }: SOSModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-card rounded-2xl shadow-gentle border border-border p-6 mx-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">You're not alone</h2>
                    <p className="text-sm text-muted-foreground">Help is always available</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Reassurance */}
              <div className="bg-primary/5 rounded-xl p-4 mb-6">
                <p className="text-sm text-foreground leading-relaxed">
                  It's okay to ask for help. Whatever you're going through, there are people who care and want to support you. You matter.
                </p>
              </div>

              {/* Helplines */}
              <div className="space-y-3">
                {helplines.map((helpline, index) => {
                  const Icon = helpline.icon;
                  return (
                    <motion.div
                      key={helpline.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{helpline.name}</p>
                          <p className="text-primary font-semibold mt-0.5">{helpline.number}</p>
                          <p className="text-xs text-muted-foreground mt-1">{helpline.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  These resources are here for you 24/7. Take care of yourself.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
