import { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, 
  Home,
  User,
  Briefcase,
  MessageCircle,
  Settings,
  Layers,
  Cpu, 
  Palette,
  Image,
  FileText,
  Music,
  Video,
  Globe,
  Code,
  Database,
  Bot,
  Github,
  Twitter,
  Linkedin,
  Mail
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleItemClick = (itemId: string) => {
    onNavigate?.(itemId);
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isVisible) setIsVisible(true);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Left Sidebar Navigation */}
      <div
        className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-out ${
          isExpanded ? 'w-64' : 'w-16'
        } bg-surface/95 backdrop-blur-md border-r border-graphite/30`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Header */}
        <div className="p-4 border-b border-graphite/30">
          <div className={`flex items-center gap-3 ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <div className="w-8 h-8 bg-gradient-electric rounded-sm flex items-center justify-center">
              <Layers className="w-4 h-4 text-background" />
            </div>
            <div className="font-mono text-sm text-chrome font-medium">
              MODULES
            </div>
          </div>
          {!isExpanded && (
            <div className="flex justify-center">
              <Layers className="w-6 h-6 text-electric-cyan" />
            </div>
          )}
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full group relative flex items-center gap-3 p-3 rounded transition-all duration-200 text-left ${
                  activeSection === item.id 
                    ? 'bg-electric-cyan/20 text-electric-cyan border-l-2 border-electric-cyan' 
                    : 'hover:bg-surface-elevated text-steel hover:text-chrome'
                }`}
                title={!isExpanded ? `${item.label} - ${item.description}` : undefined}
              >
                <div className={`flex-shrink-0 transition-colors duration-200 ${
                  activeSection === item.id ? 'text-electric-cyan' : 'text-steel group-hover:text-chrome'
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                
                <div className={`flex-1 transition-all duration-300 ${
                  isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}>
                  <div className={`font-mono text-sm font-medium ${
                    activeSection === item.id ? 'text-electric-cyan' : 'text-chrome'
                  }`}>
                    {item.label}
                  </div>
                  <div className="text-xs text-steel">
                    {item.description}
                  </div>
                </div>

                {/* Hover arrow */}
                <div className={`transition-all duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`}>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Creator Info Section */}
        <div className="border-t border-graphite/30 p-4">
          <div className={`${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-electric rounded-sm flex items-center justify-center">
                <User className="w-4 h-4 text-background" />
              </div>
              <div>
                <div className="text-sm font-mono text-chrome">Digital Architect</div>
                <div className="text-xs text-steel">Creator</div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-2">
              <a href="#" className="p-2 rounded hover:bg-surface-elevated transition-colors group">
                <Github className="w-4 h-4 text-background group-hover:text-chrome" />
              </a>
              <a href="#" className="p-2 rounded hover:bg-surface-elevated transition-colors group">
                <Twitter className="w-4 h-4 text-background group-hover:text-chrome" />
              </a>
              <a href="#" className="p-2 rounded hover:bg-surface-elevated transition-colors group">
                <Linkedin className="w-4 h-4 text-background group-hover:text-chrome" />
              </a>
              <a href="#" className="p-2 rounded hover:bg-surface-elevated transition-colors group">
                <Mail className="w-4 h-4 text-background group-hover:text-chrome" />
              </a>
            </div>
          </div>
          
          {!isExpanded && (
            <div className="flex justify-center">
              <User className="w-6 h-6 text-steel" />
            </div>
          )}
        </div>
      </div>

      {/* Hide/Toggle Button - Fixed bottom right */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-graphite/80 border border-graphite/50 rounded flex items-center justify-center z-50 hover:bg-surface-elevated transition-colors"
      >
        <Layers className="w-5 h-5 text-steel" />
      </button>
    </>
  );
};