import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Zap, Cpu, Palette, Layers } from 'lucide-react';

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
    description: 'Interactive particle playground'
  },
  {
    id: 'morph',
    label: 'MORPH',
    icon: <Layers className="w-5 h-5" />,
    description: 'Geometric transformation engine'
  },
  {
    id: 'kinetic',
    label: 'KINETIC',
    icon: <Zap className="w-5 h-5" />,
    description: 'Dynamic typography system'
  },
  {
    id: 'neural',
    label: 'NEURAL',
    icon: <Cpu className="w-5 h-5" />,
    description: 'AI-powered visual synthesis'
  }
];

interface FluidNavigationProps {
  onNavigate?: (itemId: string) => void;
  activeSection?: string;
}

export const FluidNavigation = ({ onNavigate, activeSection = 'canvas' }: FluidNavigationProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
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
    setIsExpanded(false);
  };

  return (
    <>
      {/* Custom Cursor */}
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

      {/* Navigation */}
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
        <div className="void-panel rounded-sm backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-graphite/20">
            <div className="flex items-center justify-between">
              <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="font-mono text-sm font-semibold text-chrome">AVANT-GARDE</h3>
                <p className="text-xs text-steel mt-1">Digital Art Interface</p>
              </div>
              <ChevronRight 
                className={`w-4 h-4 text-steel transition-transform duration-300 ${
                  isExpanded ? 'rotate-90' : 'rotate-0'
                }`}
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-2">
            {navItems.map((item, index) => (
              <div
                key={item.id}
                className={`relative mb-2 last:mb-0 transition-all duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-80'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <button
                  className={`w-full text-left p-3 rounded-sm transition-all duration-300 ease-spring-smooth
                    interactive-element group relative overflow-hidden ${
                    activeSection === item.id 
                      ? 'electric-glow text-foreground' 
                      : 'hover:bg-surface-elevated text-chrome'
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
                      activeSection === item.id ? 'text-foreground' : 'text-steel'
                    }`}>
                      {item.icon}
                    </div>
                    
                    <div className={`transition-all duration-300 ${
                      isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}>
                      <div className={`font-mono text-sm font-medium ${
                        activeSection === item.id ? 'text-foreground' : 'text-chrome'
                      }`}>
                        {item.label}
                      </div>
                      <div className={`text-xs mt-1 transition-colors duration-300 ${
                        hoveredItem === item.id ? 'text-electric-cyan' : 'text-steel'
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

          {/* Footer */}
          <div className={`p-4 border-t border-graphite/20 transition-all duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="text-xs text-steel font-mono">
              <div className="flex justify-between">
                <span>STATUS</span>
                <span className="text-electric-cyan">ACTIVE</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>RESOLUTION</span>
                <span className="text-chrome">{window.innerWidth}×{window.innerHeight}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 electric-glow rounded-full 
                   interactive-element flex items-center justify-center z-40
                   backdrop-blur-sm"
        onMouseEnter={() => setHoveredItem('fab')}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Zap className="w-6 h-6 text-foreground" />
      </button>
    </>
  );
};