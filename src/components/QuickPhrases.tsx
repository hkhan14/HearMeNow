import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface QuickPhrasesProps {
  onPhraseSelect: (phrase: string) => void;
}

const defaultPhrases = [
  "Thank you so much!",
  "I'm really excited about this!",
  "I'm sorry, I didn't mean that.",
  "That's amazing!",
  "I need some help with this.",
  "Can we talk about it later?",
];

const QuickPhrases = ({ onPhraseSelect }: QuickPhrasesProps) => {
  const [phrases, setPhrases] = useState<string[]>(() => {
    const saved = localStorage.getItem("quickPhrases");
    return saved ? JSON.parse(saved) : defaultPhrases;
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newPhrase, setNewPhrase] = useState("");

  const handleAddPhrase = () => {
    if (newPhrase.trim()) {
      const updated = [...phrases, newPhrase.trim()];
      setPhrases(updated);
      localStorage.setItem("quickPhrases", JSON.stringify(updated));
      setNewPhrase("");
      setIsAdding(false);
    }
  };

  const handleRemovePhrase = (index: number) => {
    const updated = phrases.filter((_, i) => i !== index);
    setPhrases(updated);
    localStorage.setItem("quickPhrases", JSON.stringify(updated));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Quick Phrases
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add New
        </Button>
      </div>

      {isAdding && (
        <div className="flex gap-2 animate-slide-up">
          <input
            type="text"
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddPhrase()}
            placeholder="Type a phrase..."
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            autoFocus
          />
          <Button onClick={handleAddPhrase} size="sm">
            Add
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {phrases.map((phrase, index) => (
          <div
            key={index}
            className="group relative p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-all cursor-pointer border border-border hover:border-primary/50"
            onClick={() => onPhraseSelect(phrase)}
          >
            <p className="text-sm pr-6">{phrase}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemovePhrase(index);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
            >
              <X className="w-3 h-3 text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickPhrases;
