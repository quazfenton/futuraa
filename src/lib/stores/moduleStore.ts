import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModulePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ModuleState {
  // State
  activeModules: string[];
  maximizedModule: string | null;
  modulePositions: Record<string, ModulePosition>;
  moduleZIndexes: Record<string, number>;
  lastOpenedModule: string | null;
  maxZIndex: number;

  // Actions
  openModule: (moduleId: string, defaultPosition?: ModulePosition) => void;
  closeModule: (moduleId: string) => void;
  toggleMaximize: (moduleId: string, currentPosition?: ModulePosition) => void;
  updateModulePosition: (moduleId: string, position: ModulePosition) => void;
  bringToFront: (moduleId: string) => void;
  closeAllModules: () => void;
  restoreLayout: () => void;
  isModuleOpen: (moduleId: string) => boolean;
  getModulePosition: (moduleId: string) => ModulePosition | undefined;
}

const generateRandomPosition = (): { x: number; y: number } => {
  const padding = 50;
  const maxX = window.innerWidth - 400 - padding;
  const maxY = window.innerHeight - 300 - padding;
  return {
    x: padding + Math.random() * Math.max(maxX - padding, 0),
    y: padding + Math.random() * Math.max(maxY - padding, 0),
  };
};

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeModules: [],
      maximizedModule: null,
      modulePositions: {},
      moduleZIndexes: {},
      lastOpenedModule: null,
      maxZIndex: 100,

      // Open a module
      openModule: (moduleId, defaultPosition) => {
        const state = get();

        if (state.activeModules.includes(moduleId)) {
          // If already open, just bring to front
          get().bringToFront(moduleId);
          return;
        }

        const randomPos = generateRandomPosition();
        const position = defaultPosition || {
          ...randomPos,
          width: 800,
          height: 600,
        };

        set({
          activeModules: [...state.activeModules, moduleId],
          modulePositions: {
            ...state.modulePositions,
            [moduleId]: state.modulePositions[moduleId] || position,
          },
          moduleZIndexes: {
            ...state.moduleZIndexes,
            [moduleId]: state.maxZIndex + 1,
          },
          lastOpenedModule: moduleId,
          maxZIndex: state.maxZIndex + 1,
        });
      },

      // Close a module
      closeModule: (moduleId) => {
        const state = get();
        set({
          activeModules: state.activeModules.filter((id) => id !== moduleId),
          maximizedModule: state.maximizedModule === moduleId ? null : state.maximizedModule,
        });
      },

      // Toggle maximize state
      toggleMaximize: (moduleId, currentPosition) => {
        const state = get();

        if (state.maximizedModule === moduleId) {
          // Restore from maximized
          set({ maximizedModule: null });
        } else {
          // Maximize
          if (currentPosition) {
            set({
              modulePositions: {
                ...state.modulePositions,
                [`${moduleId}_previous`]: currentPosition,
              },
            });
          }
          set({ maximizedModule: moduleId });
        }
      },

      // Update module position and size
      updateModulePosition: (moduleId, position) => {
        const state = get();
        set({
          modulePositions: {
            ...state.modulePositions,
            [moduleId]: position,
          },
        });
      },

      // Bring module to front
      bringToFront: (moduleId) => {
        const state = get();
        const newZIndex = state.maxZIndex + 1;
        set({
          moduleZIndexes: {
            ...state.moduleZIndexes,
            [moduleId]: newZIndex,
          },
          maxZIndex: newZIndex,
        });
      },

      // Close all modules
      closeAllModules: () => {
        set({
          activeModules: [],
          maximizedModule: null,
        });
      },

      // Restore default layout
      restoreLayout: () => {
        set({
          modulePositions: {},
          moduleZIndexes: {},
          maxZIndex: 100,
        });
      },

      // Check if module is open
      isModuleOpen: (moduleId) => {
        return get().activeModules.includes(moduleId);
      },

      // Get module position
      getModulePosition: (moduleId) => {
        return get().modulePositions[moduleId];
      },
    }),
    {
      name: 'futuraa-module-storage',
      version: 1,
      partialize: (state) => ({
        // Only persist these fields
        modulePositions: state.modulePositions,
        moduleZIndexes: state.moduleZIndexes,
        lastOpenedModule: state.lastOpenedModule,
        maxZIndex: state.maxZIndex,
        // Don't persist activeModules - start fresh on reload
      }),
    }
  )
);
