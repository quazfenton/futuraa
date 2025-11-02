import { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, 
  Zap, 
  Cpu, 
  Palette, 
  Layers,
  Image,
  FileText,
  Music,
  Video,
  Globe,
  Code,
  Database,
  User,
  Bot,
  GitBranch,
  Sparkles,
  Server,
  TrendingUp,
  Cloud,
  BookOpen,
  Brain
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'canvas',
    label: 'CANVAS',
    icon: <Palette className="w-5 h-5" />,
    description: 'Interactive Design Canvas'
  },
  {
    id: 'gallery',
    label: 'GALLERY',
    icon: <Image className="w-5 h-5" />,
    description: 'Visual Gallery'
  },
  {
    id: 'journal',
    label: 'JOURNAL',
    icon: <FileText className="w-5 h-5" />,
    description: 'Digital Journal'
  },
  {
    id: 'music',
    label: 'MUSIC',
    icon: <Music className="w-5 h-5" />,
    description: 'Sonic Interface'
  },
  {
    id: 'video',
    label: 'VIDEO',
    icon: <Video className="w-5 h-5" />,
    description: 'Motion Graphics'
  },
  {
    id: 'data',
    label: 'DATA',
    icon: <Database className="w-5 h-5" />,
    description: 'Data Vault'
  },
  {
    id: 'chat',
    label: 'LLM CHAT',
    icon: <Bot className="w-5 h-5" />,
    description: 'chat.quazfenton.xyz'
  },
  {
    id: 'notes',
    label: 'NOTES',
    icon: <FileText className="w-5 h-5" />,
    description: 'Rich Markdown notes'
  },
  {
    id: 'hfspaces',
    label: 'HF SPACES',
    icon: <Image className="w-5 h-5" />,
    description: 'Hugging Face models & demos'
  },
  {
    id: 'network',
    label: 'NETWORK',
    icon: <Globe className="w-5 h-5" />,
    description: 'HTTP requests & presets'
  },
  {
    id: 'github',
    label: 'GITHUB',
    icon: <Code className="w-5 h-5" />,
    description: 'Browse repos & files'
  },
  {
    id: 'github-advanced',
    label: 'GITHUB PRO',
    icon: <GitBranch className="w-5 h-5" />,
    description: 'Advanced repo analysis'
  },
  {
    id: 'hf-spaces-pro',
    label: 'HF SPACES PRO',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'ML models & Gradio'
  },
  {
    id: 'devops',
    label: 'DEVOPS',
    icon: <Server className="w-5 h-5" />,
    description: 'Docker & CI/CD'
  },
  {
    id: 'sandbox',
    label: 'CODE SANDBOX',
    icon: <Code className="w-5 h-5" />,
    description: 'Multi-language execution'
  },
  {
    id: 'api-pro',
    label: 'API PLAYGROUND',
    icon: <Globe className="w-5 h-5" />,
    description: 'REST & GraphQL'
  },
  {
    id: 'data-workbench',
    label: 'DATA WORKBENCH',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'CSV analysis & ML'
  },
  {
    id: 'creative',
    label: 'CREATIVE',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Image & video editing'
  },
  {
    id: 'cloud-pro',
    label: 'CLOUD STORAGE',
    icon: <Cloud className="w-5 h-5" />,
    description: 'Multi-provider files'
  },
  {
    id: 'wiki',
    label: 'WIKI',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Knowledge base'
  },
  {
    id: 'prompts',
    label: 'AI PROMPTS',
    icon: <Brain className="w-5 h-5" />,
    description: 'Prompt library'
  }
];

interface FluidNavigationProps {
  onNavigate?: (itemId: string) => void;
  activeSection?: string | null;
}

export const FluidNavigation = ({ onNavigate, activeSection }: FluidNavigationProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', updateCursor);
    return () => document.removeEventListener('mousemove', updateCursor);
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${cursorPos.x - 6}px, ${cursorPos.y - 6}px, 0)`;
    }
  }, [cursorPos]);

  const handleItemClick = (itemId: string) => {
    onNavigate?.(itemId);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Custom Cursor Trail */}
      <div
        ref={cursorRef}
        className="fixed w-3 h-3 pointer-events-none transition-all duration-200 ease-out z-50"
        style={{
          background: hoveredItem ? 'var(--gradient-electric)' : 'var(--gradient-chrome)',
          borderRadius: hoveredItem ? '50%' : '2px',
          transform: `scale(${hoveredItem ? 1.5 : 1})`,
          opacity: hoveredItem ? 0.8 : 0.6,
        }}
      />

      {/* Left Sidebar Navigation */}
      <nav
        ref={navRef}
        className={`fixed top-8 left-8 z-40 transition-all duration-500 ease-spring-smooth ${
          isExpanded ? 'w-80' : 'w-16'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setHoveredItem(null);
        }}
      >
        <div className="void-panel rounded-sm backdrop-blur-sm overflow-hidden bg-background border-border">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="font-mono text-sm font-semibold text-foreground">FUTURAA</h3>
                <p className="text-xs text-muted-foreground mt-1">Digital Workspace</p>
              </div>
              <ChevronRight 
                className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                  isExpanded ? 'rotate-90' : 'rotate-0'
                }`}
              />
            </div>
          </div>

          {/* Navigation Items - Scrollable */}
          <div className="p-2 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-graphite/50 scrollbar-track-transparent">
            {navItems.map((item, index) => (
              <div
                key={item.id}
                className={`relative mb-2 last:mb-0 transition-all duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-80'
                }`}
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <button
                  className={`w-full text-left p-3 rounded-sm transition-all duration-300 ease-spring-smooth
                    interactive-element group relative overflow-hidden ${
                    activeSection === item.id 
                      ? 'electric-glow text-foreground bg-accent' 
                      : 'hover:bg-accent/50 text-foreground'
                  }`}
                  onClick={() => handleItemClick(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Background animation */}
                  <div 
                    className={`absolute inset-0 transition-all duration-300 ${
                      hoveredItem === item.id 
                        ? 'bg-gradient-electric opacity-10' 
                        : 'bg-transparent'
                    }`}
                  />
                  
                  <div className="relative flex items-center space-x-3">
                    <div className={`transition-all duration-300 ${
                      activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {item.icon}
                    </div>
                    
                    <div className={`transition-all duration-300 ${
                      isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}>
                      <div className={`font-mono text-xs font-medium ${
                        activeSection === item.id ? 'text-primary' : 'text-foreground'
                      }`}>
                        {item.label}
                      </div>
                      <div className={`text-xs mt-0.5 transition-colors duration-300 ${
                        hoveredItem === item.id ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-gradient-electric opacity-100' 
                      : 'bg-transparent opacity-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>

          {/* Footer - Creator Info */}
          <div className={`p-4 border-t border-border transition-all duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="text-xs text-muted-foreground font-mono space-y-2">
              <div>
                <div className="text-foreground font-medium mb-1">CREATOR</div>
                <a 
                  href="https://github.com/quazfenton" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1"
                >
                  <span>GitHub</span>
                  <span className="text-xs">↗</span>
                </a>
                <a 
                  href="https://twitter.com/quazfenton" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1 mt-1"
                >
                  <span>Twitter</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Toggle Button - Bottom Right */}
      <button
        className="fixed bottom-8 right-8 w-12 h-12 bg-background border border-border rounded-full 
                   hover:border-primary transition-all duration-300 flex items-center justify-center z-40
                   backdrop-blur-sm hover:shadow-lg"
        onMouseEnter={() => setHoveredItem('toggle')}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
          isVisible ? 'rotate-180' : 'rotate-0'
        }`} />
      </button>
    </>
  );
};
