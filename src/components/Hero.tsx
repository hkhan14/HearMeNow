import { Volume2 } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-purple-700 text-primary-foreground py-20 px-4 md:py-32">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full animate-pulse-slow">
            <Volume2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Give Your Words
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Emotional Life
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl">
            HearMeNow transforms your typed messages into emotionally expressive speech,
            helping you communicate not just words, but feelings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a href="#app" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 shadow-lg">
              Try It Now
            </a>
            <a href="#impact" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-all">
              Learn More
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
