import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Hero from "@/components/Hero";
import TextInput from "@/components/TextInput";
import EmotionSelector, { Emotion } from "@/components/EmotionSelector";
import AudioPlayer from "@/components/AudioPlayer";
import QuickPhrases from "@/components/QuickPhrases";
import Impact from "@/components/Impact";
import { synthesizeSpeech } from "@/lib/tts";
import { detectEmotion } from "@/lib/emotion";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [message, setMessage] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>(() => {
    const saved = localStorage.getItem("selectedEmotion") as Emotion | null;
    return saved ?? "neutral";
  });
  // Persist selected emotion
  useEffect(() => {
    localStorage.setItem("selectedEmotion", selectedEmotion);
  }, [selectedEmotion]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please type a message first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Call backend TTS which integrates with ElevenLabs
      const blob = await synthesizeSpeech({ text: message, emotion: selectedEmotion });
      // Create object URL and play
      const url = URL.createObjectURL(blob);
      setAudioUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setIsPlaying(true);
      toast({
        title: "Voice Generated!",
        description: `Your message with ${selectedEmotion} emotion is ready`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating your voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePhraseSelect = (phrase: string) => {
    setMessage(phrase);
    toast({
      title: "Phrase Selected",
      description: "Quick phrase loaded into text field",
    });
  };

  const handleAutoDetect = async () => {
    if (!message.trim()) {
      toast({ title: "Message Required", description: "Type a message first to detect emotion", variant: "destructive" });
      return;
    }

    setIsDetecting(true);
    try {
      const res = await detectEmotion(message);
      if (res && res.emotion) {
        const next = res.emotion as Emotion;
        setSelectedEmotion(next);
        toast({ title: "Emotion Detected", description: `Auto-detected: ${next}` });
      } else {
        toast({ title: "Detection Failed", description: "Could not detect emotion", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Detection Error", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      <main id="app" className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
        <div className="text-center space-y-2 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold">
            Express Yourself
          </h2>
          <p className="text-muted-foreground">
            Type your message, choose an emotion, and hear it come to life
          </p>
        </div>

        <div className="bg-card rounded-3xl shadow-xl border p-6 md:p-8 space-y-6 animate-slide-up">
          <TextInput value={message} onChange={setMessage} />
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <EmotionSelector 
                selectedEmotion={selectedEmotion} 
                onEmotionSelect={setSelectedEmotion}
              />
            </div>
            <div className="md:ml-6 flex items-start">
              <Button 
                variant="ghost"
                size="default"
                onClick={handleAutoDetect}
                disabled={isDetecting || !message.trim()}
                className="whitespace-nowrap"
              >
                {isDetecting ? "Detecting..." : "Auto-detect Emotion"}
              </Button>
            </div>
          </div>
          
          <AudioPlayer
            isGenerating={isGenerating}
            isPlaying={isPlaying}
            onGenerate={handleGenerate}
            disabled={!message.trim()}
            emotion={selectedEmotion}
            audioSrc={audioUrl ?? undefined}
            onPlaybackEnd={() => setIsPlaying(false)}
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <QuickPhrases onPhraseSelect={handlePhraseSelect} />
        </div>

        <div className="text-center p-6 bg-muted/50 rounded-2xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-muted-foreground">
            <strong>Coming Soon:</strong> Auto emotion detection from your text,
            voice customization, and multi-language support
          </p>
        </div>
      </main>

      <Impact />

      <footer className="border-t py-8 px-4 mt-20">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ for accessibility • Powered by ElevenLabs • MLH Hackathon 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
