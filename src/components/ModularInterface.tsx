import { useState, useRef, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Maximize2, Minimize2, RotateCcw, X, Zap, Layers, Palette, Cpu } from 'lucide-react';

// ... (rest of the component)

export const ModularInterface = () => {
  const [activeModules, setActiveModules] = useState<string[]>(['canvas']);
  const [maximizedModule, setMaximizedModule] = useState<string | null>(null);
  const sidebar = useSidebar();

  const openModule = (moduleId: string) => {
    if (!activeModules.includes(moduleId)) {
      setActiveModules(prev => [...prev, moduleId]);
    }
    sidebar?.setOpen(false);
  };

  // ... (rest of the component)
};