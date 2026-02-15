import { useEffect, useRef, useState } from "react";
import { VideoOff, Camera } from "lucide-react";

interface UserVideoFeedProps {
  isCameraOn: boolean;
}

const UserVideoFeed = ({ isCameraOn }: UserVideoFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      if (!isCameraOn) {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
          setError(null);
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setHasPermission(false);
        if (err instanceof Error) {
          if (err.name === "NotAllowedError") {
            setError("Camera access denied. Please allow camera access to continue.");
          } else if (err.name === "NotFoundError") {
            setError("No camera found. Please connect a camera.");
          } else {
            setError("Unable to access camera.");
          }
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  if (!isCameraOn) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-muted/50">
        <VideoOff className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-sm">Camera is off</p>
      </div>
    );
  }

  if (hasPermission === false || error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-muted/50 p-4">
        <Camera className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-sm text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-primary text-sm hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />
      
      {/* Subtle overlay gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, hsl(var(--background) / 0.3) 0%, transparent 30%)",
        }}
      />
    </div>
  );
};

export default UserVideoFeed;
