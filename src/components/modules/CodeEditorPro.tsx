import { useState, useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import {
  Play,
  Save,
  Download,
  Upload,
  Plus,
  X,
  Settings,
  FileText,
  Code2,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface File {
  id: string;
  name: string;
  language: string;
  content: string;
  path: string;
}

interface OutputLog {
  type: "log" | "error" | "warn" | "info";
  message: string;
  timestamp: Date;
}

const LANGUAGE_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  html: "html",
  css: "css",
  json: "json",
  md: "markdown",
  txt: "plaintext",
};

const getLanguageFromFilename = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase() || "txt";
  return LANGUAGE_MAP[ext] || "plaintext";
};

export const CodeEditorPro = () => {
  const [files, setFiles] = useState<File[]>([
    {
      id: "1",
      name: "index.js",
      language: "javascript",
      content:
        '// Welcome to Code Editor Pro\n// Start coding...\n\nconsole.log("Hello, Futuraa!");',
      path: "/index.js",
    },
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [outputLogs, setOutputLogs] = useState<OutputLog[]>([]);
  const [showOutput, setShowOutput] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define custom cyber-dark theme
    monaco.editor.defineTheme("cyber-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6B7280", fontStyle: "italic" },
        { token: "keyword", foreground: "00D9FF", fontStyle: "bold" },
        { token: "string", foreground: "FFD700" },
        { token: "number", foreground: "FF0080" },
        { token: "function", foreground: "9D00FF" },
        { token: "variable", foreground: "E0E0E0" },
        { token: "type", foreground: "00FF88" },
        { token: "class", foreground: "9D00FF" },
        { token: "operator", foreground: "00D9FF" },
      ],
      colors: {
        "editor.background": "#0A0A0A",
        "editor.foreground": "#E0E0E0",
        "editorLineNumber.foreground": "#4B5563",
        "editor.selectionBackground": "#00D9FF33",
        "editor.lineHighlightBackground": "#1A1A1A",
        "editorCursor.foreground": "#00D9FF",
        "editor.findMatchBackground": "#FFD70033",
        "editor.findMatchHighlightBackground": "#FFD70022",
        "editorWidget.background": "#1A1A1A",
        "editorWidget.border": "#374151",
        "editorSuggestWidget.background": "#0A0A0A",
        "editorSuggestWidget.border": "#374151",
        "editorSuggestWidget.selectedBackground": "#00D9FF33",
      },
    });
    monaco.editor.setTheme("cyber-dark");

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      saveFile();
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFiles((prev) =>
        prev.map((file, idx) =>
          idx === activeFileIndex ? { ...file, content: value } : file,
        ),
      );
    }
  };

  const addLog = (type: OutputLog["type"], message: string) => {
    setOutputLogs((prev) => [
      ...prev,
      { type, message, timestamp: new Date() },
    ]);
  };

  const runCode = () => {
    const activeFile = files[activeFileIndex];
    setShowOutput(true);
    setOutputLogs([]);

    if (activeFile.language === "javascript") {
      try {
        // Create sandboxed console
        const consoleProxy = {
          log: (...args: unknown[]) =>
            addLog("log", args.map(String).join(" ")),
          error: (...args: unknown[]) =>
            addLog("error", args.map(String).join(" ")),
          warn: (...args: unknown[]) =>
            addLog("warn", args.map(String).join(" ")),
          info: (...args: unknown[]) =>
            addLog("info", args.map(String).join(" ")),
        };

        // Execute in isolated scope
        const func = new Function("console", activeFile.content);
        func(consoleProxy);
        addLog("info", "✓ Execution completed");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        addLog("error", `✗ ${errorMessage}`);
      }
    } else {
      addLog("warn", `Execution not supported for ${activeFile.language}`);
    }
  };

  const saveFile = () => {
    const activeFile = files[activeFileIndex];
    const blob = new Blob([activeFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
    addLog("info", `Saved ${activeFile.name}`);
  };

  const addNewFile = () => {
    const fileNumber = files.length + 1;
    const newFile: File = {
      id: Date.now().toString(),
      name: `untitled-${fileNumber}.js`,
      language: "javascript",
      content: "// New file\n",
      path: `/untitled-${fileNumber}.js`,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileIndex(files.length);
  };

  const closeFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length === 1) return; // Keep at least one file

    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    if (activeFileIndex >= index && activeFileIndex > 0) {
      setActiveFileIndex(activeFileIndex - 1);
    }
  };

  const renameFile = (index: number) => {
    const newName = prompt("Enter new filename:", files[index].name);
    if (newName && newName.trim()) {
      const language = getLanguageFromFilename(newName);
      setFiles((prev) =>
        prev.map((file, idx) =>
          idx === index ? { ...file, name: newName, language } : file,
        ),
      );
    }
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const language = getLanguageFromFilename(file.name);
      const newFile: File = {
        id: Date.now().toString(),
        name: file.name,
        language,
        content,
        path: `/${file.name}`,
      };
      setFiles((prev) => [...prev, newFile]);
      setActiveFileIndex(files.length);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = async () => {
    const activeFile = files[activeFileIndex];
    await navigator.clipboard.writeText(activeFile.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
    }
  };

  const getLogIcon = (type: OutputLog["type"]) => {
    switch (type) {
      case "error":
        return "✗";
      case "warn":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "›";
    }
  };

  const getLogColor = (type: OutputLog["type"]) => {
    switch (type) {
      case "error":
        return "text-electric-crimson";
      case "warn":
        return "text-electric-amber";
      case "info":
        return "text-electric-cyan";
      default:
        return "text-steel";
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-2 bg-surface border-b border-graphite/30 overflow-x-auto">
        {files.map((file, idx) => (
          <button
            key={file.id}
            onClick={() => setActiveFileIndex(idx)}
            onDoubleClick={() => renameFile(idx)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded transition-all whitespace-nowrap ${
              idx === activeFileIndex
                ? "bg-electric-cyan/20 text-chrome border border-electric-cyan/50"
                : "text-steel hover:bg-surface-elevated hover:text-chrome"
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>{file.name}</span>
            {files.length > 1 && (
              <X
                className="w-3 h-3 hover:text-electric-crimson"
                onClick={(e) => closeFile(idx, e)}
              />
            )}
          </button>
        ))}
        <button
          onClick={addNewFile}
          className="px-2 py-1 text-steel hover:text-chrome transition-colors"
          title="New File"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-surface border-b border-graphite/30">
        <Button
          size="sm"
          onClick={runCode}
          className="bg-electric-cyan/20 hover:bg-electric-cyan/30 border border-electric-cyan/50"
          disabled={files[activeFileIndex].language !== "javascript"}
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
        <Button
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
          className="hover:bg-surface-elevated"
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 mr-1 text-electric-green" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={uploadFile}
          className="hidden"
          accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.json,.md,.txt"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          className="hover:bg-surface-elevated"
        >
          <Upload className="w-3 h-3 mr-1" />
          Upload
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={formatCode}
          className="hover:bg-surface-elevated"
        >
          <Code2 className="w-3 h-3 mr-1" />
          Format
        </Button>
        <div className="flex-1" />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowOutput(!showOutput)}
          className={`hover:bg-surface-elevated ${showOutput ? "text-electric-cyan" : ""}`}
        >
          Output {showOutput && `(${outputLogs.length})`}
        </Button>
        <div className="text-xs text-steel font-mono px-2 py-1 bg-surface-elevated rounded">
          {files[activeFileIndex].language.toUpperCase()}
        </div>
      </div>

      {/* Editor and Output Split */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor */}
        <div className={`${showOutput ? "h-2/3" : "h-full"} transition-all`}>
          <Editor
            height="100%"
            language={files[activeFileIndex].language}
            value={files[activeFileIndex].content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="cyber-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 13,
              fontFamily: "'Fira Code', 'Courier New', monospace",
              fontLigatures: true,
              lineNumbers: "on",
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              padding: { top: 10, bottom: 10 },
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
            }}
          />
        </div>

        {/* Output Console */}
        {showOutput && (
          <div className="h-1/3 border-t border-graphite/30 bg-surface flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-graphite/30">
              <span className="text-xs font-mono text-chrome">
                OUTPUT CONSOLE
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setOutputLogs([])}
                  className="h-6 px-2"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowOutput(false)}
                  className="h-6 px-2"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2 font-mono text-xs space-y-1">
              {outputLogs.length === 0 ? (
                <div className="text-steel italic">
                  No output yet. Run your code to see results.
                </div>
              ) : (
                outputLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 ${getLogColor(log.type)}`}
                  >
                    <span className="opacity-60">{getLogIcon(log.type)}</span>
                    <span className="flex-1">{log.message}</span>
                    <span className="text-xs opacity-40">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
