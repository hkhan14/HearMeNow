import { Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  isGenerating: boolean;
  isPlaying: boolean;
  onGenerate: () => void;
  disabled: boolean;
}

const AudioPlayer = ({ isGenerating, isPlaying, onGenerate, disabled }: AudioPlayerProps) => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-2xl border shadow-lg">
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
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating Voice...
          </>
        ) : (
          <>
            <Volume2 className="mr-2 h-5 w-5" />
            Speak with Emotion
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
