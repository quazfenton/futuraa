import { useEffect, useState } from 'react';
import { ModularInterface } from '@/components/ModularInterface';
import { KineticText, GlitchText } from '@/components/KineticTypography';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mouseTrails, setMouseTrails] = useState<Array<{x: number, y: number, id: number}>>([]);

  useEffect(() => {
    // Initialize the interface
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Mouse trail effect
    const handleMouseMove = (e: MouseEvent) => {
      const trail = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now() + Math.random()
      };
      
      setMouseTrails(prev => [...prev.slice(-10), trail]);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Cleanup old trails
    const interval = setInterval(() => {
      setMouseTrails(prev => prev.slice(-5));
    }, 100);
    
    return () => clearInterval(interval);
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
      {/* Mouse Trails */}
      {mouseTrails.map((trail, index) => (
        <div
          key={trail.id}
          className="particle-trail"
          style={{
            left: trail.x,
            top: trail.y,
            animationDelay: `${index * 50}ms`
          }}
        />
      ))}

      {/* Main Interface */}
      <ModularInterface />

      {/* Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-electric-cyan opacity-60 animate-float" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-electric-violet opacity-40 animate-float" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-electric-amber opacity-30 animate-rotate-slow" />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--steel)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--steel)) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

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
