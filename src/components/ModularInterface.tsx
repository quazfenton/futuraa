import { useState, useRef, useEffect } from 'react';
import { ParticleCanvas } from './ParticleCanvas';
import { GeometricMorph } from './GeometricMorph';
import { SoundReactiveVisualizer } from './SoundReactiveVisualizer';
import { KineticText, GlitchText, MorphingText } from './KineticTypography';
import { FluidNavigation } from './FluidNavigation';
import { Maximize2, Minimize2, RotateCcw, Zap, Layers, Palette, Cpu } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  component: React.ReactNode;
  icon: React.ReactNode;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
}

const modules: Module[] = [
  {
    id: 'canvas',
    title: 'PARTICLE CANVAS',
    component: <ParticleCanvas />,
    icon: <Palette className="w-4 h-4" />,
    defaultSize: { width: 60, height: 60 },
    minSize: { width: 30, height: 30 }
  },
  {
    id: 'morph',
    title: 'GEOMETRIC MORPH',
    component: <GeometricMorph />,
    icon: <Layers className="w-4 h-4" />,
    defaultSize: { width: 35, height: 40 },
    minSize: { width: 25, height: 30 }
  },
  {
    id: 'audio',
    title: 'SOUND REACTIVE',
    component: <SoundReactiveVisualizer />,
    icon: <Zap className="w-4 h-4" />,
    defaultSize: { width: 35, height: 35 },
    minSize: { width: 25, height: 25 }
  },
  {
    id: 'kinetic',
    title: 'KINETIC TYPE',
    component: (
      <div className="p-8 h-full flex flex-col justify-center items-center space-y-6">
        <KineticText variant="title" className="text-center">
          AVANT
        </KineticText>
        <GlitchText className="text-2xl font-mono text-steel text-center">
          GARDE
        </GlitchText>
        <MorphingText 
          texts={['DIGITAL', 'KINETIC', 'NEURAL', 'FLUID']}
          className="text-xl text-chrome text-center"
        />
      </div>
    ),
    icon: <Cpu className="w-4 h-4" />,
    defaultSize: { width: 30, height: 25 },
    minSize: { width: 20, height: 20 }
  }
];

interface ModuleWindowProps {
  module: Module;
  onClose?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
}

const ModuleWindow = ({ module, onClose, onMaximize, isMaximized }: ModuleWindowProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ 
    x: Math.random() * (window.innerWidth - 400), 
    y: Math.random() * (window.innerHeight - 300) 
  });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isMaximized) return;
      
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized]);

  return (
    <div
      ref={windowRef}
      className={`absolute void-panel backdrop-blur-md overflow-hidden transition-all duration-300 ease-spring-smooth ${
        isMaximized 
          ? 'inset-4 z-50' 
          : 'z-30'
      } ${isDragging ? 'scale-105 shadow-electric' : 'shadow-void'}`}
      style={
        isMaximized 
          ? {} 
          : {
              left: position.x,
              top: position.y,
              width: `${module.defaultSize.width}vw`,
              height: `${module.defaultSize.height}vh`,
              minWidth: `${module.minSize.width}vw`,
              minHeight: `${module.minSize.height}vh`
            }
      }
    >
      {/* Window Header */}
      <div 
        className="h-12 border-b border-graphite/20 flex items-center justify-between px-4 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-3">
          <div className="text-steel">{module.icon}</div>
          <span className="font-mono text-sm font-medium text-chrome">
            {module.title}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onMaximize}
            className="w-6 h-6 flex items-center justify-center rounded-sm hover:bg-surface-elevated 
                       transition-colors duration-200 text-steel hover:text-chrome"
          >
            {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
          
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-sm hover:bg-electric-crimson/20 
                       transition-colors duration-200 text-steel hover:text-electric-crimson"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 relative overflow-hidden">
        {module.component}
      </div>
    </div>
  );
};

export const ModularInterface = () => {
  const [activeModules, setActiveModules] = useState<string[]>(['canvas']);
  const [maximizedModule, setMaximizedModule] = useState<string | null>(null);

  const openModule = (moduleId: string) => {
    if (!activeModules.includes(moduleId)) {
      setActiveModules(prev => [...prev, moduleId]);
    }
  };

  const closeModule = (moduleId: string) => {
    setActiveModules(prev => prev.filter(id => id !== moduleId));
    if (maximizedModule === moduleId) {
      setMaximizedModule(null);
    }
  };

  const toggleMaximize = (moduleId: string) => {
    setMaximizedModule(prev => prev === moduleId ? null : moduleId);
  };

  const handleNavigation = (itemId: string) => {
    openModule(itemId);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-gradient-void" />
      
      {/* Navigation */}
      <FluidNavigation 
        onNavigate={handleNavigation}
        activeSection={maximizedModule || activeModules[activeModules.length - 1]}
      />

      {/* Module Windows */}
      {activeModules.map(moduleId => {
        const module = modules.find(m => m.id === moduleId);
        if (!module) return null;

        return (
          <ModuleWindow
            key={moduleId}
            module={module}
            onClose={() => closeModule(moduleId)}
            onMaximize={() => toggleMaximize(moduleId)}
            isMaximized={maximizedModule === moduleId}
          />
        );
      })}

      {/* Quick Launch Bar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center space-x-2 void-panel p-2 rounded-sm backdrop-blur-md">
          {modules.map(module => (
            <button
              key={module.id}
              onClick={() => openModule(module.id)}
              className={`w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-200
                interactive-element ${
                activeModules.includes(module.id)
                  ? 'electric-glow text-foreground'
                  : 'text-steel hover:text-chrome hover:bg-surface-elevated'
              }`}
              title={module.title}
            >
              {module.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="fixed top-8 right-8 space-y-2 z-40">
        <div className="void-panel p-3 rounded-sm backdrop-blur-md">
          <div className="text-xs font-mono text-steel space-y-1">
            <div className="flex justify-between">
              <span>MODULES</span>
              <span className="text-electric-cyan">{activeModules.length}</span>
            </div>
            <div className="flex justify-between">
              <span>FPS</span>
              <span className="text-chrome">60</span>
            </div>
            <div className="flex justify-between">
              <span>LOAD</span>
              <span className="text-electric-amber">12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};