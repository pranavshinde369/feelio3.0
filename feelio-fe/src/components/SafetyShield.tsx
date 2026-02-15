import { Shield } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SafetyShield = () => {
  return (
    <div className="absolute top-4 right-4 z-30">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="glass rounded-full p-3 cursor-help hover:bg-primary/10 transition-colors">
            <Shield className="h-5 w-5 text-primary" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="font-medium">Crisis Protocol Active</span>
            </div>
            <p className="text-xs text-muted-foreground">
              If you're in crisis or need immediate help, our safety protocols will guide you to appropriate resources.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default SafetyShield;
