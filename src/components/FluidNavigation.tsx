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
  User
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
  }
];

interface FluidNavigationProps {
  onNavigate?: (itemId: string) => void;
  activeSection?: string | null;
}

export const FluidNavigation = ({ onNavigate, activeSection }: FluidNavigationProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleItemClick = (itemId: string) => {
    onNavigate?.(itemId);
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

      {/* Right-side Navigation Panel */}
      <div className="w-80 h-full bg-surface border-l border-graphite/30 backdrop-blur-md">
        <nav className="h-full flex flex-col p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="text-sm font-mono text-steel tracking-wider">
              MODULE NAVIGATION
            </div>
            <div className="text-xs text-titanium mt-1">
              Digital Interface Hub
            </div>
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                onMouseEnter={(e) => {
                  setHoveredItem(item.id);
                  setCursorPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredItem(null)}
                onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
                className={`w-full group flex items-center gap-4 p-4 rounded transition-all duration-300 text-left ${
                  activeSection === item.id 
                    ? 'bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30' 
                    : 'hover:bg-surface-elevated text-steel hover:text-chrome'
                }`}
              >
                <div className={`flex-shrink-0 transition-all duration-300 ${
                  hoveredItem === item.id ? 'scale-110 rotate-12' : ''
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="font-mono text-sm font-medium">
                    {item.label}
                  </div>
                  <div className="text-xs text-steel group-hover:text-titanium transition-colors">
                    {item.description}
                  </div>
                </div>
                
                <div className={`transition-transform duration-300 ${
                  hoveredItem === item.id ? 'translate-x-1' : ''
                }`}>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity" />
                </div>
              </button>
            ))}
          </div>

          {/* Footer - User Section */}
          <div className="border-t border-graphite/30 pt-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-electric rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-background" />
              </div>
              <div>
                <div className="text-sm font-mono text-chrome">Digital Architect</div>
                <div className="text-xs text-steel">System Active</div>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-steel">ACTIVE MODULES</span>
                <span className="text-electric-cyan font-mono">0/9</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-steel">STATUS</span>
                <span className="text-electric-cyan font-mono">READY</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};