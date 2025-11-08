import { memo, useCallback, useState } from 'react';
import { Rnd } from 'react-rnd';
import { Maximize2, Minimize2, RotateCcw, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModuleStore } from '@/store';

interface ModuleWindowProps {
  moduleId: string;
  title: string;
  icon: React.ComponentType;
  content: React.ReactNode;
  isMaximized: boolean;
  zIndex: number;
}

const ModuleWindow = memo(({ 
  moduleId, 
  title, 
  icon: Icon, 
  content, 
  isMaximized, 
  zIndex 
}: ModuleWindowProps) => {
  const {
    modulePositions,
    moduleSizes,
    updatePosition,
    updateSize,
    removeModule,
    toggleMaximize,
    bringToFront
  } = useModuleStore();

  const [isDragging, setIsDragging] = useState(false);

  const currentPos = modulePositions[moduleId] || { x: 100, y: 100 };
  const currentSize = moduleSizes[moduleId] || { width: 400, height: 300 };

  const handleDragStart = useCallback(() => {
    bringToFront(moduleId);
    setIsDragging(true);
  }, [bringToFront, moduleId]);

  const handleDragStop = useCallback((e: any, d: any) => {
    updatePosition(moduleId, { x: d.x, y: d.y });
    setIsDragging(false);
  }, [moduleId, updatePosition]);

  const handleResizeStop = useCallback((e: any, direction: any, ref: any, delta: any, position: any) => {
    if (!isMaximized) {
      updateSize(moduleId, {
        width: parseInt(ref.style.width),
        height: parseInt(ref.style.height)
      });
      updatePosition(moduleId, position);
    }
  }, [moduleId, isMaximized, updateSize, updatePosition]);

  return (
    <Rnd
      size={
        isMaximized 
          ? { width: window.innerWidth, height: window.innerHeight } 
          : currentSize
      }
      position={isMaximized ? { x: 0, y: 0 } : currentPos}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      style={{ zIndex }}
      dragHandleClassName="module-drag-handle"
      enableResizing={!isMaximized}
      disableDragging={isMaximized}
      bounds="window"
      minWidth={280}
      minHeight={180}
    >
      <div 
        className="h-full border rounded-sm transition-all duration-300 bg-black/95 border-graphite/50"
        onClick={() => bringToFront(moduleId)}
        style={{
          boxShadow: isDragging
            ? "0 0 40px rgba(0, 255, 255, 0.4), 0 0 80px rgba(120, 0, 255, 0.3), 0 0 0 1px rgba(0, 255, 255, 0.3)"
            : "0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 60px -10px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Module Header */}
        <div className="module-drag-handle flex items-center justify-between p-2 border-b border-black/50 bg-black/50">
          <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <Icon />
            <span className="text-sm font-mono text-steel">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => toggleMaximize(moduleId)}
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-60 hover:opacity-100 hover:bg-electric-cyan/20"
              title="Maximize/Restore"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-60 hover:opacity-100 hover:bg-electric-cyan/20"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-60 hover:opacity-100 hover:bg-electric-violet/20"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => removeModule(moduleId)}
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-60 hover:opacity-100 hover:bg-electric-crimson/20"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Module Content */}
        <div className={isMaximized ? "h-[calc(100%-2.5rem)]" : "h-[calc(100%-2.5rem)]"}>
          {content}
        </div>
      </div>
    </Rnd>
  );
});

ModuleWindow.displayName = 'ModuleWindow';

export default ModuleWindow;