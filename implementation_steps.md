# Detailed Implementation Steps for Futuraa Fixes

## Overview
This document provides detailed step-by-step implementation instructions for all the identified fixes and improvements for the Futuraa project, organized by priority and impact.

## Phase 1: Critical Security Fixes (Days 1-3)

### 1.1 Implement Content Security Policy (CSP)

**Step 1**: Update server.js to include CSP headers
```bash
# Navigate to project directory
cd /home/admin/000code/futuraa
```

Create or modify `server.js` to add CSP headers:

```javascript
// Add to server.js after other middleware
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "frame-src 'self' https://chat.quazfenton.xyz https://*.github.com https://*.huggingface.co https://quazfenton.github.io; " +
    "script-src 'self' 'unsafe-inline' https://*.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://*.googleapis.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' https:; " +
    "connect-src 'self' https://api.github.com https://huggingface.co; " +
    "frame-ancestors 'none';" // Prevent clickjacking
  );
  next();
});
```

**Step 2**: Test CSP implementation
```bash
npm run build
npm run preview
# Check browser console for CSP violations
```

### 1.2 Secure Iframe Implementation

**Step 1**: Create secure iframe wrapper component
```bash
# Create new file
touch src/components/ui/SecureIframe.tsx
```

Add content to `src/components/ui/SecureIframe.tsx`:

```typescript
import { useState, useEffect, useCallback } from 'react';

interface SecureIframeProps {
  src: string;
  title: string;
  className?: string;
  sandbox?: string;
  allow?: string;
  onLoad?: () => void;
  onError?: () => void;
  referrerPolicy?: ReferrerPolicy;
  timeout?: number;
}

const SecureIframe = ({
  src,
  title,
  className = '',
  sandbox = 'allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation',
  allow = '',
  onLoad,
  onError,
  referrerPolicy = 'no-referrer',
  timeout = 10000
}: SecureIframeProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidSrc, setIsValidSrc] = useState(true);

  // Validate src against allowed domains
  useEffect(() => {
    try {
      const url = new URL(src);
      const allowedDomains = [
        'chat.quazfenton.xyz',
        'github.com',
        'huggingface.co',
        'quazfenton.github.io'
      ];
      
      const isAllowed = allowedDomains.some(domain => 
        url.hostname.includes(domain) || url.hostname === domain
      );
      
      setIsValidSrc(isAllowed);
    } catch {
      setIsValidSrc(false);
    }
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  if (!isValidSrc) {
    return (
      <div className="flex items-center justify-center h-full bg-surface p-4">
        <div className="text-center">
          <div className="text-red-500 font-mono text-sm">Invalid source</div>
          <div className="text-xs text-steel mt-1">Contact administrator</div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full bg-surface p-4">
        <div className="text-center">
          <div className="text-red-500 font-mono text-sm">Content failed to load</div>
          <div className="text-xs text-steel mt-1">Please try again later</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <div className="text-steel font-mono text-sm">Loading content...</div>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        className={`w-full h-full ${className}`}
        sandbox={sandbox}
        allow={allow}
        referrerPolicy={referrerPolicy}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default SecureIframe;
```

**Step 2**: Replace all iframe implementations in ModularInterface.tsx

Update the modules that use iframes in `src/components/ModularInterface.tsx`:

```typescript
// Replace this section in ModularInterface.tsx:
// Find and replace the chat module content:
content: (
  <div className="h-full flex flex-col">
    <div className="flex-none p-2 text-xs text-steel">
      Embedded from chat.quazfenton.xyz
    </div>
    <SecureIframe
      src="https://chat.quazfenton.xyz?embed=1"
      className="flex-1 w-full h-full border-0 rounded"
      title="AI Chat"
      allow="clipboard-read; clipboard-write; microphone; camera; autoplay; encrypted-media"
      referrerPolicy="no-referrer"
    />
  </div>
),
```

Apply the same pattern to all other iframe implementations in the modules object.

### 1.3 Secure PostMessage Communication

**Step 1**: Create secure communication service
```bash
touch src/services/secureCommunication.ts
```

Add to `src/services/secureCommunication.ts`:

```typescript
class SecureIframeCommunicator {
  private allowedOrigins: Set<string>;
  private messageHandlers: Map<string, Set<(data: any) => void>> = new Map();

  constructor(allowedDomains: string[]) {
    this.allowedOrigins = new Set(
      allowedDomains.map(domain => `https://${domain}`)
    );
  }

  public registerIframe(id: string, iframe: HTMLIFrameElement): void {
    if (!this.messageHandlers.has(id)) {
      this.messageHandlers.set(id, new Set());
    }
  }

  public addMessageHandler(
    id: string, 
    handler: (data: any) => void
  ): () => void {
    if (!this.messageHandlers.has(id)) {
      this.messageHandlers.set(id, new Set());
    }
    
    const handlers = this.messageHandlers.get(id)!;
    handlers.add(handler);

    // Return cleanup function
    return () => {
      handlers.delete(handler);
    };
  }

  public sendMessage(
    iframe: HTMLIFrameElement, 
    message: any, 
    targetOrigin: string
  ): void {
    if (!this.allowedOrigins.has(targetOrigin)) {
      console.error(`Untrusted origin: ${targetOrigin}`);
      return;
    }

    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, targetOrigin);
    }
  }

  public initializeListener(): () => void {
    const handler = (event: MessageEvent) => {
      if (!this.allowedOrigins.has(event.origin)) {
        return; // Ignore messages from untrusted origins
      }

      // Process trusted message
      // You can implement specific message routing here
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }
}

export const iframeCommunicator = new SecureIframeCommunicator([
  'chat.quazfenton.xyz',
  'github.com',
  'huggingface.co'
]);
```

**Step 2**: Update postMessage usage in ModularInterface.tsx

Replace the current `postAuthToIframes` function:

```typescript
import { iframeCommunicator } from '@/services/secureCommunication';

// Replace the current postAuthToIframes function
const postAuthToIframes = useCallback((token: string) => {
  try {
    const iframes = document.querySelectorAll(
      "iframe[data-module]",
    ) as NodeListOf<HTMLIFrameElement>;
    iframes.forEach((frame) => {
      try {
        // Validate the frame source before sending
        const url = new URL(frame.src);
        if (url.hostname === 'chat.quazfenton.xyz') {
          iframeCommunicator.sendMessage(
            frame,
            { type: "bing:auth", token },
            "https://chat.quazfenton.xyz"
          );
        }
      } catch (error) {
        console.error("PostMessage to iframe failed:", error);
      }
    });
  } catch (error) {
    console.error("Iframe communication error:", error);
  }
}, []);
```

## Phase 2: Error Handling & State Management (Days 4-6)

### 2.1 Global Error Boundaries

**Step 1**: Create ErrorBoundary component
```bash
touch src/components/ui/ErrorBoundary.tsx
```

Add content to `src/components/ui/ErrorBoundary.tsx`:

```typescript
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Here you could log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error | null }> = ({ error }) => (
  <div className="void-panel p-8 text-center">
    <h2 className="text-xl font-mono text-electric-cyan mb-4">Something went wrong</h2>
    <p className="text-steel mb-4">
      {error?.message || 'An unexpected error occurred'}
    </p>
    <button
      className="bg-electric-cyan/20 hover:bg-electric-cyan/30 px-4 py-2 rounded-sm font-mono"
      onClick={() => window.location.reload()}
    >
      Reload Application
    </button>
  </div>
);

export default ErrorBoundary;
```

**Step 2**: Add ErrorBoundary to App.tsx
```typescript
import ErrorBoundary from "@/components/ui/ErrorBoundary";

// Update App.tsx
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);
```

### 2.2 Zustand State Management Implementation

**Step 1**: Create Zustand store
```bash
mkdir -p src/store
touch src/store/index.ts
```

Add content to `src/store/index.ts`:

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface ModuleState {
  activeModules: string[];
  modulePositions: Record<string, Position>;
  moduleSizes: Record<string, Size>;
  moduleZIndexes: Record<string, number>;
  maximizedModule: string | null;
  previousStates: Record<string, { position: Position; size: Size }>;
  zIndexCounter: number;
  
  // Actions
  addModule: (id: string, position?: Position, size?: Size) => void;
  removeModule: (id: string) => void;
  updatePosition: (id: string, position: Position) => void;
  updateSize: (id: string, size: Size) => void;
  bringToFront: (id: string) => void;
  toggleMaximize: (id: string) => void;
  setModuleZIndex: (id: string, zIndex: number) => void;
}

export const useModuleStore = create<ModuleState>()(
  devtools(
    (set, get) => ({
      activeModules: [],
      modulePositions: {},
      moduleSizes: {},
      moduleZIndexes: {},
      maximizedModule: null,
      previousStates: {},
      zIndexCounter: 100,
      
      addModule: (id, position = { x: 100, y: 100 }, size = { width: 400, height: 300 }) => 
        set((state) => ({
          activeModules: [...state.activeModules, id],
          modulePositions: { ...state.modulePositions, [id]: position },
          moduleSizes: { ...state.moduleSizes, [id]: size },
          moduleZIndexes: { ...state.moduleZIndexes, [id]: state.zIndexCounter + 1 },
          zIndexCounter: state.zIndexCounter + 1
        })),
      
      removeModule: (id) => 
        set((state) => {
          const { [id]: removedPosition, ...newPositions } = state.modulePositions;
          const { [id]: removedSize, ...newSizes } = state.moduleSizes;
          const { [id]: removedZIndex, ...newZIndexes } = state.moduleZIndexes;
          
          return {
            activeModules: state.activeModules.filter(moduleId => moduleId !== id),
            modulePositions: newPositions,
            moduleSizes: newSizes,
            moduleZIndexes: newZIndexes,
            maximizedModule: state.maximizedModule === id ? null : state.maximizedModule
          };
        }),
      
      updatePosition: (id, position) => 
        set((state) => ({
          modulePositions: { ...state.modulePositions, [id]: position }
        })),
      
      updateSize: (id, size) => 
        set((state) => ({
          moduleSizes: { ...state.moduleSizes, [id]: size }
        })),
      
      bringToFront: (id) => 
        set((state) => ({
          moduleZIndexes: { 
            ...state.moduleZIndexes, 
            [id]: state.zIndexCounter + 1 
          },
          zIndexCounter: state.zIndexCounter + 1
        })),
      
      toggleMaximize: (id) => 
        set((state) => {
          if (state.maximizedModule === id) {
            // Restore from maximize
            const prevState = state.previousStates[id];
            if (prevState) {
              return {
                maximizedModule: null,
                modulePositions: { ...state.modulePositions, [id]: prevState.position },
                moduleSizes: { ...state.moduleSizes, [id]: prevState.size },
                previousStates: (({ [id]: _, ...rest }) => rest)(state.previousStates)
              };
            }
            return { maximizedModule: null };
          } else {
            // Save current state and maximize
            const currentState = {
              position: state.modulePositions[id],
              size: state.moduleSizes[id]
            };
            
            return {
              maximizedModule: id,
              previousStates: { ...state.previousStates, [id]: currentState },
              modulePositions: { ...state.modulePositions, [id]: { x: 0, y: 0 } },
              moduleSizes: { ...state.moduleSizes, [id]: { width: window.innerWidth, height: window.innerHeight } }
            };
          }
        }),
      
      setModuleZIndex: (id, zIndex) => 
        set((state) => ({
          moduleZIndexes: { ...state.moduleZIndexes, [id]: zIndex }
        }))
    })
  )
);
```

**Step 2**: Update ModularInterface.tsx to use Zustand
```typescript
// Update ModularInterface.tsx imports and state management
import { useModuleStore } from '@/store';

export const ModularInterface = () => {
  // Replace React state with Zustand store
  const {
    activeModules,
    modulePositions,
    moduleSizes,
    moduleZIndexes,
    maximizedModule,
    previousStates,
    addModule,
    removeModule,
    updatePosition,
    updateSize,
    bringToFront,
    toggleMaximize
  } = useModuleStore();

  // Update functions to use store instead of React state
  const openModule = (moduleId: string) => {
    if (!activeModules.includes(moduleId)) {
      const module = modules[moduleId];
      const randomPos = generateRandomPosition();
      
      addModule(moduleId, randomPos, module.size);
      bringToFront(moduleId);
      setLastOpenedModule(moduleId);
      setInfoText(`OPENING ${module.title.toUpperCase()}`);
    } else {
      closeModule(moduleId);
    }
  };

  const closeModule = (moduleId: string) => {
    removeModule(moduleId);
    if (maximizedModule === moduleId) {
      // Maximization is now handled by the store
    }
    setInfoText(`CLOSED ${modules[moduleId].title.toUpperCase()}`);
  };

  // Similar updates for other functions...
};
```

## Phase 3: Performance Optimizations (Days 7-9)

### 3.1 Component Memoization

**Step 1**: Create memoized components
```bash
touch src/components/ModuleWindow.tsx
```

Add content to `src/components/ModuleWindow.tsx`:

```typescript
import { memo, useCallback } from 'react';
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

  const currentPos = modulePositions[moduleId] || { x: 100, y: 100 };
  const currentSize = moduleSizes[moduleId] || { width: 400, height: 300 };

  const handleDragStop = useCallback((e: any, d: any) => {
    if (!isMaximized) {
      updatePosition(moduleId, { x: d.x, y: d.y });
    }
  }, [moduleId, isMaximized, updatePosition]);

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
      onDragStart={() => bringToFront(moduleId)}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      style={{ zIndex }}
      dragHandleClassName="module-drag-handle"
      enableResizing={!isMaximized}
      bounds="parent"
      minWidth={280}
      minHeight={180}
    >
      <div className="h-full border rounded-sm bg-black/95 border-graphite/50">
        {/* Module Header */}
        <div className="module-drag-handle flex items-center justify-between p-2 border-b border-black/50 bg-black/50">
          <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <Icon className="w-4 h-4 text-electric-cyan" />
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
```

**Step 2**: Update ModularInterface to use memoized components
```typescript
// In ModularInterface.tsx, replace the window rendering section:
{
  activeModules.map((moduleId) => {
    const module = modules[moduleId];
    const isMaximized = maximizedModule === moduleId;
    const zIndex = moduleZIndexes[moduleId] || 20;

    return (
      <ModuleWindow
        key={moduleId}
        moduleId={moduleId}
        title={module.title}
        icon={module.icon}
        content={module.content}
        isMaximized={isMaximized}
        zIndex={zIndex}
      />
    );
  })
}
```

### 3.2 Animation Optimizations

**Step 1**: Create optimized animation hooks
```bash
touch src/hooks/useOptimizedAnimation.ts
```

Add content to `src/hooks/useOptimizedAnimation.ts`:

```typescript
import { useState, useEffect, useRef, useCallback } from 'react';

interface AnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
}

export const useOptimizedAnimation = (
  enabled: boolean,
  options: AnimationOptions = {}
) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  const { duration = 1000, easing = 'linear', delay = 0 } = options;

  const animate = useCallback(() => {
    if (!enabled) return;
    
    const animateFrame = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apply easing function
      let easedProgress = progress;
      if (easing === 'ease-in') {
        easedProgress = Math.pow(progress, 2);
      } else if (easing === 'ease-out') {
        easedProgress = 1 - Math.pow(1 - progress, 2);
      } else if (easing === 'ease-in-out') {
        easedProgress = progress < 0.5 
          ? 2 * Math.pow(progress, 2) 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      }
      
      setIsAnimating(easedProgress < 1);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateFrame);
      } else {
        setIsAnimating(false);
        startTimeRef.current = null;
      }
    };
    
    animationRef.current = requestAnimationFrame(animateFrame);
  }, [enabled, duration, easing]);

  useEffect(() => {
    if (enabled && !isAnimating) {
      const timer = setTimeout(() => {
        animate();
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [enabled, isAnimating, delay, animate]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return { isAnimating };
};

export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
};
```

**Step 2**: Update KineticTypography to use optimized animations
```typescript
// Update KineticTypography.tsx to use the new hooks
import { useOptimizedAnimation, usePageVisibility } from '@/hooks/useOptimizedAnimation';

// In the KineticLetter component:
const KineticLetter = ({ children, delay = 0, className = '' }: KineticLetterProps) => {
  const letterRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isVisible = usePageVisibility();
  const { isAnimating } = useOptimizedAnimation(true, { delay });

  useEffect(() => {
    if (!isVisible || !letterRef.current) return;

    const animateIn = () => {
      if (letterRef.current) {
        letterRef.current.style.transform = `translateY(0) rotateX(0deg) scale(1)`;
        letterRef.current.style.opacity = '1';
      }
    };

    const timeout = setTimeout(animateIn, delay);
    return () => clearTimeout(timeout);
  }, [delay, isVisible]);

  // Rest of the component remains the same...
};
```

## Phase 4: Production Readiness (Days 10-12)

### 4.1 Environment Configuration

**Step 1**: Create environment configuration
```bash
touch src/config/index.ts
```

Add content to `src/config/index.ts`:

```typescript
// Environment configuration
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  environment: import.meta.env.NODE_ENV || 'development',
  version: import.meta.env.VITE_APP_VERSION || 'development',
  debug: import.meta.env.VITE_DEBUG === 'true',
  
  // Feature flags
  features: {
    analytics: import.meta.env.VITE_FEATURE_ANALYTICS !== 'false',
    collaboration: import.meta.env.VITE_FEATURE_COLLABORATION !== 'false',
    externalIframes: import.meta.env.VITE_FEATURE_EXTERNAL_IFRAMES !== 'false',
  },
  
  // External services
  services: {
    chatDomain: import.meta.env.VITE_CHAT_DOMAIN || 'chat.quazfenton.xyz',
    githubDomain: import.meta.env.VITE_GITHUB_DOMAIN || 'github.com',
    huggingfaceDomain: import.meta.env.VITE_HUGGINGFACE_DOMAIN || 'huggingface.co',
  },
  
  // Performance settings
  performance: {
    maxConcurrentIframes: parseInt(import.meta.env.VITE_MAX_IFRAMES || '3'),
    animationFps: parseInt(import.meta.env.VITE_ANIMATION_FPS || '60'),
    memoryLimit: parseInt(import.meta.env.VITE_MEMORY_LIMIT || '256'), // MB
  },
  
  // Security settings
  security: {
    enableCSP: import.meta.env.VITE_ENABLE_CSP !== 'false',
    enablePostMessageValidation: import.meta.env.VITE_VALIDATE_POSTMESSAGE !== 'false',
    maxIframeLoadTime: parseInt(import.meta.env.VITE_IFRAME_TIMEOUT || '10000'), // ms
  }
};

// Validation
if (config.environment === 'production' && config.debug) {
  console.warn('Warning: Debug mode enabled in production');
}

export default config;
```

**Step 2**: Update .env files
```bash
# Create .env.example
touch .env.example
```

Add content to `.env.example`:

```env
# Application Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false

# Feature Flags
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_COLLABORATION=true
VITE_FEATURE_EXTERNAL_IFRAMES=true

# External Services
VITE_CHAT_DOMAIN=chat.quazfenton.xyz
VITE_GITHUB_DOMAIN=github.com
VITE_HUGGINGFACE_DOMAIN=huggingface.co

# Performance Settings
VITE_MAX_IFRAMES=3
VITE_ANIMATION_FPS=60
VITE_MEMORY_LIMIT=256

# Security Settings
VITE_ENABLE_CSP=true
VITE_VALIDATE_POSTMESSAGE=true
VITE_IFRAME_TIMEOUT=10000
```

### 4.2 Monitoring Implementation

**Step 1**: Create monitoring service
```bash
touch src/services/monitoring.ts
```

Add content to `src/services/monitoring.ts`:

```typescript
import config from '@/config';

interface LogEvent {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
}

class MonitoringService {
  private enabled: boolean;
  private logs: LogEvent[] = [];
  private maxLogs: number = 1000;

  constructor() {
    this.enabled = config.environment !== 'development' || config.debug;
  }

  log(level: LogEvent['level'], message: string, context?: Record<string, any>) {
    if (!this.enabled) {
      // In development, still log to console
      console[level](message, context);
      return;
    }

    const logEvent: LogEvent = {
      level,
      message,
      timestamp: new Date(),
      context: { ...context, environment: config.environment }
    };

    // Add to internal logs
    this.logs.push(logEvent);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Send to external service in production
    if (config.environment === 'production') {
      this.sendToExternalService(logEvent);
    }

    // Also log to console
    console[level](message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  debug(message: string, context?: Record<string, any>) {
    if (config.debug) {
      this.log('debug', message, context);
    }
  }

  private sendToExternalService(logEvent: LogEvent) {
    // In a real implementation, send to external monitoring service
    // e.g., Sentry, LogRocket, etc.
    console.log('Would send to external service:', logEvent);
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  // Performance monitoring
  measurePerformance(taskName: string, task: () => any) {
    const start = performance.now();
    try {
      const result = task();
      const end = performance.now();
      this.info(`${taskName} completed`, {
        duration: `${end - start}ms`,
        memory: (performance as any).memory ? {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
        } : undefined
      });
      return result;
    } catch (error) {
      const end = performance.now();
      this.error(`${taskName} failed`, {
        duration: `${end - start}ms`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}

export const monitoringService = new MonitoringService();
```

**Step 2**: Update main components to use monitoring
```typescript
// In ModularInterface.tsx
import { monitoringService } from '@/services/monitoring';

// Add monitoring to key functions:
useEffect(() => {
  monitoringService.info('ModularInterface mounted');
  
  return () => {
    monitoringService.info('ModularInterface unmounted');
  };
}, []);

// Add performance monitoring to expensive operations:
const openModule = (moduleId: string) => {
  monitoringService.measurePerformance(`Open module ${moduleId}`, () => {
    // Original openModule logic
  });
};
```

## Phase 5: Testing Implementation (Days 13-15)

### 5.1 Jest Configuration

**Step 1**: Install testing dependencies
```bash
npm install -D jest @types/jest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react-refresh
npm install -D ts-jest
```

**Step 2**: Create Jest configuration
```bash
touch jest.config.js
```

Add content to `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',  // Exclude entry point
    '!src/vite-env.d.ts'  // Exclude type definitions
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
```

**Step 3**: Create setup file
```bash
touch src/setupTests.ts
```

Add content to `src/setupTests.ts`:

```typescript
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock global objects that might not be available in test environment
Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver if it doesn't exist
window.ResizeObserver = window.ResizeObserver || jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
```

### 5.2 Create Test Files

**Step 1**: Create component test
```bash
mkdir -p src/__tests__
touch src/__tests__/ModuleWindow.test.tsx
```

Add content to `src/__tests__/ModuleWindow.test.tsx`:

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModuleWindow from '@/components/ModuleWindow';
import { useModuleStore } from '@/store';

// Mock the store
jest.mock('@/store', () => ({
  useModuleStore: jest.fn()
}));

const mockUseModuleStore = useModuleStore as jest.MockedFunction<typeof useModuleStore>;

describe('ModuleWindow', () => {
  beforeEach(() => {
    mockUseModuleStore.mockReturnValue({
      modulePositions: { 'test-module': { x: 100, y: 100 } },
      moduleSizes: { 'test-module': { width: 400, height: 300 } },
      updatePosition: jest.fn(),
      updateSize: jest.fn(),
      removeModule: jest.fn(),
      toggleMaximize: jest.fn(),
      bringToFront: jest.fn(),
      addModule: jest.fn(),
      moduleZIndexes: { 'test-module': 100 },
      maximizedModule: null,
      previousStates: {},
      setModuleZIndex: jest.fn()
    });
  });

  test('renders module window with correct content', () => {
    render(
      <ModuleWindow
        moduleId="test-module"
        title="Test Module"
        icon={() => <div>Icon</div>}
        content={<div>Module Content</div>}
        isMaximized={false}
        zIndex={100}
      />
    );

    expect(screen.getByText('Module Content')).toBeInTheDocument();
    expect(screen.getByText('Test Module')).toBeInTheDocument();
  });

  test('triggers close action when close button is clicked', () => {
    const removeModule = jest.fn();
    mockUseModuleStore.mockReturnValue({
      modulePositions: { 'test-module': { x: 100, y: 100 } },
      moduleSizes: { 'test-module': { width: 400, height: 300 } },
      updatePosition: jest.fn(),
      updateSize: jest.fn(),
      removeModule,
      toggleMaximize: jest.fn(),
      bringToFront: jest.fn(),
      addModule: jest.fn(),
      moduleZIndexes: { 'test-module': 100 },
      maximizedModule: null,
      previousStates: {},
      setModuleZIndex: jest.fn()
    });

    render(
      <ModuleWindow
        moduleId="test-module"
        title="Test Module"
        icon={() => <div>Icon</div>}
        content={<div>Module Content</div>}
        isMaximized={false}
        zIndex={100}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(removeModule).toHaveBeenCalledWith('test-module');
  });
});
```

## Phase 6: Build Optimization (Days 16-17)

### 6.1 Update Build Configuration

**Step 1**: Update vite.config.ts for production optimization
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true in dev, false in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@radix-ui/react-*', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'data-vendor': ['@tanstack/react-query', 'zustand'],
          'editor-vendor': ['@monaco-editor/react', 'monaco-editor'],
          'draw-vendor': ['tldraw'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});
```

### 6.2 Add Performance Budget

**Step 1**: Create performance budget configuration
```bash
touch package.json  # Update existing file
```

Add to the scripts section in package.json:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "perf:check": "npm run build && npx lighthouse http://localhost:4173 --only-categories=performance --output=json --output-path=./perf-report.json"
  }
}
```

## Phase 7: Final Integration & Testing (Day 18-21)

### 7.1 Integration Testing

**Step 1**: Create e2e tests with Playwright
```bash
npm install -D @playwright/test
npx playwright install
```

**Step 2**: Create Playwright config
```bash
touch playwright.config.ts
```

Add content to `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 3**: Create basic e2e test
```bash
mkdir -p e2e
touch e2e/basic.test.ts
```

Add content to `e2e/basic.test.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('loads the main page', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the loading animation to complete
  await expect(page.locator('text=0000')).toBeVisible();
  
  // Wait for main interface to load
  await page.waitForSelector('.module-window', { state: 'attached' });
  
  // Verify the main components are present
  expect(await page.locator('.void-panel').count()).toBeGreaterThan(0);
  expect(await page.locator('button').count()).toBeGreaterThan(0);
});

test('opens a module', async ({ page }) => {
  await page.goto('/');
  
  // Wait for page to load
  await page.waitForSelector('button[title="CANVAS"]', { state: 'visible' });
  
  // Click on the canvas module
  await page.click('button[title="CANVAS"]');
  
  // Verify module window appears
  await expect(page.locator('.module-window')).toBeVisible();
  
  // Verify module content is present
  await expect(page.locator('text=Design')).toBeVisible();
});
```

### 7.2 Final Production Check

**Step 1**: Create production check script
```bash
touch scripts/production-check.sh
```

Add content to `scripts/production-check.sh`:

```bash
#!/bin/bash
echo "Running production checks..."

# Check if all required env vars are set
if [ -z "$VITE_API_URL" ]; then
  echo "Error: VITE_API_URL is not set"
  exit 1
fi

# Run linting
echo "Running lint checks..."
npm run lint

if [ $? -ne 0 ]; then
  echo "Linting failed"
  exit 1
fi

# Run tests
echo "Running unit tests..."
npm run test:coverage

if [ $? -ne 0 ]; then
  echo "Tests failed"
  exit 1
fi

# Build application
echo "Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed"
  exit 1
fi

# Check bundle size
echo "Checking bundle size..."
BUNDLE_SIZE=$(du -sh dist | cut -f1)
echo "Bundle size: $BUNDLE_SIZE"

# Performance check
echo "Running performance check..."
npm run perf:check

echo "All production checks passed!"
```

**Step 2**: Make script executable and add to package.json
```bash
chmod +x scripts/production-check.sh
```

Add to package.json scripts:
```json
{
  "scripts": {
    "prod:check": "bash scripts/production-check.sh"
  }
}
```

## Summary of Implementation Steps

Following this detailed implementation plan will systematically address all the identified issues in the Futuraa project:

1. **Security**: Implemented CSP, secure iframes, and validated postMessage
2. **Error Handling**: Added global error boundaries and proper error management
3. **State Management**: Moved from React state to Zustand for scalable state management
4. **Performance**: Implemented component memoization and optimized animations
5. **Production Readiness**: Added configuration management and monitoring
6. **Testing**: Implemented comprehensive test suite
7. **Build Optimization**: Optimized for production deployment

The plan is designed to be executed in phases to minimize risk and allow for testing at each stage. Each phase builds upon the previous one to create a robust, production-ready application.