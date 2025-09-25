import { useState, useRef, useEffect, useCallback } from 'react';
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
  ChevronLeft,
  Moon,
  Sun,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Heart,
 Bot
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

// Enhanced module components
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  
  const tracks = [
    { title: "Neon Dreams", artist: "Synthwave Collective", duration: "3:42" },
    { title: "Digital Rain", artist: "Cyber Pulse", duration: "4:15" },
    { title: "Electric Void", artist: "Tech Noir", duration: "5:28" },
    { title: "Chrome Horizon", artist: "Future Bass", duration: "3:55" }
  ];

  return (
    <div className="h-full p-4 bg-gradient-to-b from-surface to-surface-elevated">
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-electric rounded mx-auto mb-3 flex items-center justify-center">
            <Music className="w-8 h-8 text-background" />
          </div>
          <h3 className="font-mono text-chrome mb-1">{tracks[currentTrack].title}</h3>
          <p className="text-sm text-steel">{tracks[currentTrack].artist}</p>
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <Button size="sm" variant="ghost" className="hover:bg-electric-cyan/20">
            <SkipForward className="w-4 h-4 rotate-180" />
          </Button>
          <Button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-electric-cyan/20 hover:bg-electric-cyan/30"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="ghost" className="hover:bg-electric-cyan/20">
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {tracks.map((track, index) => (
            <div 
              key={index}
              className={`p-2 rounded cursor-pointer transition-colors ${
                index === currentTrack ? 'bg-electric-cyan/20' : 'hover:bg-surface-elevated'
              }`}
              onClick={() => setCurrentTrack(index)}
            >
              <div className="flex justify-between text-xs">
                <span className="text-chrome">{track.title}</span>
                <span className="text-steel">{track.duration}</span>
              </div>
              <div className="text-xs text-steel">{track.artist}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ImageGallery = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    { url: "/api/placeholder/300/200", title: "Cyber Landscape" },
    { url: "/api/placeholder/300/200", title: "Digital Art" },
    { url: "/api/placeholder/300/200", title: "Neon City" },
    { url: "/api/placeholder/300/200", title: "Tech Noir" }
  ];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="h-full relative overflow-hidden">
      <img 
        src={images[currentImage].url} 
        alt={images[currentImage].title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="font-mono text-chrome mb-2">{images[currentImage].title}</h3>
        <div className="flex justify-between items-center">
          <button onClick={prevImage} className="p-2 hover:bg-surface/50 rounded">
            <ChevronLeft className="w-4 h-4 text-chrome" />
          </button>
          <div className="flex gap-1">
            {images.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImage ? 'bg-electric-cyan' : 'bg-steel/50'
                }`}
              />
            ))}
          </div>
          <button onClick={nextImage} className="p-2 hover:bg-surface/50 rounded">
            <ChevronRight className="w-4 h-4 text-chrome" />
          </button>
        </div>
      </div>
    </div>
  );
};

const modules: Record<string, ModuleWindow> = {
  canvas: {
    id: 'canvas',
    title: 'Digital Canvas',
    icon: Palette,
    content: (
      <div className="h-full p-4 flex items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
        <div className="text-center space-y-4">
          <Palette className="w-12 h-12 text-electric-cyan mx-auto animate-pulse" />
          <p className="text-steel">Interactive Design Canvas</p>
          <iframe 
            src="about:blank" 
            className="w-full h-32 rounded border border-graphite/30"
            title="Canvas Preview"
          />
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
    content: <ImageGallery />,
    position: { x: 200, y: 150 },
    size: { width: 450, height: 350 },
    subdomain: 'gallery'
  },
  journal: {
    id: 'journal',
    title: 'Digital Journal',
    icon: FileText,
    content: (
      <div className="h-full p-4 bg-gradient-to-b from-surface to-surface-elevated">
        <div className="space-y-4">
          <div className="text-center mb-4">
            <FileText className="w-8 h-8 text-electric-amber mx-auto mb-2" />
            <h3 className="font-mono text-chrome">Digital Journal</h3>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <div className="p-3 bg-surface-elevated rounded border-l-2 border-electric-amber">
              <div className="text-xs text-steel mb-1">2024.01.15</div>
              <h4 className="text-sm font-mono text-chrome mb-1">Cyber Aesthetics</h4>
              <p className="text-xs text-steel">Exploring the intersection of technology and art...</p>
            </div>
            <div className="p-3 bg-surface-elevated rounded border-l-2 border-electric-violet">
              <div className="text-xs text-steel mb-1">2024.01.12</div>
              <h4 className="text-sm font-mono text-chrome mb-1">Future UI Patterns</h4>
              <p className="text-xs text-steel">Designing interfaces for tomorrow's world...</p>
            </div>
            <div className="p-3 bg-surface-elevated rounded border-l-2 border-electric-cyan">
              <div className="text-xs text-steel mb-1">2024.01.10</div>
              <h4 className="text-sm font-mono text-chrome mb-1">Digital Minimalism</h4>
              <p className="text-xs text-steel">Less is more in the digital age...</p>
            </div>
          </div>
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
    content: <MusicPlayer />,
    position: { x: 150, y: 120 },
    size: { width: 380, height: 320 },
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
  },
  chat: {
    id: 'chat',
    title: 'LLM Chat (binG)',
    icon: Bot,
    content: (
      <div className="h-full flex flex-col">
        <div className="flex-none p-2 text-xs text-steel">
          Embedded from chat.quazfenton.xyz
        </div>
        <iframe 
          src="https://chat.quazfenton.xyz?embed=1" 
          className="flex-1 w-full h-full border-0 rounded"
          loading="lazy"
          referrerPolicy="no-referrer"
          data-module="chat"
          allow="clipboard-read; clipboard-write; microphone; camera; autoplay; encrypted-media"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title="binG Chat"
        />
      </div>
    ),
    position: { x: 160, y: 90 },
    size: { width: 520, height: 640 },
    subdomain: 'chat'
  },
  notes: {
    id: 'notes',
    title: 'Notes',
    icon: FileText,
    content: (
      <iframe 
        src="https://chat.quazfenton.xyz/embed/notes" 
        className="w-full h-full border-0 rounded"
        loading="lazy"
        referrerPolicy="no-referrer"
        data-module="notes"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        title="Notes Mini-App"
      />
    ),
    position: { x: 120, y: 110 },
    size: { width: 600, height: 520 },
    subdomain: 'chat'
  },
  hfspaces: {
    id: 'hfspaces',
    title: 'HF Spaces',
    icon: Image,
    content: (
      <iframe 
        src="https://chat.quazfenton.xyz/embed/hf-spaces" 
        className="w-full h-full border-0 rounded"
        loading="lazy"
        referrerPolicy="no-referrer"
        data-module="hfspaces"
        allow="clipboard-read; clipboard-write; microphone; camera; autoplay; encrypted-media"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        title="Hugging Face Spaces"
      />
    ),
    position: { x: 240, y: 120 },
    size: { width: 820, height: 620 },
    subdomain: 'chat'
  },
  network: {
    id: 'network',
    title: 'Network Builder',
    icon: Globe,
    content: (
      <iframe 
        src="https://chat.quazfenton.xyz/embed/network" 
        className="w-full h-full border-0 rounded"
        loading="lazy"
        referrerPolicy="no-referrer"
        data-module="network"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        title="Network Request Builder"
      />
    ),
    position: { x: 200, y: 160 },
    size: { width: 760, height: 560 },
    subdomain: 'chat'
  },
  github: {
    id: 'github',
    title: 'GitHub Explorer',
    icon: Code,
    content: (
      <iframe 
        src="https://chat.quazfenton.xyz/embed/github" 
        className="w-full h-full border-0 rounded"
        loading="lazy"
        referrerPolicy="no-referrer"
        data-module="github"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        title="GitHub Explorer"
      />
    ),
    position: { x: 300, y: 180 },
    size: { width: 860, height: 640 },
    subdomain: 'chat'
  }
};

export const ModularInterface = () => {
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [maximizedModule, setMaximizedModule] = useState<string | null>(null);
  const [showNavigation, setShowNavigation] = useState(true);
  const [lastOpenedModule, setLastOpenedModule] = useState<string | null>(null);
  const [modulePositions, setModulePositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const [moduleZIndexes, setModuleZIndexes] = useState<Record<string, number>>({});
  const [isLightMode, setIsLightMode] = useState(false);
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [infoText, setInfoText] = useState("DIGITAL WORKSPACE INITIALIZED");
  const [dockScrollOffset, setDockScrollOffset] = useState(0);
  const dockDragRef = useRef<{ startX: number; startOffset: number; dragging: boolean }>({ startX: 0, startOffset: 0, dragging: false });
  const [backgroundOffset, setBackgroundOffset] = useState({ x: 0, y: 0 });
  const [isDraggingBackground, setIsDraggingBackground] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const maxZIndex = useRef(100);
  
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

  // Generate random position avoiding overlaps
  const generateRandomPosition = useCallback(() => {
    const padding = 50;
    const maxX = window.innerWidth - 400 - padding;
    const maxY = window.innerHeight - 300 - padding;
    return {
      x: padding + Math.random() * Math.max(maxX - padding, 0),
      y: padding + Math.random() * Math.max(maxY - padding, 0)
    };
  }, []);

  // Broadcast auth token to iframes when available
  const postAuthToIframes = useCallback((token: string) => {
    try {
      const iframes = document.querySelectorAll('iframe[data-module]') as NodeListOf<HTMLIFrameElement>;
      iframes.forEach((frame) => {
        try {
          frame.contentWindow?.postMessage({ type: 'bing:auth', token }, 'https://chat.quazfenton.xyz');
        } catch {}
      });
    } catch {}
  }, []);

  // Info text cycling effect
  useEffect(() => {
    const texts = [
      "DIGITAL WORKSPACE ACTIVE",
      "CYBER INTERFACE READY", 
      "AVANT-GARDE SYSTEM ONLINE",
      "TECHNOFUTURE LOADING...",
      "ELECTRIC DREAMS INITIALIZED"
    ];
    
    const interval = setInterval(() => {
      if (showInfoBox) {
        setInfoText(texts[Math.floor(Math.random() * texts.length)]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [showInfoBox]);

  const toggleModule = (moduleId: string) => {
    if (activeModules.includes(moduleId)) {
      // Close module if already open
      setActiveModules(prev => prev.filter(id => id !== moduleId));
      if (maximizedModule === moduleId) setMaximizedModule(null);
    } else {
      // Open module
      setActiveModules(prev => [...prev, moduleId]);
      setLastOpenedModule(moduleId);
      bringToFront(moduleId);
      
      // Set random position if not set
      if (!modulePositions[moduleId]) {
        const randomPos = generateRandomPosition();
        setModulePositions(prev => ({
          ...prev,
          [moduleId]: { ...randomPos, ...modules[moduleId].size }
        }));
      }
    }
  };

  const closeModule = (moduleId: string) => {
    setActiveModules(prev => prev.filter(id => id !== moduleId));
    if (maximizedModule === moduleId) setMaximizedModule(null);
  };

  const openModule = (moduleId: string) => {
    if (!activeModules.includes(moduleId)) {
      setActiveModules(prev => [...prev, moduleId]);
      setLastOpenedModule(moduleId);
      bringToFront(moduleId);
      
      // Set random position if not set
      if (!modulePositions[moduleId]) {
        const randomPos = generateRandomPosition();
        setModulePositions(prev => ({
          ...prev,
          [moduleId]: { ...randomPos, ...modules[moduleId].size }
        }));
      }
    }
  };

  const toggleMaximize = (moduleId: string) => {
    setMaximizedModule(prev => prev === moduleId ? null : moduleId);
  };

  const refreshModule = (moduleId: string) => {
    // Refresh iframe or module content
    const iframe = document.querySelector(`iframe[data-module="${moduleId}"]`) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const openFullVersion = (moduleId: string) => {
    const module = modules[moduleId];
    if (module?.subdomain) {
      window.open(`https://${module.subdomain}.your-domain.com`, '_blank');
    }
  };

  const bringToFront = (moduleId: string) => {
    maxZIndex.current += 1;
    setModuleZIndexes(prev => ({ ...prev, [moduleId]: maxZIndex.current }));
  };

  // Background dragging
  const handleBackgroundMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDraggingBackground(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleBackgroundMouseMove = (e: React.MouseEvent) => {
    if (isDraggingBackground && dragStartRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setBackgroundOffset(prev => ({
        x: prev.x + deltaX * 0.3,
        y: prev.y + deltaY * 0.3
      }));
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleBackgroundMouseUp = () => {
    setIsDraggingBackground(false);
    dragStartRef.current = null;
  };

  // Dock scrolling
  const handleDockMouseDown = (e: React.MouseEvent) => {
    dockDragRef.current = { 
      startX: e.clientX, 
      startOffset: dockScrollOffset, 
      dragging: true 
    };
  };

  const handleDockMouseMove = (e: React.MouseEvent) => {
    if (dockDragRef.current.dragging) {
      const delta = e.clientX - dockDragRef.current.startX;
      const maxOffset = -(Object.keys(modules).length - 6) * 60;
      setDockScrollOffset(Math.max(Math.min(dockDragRef.current.startOffset + delta, 0), maxOffset));
    }
  };

  const handleDockMouseUp = () => {
    dockDragRef.current.dragging = false;
  };

  return (
    <div 
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        isLightMode ? 'light-mode' : ''
      }`}
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            45deg,
            hsl(var(--surface)) 0px,
            hsl(var(--surface)) 1px,
            transparent 1px,
            transparent 80px
          ),
          repeating-linear-gradient(
            -45deg,
            hsl(var(--surface-elevated)) 0px,
            hsl(var(--surface-elevated)) 1px,
            transparent 1px,
            transparent 80px
          )
        `,
        backgroundPosition: `${backgroundOffset.x}px ${backgroundOffset.y}px, ${backgroundOffset.x}px ${backgroundOffset.y}px`,
        backgroundSize: '160px 160px, 160px 160px',
      }}
      onMouseDown={handleBackgroundMouseDown}
      onMouseMove={handleBackgroundMouseMove}
      onMouseUp={handleBackgroundMouseUp}
    >
      {/* Left Sidebar Navigation */}
      {showNavigation && (
        <FluidNavigation 
          onNavigate={openModule}
          activeSection={lastOpenedModule}
        />
      )}

      {/* System Status Box - Top Right */}
      {showInfoBox && (
        <div className="fixed top-4 right-4 void-panel rounded p-4 z-30 max-w-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm text-chrome">
                {lastOpenedModule && modules[lastOpenedModule] 
                  ? `${modules[lastOpenedModule].title} Active`
                  : 'DIGITAL WORKSPACE'
                }
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsLightMode(!isLightMode)}
                  className="p-1 hover:bg-surface-elevated rounded transition-colors"
                >
                  {isLightMode ? (
                    <Moon className="w-4 h-4 text-steel" />
                  ) : (
                    <Sun className="w-4 h-4 text-steel" />
                  )}
                </button>
                <button
                  onClick={() => setShowInfoBox(false)}
                  className="p-1 hover:bg-surface-elevated rounded transition-colors"
                >
                  <X className="w-4 h-4 text-steel" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs">
                <span className="text-steel">Status:</span>
                <span className="text-electric-cyan ml-2 cyber-text-glow">{infoText}</span>
              </div>
              
              {lastOpenedModule && modules[lastOpenedModule]?.subdomain && (
                <div className="text-xs">
                  <span className="text-steel">Hyperlink:</span>
                  <a 
                    href={`https://${modules[lastOpenedModule].subdomain}.your-domain.com`} 
                    className="text-electric-cyan ml-2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {modules[lastOpenedModule].subdomain}.your-domain.com
                  </a>
                </div>
              )}
              
              <div className="text-xs">
                <span className="text-steel">User:</span>
                <span className="text-chrome ml-2">{user.name}</span>
                <span className={`ml-2 w-2 h-2 rounded-full inline-block ${
                  user.status === 'online' ? 'bg-electric-cyan' : 
                  user.status === 'away' ? 'bg-electric-amber' : 'bg-electric-crimson'
                }`} />
              </div>
              
              <div className="text-xs">
                <span className="text-steel">Active Windows:</span>
                <span className="text-chrome ml-2">{activeModules.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module Windows */}
      {activeModules.map(moduleId => (
        <Rnd
          key={moduleId}
          size={modulePositions[moduleId] || modules[moduleId].size}
          position={{ 
            x: modulePositions[moduleId]?.x || modules[moduleId].position.x, 
            y: modulePositions[moduleId]?.y || modules[moduleId].position.y 
          }}
          onDragStop={(e, d) => {
            setModulePositions(prev => ({
              ...prev,
              [moduleId]: { 
                ...prev[moduleId], 
                x: d.x, 
                y: d.y 
              }
            }));
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setModulePositions(prev => ({
              ...prev,
              [moduleId]: {
                x: position.x,
                y: position.y,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height)
              }
            }));
          }}
          minWidth={250}
          minHeight={200}
          bounds="parent"
          className={`${maximizedModule === moduleId ? 'opacity-95' : 'opacity-90'} transition-opacity duration-200`}
          style={{ zIndex: moduleZIndexes[moduleId] || 100 }}
          onMouseDown={() => bringToFront(moduleId)}
        >
          <div 
            className={`module-window rounded shadow-2xl h-full flex flex-col transition-all duration-300 ${
              isLightMode ? 'bg-white/90' : ''
            }`}
            onDoubleClick={() => toggleMaximize(moduleId)}
          >
            {/* Window Controls */}
            <div className="absolute top-3 right-3 flex gap-2 z-10">
              <button
                onClick={() => toggleMaximize(moduleId)}
                className="p-1.5 hover:bg-surface-elevated/50 rounded transition-all duration-200 backdrop-blur-sm"
                title="Maximize/Restore"
              >
                {maximizedModule === moduleId ? (
                  <Minimize2 className="w-4 h-4 text-chrome hover:text-electric-cyan" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-chrome hover:text-electric-cyan" />
                )}
              </button>
              
              {modules[moduleId]?.subdomain && (
                <button
                  onClick={() => openFullVersion(moduleId)}
                  className="p-1.5 hover:bg-surface-elevated/50 rounded transition-all duration-200 backdrop-blur-sm"
                  title="Open full version"
                >
                  <ExternalLink className="w-4 h-4 text-chrome hover:text-electric-violet" />
                </button>
              )}
              
              <button
                onClick={() => refreshModule(moduleId)}
                className="p-1.5 hover:bg-surface-elevated/50 rounded transition-all duration-200 backdrop-blur-sm"
                title="Refresh"
              >
                <RotateCcw className="w-4 h-4 text-chrome hover:text-electric-amber" />
              </button>
              
              <button
                onClick={() => closeModule(moduleId)}
                className="p-1.5 hover:bg-surface-elevated/50 rounded transition-all duration-200 backdrop-blur-sm"
                title="Close"
              >
                <X className="w-4 h-4 text-chrome hover:text-electric-crimson" />
              </button>
            </div>

            {/* Module Content */}
            <div className="flex-1 overflow-hidden relative z-5">
              {modules[moduleId]?.content}
            </div>
          </div>
        </Rnd>
      ))}

      {/* Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div 
          className={`flex items-center gap-2 p-2 backdrop-blur-md border border-graphite/30 rounded-full transition-colors duration-300 ${
            isLightMode ? 'bg-white/80' : 'bg-surface/95'
          }`}
          style={{
            transform: `translateX(${dockScrollOffset}px)`,
            transition: dockDragRef.current.dragging ? 'none' : 'transform 0.3s ease-out'
          }}
          onMouseDown={handleDockMouseDown}
          onMouseMove={handleDockMouseMove}
          onMouseUp={handleDockMouseUp}
          onMouseLeave={handleDockMouseUp}
        >
          {Object.entries(modules).map(([moduleId, module]) => (
            <button
              key={moduleId}
              onClick={() => toggleModule(moduleId)}
              className={`dock-button relative group w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 interactive-element ${
                activeModules.includes(moduleId)
                  ? 'active bg-electric-cyan/20 text-electric-cyan shadow-lg shadow-electric-cyan/30'
                  : 'bg-surface-elevated hover:bg-surface-elevated/80 text-steel hover:text-chrome'
              }`}
              title={module.title}
            >
              <module.icon className="w-6 h-6" />
              {activeModules.includes(moduleId) && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-electric-cyan rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Toggle Button */}
      <button
        onClick={() => setShowNavigation(!showNavigation)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-background border border-graphite/50 rounded flex items-center justify-center z-50 hover:bg-surface-elevated transition-colors"
      >
        <Layers className="w-5 h-5 text-background" />
      </button>
    </div>
  );
};