import { Heart, Users, Sparkles, Globe } from "lucide-react";

const impactStats = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Emotional Expression",
    description: "Convey tone, sarcasm, excitement, and empathy - not just words",
    color: "emotion-happy",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "True Inclusion",
    description: "Empowers people with speech impairments to participate fully in conversations",
    color: "emotion-calm",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Natural Connection",
    description: "Sounds human and authentic, making interactions feel real",
    color: "emotion-excited",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Universal Access",
    description: "Works across languages and contexts - classrooms, workplaces, social life",
    color: "emotion-surprised",
  },
];

const Impact = () => {
  return (
    <section id="impact" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold">
            Making Communication
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Truly Accessible
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Traditional text-to-speech fails to convey emotion. HearMeNow changes that,
            giving everyone the power to express themselves fully.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ 
                  backgroundColor: `hsl(var(--${stat.color}) / 0.1)`,
                  color: `hsl(var(--${stat.color}))`
                }}
              >
                {stat.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
              <p className="text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl border border-primary/20">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold">The Problem We Solve</h3>
            <p className="text-lg text-muted-foreground">
              Current TTS apps help people speak, but they sound robotic and emotionless. 
              This creates a disconnect where tone matters as much as words. People feel 
              misunderstood in social and professional settings.
            </p>
            <div className="pt-4">
              <p className="text-xl font-semibold text-primary">
                HearMeNow bridges that gap with emotionally intelligent voice synthesis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
