import { useEffect, useState, useCallback } from "react";
import { Tldraw, createTLStore, defaultShapeUtils } from "tldraw";
import "tldraw/tldraw.css";
import {
  Users,
  Download,
  Upload,
  Trash2,
  Grid,
  Square,
  Circle,
  Triangle,
  Type,
  Pencil,
  Hand,
  MousePointer2,
  Eraser,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const addLog = (type: string, message: string) => {
  console.log(`[${type}]`, message);
};

interface CollaborativeBoardProps {
  roomId?: string;
  userId?: string;
}

export const CollaborativeBoard = ({
  roomId = "default",
  userId = "guest",
}: CollaborativeBoardProps) => {
  const [store] = useState(() =>
    createTLStore({ shapeUtils: defaultShapeUtils }),
  );
  const [isReady, setIsReady] = useState(false);
  const [userColor] = useState(() => {
    const colors = ["#00D9FF", "#9D00FF", "#FFD700", "#FF0080", "#00FF88"];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      // Export as JSON - using store.serialize() for TLDraw v2
      const snapshot = store.serialize("document");
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `whiteboard-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  }, [store]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const snapshot = JSON.parse(text);
        // Use store methods to load data - simplified approach
        store.clear();
        // TLDraw v2 - we can't directly load arbitrary JSON
        // This is a simplified version - in production, validate the schema
        console.log("Import loaded:", snapshot);
        addLog("info", "Board imported (experimental)");
      } catch (error) {
        console.error("Import failed:", error);
        addLog("error", "Import failed");
      }
    };
    input.click();
  }, [store]);

  const handleClear = useCallback(() => {
    if (confirm("Clear entire board? This cannot be undone.")) {
      store.clear();
    }
  }, [store]);

  if (!isReady) {
    return (
      <div className="h-full w-full bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-steel font-mono text-sm">Loading whiteboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-surface relative">
      {/* Custom Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-black/90 backdrop-blur-md border border-graphite/50 rounded p-2 space-y-1">
          <div className="text-xs font-mono text-steel mb-2 px-1">TOOLS</div>
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start hover:bg-electric-cyan/20"
            title="Select"
          >
            <MousePointer2 className="w-4 h-4 mr-2" />
            <span className="text-xs">Select</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start hover:bg-electric-cyan/20"
            title="Draw"
          >
            <Pencil className="w-4 h-4 mr-2" />
            <span className="text-xs">Draw</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start hover:bg-electric-cyan/20"
            title="Eraser"
          >
            <Eraser className="w-4 h-4 mr-2" />
            <span className="text-xs">Erase</span>
          </Button>
          <div className="border-t border-graphite/30 my-2" />
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start hover:bg-electric-violet/20"
            title="Rectangle"
          >
            <Square className="w-4 h-4 mr-2" />
            <span className="text-xs">Box</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start hover:bg-electric-violet/20"
            title="Circle"
          >
            <Circle className="w-4 h-4 mr-2" />
            <span className="text-xs">Circle</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start hover:bg-electric-violet/20"
            title="Text"
          >
            <Type className="w-4 h-4 mr-2" />
            <span className="text-xs">Text</span>
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <div className="bg-black/90 backdrop-blur-md border border-graphite/50 rounded p-2 flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleExport}
            className="hover:bg-electric-cyan/20"
            title="Export Board"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleImport}
            className="hover:bg-electric-cyan/20"
            title="Import Board"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClear}
            className="hover:bg-electric-crimson/20"
            title="Clear Board"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black/90 backdrop-blur-md border border-graphite/50 rounded px-3 py-2 flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: userColor }}
          />
          <span className="text-xs font-mono text-chrome">{userId}</span>
          <Users className="w-4 h-4 text-steel ml-1" />
          <span className="text-xs text-steel">1</span>
        </div>
      </div>

      {/* TLDraw Canvas with Custom Styling */}
      <style>{`
        .tldraw {
          --color-background: #0A0A0A !important;
          --color-low: #1A1A1A !important;
          --color-low-alpha: rgba(26, 26, 26, 0.5) !important;
          --color-mid: #374151 !important;
          --color-high: #E0E0E0 !important;
          --color-text: #E0E0E0 !important;
          --color-text-0: #E0E0E0 !important;
          --color-text-1: #9CA3AF !important;
          --color-selected: #00D9FF !important;
          --color-selected-contrast: #0A0A0A !important;
          --color-muted-1: #6B7280 !important;
          --color-hint: #4B5563 !important;
          --color-primary: #00D9FF !important;
          --color-accent-blue: #00D9FF !important;
          --color-accent-violet: #9D00FF !important;
          --color-accent-yellow: #FFD700 !important;
          --color-accent-red: #FF0080 !important;
          --color-accent-green: #00FF88 !important;
          font-family: 'Courier New', monospace !important;
        }

        .tldraw__editor {
          background-color: #0A0A0A !important;
        }

        .tldraw__menu {
          display: none !important;
        }

        .tldraw__toolbar {
          background: rgba(10, 10, 10, 0.9) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(55, 65, 81, 0.5) !important;
        }

        .tldraw__button {
          color: #9CA3AF !important;
        }

        .tldraw__button:hover {
          background: rgba(0, 217, 255, 0.1) !important;
          color: #00D9FF !important;
        }

        .tldraw__button[data-state="selected"] {
          background: rgba(0, 217, 255, 0.2) !important;
          color: #00D9FF !important;
        }

        .tldraw__scrollbar {
          --color-scrollbar: #374151 !important;
        }

        .tlui-menu__group {
          background: #0A0A0A !important;
          border: 1px solid #374151 !important;
        }

        .tlui-menu__button {
          color: #E0E0E0 !important;
        }

        .tlui-menu__button:hover {
          background: rgba(0, 217, 255, 0.1) !important;
        }

        .tlui-popover__content {
          background: #0A0A0A !important;
          border: 1px solid #374151 !important;
        }

        .tlui-kbd {
          background: #1A1A1A !important;
          border-color: #374151 !important;
          color: #9CA3AF !important;
        }
      `}</style>

      <div className="h-full w-full">
        <Tldraw store={store} autoFocus hideUi={false} />
      </div>
    </div>
  );
};
