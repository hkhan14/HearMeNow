import React, { useState } from "react";
import TextInput from "./TextInput";
import EmotionSelector, { type Emotion } from "./EmotionSelector";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  emotion: Emotion;
  onEmotionChange: (e: Emotion) => void;
  onPlay: () => void;
  isGenerating?: boolean;
  maxLength?: number;
}

const ChatInput = ({ value, onChange, emotion, onEmotionChange, onPlay, isGenerating = false, maxLength = 500 }: ChatInputProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <TextInput value={value} onChange={onChange} maxLength={maxLength} />
        </div>

        <div className="w-full lg:w-64 flex flex-col gap-4">
          <EmotionSelector selectedEmotion={emotion} onEmotionSelect={onEmotionChange} />

          <div className="pt-2">
            <Button
              onClick={onPlay}
              disabled={!value.trim() || isGenerating}
              className="w-full rounded-full font-semibold"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Play"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
