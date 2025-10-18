import { Smile, Frown, Angry, Leaf, Zap, Sparkles, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Emotion = "happy" | "sad" | "angry" | "calm" | "surprised" | "excited" | "neutral";

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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {emotions.map((emotion) => (
          <Button
            key={emotion.value}
            variant="outline"
            onClick={() => onEmotionSelect(emotion.value)}
            className={cn(
              "flex flex-col items-center justify-center h-20 gap-1 transition-all border-2",
              emotion.bgClass,
              emotion.hoverClass,
              selectedEmotion === emotion.value
                ? `border-${emotion.color} shadow-lg scale-105`
                : "border-border"
            )}
            style={
              selectedEmotion === emotion.value
                ? { borderColor: `hsl(var(--${emotion.color}))` }
                : undefined
            }
          >
            <div style={{ color: `hsl(var(--${emotion.color}))` }}>
              {emotion.icon}
            </div>
            <span className="text-xs font-medium">{emotion.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EmotionSelector;
