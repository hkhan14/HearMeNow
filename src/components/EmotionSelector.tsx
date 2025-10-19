import { Smile, Frown, Angry, Leaf, Zap, Sparkles, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Canonical set of supported emotions used across the app.
 * Keep in sync with CSS variables --emotion-<name> in index.css.
 */
export type Emotion = "happy" | "sad" | "angry" | "calm" | "surprised" | "excited" | "neutral";

/**
 * Props contract for EmotionSelector.
 * - selectedEmotion: current value
 * - onEmotionSelect: called with next value on user action
 */
interface EmotionSelectorProps {
  selectedEmotion: Emotion;
  onEmotionSelect: (emotion: Emotion) => void;
}

const emotions: { 
  value: Emotion; 
  label: string; 
  icon: React.ReactNode; 
  color: string;
  bgClass: string;
  hoverClass: string;
}[] = [
  { 
    value: "happy", 
    label: "Happy", 
    icon: <Smile className="w-5 h-5" />, 
    color: "emotion-happy",
    bgClass: "bg-emotion-happy/10",
    hoverClass: "hover:bg-emotion-happy/20"
  },
  { 
    value: "sad", 
    label: "Sad", 
    icon: <Frown className="w-5 h-5" />, 
    color: "emotion-sad",
    bgClass: "bg-emotion-sad/10",
    hoverClass: "hover:bg-emotion-sad/20"
  },
  { 
    value: "angry", 
    label: "Angry", 
    icon: <Angry className="w-5 h-5" />, 
    color: "emotion-angry",
    bgClass: "bg-emotion-angry/10",
    hoverClass: "hover:bg-emotion-angry/20"
  },
  { 
    value: "calm", 
    label: "Calm", 
    icon: <Leaf className="w-5 h-5" />, 
    color: "emotion-calm",
    bgClass: "bg-emotion-calm/10",
    hoverClass: "hover:bg-emotion-calm/20"
  },
  { 
    value: "surprised", 
    label: "Surprised", 
    icon: <Zap className="w-5 h-5" />, 
    color: "emotion-surprised",
    bgClass: "bg-emotion-surprised/10",
    hoverClass: "hover:bg-emotion-surprised/20"
  },
  { 
    value: "excited", 
    label: "Excited", 
    icon: <Sparkles className="w-5 h-5" />, 
    color: "emotion-excited",
    bgClass: "bg-emotion-excited/10",
    hoverClass: "hover:bg-emotion-excited/20"
  },
  { 
    value: "neutral", 
    label: "Neutral", 
    icon: <Minus className="w-5 h-5" />, 
    color: "emotion-neutral",
    bgClass: "bg-emotion-neutral/10",
    hoverClass: "hover:bg-emotion-neutral/20"
  },
];

const EmotionSelector = ({ selectedEmotion, onEmotionSelect }: EmotionSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Select Emotion
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2" role="radiogroup" aria-label="Select Emotion">
        {emotions.map((emotion) => {
          const isSelected = selectedEmotion === emotion.value;
          return (
            <Button
              key={emotion.value}
              variant="outline"
              onClick={() => onEmotionSelect(emotion.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onEmotionSelect(emotion.value);
                }
              }}
              role="radio"
              aria-checked={isSelected}
              aria-label={emotion.label}
              className={cn(
                "flex flex-col items-center justify-center h-20 gap-1 transition-all border-2 focus-visible:ring-2 focus-visible:ring-primary",
                emotion.bgClass,
                emotion.hoverClass,
                isSelected ? `shadow-lg scale-105` : "border-border"
              )}
              style={
                isSelected
                  ? { borderColor: `hsl(var(--${emotion.color}))` }
                  : undefined
              }
            >
              <div style={{ color: `hsl(var(--${emotion.color}))` }}>
                {emotion.icon}
              </div>
              <span className="text-xs font-medium">{emotion.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionSelector;
