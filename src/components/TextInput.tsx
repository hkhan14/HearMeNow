import React, { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

// Forward the native textarea ref so parent can read/set caret position
const TextInput = forwardRef<HTMLTextAreaElement, TextInputProps>(({ value, onChange, maxLength = 500 }, ref) => {
  return (
    <div className="space-y-2">
      <label htmlFor="message-input" className="text-sm font-medium text-foreground">
        Type Your Message
      </label>
      <Textarea
        id="message-input"
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type what you want to say..."
        className="min-h-[120px] text-base resize-none focus:ring-2 focus:ring-primary"
        maxLength={maxLength}
      />
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Press Enter to add line breaks</span>
        <span>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
});

TextInput.displayName = "TextInput";

export default TextInput;
