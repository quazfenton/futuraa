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
  Bot
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'canvas',
    label: 'Digital Canvas',
    icon: Palette,
    description: 'Interactive design workspace'
  },
  {
    id: 'gallery',
    label: 'Visual Gallery',
    icon: Image,
    description: 'Image collection & viewer'
  },
  {
    id: 'journal',
    label: 'Digital Journal',
    icon: FileText,
    description: 'Written content & blog'
  },
  {
    id: 'music',
    label: 'Sonic Interface',
    icon: Music,
    description: 'Audio playlist & controls'
  },
  {
    id: 'video',
    label: 'Motion Archive',
    icon: Video,
    description: 'Video content player'
  },
  {
    id: 'portfolio',
    label: 'Portfolio Hub',
    icon: Globe,
    description: 'Main portfolio interface'
  },
  {
    id: 'neural',
    label: 'Neural Network',
    icon: Cpu,
    description: 'AI processing hub'
  },
  {
    id: 'code',
    label: 'Code Studio',
    icon: Code,
    description: 'Development environment'
  },
  {
    id: 'data',
    label: 'Data Vault',
    icon: Database,
    description: 'Information repository'
  },
  {
    id: 'chat',
    label: 'LLM Chat',
    icon: Bot,
    description: 'chat.quazfenton.xyz'
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: FileText,
    description: 'Rich Markdown notes'
  },
  {
    id: 'hfspaces',
    label: 'HF Spaces',
    icon: Image,
    description: 'Hugging Face models & demos'
  },
  {
    id: 'network',
    label: 'Network Builder',
    icon: Globe,
    description: 'HTTP requests & presets'
  },
  {
    id: 'github',
    label: 'GitHub Explorer',
    icon: Code,
    description: 'Browse repos & files'
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
  const [showStatus, setShowStatus] = useState(true);

  const handleItemClick = (itemId: string) => {
    onNavigate?.(itemId);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Custom Cursor */}
      <div 
        className="fixed w-6 h-6 pointer-events-none z-50 transition-all duration-200"
        style={{
          left: cursorPos.x - 12,
          top: cursorPos.y - 12,
          background: hoveredItem ? 'var(--gradient-electric)' : 'transparent',
          borderRadius: '50%',
          opacity: hoveredItem ? 0.6 : 0,
          transform: `scale(${hoveredItem ? 1.5 : 1})`,
        }}
      />

      {/* Floating Navigation Panel - Left Side */}
      <div
        className={`fixed top-1/2 left-8 transform -translate-y-1/2 transition-all duration-500 ${
          isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        } z-40`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setHoveredItem(null);
        }}
      >
        {isExpanded && (
          <nav className="void-panel p-6 rounded-lg backdrop-blur-md min-w-[320px] max-w-[380px] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="text-sm font-mono text-steel mb-2 tracking-wider">
                MODULE NAVIGATION
              </div>
              <div className="text-xs text-titanium">
                Digital Interface Hub
              </div>
            </div>
            
            {/* Navigation Items */}
            <div className="space-y-2 mb-6">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  onMouseEnter={(e) => {
                    setHoveredItem(item.id);
                    setCursorPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
                  className={`w-full group flex items-center gap-3 p-3 rounded transition-all duration-300 text-left interactive-element ${
                    activeSection === item.id 
                      ? 'electric-glow text-foreground' 
                      : 'hover:bg-surface-elevated text-steel hover:text-chrome'
                  }`}
                  style={{ transitionDelay: `${index * 30}ms` }}
                >
                  <div className={`flex-shrink-0 transition-all duration-300 ${
                    hoveredItem === item.id ? 'scale-110 rotate-12' : ''
                  } ${activeSection === item.id ? 'text-foreground' : 'text-steel'}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-mono text-sm font-medium ${
                      activeSection === item.id ? 'text-foreground' : 'text-chrome'
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs transition-colors duration-300 ${
                      hoveredItem === item.id ? 'text-electric-cyan' : 'text-steel'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  
                  <div className={`transition-transform duration-300 ${
                    hoveredItem === item.id ? 'translate-x-1' : ''
                  }`}>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </div>

                  {/* Active indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-gradient-electric opacity-100' 
                      : 'bg-transparent opacity-0'
                  }`} />
                </button>
              ))}
            </div>

            {/* Creator Info Section */}
            {showStatus && (
              <div className="border-t border-graphite/30 pt-4 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-electric rounded-sm flex items-center justify-center">
                      <User className="w-3 h-3 text-background" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-chrome">Creator Info</div>
                      <div className="text-xs text-steel">Quaz Fenton</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStatus(false)}
                    className="text-steel hover:text-chrome transition-colors p-1"
                  >
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </button>
                </div>
                
                {/* Social Links */}
                <div className="space-y-2">
                  <a 
                    href="https://github.com/quazfenton" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-steel hover:text-electric-cyan transition-colors p-2 rounded hover:bg-surface-elevated"
                  >
                    <Code className="w-3 h-3" />
                    <span className="font-mono">GitHub</span>
                  </a>
                  <a 
                    href="https://twitter.com/quazfenton" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-steel hover:text-electric-cyan transition-colors p-2 rounded hover:bg-surface-elevated"
                  >
                    <Globe className="w-3 h-3" />
                    <span className="font-mono">Twitter</span>
                  </a>
                  <a 
                    href="https://quazfenton.xyz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-steel hover:text-electric-cyan transition-colors p-2 rounded hover:bg-surface-elevated"
                  >
                    <Globe className="w-3 h-3" />
                    <span className="font-mono">Portfolio</span>
                  </a>
                </div>
              </div>
            )}

            {/* Show Status Button when hidden */}
            {!showStatus && (
              <div className="border-t border-graphite/30 pt-3">
                <button
                  onClick={() => setShowStatus(true)}
                  className="w-full text-left p-2 rounded hover:bg-surface-elevated transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-electric rounded-sm flex items-center justify-center">
                      <User className="w-2 h-2 text-background" />
                    </div>
                    <span className="text-xs font-mono text-steel group-hover:text-chrome">Show Status</span>
                    <ChevronRight className="w-3 h-3 text-steel -rotate-90" />
                  </div>
                </button>
              </div>
            )}
          </nav>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed bottom-8 right-8 w-12 h-12 electric-glow rounded-sm interactive-element flex items-center justify-center z-40 backdrop-blur-sm transition-all duration-300 ${
          isExpanded ? 'rotate-45' : 'rotate-0'
        }`}
        onMouseEnter={() => setHoveredItem('fab')}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Zap className="w-5 h-5 text-foreground" />
      </button>
    </>
  );
};