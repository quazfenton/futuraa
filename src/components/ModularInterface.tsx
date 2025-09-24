import { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  X, 
  Zap, 
  Layers, 
  Palette, 
  Cpu,
  Image,
  FileText,
  Music,
  Video,
  Globe,
  User,
  ExternalLink,
  Camera,
  Code,
  Settings,
  Database,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FluidNavigation } from '@/components/FluidNavigation';

interface ModuleWindow {
  id: string;
  title: string;
  icon: any;
  content: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  subdomain?: string;
}

interface User {
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
  lastActivity: string;
}

const modules: Record<string, ModuleWindow> = {
  canvas: {
    id: 'canvas',
    title: 'Digital Canvas',
    icon: Palette,
    content: (
      <div className="h-full void-panel p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Palette className="w-12 h-12 text-electric-cyan mx-auto" />
          <p className="text-steel">Interactive Design Canvas</p>
        </div>
      </div>
    ),
    position: { x: 100, y: 100 },
    size: { width: 400, height: 300 },
    subdomain: 'canvas'
  },
  gallery: {
    id: 'gallery',
    title: 'Visual Gallery',
    icon: Image,
    content: (
      <div className="h-full void-panel p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Image className="w-12 h-12 text-electric-violet mx-auto" />
          <p className="text-steel">Right-click to navigate</p>
        </div>
      </div>
    ),
    position: { x: 200, y: 150 },
    size: { width: 450, height: 350 },
    subdomain: 'gallery'
  },
  journal: {
    id: 'journal',
    title: 'Digital Journal',
    icon: FileText,
    content: (
      <div className="h-full void-panel p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileText className="w-12 h-12 text-electric-amber mx-auto" />
          <p className="text-steel">Written Content & Blog</p>
        </div>
      </div>
    ),
    position: { x: 300, y: 200 },
    size: { width: 500, height: 400 },
    subdomain: 'journal'
  },
  music: {
    id: 'music',
    title: 'Sonic Interface',
    icon: Music,
    content: (
      <div className="h-full void-panel p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Music className="w-12 h-12 text-electric-cyan mx-auto" />
          <p className="text-steel">Audio Playlist & Controls</p>
        </div>
      </div>
    ),
    position: { x: 150, y: 120 },
    size: { width: 380, height: 280 },
    subdomain: 'music'
  },
  video: {
    id: 'video',
    title: 'Motion Archive',
    icon: Video,
    content: (
      <div className="h-full void-panel p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Video className="w-12 h-12 text-electric-crimson mx-auto" />
          <p className="text-steel">Video Content Player</p>
        </div>
      </div>
    ),
    position: { x: 250, y: 180 },
    size: { width: 520, height: 320 },
    subdomain: 'video'
  },
  portfolio: {
    id: 'portfolio',
    title: 'Portfolio Hub',
    icon: Globe,
    content: (
      <div className="h-full void-panel p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Globe className="w-12 h-12 text-electric-violet mx-auto" />
          <p className="text-steel">Main Portfolio Interface</p>
        </div>
      </div>
    ),
    position: { x: 180, y: 140 },
    size: { width: 480, height: 360 },
    subdomain: 'portfolio'
  },
  neural: {
    id: 'neural',
    title: 'Neural Network',
    icon: Cpu,
    content: (
      <div className="h-full void-panel p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Cpu className="w-12 h-12 text-electric-amber mx-auto" />
          <p className="text-steel">AI Processing Hub</p>
        </div>
      </div>
    ),
    position: { x: 120, y: 160 },
    size: { width: 420, height: 320 },
    subdomain: 'neural'
  },
  code: {
    id: 'code',
    title: 'Code Studio',
    icon: Code,
    content: (
      <div className="h-full void-panel p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Code className="w-12 h-12 text-electric-cyan mx-auto" />
          <p className="text-steel">Development Environment</p>
        </div>
      </div>
    ),
    position: { x: 220, y: 110 },
    size: { width: 460, height: 340 },
    subdomain: 'code'
  },
  data: {
    id: 'data',
    title: 'Data Vault',
    icon: Database,
    content: (
      <div className="h-full void-panel p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Database className="w-12 h-12 text-electric-violet mx-auto" />
          <p className="text-steel">Information Repository</p>
        </div>
      </div>
    ),
    position: { x: 280, y: 130 },
    size: { width: 440, height: 300 },
    subdomain: 'data'
  }
};

export const ModularInterface = () => {
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [maximizedModule, setMaximizedModule] = useState<string | null>(null);
  const [showNavigation, setShowNavigation] = useState(true);
  const [lastOpenedModule, setLastOpenedModule] = useState<string | null>(null);
  const [modulePositions, setModulePositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  
  const user: User = {
    name: "Digital Architect",
    avatar: "/api/placeholder/32/32",
    status: "online",
    lastActivity: "Active now"
  };

  useEffect(() => {
    // Auto-hide navigation after opening a window
    if (activeModules.length > 0 && showNavigation) {
      const timer = setTimeout(() => {
        setShowNavigation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeModules.length, showNavigation]);

  const openModule = (moduleId: string) => {
    if (!activeModules.includes(moduleId)) {
      setActiveModules(prev => [...prev, moduleId]);
      setLastOpenedModule(moduleId);
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

  const refreshModule = (moduleId: string) => {
    // Refresh module content
    console.log(`Refreshing module: ${moduleId}`);
  };

  const openFullVersion = (moduleId: string) => {
    const module = modules[moduleId];
    if (module?.subdomain) {
      // Open in new tab with subdomain
      window.open(`https://${module.subdomain}.${window.location.hostname}`, '_blank');
    }
  };

  const toggleNavigation = () => {
    setShowNavigation(prev => !prev);
  };

  const updateModulePosition = (moduleId: string, position: { x: number; y: number }, size: { width: number; height: number }) => {
    setModulePositions(prev => ({
      ...prev,
      [moduleId]: { ...position, ...size }
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Right-side Navigation Panel */}
      <div className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ${
        showNavigation ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <FluidNavigation 
          onNavigate={openModule}
          activeSection={lastOpenedModule}
        />
      </div>

      {/* Navigation Toggle Button */}
      <Button
        onClick={toggleNavigation}
        className={`fixed top-4 right-4 z-40 void-panel hover:electric-glow transition-all duration-300 ${
          showNavigation ? 'translate-x-0' : 'translate-x-0'
        }`}
        size="icon"
      >
        {showNavigation ? <ChevronRight className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
      </Button>

      {/* Module Windows */}
      {activeModules.map(moduleId => {
        const module = modules[moduleId];
        const isMaximized = maximizedModule === moduleId;
        const currentPosition = modulePositions[moduleId] || module.position;
        const currentSize = modulePositions[moduleId] || module.size;

        return (
          <Rnd
            key={moduleId}
            size={isMaximized ? { width: '100vw', height: '100vh' } : currentSize}
            position={isMaximized ? { x: 0, y: 0 } : currentPosition}
            onDragStop={(e, d) => {
              if (!isMaximized) {
                updateModulePosition(moduleId, { x: d.x, y: d.y }, currentSize);
              }
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              if (!isMaximized) {
                updateModulePosition(moduleId, position, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height)
                });
              }
            }}
            className={`${isMaximized ? 'z-30' : 'z-20'}`}
            dragHandleClassName="module-drag-handle"
            enableResizing={!isMaximized}
            bounds="parent"
            minWidth={300}
            minHeight={200}
          >
            <div className="h-full void-panel border border-graphite/30">
              {/* Module Header */}
              <div className="module-drag-handle flex items-center justify-between p-2 border-b border-graphite/20 bg-surface-elevated">
                <div className="flex items-center gap-2">
                  <module.icon className="w-4 h-4 text-electric-cyan" />
                  <span className="text-sm font-mono text-steel">{module.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => refreshModule(moduleId)}
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 hover:bg-electric-cyan/20"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => openFullVersion(moduleId)}
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 hover:bg-electric-violet/20"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => toggleMaximize(moduleId)}
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 hover:bg-electric-amber/20"
                  >
                    {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  </Button>
                  <Button
                    onClick={() => closeModule(moduleId)}
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 hover:bg-electric-crimson/20"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {/* Module Content */}
              <div className="h-[calc(100%-2.5rem)]">
                {module.content}
              </div>
            </div>
          </Rnd>
        );
      })}

      {/* Bottom Horizontal Module Catalog */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="void-panel p-3 rounded-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            {Object.values(modules).map(module => (
              <Button
                key={module.id}
                onClick={() => openModule(module.id)}
                className={`relative group p-3 void-panel hover:electric-glow transition-all duration-300 ${
                  activeModules.includes(module.id) ? 'bg-electric-cyan/20' : ''
                }`}
                title={module.title}
              >
                <module.icon className="w-5 h-5 text-steel group-hover:text-electric-cyan transition-colors" />
                {activeModules.includes(module.id) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-electric-cyan rounded-full animate-pulse" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Status Panel */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="void-panel p-4 rounded-lg backdrop-blur-md max-w-sm">
          <div className="space-y-3">
            {/* User Status */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-electric rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-background" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-surface ${
                  user.status === 'online' ? 'bg-electric-cyan' : 
                  user.status === 'away' ? 'bg-electric-amber' : 'bg-electric-crimson'
                }`} />
              </div>
              <div>
                <div className="text-sm font-mono text-chrome">{user.name}</div>
                <div className="text-xs text-steel">{user.lastActivity}</div>
              </div>
            </div>

            {/* Last Opened Module Info */}
            {lastOpenedModule && (
              <div className="border-t border-graphite/30 pt-3">
                <div className="text-xs text-steel mb-1">LAST OPENED</div>
                <div className="flex items-center gap-2 animate-fade-in">
                  {(() => {
                    const module = modules[lastOpenedModule];
                    return (
                      <>
                        <module.icon className="w-4 h-4 text-electric-cyan animate-pulse" />
                        <span className="text-sm font-mono text-chrome kinetic-text">
                          {module.title}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* System Status */}
            <div className="border-t border-graphite/30 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-steel">MODULES</span>
                <span className="text-electric-cyan font-mono">{activeModules.length}/9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};