# Advanced ModularInterface Technical Planning Document
## Project: Futuraa - Advanced App Modules Integration

**Document Version:** 1.0  
**Date:** 2024  
**Status:** Pre-Production Planning  
**Objective:** Comprehensive technical planning for advanced modular features

---

## Table of Contents
1. [Current Architecture Analysis](#1-current-architecture-analysis)
2. [Proposed Advanced Modules](#2-proposed-advanced-modules)
3. [Technical Stack & Dependencies](#3-technical-stack--dependencies)
4. [Integration Architecture](#4-integration-architecture)
5. [Code Implementation Plans](#5-code-implementation-plans)
6. [State Management Strategy](#6-state-management-strategy)
7. [Performance Optimization](#7-performance-optimization)
8. [Security Considerations](#8-security-considerations)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Testing Strategy](#10-testing-strategy)

---

## 1. Current Architecture Analysis

### 1.1 Existing Component Structure
```typescript
// Location: /home/admin/000code/futuraa/src/components/ModularInterface.tsx

Current Architecture:
├── ModularInterface (Main Component)
│   ├── State Management (useState hooks)
│   │   ├── activeModules: string[]
│   │   ├── maximizedModule: string | null
│   │   ├── modulePositions: Record<string, Position>
│   │   ├── moduleZIndexes: Record<string, number>
│   │   └── backgroundOffset: {x, y}
│   ├── Window Management (react-rnd)
│   ├── Module Registry (modules object)
│   └── UI Components
│       ├── Info Box
│       ├── Navigation Panel (FluidNavigation)
│       ├── Module Windows (Rnd)
│       └── Bottom Dock
```

### 1.2 Current Technology Stack
- **Framework:** React 18.3.1 + TypeScript
- **Window Management:** react-rnd 10.5.2
- **UI Library:** Radix UI + shadcn/ui
- **Icons:** lucide-react 0.462.0
- **Styling:** Tailwind CSS 3.4.11
- **Build Tool:** Vite 5.4.1
- **State:** React Hooks (no external state manager)

### 1.3 Current Module Types
1. **Static Modules:** Canvas, Gallery, Journal, Music, Video
2. **Iframe Modules:** Chat, Notes, HF Spaces, GitHub, DevOps
3. **Placeholder Modules:** Portfolio, Neural, Code, Data

### 1.4 Key Integration Points Identified
```typescript
// Lines 44-52: ModuleWindow Interface
interface ModuleWindow {
  id: string;
  title: string;
  icon: any;
  content: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  subdomain?: string;
}

// Lines 191-645: Module Registry
const modules: Record<string, ModuleWindow> = { ... }

// Lines 729-752: openModule function - PRIMARY INTEGRATION POINT
const openModule = (moduleId: string) => {
  // Module initialization logic
  // Position calculation
  // State updates
}
```

---

## 2. Proposed Advanced Modules

### 2.1 Real-Time Collaborative Whiteboard
**Module ID:** `collaborative-board`  
**Priority:** HIGH  
**Complexity:** Advanced

#### Technical Specifications
```typescript
// Dependencies to Add:
{
  "tldraw": "^2.0.0",           // Whiteboard library
  "yjs": "^13.6.10",            // CRDT for collaboration
  "y-websocket": "^1.5.0",      // WebSocket provider
  "y-indexeddb": "^9.0.12"      // Local persistence
}

// Alternative Option:
{
  "excalidraw": "^0.17.0",      // Lighter alternative
  "@excalidraw/excalidraw": "^0.17.0"
}
```

#### Implementation Plan
```typescript
// Location: src/components/modules/CollaborativeBoard.tsx
import { Tldraw } from 'tldraw';
import { useYjsStore } from '@tldraw/store';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface CollaborativeBoardProps {
  roomId: string;
  userId: string;
}

export const CollaborativeBoard = ({ roomId, userId }: CollaborativeBoardProps) => {
  const [doc] = useState(() => new Y.Doc());
  const [provider] = useState(() => 
    new WebsocketProvider(
      'wss://your-websocket-server.com', 
      roomId, 
      doc
    )
  );

  const store = useYjsStore({
    doc,
    awareness: provider.awareness,
  });

  useEffect(() => {
    provider.awareness.setLocalStateField('user', {
      name: userId,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    });

    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, []);

  return (
    <div className="h-full w-full bg-surface">
      <Tldraw 
        store={store}
        className="tldraw-custom-theme"
      />
    </div>
  );
};

// Module Registration in ModularInterface.tsx (Line ~645)
collaborativeBoard: {
  id: "collaborative-board",
  title: "Collaborative Board",
  icon: Palette,
  content: <CollaborativeBoard roomId="default" userId={user.name} />,
  position: { x: 150, y: 100 },
  size: { width: 900, height: 650 },
  subdomain: "board",
},
```

#### Integration Steps
1. Install dependencies: `npm install tldraw yjs y-websocket y-indexeddb`
2. Create WebSocket server (or use hosted solution)
3. Add module component at `src/components/modules/CollaborativeBoard.tsx`
4. Register module in `modules` object (line ~645)
5. Add custom CSS for dark theme integration

---

### 2.2 Advanced Code Editor with LSP
**Module ID:** `code-editor-pro`  
**Priority:** HIGH  
**Complexity:** Advanced

#### Technical Specifications
```typescript
// Dependencies:
{
  "@monaco-editor/react": "^4.6.0",  // Monaco Editor React wrapper
  "monaco-editor": "^0.45.0",        // VS Code's editor
  "monaco-languageclient": "^8.0.0", // LSP support
  "vscode-languageserver": "^9.0.1"  // Language server
}

// Alternative (Lighter):
{
  "@codemirror/state": "^6.4.0",
  "@codemirror/view": "^6.23.0",
  "@codemirror/lang-javascript": "^6.2.1",
  "@codemirror/lang-python": "^6.1.4",
  "@codemirror/autocomplete": "^6.12.0",
  "@codemirror/lint": "^6.5.0"
}
```

#### Implementation Plan
```typescript
// Location: src/components/modules/CodeEditorPro.tsx
import Editor from '@monaco-editor/react';
import { useState, useRef, useEffect } from 'react';
import { Play, Save, Download, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface File {
  name: string;
  language: string;
  content: string;
  path: string;
}

export const CodeEditorPro = () => {
  const [files, setFiles] = useState<File[]>([
    {
      name: 'index.js',
      language: 'javascript',
      content: '// Start coding...\nconsole.log("Hello, World!");',
      path: '/index.js'
    }
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [theme, setTheme] = useState('vs-dark');
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Custom theme matching cyberpunk aesthetic
    monaco.editor.defineTheme('cyber-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00D9FF', fontStyle: 'bold' },
        { token: 'string', foreground: 'FFD700' },
        { token: 'number', foreground: 'FF0080' },
        { token: 'function', foreground: '9D00FF' },
      ],
      colors: {
        'editor.background': '#0A0A0A',
        'editor.foreground': '#E0E0E0',
        'editorLineNumber.foreground': '#4B5563',
        'editor.selectionBackground': '#00D9FF33',
        'editor.lineHighlightBackground': '#1A1A1A',
      },
    });
    monaco.editor.setTheme('cyber-dark');
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFiles(prev => prev.map((file, idx) => 
        idx === activeFileIndex ? { ...file, content: value } : file
      ));
    }
  };

  const runCode = () => {
    const activeFile = files[activeFileIndex];
    if (activeFile.language === 'javascript') {
      try {
        // Create sandboxed execution context
        const result = eval(activeFile.content);
        console.log('Execution Result:', result);
      } catch (error) {
        console.error('Execution Error:', error);
      }
    }
  };

  const saveFile = () => {
    const activeFile = files[activeFileIndex];
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addNewFile = () => {
    const newFile: File = {
      name: `untitled-${files.length + 1}.js`,
      language: 'javascript',
      content: '// New file\n',
      path: `/untitled-${files.length + 1}.js`
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileIndex(files.length);
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-2 bg-surface border-b border-graphite/30">
        {files.map((file, idx) => (
          <button
            key={idx}
            onClick={() => setActiveFileIndex(idx)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
              idx === activeFileIndex
                ? 'bg-electric-cyan/20 text-chrome border border-electric-cyan/50'
                : 'text-steel hover:bg-surface-elevated'
            }`}
          >
            {file.name}
          </button>
        ))}
        <button
          onClick={addNewFile}
          className="ml-2 px-2 py-1 text-steel hover:text-chrome text-xs"
        >
          +
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-surface border-b border-graphite/30">
        <Button
          size="sm"
          onClick={runCode}
          className="bg-electric-cyan/20 hover:bg-electric-cyan/30"
        >
          <Play className="w-3 h-3 mr-1" />
          Run
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={saveFile}
          className="hover:bg-surface-elevated"
        >
          <Save className="w-3 h-3 mr-1" />
          Save
        </Button>
        <div className="ml-auto text-xs text-steel font-mono">
          {files[activeFileIndex].language.toUpperCase()}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={files[activeFileIndex].language}
          value={files[activeFileIndex].content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 13,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 10 },
          }}
        />
      </div>
    </div>
  );
};

// Module Registration
codeEditorPro: {
  id: "code-editor-pro",
  title: "Code Editor Pro",
  icon: Code,
  content: <CodeEditorPro />,
  position: { x: 200, y: 120 },
  size: { width: 1000, height: 700 },
  subdomain: "code",
},
```

#### Integration Steps
1. Install: `npm install @monaco-editor/react monaco-editor`
2. Create component at `src/components/modules/CodeEditorPro.tsx`
3. Add to module registry (line ~645)
4. Configure Vite to handle Monaco workers
5. Add custom cyber-dark theme

---

### 2.3 Integrated Terminal Emulator
**Module ID:** `terminal`  
**Priority:** MEDIUM  
**Complexity:** Advanced

#### Technical Specifications
```typescript
// Dependencies:
{
  "xterm": "^5.3.0",              // Terminal emulator
  "xterm-addon-fit": "^0.8.0",    // Auto-resize
  "xterm-addon-web-links": "^0.9.0", // Clickable links
  "xterm-addon-search": "^0.13.0", // Search functionality
  "node-pty": "^1.0.0"            // Backend: PTY process (requires Node.js backend)
}

// For browser-only solution:
{
  "xterm": "^5.3.0",
  "local-echo": "^1.4.1"          // Local shell simulation
}
```

#### Implementation Plan
```typescript
// Location: src/components/modules/TerminalEmulator.tsx
import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { SearchAddon } from 'xterm-addon-search';
import 'xterm/css/xterm.css';
import { Button } from '@/components/ui/button';
import { X, Plus, Search, Copy } from 'lucide-react';

interface TerminalTab {
  id: string;
  terminal: Terminal;
  name: string;
}

export const TerminalEmulator = () => {
  const terminalRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [tabs, setTabs] = useState<TerminalTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');

  const createTerminal = (tabId: string) => {
    const terminal = new Terminal({
      cursorBlink: true,
      fontFamily: '"Fira Code", "Courier New", monospace',
      fontSize: 13,
      theme: {
        background: '#0A0A0A',
        foreground: '#E0E0E0',
        cursor: '#00D9FF',
        cursorAccent: '#0A0A0A',
        selectionBackground: '#00D9FF33',
        black: '#1A1A1A',
        red: '#FF0080',
        green: '#00FF88',
        yellow: '#FFD700',
        blue: '#00D9FF',
        magenta: '#9D00FF',
        cyan: '#00D9FF',
        white: '#E0E0E0',
        brightBlack: '#4B5563',
        brightRed: '#FF0080',
        brightGreen: '#00FF88',
        brightYellow: '#FFD700',
        brightBlue: '#00D9FF',
        brightMagenta: '#9D00FF',
        brightCyan: '#00D9FF',
        brightWhite: '#FFFFFF',
      },
      rows: 24,
      cols: 80,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const searchAddon = new SearchAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);
    terminal.loadAddon(searchAddon);

    const terminalEl = terminalRefs.current.get(tabId);
    if (terminalEl) {
      terminal.open(terminalEl);
      fitAddon.fit();

      // Welcome message
      terminal.writeln('\x1b[1;36m╔════════════════════════════════════════╗\x1b[0m');
      terminal.writeln('\x1b[1;36m║      FUTURAA TERMINAL v1.0.0          ║\x1b[0m');
      terminal.writeln('\x1b[1;36m╚════════════════════════════════════════╝\x1b[0m');
      terminal.writeln('');
      terminal.write('\x1b[1;32m$\x1b[0m ');

      // Handle window resize
      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });
      resizeObserver.observe(terminalEl);

      // Simulated shell (for frontend only)
      let currentLine = '';
      terminal.onData((data) => {
        if (data === '\r') { // Enter key
          terminal.write('\r\n');
          executeCommand(terminal, currentLine);
          currentLine = '';
          terminal.write('\x1b[1;32m$\x1b[0m ');
        } else if (data === '\x7F') { // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            terminal.write('\b \b');
          }
        } else {
          currentLine += data;
          terminal.write(data);
        }
      });

      return { terminal, fitAddon, searchAddon, resizeObserver };
    }
    return null;
  };

  const executeCommand = (terminal: Terminal, command: string) => {
    const cmd = command.trim();
    
    // Simple command parser (expand for production)
    switch (cmd.split(' ')[0]) {
      case 'help':
        terminal.writeln('Available commands:');
        terminal.writeln('  help    - Show this help message');
        terminal.writeln('  clear   - Clear the terminal');
        terminal.writeln('  echo    - Echo text');
        terminal.writeln('  date    - Show current date');
        terminal.writeln('  whoami  - Show current user');
        break;
      case 'clear':
        terminal.clear();
        break;
      case 'echo':
        terminal.writeln(cmd.slice(5));
        break;
      case 'date':
        terminal.writeln(new Date().toString());
        break;
      case 'whoami':
        terminal.writeln('guest@futuraa');
        break;
      case '':
        break;
      default:
        terminal.writeln(`\x1b[1;31mCommand not found: ${cmd.split(' ')[0]}\x1b[0m`);
        terminal.writeln('Type "help" for available commands');
    }
  };

  const addTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const newTab: TerminalTab = {
      id: newTabId,
      terminal: null as any, // Will be set after render
      name: `Terminal ${tabs.length + 1}`,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const closeTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.terminal) {
      tab.terminal.dispose();
    }
    setTabs(prev => prev.filter(t => t.id !== tabId));
    if (activeTabId === tabId && tabs.length > 1) {
      setActiveTabId(tabs[0].id === tabId ? tabs[1].id : tabs[0].id);
    }
  };

  useEffect(() => {
    if (tabs.length === 0) {
      addTab();
    }
  }, []);

  useEffect(() => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab && !activeTab.terminal) {
      const result = createTerminal(activeTabId);
      if (result) {
        setTabs(prev => prev.map(t => 
          t.id === activeTabId ? { ...t, terminal: result.terminal } : t
        ));
      }
    }
  }, [activeTabId, tabs]);

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-2 bg-surface border-b border-graphite/30">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono ${
              tab.id === activeTabId
                ? 'bg-electric-cyan/20 text-chrome border border-electric-cyan/50'
                : 'text-steel hover:bg-surface-elevated cursor-pointer'
            }`}
          >
            <span onClick={() => setActiveTabId(tab.id)}>{tab.name}</span>
            <button
              onClick={() => closeTab(tab.id)}
              className="hover:text-electric-crimson"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={addTab}
          className="ml-2 px-2 py-1 text-steel hover:text-chrome"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal Container */}
      <div className="flex-1 relative">
        {tabs.map(tab => (
          <div
            key={tab.id}
            ref={el => el && terminalRefs.current.set(tab.id, el)}
            className={`absolute inset-0 p-2 ${
              tab.id === activeTabId ? 'block' : 'hidden'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Module Registration
terminal: {
  id: "terminal",
  title: "Terminal",
  icon: Terminal,
  content: <TerminalEmulator />,
  position: { x: 180, y: 140 },
  size: { width: 800, height: 500 },
  subdomain: "terminal",
},
```

#### Integration Steps
1. Install: `npm install xterm xterm-addon-fit xterm-addon-web-links xterm-addon-search`
2. Create component at `src/components/modules/TerminalEmulator.tsx`
3. Add xterm CSS import to main CSS file
4. Register module in modules object
5. Optional: Create WebSocket backend for real shell access

---

### 2.4 File Manager with Cloud Sync
**Module ID:** `file-manager`  
**Priority:** MEDIUM  
**Complexity:** Medium-Advanced

#### Technical Specifications
```typescript
// Dependencies:
{
  "react-dropzone": "^14.2.3",      // Drag & drop
  "idb": "^8.0.0",                  // IndexedDB wrapper
  "file-saver": "^2.0.5",           // File download
  "@tanstack/react-virtual": "^3.0.0", // Virtual scrolling
}

// For cloud sync:
{
  "aws-sdk": "^2.1498.0",           // S3 for storage
  // OR
  "supabase": "^2.38.0",            // Supabase storage
  // OR
  "firebase": "^10.7.0"             // Firebase storage
}
```

#### Implementation Plan
```typescript
// Location: src/components/modules/FileManager.tsx
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { openDB, IDBPDatabase } from 'idb';
import { saveAs } from 'file-saver';
import {
  File as FileIcon,
  Folder,
  Upload,
  Download,
  Trash2,
  Search,
  Grid,
  List,
  Image as ImageIcon,
  FileText,
  Film,
  Music as MusicIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  path: string;
  content?: ArrayBuffer;
  thumbnail?: string;
}

const DB_NAME = 'futuraa-file-system';
const DB_VERSION = 1;
const STORE_NAME = 'files';

export const FileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      const database = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('path', 'path', { unique: false });
            store.createIndex('name', 'name', { unique: false });
          }
        },
      });
      setDb(database);
      loadFiles(database, currentPath);
    };
    initDB();
  }, []);

  const loadFiles = async (database: IDBPDatabase, path: string) => {
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('path');
    const allFiles = await index.getAll(path);
    setFiles(allFiles);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!db) return;

    const newFiles: FileItem[] = await Promise.all(
      acceptedFiles.map(async (file) => {
        const content = await file.arrayBuffer();
        let thumbnail: string | undefined;

        // Generate thumbnail for images
        if (file.type.startsWith('image/')) {
          thumbnail = await generateThumbnail(file);
        }

        return {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          type: 'file' as const,
          mimeType: file.type,
          size: file.size,
          createdAt: new Date(),
          modifiedAt: new Date(),
          path: currentPath,
          content,
          thumbnail,
        };
      })
    );

    // Save to IndexedDB
    const tx = db.transaction(STORE_NAME, 'readwrite');
    for (const file of newFiles) {
      await tx.store.add(file);
    }
    await tx.done;

    setFiles(prev => [...prev, ...newFiles]);
  }, [db, currentPath]);

  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const size = 150;
          canvas.width = size;
          canvas.height = size;

          const scale = Math.max(size / img.width, size / img.height);
          const x = (size - img.width * scale) / 2;
          const y = (size - img.height * scale) / 2;

          ctx?.drawImage(img, x, y, img.width * scale, img.height * scale);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  const downloadFile = async (fileId: string) => {
    if (!db) return;
    const file = await db.get(STORE_NAME, fileId);
    if (file && file.content) {
      const blob = new Blob([file.content], { type: file.mimeType });
      saveAs(blob, file.name);
    }
  };

  const deleteFiles = async () => {
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    for (const fileId of selectedFiles) {
      await tx.store.delete(fileId);
    }
    await tx.done;
    setFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
    setSelectedFiles(new Set());
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return <Folder className="w-5 h-5" />;
    if (file.mimeType?.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (file.mimeType?.startsWith('video/')) return <Film className="w-5 h-5" />;
    if (file.mimeType?.startsWith('audio/')) return <MusicIcon className="w-5 h-5" />;
    if (file.mimeType?.startsWith('text/')) return <FileText className="w-5 h-5" />;
    return <FileIcon className="w-5 h-5" />;
  };

  const filteredFiles = files
    .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'date': return b.modifiedAt.getTime() - a.modifiedAt.getTime();
        case 'size': return b.size - a.size;
        default: return 0;
      }
    });

  return (
    <div {...getRootProps()} className="h-full flex flex-col bg-surface">
      <input {...getInputProps()} />
      
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-graphite/30">
        <Button size="sm" className="bg-electric-cyan/20">
          <Upload className="w-4 h-4 mr-1" />
          Upload
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={deleteFiles}
          disabled={selectedFiles.size === 0}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 h-8"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* File Grid/List */}
      <div className="flex-1 overflow-auto p-4">
        {isDragActive && (
          <div className="absolute inset-0 bg-electric-cyan/10 border-2 border-dashed border-electric-cyan flex items-center justify-center z-10">
            <div className="text-center">
              <Upload className="w-12 h-12 text-electric-cyan mx-auto mb-2" />
              <p className="text-chrome font-mono">Drop files here</p>
            </div>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className={`p-3 rounded border cursor-pointer transition-all ${
                  selectedFiles.has(file.id)
                    ? 'border-electric-cyan bg-electric-cyan/10'
                    : 'border-graphite/30 hover:border-electric-cyan/50'
                }`}
                onClick={() => {
                  const newSelected = new Set(selectedFiles);
                  if (newSelected.has(file.id)) {
                    newSelected.delete(file.id);
                  } else {
                    newSelected.add(file.id);
                  }
                  setSelectedFiles(newSelected);
                }}
              >
                <div className="aspect-square bg-surface-elevated rounded mb-2 flex items-center justify-center">
                  {file.thumbnail ? (
                    <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="text-steel">{getFileIcon(file)}</div>
                  )}
                </div>
                <p className="text-xs text-chrome truncate">{file.name}</p>
                <p className="text-xs text-steel">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                  selectedFiles.has(file.id)
                    ? 'bg-electric-cyan/10'
                    : 'hover:bg-surface-elevated'
                }`}
                onClick={() => {
                  const newSelected = new Set(selectedFiles);
                  if (newSelected.has(file.id)) {
                    newSelected.delete(file.id);
                  } else {
                    newSelected.add(file.id);
                  }
                  setSelectedFiles(newSelected);
                }}
              >
                <div className="text-steel">{getFileIcon(file)}</div>
                <span className="flex-1 text-sm text-chrome truncate">{file.name}</span>
                <span className="text-xs text-steel">{(file.size / 1024).toFixed(1)} KB</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(file.id);
                  }}
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Module Registration
fileManager: {
  id: "file-manager",
  title: "File Manager",
  icon: Folder,
  content: <FileManager />,
  position: { x: 220, y: 160 },
  size: { width: 900, height: 600 },
  subdomain: "files",
},
```

#### Integration Steps
1. Install: `npm install react-dropzone idb file-saver @tanstack/react-virtual`
2. Create component at `src/components/modules/FileManager.tsx`
3. Add to module registry
4. Configure IndexedDB storage quota
5. Optional: Add cloud sync with Supabase/S3

---

### 2.5 Real-Time Analytics Dashboard
**Module ID:** `analytics-dashboard`  
**Priority:** MEDIUM  
**Complexity:** Medium

#### Technical Specifications
```typescript
// Dependencies:
{
  "recharts": "^2.12.7",           // Already installed
  "@tanstack/react-query": "^5.56.2", // Already installed
  "date-fns": "^3.6.0",            // Already installed
  "zustand": "^4.4.0"              // State management
}
```

#### Implementation Plan
```typescript
// Location: src/components/modules/AnalyticsDashboard.tsx
import { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Activity, Users, Zap } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    totalModules: 0,
    performance: 0,
    uptime: 0,
  });

  const [timeSeriesData, setTimeSeriesData] = useState([
    { time: '00:00', users: 0, cpu: 0, memory: 0 },
  ]);

  useEffect(() => {
    // Simulate real-time data
    const interval = setInterval(() => {
      setMetrics({
        activeUsers: Math.floor(Math.random() * 100) + 50,
        totalModules: Math.floor(Math.random() * 20) + 10,
        performance: Math.floor(Math.random() * 30) + 70,
        uptime: 99.9,
      });

      setTimeSeriesData(prev => [
        ...prev.slice(-20),
        {
          time: new Date().toLocaleTimeString(),
          users: Math.floor(Math.random() * 100),
          cpu: Math.floor(Math.random() * 50) + 20,
          memory: Math.floor(Math.random() * 40) + 30,
        },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full overflow-auto bg-surface p-4">
      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Users', value: metrics.activeUsers, icon: Users, color: 'electric-cyan' },
          { label: 'Modules', value: metrics.totalModules, icon: Zap, color: 'electric-violet' },
          { label: 'Performance', value: `${metrics.performance}%`, icon: Activity, color: 'electric-amber' },
          { label: 'Uptime', value: `${metrics.uptime}%`, icon: TrendingUp, color: 'electric-green' },
        ].map((metric, idx) => (
          <div key={idx} className="bg-surface-elevated rounded-lg p-4 border border-graphite/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-steel uppercase">{metric.label}</span>
              <metric.icon className={`w-4 h-4 text-${metric.color}`} />
            </div>
            <div className="text-2xl font-mono text-chrome">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-elevated rounded-lg p-4 border border-graphite/30">
          <h3 className="text-sm font-mono text-chrome mb-4">User Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0A0A0A', 
                  border: '1px solid #374151',
                  borderRadius: '4px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#00D9FF" 
                fill="#00D9FF20" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface-elevated rounded-lg p-4 border border-graphite/30">
          <h3 className="text-sm font-mono text-chrome mb-4">System Resources</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0A0A0A', 
                  border: '1px solid #374151',
                  borderRadius: '4px'
                }}
              />
              <Line type="monotone" dataKey="cpu" stroke="#FFD700" strokeWidth={2} />
              <Line type="monotone" dataKey="memory" stroke="#9D00FF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Module Registration
analyticsDashboard: {
  id: "analytics-dashboard",
  title: "Analytics",
  icon: TrendingUp,
  content: <AnalyticsDashboard />,
  position: { x: 240, y: 180 },
  size: { width: 900, height: 600 },
  subdomain: "analytics",
},
```

---

## 3. Technical Stack & Dependencies

### 3.1 Core Dependencies (Existing)
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-rnd": "^10.5.2",
  "lucide-react": "^0.462.0",
  "@radix-ui/*": "Latest versions",
  "tailwindcss": "^3.4.11",
  "vite": "^5.4.1",
  "typescript": "^5.5.3"
}
```

### 3.2 New Dependencies Required
```json
{
  // Whiteboard
  "tldraw": "^2.0.0",
  "yjs": "^13.6.10",
  "y-websocket": "^1.5.0",
  
  // Code Editor
  "@monaco-editor/react": "^4.6.0",
  "monaco-editor": "^0.45.0",
  
  // Terminal
  "xterm": "^5.3.0",
  "xterm-addon-fit": "^0.8.0",
  "xterm-addon-web-links": "^0.9.0",
  
  // File Manager
  "react-dropzone": "^14.2.3",
  "idb": "^8.0.0",
  "file-saver": "^2.0.5",
  
  // State Management
  "zustand": "^4.4.0"
}
```

### 3.3 Vite Configuration Updates
```typescript
// Location: vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'monaco-editor',
      'xterm',
      'tldraw',
    ],
  },
  worker: {
    format: 'es',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'monaco': ['monaco-editor', '@monaco-editor/react'],
          'xterm': ['xterm', 'xterm-addon-fit'],
          'tldraw': ['tldraw', 'yjs'],
        },
      },
    },
  },
});
```

---

## 4. Integration Architecture

### 4.1 Module System Architecture
```
ModularInterface.tsx (Main Controller)
├── Module Registry (modules object - Line 191-645)
│   ├── Static Modules (defined inline)
│   └── Dynamic Modules (imported components)
├── Window Manager (react-rnd - Line 1015-1127)
├── State Manager (useState hooks - Line 647-680)
└── Event System (callbacks - Line 729-850)
```

### 4.2 Insertion Points Map

#### **Primary Insertion Point: Module Registry**
```typescript
// Location: Line ~645 in ModularInterface.tsx
const modules: Record<string, ModuleWindow> = {
  // ... existing modules ...
  
  // INSERT NEW MODULES HERE:
  collaborativeBoard: { /* ... */ },
  codeEditorPro: { /* ... */ },
  terminal: { /* ... */ },
  fileManager: { /* ... */ },
  analyticsDashboard: { /* ... */ },
};
```

#### **Secondary Insertion Points**

1. **Import Statements (Line 1-42)**
```typescript
// Add at line ~40
import { CollaborativeBoard } from '@/components/modules/CollaborativeBoard';
import { CodeEditorPro } from '@/components/modules/CodeEditorPro';
import { TerminalEmulator } from '@/components/modules/TerminalEmulator';
import { FileManager } from '@/components/modules/FileManager';
import { AnalyticsDashboard } from '@/components/modules/AnalyticsDashboard';
```

2. **FluidNavigation Items**
```typescript
// Location: src/components/FluidNavigation.tsx
// Add to navItems array
const navItems: NavItem[] = [
  // ... existing items ...
  {
    id: 'collaborative-board',
    label: 'WHITEBOARD',
    icon: <Palette className="w-5 h-5" />,
    description: 'Collaborative Whiteboard'
  },
  // ... more items
];
```

3. **Icon Imports**
```typescript
// Line ~1-40 in ModularInterface.tsx
import {
  // ... existing icons ...
  Terminal,
  Folder,
  // Add more as needed
} from "lucide-react";
```

### 4.3 Data Flow Architecture
```
User Interaction
    ↓
openModule(moduleId) [Line 729]
    ↓
State Updates (setActiveModules, setModulePositions, etc.)
    ↓
React Re-render
    ↓
Module Window Rendered (Rnd component - Line 1015)
    ↓
Module Content Rendered (module.content)
```

---

## 5. Code Implementation Plans

### 5.1 Step-by-Step Integration Process

#### Phase 1: Setup (Estimated: 2 hours)
```bash
# 1. Install dependencies
npm install tldraw yjs y-websocket @monaco-editor/react monaco-editor xterm xterm-addon-fit react-dropzone idb file-saver zustand

# 2. Create module directories
mkdir -p src/components/modules
mkdir -p src/lib/stores
mkdir -p src/lib/utils/modules

# 3. Update TypeScript config if needed
# Ensure "skipLibCheck": true for monaco-editor
```

#### Phase 2: Component Creation (Estimated: 8 hours)
```typescript
// Create files in order:
// 1. src/components/modules/CollaborativeBoard.tsx
// 2. src/components/modules/CodeEditorPro.tsx
// 3. src/components/modules/TerminalEmulator.tsx
// 4. src/components/modules/FileManager.tsx
// 5. src/components/modules/AnalyticsDashboard.tsx
```

#### Phase 3: Module Registration (Estimated: 1 hour)
```typescript
// Location: ModularInterface.tsx

// Step 1: Add imports (after line 40)
import { CollaborativeBoard } from '@/components/modules/CollaborativeBoard';
import { CodeEditorPro } from '@/components/modules/CodeEditorPro';
import { TerminalEmulator } from '@/components/modules/TerminalEmulator';
import { FileManager } from '@/components/modules/FileManager';
import { AnalyticsDashboard } from '@/components/modules/AnalyticsDashboard';
import { Terminal, Folder } from 'lucide-react';

// Step 2: Register modules (insert at line ~645, before closing brace)
const modules: Record<string, ModuleWindow> = {
  // ... existing modules ...
  
  collaborativeBoard: {
    id: "collaborative-board",
    title: "Whiteboard",
    icon: Palette,
    content: <CollaborativeBoard roomId="default" userId={user?.name || 'guest'} />,
    position: { x: 150, y: 100 },
    size: { width: 900, height: 650 },
    subdomain: "board",
  },
  codeEditorPro: {
    id: "code-editor-pro",
    title: "Code Editor Pro",
    icon: Code,
    content: <CodeEditorPro />,
    position: { x: 200, y: 120 },
    size: { width: 1000, height: 700 },
    subdomain: "code",
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    icon: Terminal,
    content: <TerminalEmulator />,
    position: { x: 180, y: 140 },
    size: { width: 800, height: 500 },
    subdomain: "terminal",
  },
  fileManager: {
    id: "file-manager",
    title: "Files",
    icon: Folder,
    content: <FileManager />,
    position: { x: 220, y: 160 },
    size: { width: 900, height: 600 },
    subdomain: "files",
  },
  analyticsDashboard: {
    id: "analytics-dashboard",
    title: "Analytics",
    icon: TrendingUp,
    content: <AnalyticsDashboard />,
    position: { x: 240, y: 180 },
    size: { width: 900, height: 600 },
    subdomain: "analytics",
  },
};
```

#### Phase 4: Navigation Updates (Estimated: 30 minutes)
```typescript
// Location: src/components/FluidNavigation.tsx
// Add to navItems array (around line 30-100)

const navItems: NavItem[] = [
  // ... existing items ...
  {
    id: 'collaborative-board',
    label: 'WHITEBOARD',
    icon: <Palette className="w-5 h-5" />,
    description: 'Collaborative Drawing'
  },
  {
    id: 'code-editor-pro',
    label: 'CODE PRO',
    icon: <Code className="w-5 h-5" />,
    description: 'Advanced Code Editor'
  },
  {
    id: 'terminal',
    label: 'TERMINAL',
    icon: <Terminal className="w-5 h-5" />,
    description: 'Terminal Emulator'
  },
  {
    id: 'file-manager',
    label: 'FILES',
    icon: <Folder className="w-5 h-5" />,
    description: 'File Manager'
  },
  {
    id: 'analytics-dashboard',
    label: 'ANALYTICS',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'System Analytics'
  },
];
```

### 5.2 Styling Integration

#### Custom CSS Additions
```css
/* Location: src/index.css or src/App.css */

/* Monaco Editor Dark Theme */
.monaco-editor .margin {
  background-color: #0A0A0A !important;
}

/* XTerm Terminal Customization */
.xterm {
  padding: 8px;
}

.xterm .xterm-viewport::-webkit-scrollbar {
  width: 8px;
}

.xterm .xterm-viewport::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}

/* TLDraw Custom Theme */
.tldraw-custom-theme {
  --color-background: #0A0A0A;
  --color-panel: #1A1A1A;
  --color-text: #E0E0E0;
}

/* File Manager Drag Active */
.file-manager-drag-active {
  border: 2px dashed #00D9FF;
  background: rgba(0, 217, 255, 0.05);
}
```

---

## 6. State Management Strategy

### 6.1 Current State Architecture
```typescript
// Location: ModularInterface.tsx - Lines 647-680
const [activeModules, setActiveModules] = useState<string[]>([]);
const [maximizedModule, setMaximizedModule] = useState<string | null>(null);
const [modulePositions, setModulePositions] = useState<Record<string, Position>>({});
const [moduleZIndexes, setModuleZIndexes] = useState<Record<string, number>>({});
```

### 6.2 Enhanced State Management with Zustand

#### Create Global Store
```typescript
// Location: src/lib/stores/moduleStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModuleState {
  // Module state
  activeModules: string[];
  maximizedModule: string | null;
  modulePositions: Record<string, { x: number; y: number; width: number; height: number }>;
  moduleZIndexes: Record<string, number>;
  
  // Actions
  openModule: (moduleId: string) => void;
  closeModule: (moduleId: string) => void;
  maximizeModule: (moduleId: string) => void;
  updateModulePosition: (moduleId: string, position: any) => void;
  bringToFront: (moduleId: string) => void;
  
  // Persistence
  saveLayout: () => void;
  loadLayout: () => void;
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      activeModules: [],
      maximizedModule: null,
      modulePositions: {},
      moduleZIndexes: {},
      
      openModule: (moduleId) => {
        const state = get();
        if (!state.activeModules.includes(moduleId)) {
          set({ 
            activeModules: [...state.activeModules, moduleId],
            moduleZIndexes: {
              ...state.moduleZIndexes,
              [moduleId]: Math.max(...Object.values(state.moduleZIndexes), 100) + 1
            }
          });
        }
      },
      
      closeModule: (moduleId) => {
        set((state) => ({
          activeModules: state.activeModules.filter(id => id !== moduleId),
          maximizedModule: state.maximizedModule === moduleId ? null : state.maximizedModule,
        }));
      },
      
      maximizeModule: (moduleId) => {
        set((state) => ({
          maximizedModule: state.maximizedModule === moduleId ? null : moduleId,
        }));
      },
      
      updateModulePosition: (moduleId, position) => {
        set((state) => ({
          modulePositions: {
            ...state.modulePositions,
            [moduleId]: position,
          },
        }));
      },
      
      bringToFront: (moduleId) => {
        set((state) => ({
          moduleZIndexes: {
            ...state.moduleZIndexes,
            [moduleId]: Math.max(...Object.values(state.moduleZIndexes), 100) + 1,
          },
        }));
      },
      
      saveLayout: () => {
        // Automatically handled by persist middleware
      },
      
      loadLayout: () => {
        // Automatically handled by persist middleware
      },
    }),
    {
      name: 'futuraa-module-storage',
      version: 1,
    }
  )
);
```

### 6.3 Migration Strategy
```typescript
// Option 1: Gradual migration (recommended)
// Keep existing useState, slowly migrate to Zustand

// Option 2: Full migration
// Replace all useState with useModuleStore
// Update all state access points
```

---

## 7. Performance Optimization

### 7.1 Code Splitting
```typescript
// Location: ModularInterface.tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy modules
const CollaborativeBoard = lazy(() => import('@/components/modules/CollaborativeBoard'));
const CodeEditorPro = lazy(() => import('@/components/modules/CodeEditorPro'));
const TerminalEmulator = lazy(() => import('@/components/modules/TerminalEmulator'));

// Wrap in Suspense
const LazyModule = ({ module }: { module: ModuleWindow }) => (
  <Suspense fallback={
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full" />
    </div>
  }>
    {module.content}
  </Suspense>
);
```

### 7.2 Virtual Scrolling for Large Lists
```typescript
// For FileManager and similar modules
import { useVirtualizer } from '@tanstack/react-virtual';

const FileList = ({ files }: { files: FileItem[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: files.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });
  
  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <FileItem file={files[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 7.3 Memoization Strategy
```typescript
// Memoize expensive computations
import { useMemo, useCallback } from 'react';

// In ModularInterface.tsx
const sortedModules = useMemo(() => {
  return Object.values(modules).sort((a, b) => 
    a.title.localeCompare(b.title)
  );
}, [modules]);

const handleModuleOpen = useCallback((moduleId: string) => {
  openModule(moduleId);
}, [openModule]);
```

### 7.4 IndexedDB Optimization
```typescript
// Batch operations for better performance
const batchSaveFiles = async (files: FileItem[]) => {
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const promises = files.map(file => tx.store.put(file));
  await Promise.all([...promises, tx.done]);
};
```

---

## 8. Security Considerations

### 8.1 Iframe Sandbox Security
```typescript
// All iframe modules should use restrictive sandbox attributes
<iframe
  src="https://external-service.com"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  referrerPolicy="no-referrer"
  allow="clipboard-read; clipboard-write"
  title="Module Name"
/>

// Avoid: sandbox="allow-scripts allow-same-origin allow-top-navigation"
// This combination can escape the sandbox
```

### 8.2 Content Security Policy
```typescript
// Location: index.html or server configuration
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://chat.quazfenton.xyz;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' wss: https:;
  frame-src https://chat.quazfenton.xyz https://quazfenton.github.io;
  worker-src 'self' blob:;
">
```

### 8.3 Code Execution Sanitization
```typescript
// For CodeEditorPro module - sanitize eval()
const safeEval = (code: string) => {
  try {
    // Create isolated scope
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const func = new AsyncFunction('console', code);
    
    // Provide limited console
    const limitedConsole = {
      log: (...args: any[]) => console.log('[Sandbox]', ...args),
      error: (...args: any[]) => console.error('[Sandbox]', ...args),
      warn: (...args: any[]) => console.warn('[Sandbox]', ...args),
    };
    
    return func(limitedConsole);
  } catch (error) {
    console.error('Execution error:', error);
    return null;
  }
};
```

### 8.4 File Upload Validation
```typescript
// For FileManager module
const validateFile = (file: File): { valid: boolean; error?: string } => {
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/html',
    'application/json', 'text/javascript', 'text/css',
  ];
  
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File too large (max 50MB)' };
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }
  
  return { valid: true };
};
```

### 8.5 XSS Prevention
```typescript
// Sanitize user input in all modules
import DOMPurify from 'dompurify';

const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};
```

---

## 9. Implementation Roadmap

### 9.1 Phase 1: Foundation (Week 1)
**Priority:** Critical  
**Estimated Time:** 5-7 days

#### Tasks:
1. **Dependency Installation & Configuration**
   - [ ] Install all required npm packages
   - [ ] Update Vite configuration for Monaco, XTerm
   - [ ] Configure TypeScript for new libraries
   - [ ] Test build process

2. **Project Structure Setup**
   - [ ] Create `/src/components/modules/` directory
   - [ ] Create `/src/lib/stores/` directory
   - [ ] Create `/src/lib/utils/modules/` directory
   - [ ] Set up module templates

3. **State Management Migration**
   - [ ] Install Zustand
   - [ ] Create `moduleStore.ts`
   - [ ] Set up persistence middleware
   - [ ] Test state synchronization

**Deliverables:**
- ✅ All dependencies installed without conflicts
- ✅ Build process working with new libraries
- ✅ Basic Zustand store operational

---

### 9.2 Phase 2: Core Module Development (Week 2-3)
**Priority:** High  
**Estimated Time:** 10-14 days

#### Module 1: Code Editor Pro (3 days)
- [ ] Day 1: Basic Monaco integration, theme setup
- [ ] Day 2: Multi-file support, tab system
- [ ] Day 3: Toolbar, save/load, execution sandbox

#### Module 2: Terminal Emulator (3 days)
- [ ] Day 1: XTerm integration, basic shell
- [ ] Day 2: Multi-tab support, command parser
- [ ] Day 3: Search, copy/paste, themes

#### Module 3: Collaborative Whiteboard (4 days)
- [ ] Day 1: TLDraw basic integration
- [ ] Day 2: Yjs CRDT setup
- [ ] Day 3: WebSocket provider, multi-user
- [ ] Day 4: Persistence, export features

#### Module 4: File Manager (3 days)
- [ ] Day 1: IndexedDB setup, drag-drop
- [ ] Day 2: File operations, thumbnails
- [ ] Day 3: Search, filters, sorting

#### Module 5: Analytics Dashboard (1 day)
- [ ] Day 1: Charts, real-time data, metrics

**Deliverables:**
- ✅ 5 fully functional modules
- ✅ Each module tested independently
- ✅ Documentation for each module

---

### 9.3 Phase 3: Integration (Week 4)
**Priority:** High  
**Estimated Time:** 5-7 days

#### Tasks:
1. **Module Registration**
   - [ ] Add all modules to registry
   - [ ] Update imports in ModularInterface
   - [ ] Configure default positions/sizes
   - [ ] Add icons to navigation

2. **FluidNavigation Updates**
   - [ ] Add navigation items
   - [ ] Update icons and descriptions
   - [ ] Test navigation flow

3. **Styling Integration**
   - [ ] Ensure cyber-dark theme consistency
   - [ ] Custom CSS for each module
   - [ ] Responsive design adjustments
   - [ ] Animation refinements

4. **Cross-Module Communication**
   - [ ] Implement event bus if needed
   - [ ] Set up module messaging
   - [ ] Test inter-module interactions

**Deliverables:**
- ✅ All modules accessible from UI
- ✅ Consistent visual design
- ✅ Smooth module interactions

---

### 9.4 Phase 4: Enhancement & Polish (Week 5)
**Priority:** Medium  
**Estimated Time:** 5-7 days

#### Tasks:
1. **Performance Optimization**
   - [ ] Implement lazy loading
   - [ ] Add virtual scrolling where needed
   - [ ] Optimize re-renders with useMemo/useCallback
   - [ ] Bundle size analysis and optimization

2. **User Experience**
   - [ ] Add keyboard shortcuts
   - [ ] Improve drag-and-drop feedback
   - [ ] Loading states and skeletons
   - [ ] Error boundaries and fallbacks

3. **Persistence & Sessions**
   - [ ] Save workspace layouts
   - [ ] Restore open modules on reload
   - [ ] Export/import configurations
   - [ ] Cloud sync (optional)

4. **Accessibility**
   - [ ] ARIA labels for all interactive elements
   - [ ] Keyboard navigation
   - [ ] Screen reader support
   - [ ] Focus management

**Deliverables:**
- ✅ Optimized bundle size
- ✅ Smooth 60fps interactions
- ✅ Persistent workspace state
- ✅ WCAG 2.1 AA compliance

---

### 9.5 Phase 5: Testing & Deployment (Week 6)
**Priority:** Critical  
**Estimated Time:** 5-7 days

#### Tasks:
1. **Comprehensive Testing** (See Section 10)
   - [ ] Unit tests for each module
   - [ ] Integration tests
   - [ ] E2E tests
   - [ ] Performance benchmarks

2. **Documentation**
   - [ ] API documentation
   - [ ] User guides for each module
   - [ ] Developer setup instructions
   - [ ] Architecture diagrams

3. **Deployment**
   - [ ] Build production bundle
   - [ ] Set up CI/CD pipeline
   - [ ] Configure hosting
   - [ ] SSL/security setup

4. **Monitoring**
   - [ ] Error tracking (Sentry)
   - [ ] Analytics (Plausible/Fathom)
   - [ ] Performance monitoring
   - [ ] User feedback system

**Deliverables:**
- ✅ 90%+ test coverage
- ✅ Complete documentation
- ✅ Production deployment
- ✅ Monitoring dashboard

---

## 10. Testing Strategy

### 10.1 Unit Testing
```typescript
// Location: src/components/modules/__tests__/CodeEditorPro.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeEditorPro } from '../CodeEditorPro';

describe('CodeEditorPro', () => {
  it('renders editor with default content', () => {
    render(<CodeEditorPro />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('handles file creation', () => {
    render(<CodeEditorPro />);
    const newFileBtn = screen.getByText('+');
    fireEvent.click(newFileBtn);
    expect(screen.getByText('untitled-2.js')).toBeInTheDocument();
  });

  it('saves file correctly', () => {
    const { getByTestId } = render(<CodeEditorPro />);
    const saveBtn = getByTestId('save-button');
    fireEvent.click(saveBtn);
    // Assert download triggered
  });
});
```

### 10.2 Integration Testing
```typescript
// Location: src/__tests__/integration/ModularInterface.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ModularInterface } from '@/components/ModularInterface';

describe('ModularInterface Integration', () => {
  it('opens and closes modules correctly', async () => {
    render(<ModularInterface />);
    
    // Open code editor
    const codeEditorBtn = screen.getByTitle('Code Editor Pro');
    fireEvent.click(codeEditorBtn);
    
    expect(screen.getByText('Code Editor Pro')).toBeInTheDocument();
    
    // Close module
    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);
    
    expect(screen.queryByText('Code Editor Pro')).not.toBeInTheDocument();
  });

  it('persists module positions', async () => {
    const { rerender } = render(<ModularInterface />);
    
    // Open and move module
    const moduleBtn = screen.getByTitle('Terminal');
    fireEvent.click(moduleBtn);
    
    // Simulate drag (implementation depends on react-rnd testing)
    // ...
    
    // Reload component
    rerender(<ModularInterface />);
    
    // Assert position is restored
    // ...
  });
});
```

### 10.3 E2E Testing with Playwright
```typescript
// Location: e2e/modular-interface.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Modular Interface E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('complete workflow: open multiple modules', async ({ page }) => {
    // Open code editor
    await page.click('[title="Code Editor Pro"]');
    await expect(page.locator('text=Code Editor Pro')).toBeVisible();

    // Open terminal
    await page.click('[title="Terminal"]');
    await expect(page.locator('text=Terminal')).toBeVisible();

    // Verify both are open
    const modules = await page.locator('.module-window').count();
    expect(modules).toBe(2);

    // Drag module
    await page.locator('text=Code Editor Pro').dragTo(
      page.locator('body'),
      { targetPosition: { x: 400, y: 300 } }
    );

    // Maximize module
    await page.dblclick('[data-drag-handle]');
    await expect(page.locator('.maximized-module')).toBeVisible();
  });

  test('code editor: write and execute code', async ({ page }) => {
    await page.click('[title="Code Editor Pro"]');
    
    // Type code
    await page.locator('.monaco-editor').click();
    await page.keyboard.type('console.log("Hello World");');
    
    // Run code
    await page.click('button:has-text("Run")');
    
    // Check console output
    const logs = await page.evaluate(() => console.log);
    // Assert output
  });

  test('file manager: upload and download files', async ({ page }) => {
    await page.click('[title="Files"]');
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-fixtures/sample.txt');
    
    // Verify file appears
    await expect(page.locator('text=sample.txt')).toBeVisible();
    
    // Download file
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Download")'),
    ]);
    
    expect(download.suggestedFilename()).toBe('sample.txt');
  });

  test('responsive: mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile-friendly layout
    await page.click('[title="Code Editor Pro"]');
    const module = page.locator('.module-window');
    const box = await module.boundingBox();
    
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});
```

### 10.4 Performance Testing
```typescript
// Location: src/__tests__/performance/ModularInterface.perf.test.tsx
import { render } from '@testing-library/react';
import { ModularInterface } from '@/components/ModularInterface';

describe('Performance Tests', () => {
  it('renders under 100ms', () => {
    const start = performance.now();
    render(<ModularInterface />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100);
  });

  it('handles 10 open modules without lag', async () => {
    const { getByTitle } = render(<ModularInterface />);
    
    const moduleIds = [
      'Code Editor Pro', 'Terminal', 'Files',
      'Whiteboard', 'Analytics', 'Gallery',
      'Music', 'Video', 'Journal', 'Notes'
    ];
    
    const start = performance.now();
    
    for (const id of moduleIds) {
      getByTitle(id).click();
    }
    
    const end = performance.now();
    expect(end - start).toBeLessThan(1000);
  });

  it('bundle size is under 1MB (gzipped)', async () => {
    // Run build and check dist size
    // This would be in a separate script
  });
});
```

### 10.5 Test Coverage Goals
- **Unit Tests:** 85%+ coverage
- **Integration Tests:** All critical user flows
- **E2E Tests:** 10+ scenarios covering main features
- **Performance:** <100ms initial render, <16ms interactions

---

## 11. Conclusion & Next Steps

### 11.1 Summary
This technical planning document provides a comprehensive roadmap for integrating advanced modular features into the Futuraa ModularInterface component. The proposed modules include:

1. **Collaborative Whiteboard** - Real-time drawing with TLDraw + Yjs
2. **Code Editor Pro** - Monaco-based editor with LSP support
3. **Terminal Emulator** - Full XTerm.js implementation
4. **File Manager** - IndexedDB-backed file system
5. **Analytics Dashboard** - Real-time metrics visualization

### 11.2 Key Benefits
- ✅ Enhanced functionality without breaking existing design
- ✅ Modular architecture allows easy addition/removal
- ✅ Performance-optimized with lazy loading and code splitting
- ✅ Secure implementation with sandboxing and CSP
- ✅ Comprehensive testing strategy

### 11.3 Immediate Next Steps
1. Review and approve this technical plan
2. Set up development environment with new dependencies
3. Create branch: `feature/advanced-modules`
4. Begin Phase 1: Foundation setup
5. Implement one module as proof-of-concept
6. Iterate based on feedback

### 11.4 Risk Mitigation
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Dependency conflicts | Medium | High | Test in isolated branch first |
| Bundle size bloat | High | Medium | Implement code splitting, lazy loading |
| Performance degradation | Medium | High | Continuous performance monitoring |
| Browser compatibility | Low | Medium | Polyfills, feature detection |
| Security vulnerabilities | Low | Critical | Regular security audits, CSP |

### 11.5 Success Metrics
- [ ] All 5 modules functional and integrated
- [ ] Bundle size < 1MB gzipped
- [ ] Page load < 2 seconds
- [ ] Test coverage > 85%
- [ ] Zero critical security issues
- [ ] Lighthouse score > 90
- [ ] No breaking changes to existing functionality

### 11.6 Future Enhancements
- WebRTC-based video chat module
- AI assistant integration
- Database query builder
- 3D visualization module
- Real-time collaboration for all modules
- Mobile app (React Native)
- Desktop app (Electron)
- Plugin system for community modules

---

## Appendix A: File Structure After Implementation

```
futuraa/
├── src/
│   ├── components/
│   │   ├── modules/
│   │   │   ├── CollaborativeBoard.tsx
│   │   │   ├── CodeEditorPro.tsx
│   │   │   ├── TerminalEmulator.tsx
│   │   │   ├── FileManager.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   └── __tests__/
│   │   │       ├── CollaborativeBoard.test.tsx
│   │   │       ├── CodeEditorPro.test.tsx
│   │   │       ├── TerminalEmulator.test.tsx
│   │   │       ├── FileManager.test.tsx
│   │   │       └── AnalyticsDashboard.test.tsx
│   │   ├── ModularInterface.tsx
│   │   ├── FluidNavigation.tsx
│   │   └── ui/
│   ├── lib/
│   │   ├── stores/
│   │   │   ├── moduleStore.ts
│   │   │   └── __tests__/
│   │   │       └── moduleStore.test.ts
│   │   └── utils/
│   │       └── modules/
│   │           ├── security.ts
│   │           ├── persistence.ts
│   │           └── validation.ts
│   └── styles/
│       ├── modules.css
│       └── themes.css
├── e2e/
│   ├── modular-interface.spec.ts
│   ├── code-editor.spec.ts
│   └── file-manager.spec.ts
├── docs/
│   ├── MODULES.md
│   ├── API.md
│   └── CONTRIBUTING.md
└── package.json (updated with new dependencies)
```

---

## Appendix B: Quick Reference - Integration Checklist

### Pre-Integration Checklist
- [ ] Read entire technical planning document
- [ ] Review existing ModularInterface.tsx code
- [ ] Backup current working version
- [ ] Create feature branch
- [ ] Install all required dependencies
- [ ] Verify build process works

### Module Integration Checklist (Per Module)
- [ ] Create module component file
- [ ] Implement core functionality
- [ ] Add unit tests (85%+ coverage)
- [ ] Write integration tests
- [ ] Add to module registry in ModularInterface.tsx
- [ ] Update FluidNavigation.tsx
- [ ] Add custom styling if needed
- [ ] Test in isolation
- [ ] Test with other modules
- [ ] Document usage
- [ ] Optimize performance
- [ ] Security audit
- [ ] Accessibility check
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Add to deployment pipeline

### Post-Integration Checklist
- [ ] Full E2E test suite passes
- [ ] Performance benchmarks met
- [ ] Bundle size within limits
- [ ] All linting passes
- [ ] TypeScript compiles without errors
- [ ] Security scan passes
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Code review completed
- [ ] Merge to main branch
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Deploy to production
- [ ] Monitor for issues

---

**Document Status:** ✅ Complete  
**Last Updated:** 2024  
**Maintained By:** Futuraa Development Team  
**Version:** 1.0.0  
**Next Review:** After Phase 1 Completion

---

*This document serves as the definitive technical specification for advanced module integration. All implementation should follow these guidelines to ensure consistency, quality, and maintainability.*