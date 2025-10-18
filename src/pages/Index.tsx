import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Hero from "@/components/Hero";
import TextInput from "@/components/TextInput";
import EmotionSelector, { Emotion } from "@/components/EmotionSelector";
import AudioPlayer from "@/components/AudioPlayer";
import QuickPhrases from "@/components/QuickPhrases";
import Impact from "@/components/Impact";

const Index = () => {
  const [message, setMessage] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>("neutral");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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
      // TODO: Integrate with ElevenLabs API via backend
      // For now, simulate generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsPlaying(true);
      
      toast({
        title: "Voice Generated!",
        description: `Your message with ${selectedEmotion} emotion is ready`,
      });

      // Simulate playback duration
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your voice. Please try again.",
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
          
          <EmotionSelector 
            selectedEmotion={selectedEmotion} 
            onEmotionSelect={setSelectedEmotion}
          />
          
          <AudioPlayer
            isGenerating={isGenerating}
            isPlaying={isPlaying}
            onGenerate={handleGenerate}
            disabled={!message.trim()}
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
