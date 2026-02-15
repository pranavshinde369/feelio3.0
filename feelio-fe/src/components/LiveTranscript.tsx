import { useEffect, useState } from "react";

interface LiveTranscriptProps {
  transcript: string;
  isVisible: boolean;
}

const LiveTranscript = ({ transcript, isVisible }: LiveTranscriptProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!transcript) {
      setDisplayedText("");
      return;
    }

    setIsAnimating(true);
    setDisplayedText("");

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < transcript.length) {
        setDisplayedText(transcript.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [transcript]);

  if (!isVisible && !displayedText) return null;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-20">
      <div className="glass rounded-xl px-6 py-4 text-center animate-fade-in">
        <p className="text-foreground text-lg leading-relaxed">
          {displayedText}
          {isAnimating && (
            <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse" />
          )}
        </p>
      </div>
    </div>
  );
};

export default LiveTranscript;
