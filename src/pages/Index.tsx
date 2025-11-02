import { useEffect, useState } from 'react';
import { ModularInterface } from '@/components/ModularInterface';
import { KineticText, GlitchText } from '@/components/KineticTypography';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize the interface
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Loading Animation */}
        <div className="text-center space-y-8 z-10">
          <div className="relative">
            <KineticText 
              variant="title" 
              className="kinetic-text" 
              staggerDelay={100}
            >
              AVANT-GARDE
            </KineticText>
            <div className="absolute inset-0 kinetic-text opacity-20 blur-sm">
              AVANT-GARDE
            </div>
          </div>
          
          <GlitchText className="text-xl font-mono text-steel">
            INITIALIZING DIGITAL EXPERIENCE...
          </GlitchText>
          
          <div className="flex justify-center">
            <div className="w-48 h-1 bg-graphite rounded overflow-hidden">
              <div className="h-full bg-gradient-electric animate-[pulse_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

        {/* Background geometric elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute morphing-blob"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                background: `var(--gradient-${['electric', 'chrome', 'steel'][Math.floor(Math.random() * 3)]})`,
                opacity: 0.1,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Interface */}
      <ModularInterface />


      {/* Performance Monitor */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="void-panel p-2 rounded-sm backdrop-blur-md">
          <div className="text-xs font-mono text-steel">
            <div className="text-electric-cyan">◉ LIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
