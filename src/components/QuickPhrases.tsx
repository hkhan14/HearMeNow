import { Button } from "@/components/ui/button";
import { Plus, X, Star } from "lucide-react";
import { useState } from "react";

interface PhraseItem {
  text: string;
  favorite?: boolean;
}

interface QuickPhrasesProps {
  // Called when user taps the phrase to replace the full message (legacy)
  onPhraseSelect?: (phrase: string) => void;
  // Called when user taps the phrase to insert/append into the current message
  onPhraseInsert?: (phrase: string) => void;
}

const defaultPhrases: PhraseItem[] = [
  { text: "Thank you so much!" },
  { text: "I'm really excited about this!" },
  { text: "I'm sorry, I didn't mean that." },
  { text: "That's amazing!" },
  { text: "I need some help with this." },
  { text: "Can we talk about it later?" },
];

const QuickPhrases = ({ onPhraseSelect, onPhraseInsert }: QuickPhrasesProps) => {
  const [phrases, setPhrases] = useState<PhraseItem[]>(() => {
    const saved = localStorage.getItem("quickPhrases");
    if (!saved) return defaultPhrases;
    try {
      const parsed = JSON.parse(saved);
      // Support older format: array of strings
      if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === "string") {
        return (parsed as string[]).map((t) => ({ text: t }));
      }
      return parsed as PhraseItem[];
    } catch (err) {
      return defaultPhrases;
    }
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newPhrase, setNewPhrase] = useState("");

  const persist = (items: PhraseItem[]) => {
    setPhrases(items);
    localStorage.setItem("quickPhrases", JSON.stringify(items));
  };

  const handleAddPhrase = () => {
    if (newPhrase.trim()) {
      const updated = [...phrases, { text: newPhrase.trim() }];
      persist(updated);
      setNewPhrase("");
      setIsAdding(false);
    }
  };

  const handleRemovePhrase = (index: number) => {
    const updated = phrases.filter((_, i) => i !== index);
    persist(updated);
  };

  const toggleFavorite = (index: number) => {
    const updated = phrases.map((p, i) => (i === index ? { ...p, favorite: !p.favorite } : p));
    persist(updated);
  };

  // Display favorites first (keep original relative order)
  const favoriteItems = phrases.filter((p) => p.favorite);
  const otherItems = phrases.filter((p) => !p.favorite);

  const renderGrid = (items: PhraseItem[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {items.map((phrase, index) => {
        // compute original index to operate on array
        const originalIndex = phrases.indexOf(phrase);
        return (
          <div
            key={originalIndex}
            className="group relative p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-all cursor-pointer border border-border hover:border-primary/50"
            onClick={() => {
              // insert if insert handler provided, otherwise replace
              if (onPhraseInsert) onPhraseInsert(phrase.text);
              else if (onPhraseSelect) onPhraseSelect(phrase.text);
            }}
          >
            <p className="text-sm pr-12">{phrase.text}</p>

            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(originalIndex);
                }}
                title={phrase.favorite ? "Unfavorite" : "Favorite"}
                className="p-1 rounded hover:bg-accent/10"
              >
                <Star className={`w-4 h-4 ${phrase.favorite ? "text-yellow-400" : "text-muted-foreground"}`} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePhrase(originalIndex);
                }}
                className="p-1 hover:bg-destructive/10 rounded"
                title="Remove"
              >
                <X className="w-3 h-3 text-destructive" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Quick Phrases</label>
        <Button variant="ghost" size="sm" onClick={() => setIsAdding(!isAdding)} className="text-xs">
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

      {favoriteItems.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-2">Favorites</div>
          {renderGrid(favoriteItems)}
        </div>
      )}

      <div className="text-xs text-muted-foreground mb-2">All Phrases</div>
      {renderGrid(otherItems)}
    </div>
  );
};

export default QuickPhrases;
