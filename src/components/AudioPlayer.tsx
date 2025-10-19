import { useEffect, useRef } from "react";
import { Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Emotion } from "@/components/EmotionSelector";

interface AudioPlayerProps {
  isGenerating: boolean;
  isPlaying: boolean;
  onGenerate: () => void;
  disabled: boolean;
  emotion?: Emotion;
  audioSrc?: string;
  onPlaybackEnd?: () => void;
}

const AudioPlayer = ({ isGenerating, isPlaying, onGenerate, disabled, emotion = "neutral", audioSrc, onPlaybackEnd }: AudioPlayerProps) => {
  const emotionColorVar = `var(--emotion-${emotion})`;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-play when we have audio and playing state is true
  useEffect(() => {
    if (isPlaying && audioSrc && audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        void audioRef.current.play();
      } catch {
        // no-op
      }
    }
  }, [isPlaying, audioSrc]);

  // Notify parent when playback ends
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const handler = () => onPlaybackEnd?.();
    el.addEventListener("ended", handler);
    return () => {
      el.removeEventListener("ended", handler);
    };
  }, [onPlaybackEnd]);
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-2xl border shadow-lg">
      <audio ref={audioRef} src={audioSrc} preload="auto" hidden />
      {/* Waveform visualization */}
      <div className="flex items-center justify-center gap-1 h-16">
        {isPlaying || isGenerating ? (
          <>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 bg-primary rounded-full animate-wave",
                  isGenerating ? "opacity-50" : "opacity-100"
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  height: isGenerating ? "20px" : "40px",
                  backgroundColor: `hsl(${emotionColorVar})`,
                }}
              />
            ))}
          </>
        ) : (
          <Volume2 className="w-12 h-12 text-muted-foreground" />
        )}
      </div>

      <Button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        size="lg"
        className="w-full max-w-xs font-semibold rounded-full transition-all hover:scale-105"
        aria-label={isGenerating ? "Generating voice" : `Speak with ${emotion} tone`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating Voice...
          </>
        ) : (
          <>
            <Volume2 className="mr-2 h-5 w-5" />
            {`Speak with ${emotion.charAt(0).toUpperCase() + emotion.slice(1)} tone`}
          </>
        )}
      </Button>

      {isPlaying && (
        <p className="text-sm text-muted-foreground animate-pulse">
          Playing your message...
        </p>
      )}
    </div>
  );
};

export default AudioPlayer;
