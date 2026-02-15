import { Mic, MicOff, Video, VideoOff, PhoneOff, PanelRightOpen, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ControlBarProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onEndSession: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const ControlBar = ({
  isMicOn,
  isCameraOn,
  onToggleMic,
  onToggleCamera,
  onEndSession,
  onToggleSidebar,
  isSidebarOpen,
}: ControlBarProps) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="glass rounded-full px-6 py-3 flex items-center gap-4">
        {/* Microphone Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMic}
              className={`
                rounded-full h-12 w-12 transition-all duration-200
                ${isMicOn 
                  ? "bg-muted hover:bg-muted/80" 
                  : "bg-destructive/20 hover:bg-destructive/30 text-destructive"
                }
              `}
            >
              {isMicOn ? (
                <Mic className="h-5 w-5" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isMicOn ? "Mute microphone" : "Unmute microphone"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Camera Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCamera}
              className={`
                rounded-full h-12 w-12 transition-all duration-200
                ${isCameraOn 
                  ? "bg-muted hover:bg-muted/80" 
                  : "bg-destructive/20 hover:bg-destructive/30 text-destructive"
                }
              `}
            >
              {isCameraOn ? (
                <Video className="h-5 w-5" />
              ) : (
                <VideoOff className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isCameraOn ? "Turn off camera" : "Turn on camera"}</p>
          </TooltipContent>
        </Tooltip>

        {/* End Session */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={onEndSession}
              className="rounded-full h-12 w-12 bg-destructive hover:bg-destructive/90"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>End session</p>
          </TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="h-8 w-px bg-border mx-2" />

        {/* Toggle Sidebar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="rounded-full h-12 w-12 bg-muted hover:bg-muted/80"
            >
              {isSidebarOpen ? (
                <PanelRightClose className="h-5 w-5" />
              ) : (
                <PanelRightOpen className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSidebarOpen ? "Hide insights" : "Show insights"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ControlBar;
