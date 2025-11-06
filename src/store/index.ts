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