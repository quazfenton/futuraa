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
  const [lastClickTime, setLastClickTime] = useState<Record<string, number>>({});
  const [previousStates, setPreviousStates] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const [isLightMode, setIsLightMode] = useState(false);
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [infoText, setInfoText] = useState("DIGITAL WORKSPACE INITIALIZED");
  const [dockScrollOffset, setDockScrollOffset] = useState(0);
  const dockDragRef = useRef<{ startX: number; startOffset: number; dragging: boolean }>({ startX: 0, startOffset: 0, dragging: false });
  const [backgroundOffset, setBackgroundOffset] = useState({ x: 0, y: 0 });
  const [isDraggingBackground, setIsDraggingBackground] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const maxZIndex = useRef(100);
  const [cursorTrails, setCursorTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
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

  // If you have a central auth state, call postAuthToIframes(token) after login

  // Cursor trail effect
  useEffect(() => {
    let trailId = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const trail = {
        id: trailId++,
        x: e.clientX,
        y: e.clientY
      };
      
      setCursorTrails(prev => [...prev.slice(-8), trail]);
      
      // Create particle element
      const particle = document.createElement('div');
      particle.className = 'particle-trail';
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      document.body.appendChild(particle);
      
      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, 1200);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const openModule = (moduleId: string) => {
    if (!activeModules.includes(moduleId)) {
      const randomPos = generateRandomPosition();
      const module = modules[moduleId];
      
      // Set random position if not already set
      if (!modulePositions[moduleId]) {
      setModulePositions(prev => ({
        ...prev,
        [moduleId]: { x: randomPos.x, y: randomPos.y, width: module.size.width, height: module.size.height }
      }));
      }
      
      // Bring to front
      maxZIndex.current += 1;
      setModuleZIndexes(prev => ({ ...prev, [moduleId]: maxZIndex.current }));
      
      setActiveModules(prev => [...prev, moduleId]);
      setLastOpenedModule(moduleId);
      setInfoText(`OPENING ${module.title.toUpperCase()}`);
    } else {
      // If already open, toggle visibility
      closeModule(moduleId);
    }
  };

  const closeModule = (moduleId: string) => {
    setActiveModules(prev => prev.filter(id => id !== moduleId));
    if (maximizedModule === moduleId) {
      setMaximizedModule(null);
    }
    setInfoText(`CLOSED ${modules[moduleId].title.toUpperCase()}`);
  };

  const toggleMaximize = (moduleId: string) => {
    const currentTime = Date.now();
    const lastClick = lastClickTime[moduleId] || 0;
    
    // Double-click detection (within 300ms)
    if (currentTime - lastClick < 300) {
      const currentState = modulePositions[moduleId] || modules[moduleId];
      
      if (maximizedModule === moduleId) {
        // Restore previous state
        const prevState = previousStates[moduleId];
        if (prevState) {
          setModulePositions(prev => ({ ...prev, [moduleId]: prevState }));
        }
        setMaximizedModule(null);
        setInfoText(`RESTORED ${modules[moduleId].title.toUpperCase()}`);
      } else {
        // Save current state before maximizing
        const pos = modulePositions[moduleId] || modules[moduleId].position;
        const size = modulePositions[moduleId] || modules[moduleId].size;
        setPreviousStates(prev => ({ 
          ...prev, 
          [moduleId]: { 
            x: pos.x, 
            y: pos.y, 
            width: size.width, 
            height: size.height 
          } 
        }));
        setMaximizedModule(moduleId);
        setInfoText(`MAXIMIZED ${modules[moduleId].title.toUpperCase()}`);
      }
    }
    
    setLastClickTime(prev => ({ ...prev, [moduleId]: currentTime }));
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

  const bringToFront = (moduleId: string) => {
    maxZIndex.current += 1;
    setModuleZIndexes(prev => ({ ...prev, [moduleId]: maxZIndex.current }));
  };

  // Background dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingBackground && dragStartRef.current) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        setBackgroundOffset(prev => ({
          x: prev.x + deltaX * 0.3, // Reduced movement for smooth effect
          y: prev.y + deltaY * 0.3
        }));
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      setIsDraggingBackground(false);
      dragStartRef.current = null;
    };

    if (isDraggingBackground) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingBackground]);

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

  const handleBackgroundMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on empty space
    if (e.target === e.currentTarget) {
      setIsDraggingBackground(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  return (
    <div 
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        isLightMode ? 'bg-gradient-to-br from-white to-gray-100' : ''
      }`}
      onMouseDown={handleBackgroundMouseDown}
      style={{
        transform: `translate(${backgroundOffset.x}px, ${backgroundOffset.y}px)`,
        cursor: isDraggingBackground ? 'grabbing' : 'default'
      }}
    >
      {/* Enhanced Info Box */}
      {showInfoBox && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className={`void-panel p-4 rounded-lg backdrop-blur-md max-w-80 min-w-64 transition-all duration-300 ${
            isLightMode ? 'bg-white/80 border-gray-300' : ''
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse" />
                <span className={`text-xs font-mono tracking-wider ${
                  isLightMode ? 'text-gray-800' : 'text-chrome'
                }`}>SYSTEM STATUS</span>
              </div>
              <div className="flex gap-1">
                <Button
                  onClick={() => setIsLightMode(!isLightMode)}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-60 hover:opacity-100"
                >
                  {isLightMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                </Button>
                <Button
                  onClick={() => setShowInfoBox(false)}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-60 hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className={`text-sm font-mono cyber-text-glow ${
                isLightMode ? 'text-gray-900' : 'text-electric-cyan'
              }`}>
                {infoText}
              </div>
              
              {lastOpenedModule && (
                <div className={`text-xs ${isLightMode ? 'text-gray-600' : 'text-steel'}`}>
                  ACTIVE: {modules[lastOpenedModule].title}
                </div>
              )}
              
              <div className={`flex justify-between text-xs ${
                isLightMode ? 'text-gray-600' : 'text-steel'
              }`}>
                <span>MODULES: {activeModules.length}/9</span>
                <span>MODE: {isLightMode ? 'LIGHT' : 'DARK'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show Info Box Button when hidden */}
      {!showInfoBox && (
        <Button
          onClick={() => setShowInfoBox(true)}
          className="fixed bottom-4 left-4 z-40 void-panel hover:electric-glow"
          size="icon"
        >
          <User className="w-4 h-4" />
        </Button>
      )}

      {/* Right-side Navigation Panel */}
      <div className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ${
        showNavigation ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <FluidNavigation 
          onNavigate={openModule}
          activeSection={lastOpenedModule}
        />
      </div>

      {/* Module Windows */}
      {activeModules.map(moduleId => {
        const module = modules[moduleId];
        const isMaximized = maximizedModule === moduleId;
        const currentPosition = modulePositions[moduleId] || module.position;
        const currentSize = modulePositions[moduleId] || module.size;
        const zIndex = moduleZIndexes[moduleId] || 20;

        return (
          <Rnd
            key={moduleId}
            size={isMaximized ? { width: '100vw', height: '100vh' } : currentSize}
            position={isMaximized ? { x: 0, y: 0 } : currentPosition}
            onDragStart={() => bringToFront(moduleId)}
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
            style={{ zIndex }}
            dragHandleClassName="module-drag-handle"
            enableResizing={!isMaximized}
            bounds="parent"
            minWidth={280}
            minHeight={180}
          >
            <div 
              className={`h-full group transition-all duration-300 ${
                isLightMode 
                  ? 'module-window' 
                  : 'void-panel'
              }`}
              style={{
                background: isLightMode ? 'hsl(0 0% 100% / 0.9)' : 'hsl(0 0% 3% / 0.95)',
                boxShadow: isLightMode 
                  ? '0 20px 60px -10px hsl(0 0% 0% / 0.1)' 
                  : isDraggingBackground 
                    ? '0 0 40px hsl(180 100% 50% / 0.3)' 
                    : '0 20px 60px -10px hsl(0 0% 0% / 0.5)'
              }}
              onClick={() => bringToFront(moduleId)}
            >
              {/* Module Controls - No top bar, floating controls */}
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={() => refreshModule(moduleId)}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 hover:bg-electric-cyan/20 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => toggleMaximize(moduleId)}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 hover:bg-electric-violet/20 transition-all"
                >
                  <Maximize2 className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => openFullVersion(moduleId)}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 hover:bg-electric-amber/20 transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => closeModule(moduleId)}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 hover:bg-electric-crimson/20 transition-all"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              {/* Module Content */}
              <div 
                className={isMaximized ? "h-full" : "h-[calc(100%-2.5rem)]"}
                onDoubleClick={() => toggleMaximize(moduleId)}
              >
                {module.content}
              </div>
            </div>
          </Rnd>
        );
      })}

      {/* Bottom Dock */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="void-panel p-2 rounded backdrop-blur-md">
          <div 
            className="flex items-center gap-2 overflow-hidden max-w-screen-sm"
            style={{
              transform: `translateX(${dockScrollOffset}px)`,
              transition: dockDragRef.current.dragging ? 'none' : 'transform 0.3s ease'
            }}
            onMouseDown={(e) => {
              dockDragRef.current = { startX: e.clientX, startOffset: dockScrollOffset, dragging: true };
            }}
            onMouseMove={(e) => {
              if (dockDragRef.current.dragging) {
                const delta = e.clientX - dockDragRef.current.startX;
                setDockScrollOffset(Math.max(Math.min(dockDragRef.current.startOffset + delta, 0), -(Object.values(modules).length - 6) * 50));
              }
            }}
            onMouseUp={() => { dockDragRef.current.dragging = false; }}
            onMouseLeave={() => { dockDragRef.current.dragging = false; }}
          >
            {Object.values(modules).map((module, index) => (
              <Button
                key={module.id}
                onClick={() => openModule(module.id)}
                className={`relative group w-12 h-12 transition-all duration-300 flex-shrink-0 dock-button ${
                  activeModules.includes(module.id) ? 'active electric-glow' : 'hover:bg-surface-elevated'
                }`}
                title={module.title}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <module.icon className={`w-6 h-6 transition-colors ${
                  activeModules.includes(module.id)
                    ? 'text-electric-cyan'
                    : 'text-steel group-hover:text-electric-cyan'
                }`} />
                
                {/* Active indicator */}
                {activeModules.includes(module.id) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-electric-cyan rounded-full animate-pulse" />
                )}
                
                {/* Hover tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="text-xs font-mono px-2 py-1 rounded whitespace-nowrap bg-surface text-chrome">
                    {module.title}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          {/* Scroll indicators */}
          {Object.values(modules).length > 6 && (
            <>
              <Button
                onClick={() => setDockScrollOffset(prev => Math.min(prev + 100, 0))}
                className="absolute left-1 top-1/2 transform -translate-y-1/2 p-1 opacity-60 hover:opacity-100"
                size="icon"
                variant="ghost"
                disabled={dockScrollOffset >= 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setDockScrollOffset(prev => Math.max(prev - 100, -(Object.values(modules).length - 6) * 60))}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 opacity-60 hover:opacity-100"
                size="icon"
                variant="ghost"
                disabled={dockScrollOffset <= -(Object.values(modules).length - 6) * 60}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Background Grid - Larger tiles */}
      <div 
        className="fixed inset-0 pointer-events-none overflow-hidden opacity-5"
        style={{
          transform: `translate(${backgroundOffset.x * 0.1}px, ${backgroundOffset.y * 0.1}px)`,
          backgroundImage: `
            linear-gradient(hsl(var(--steel)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--steel)) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

    </div>
  );
};