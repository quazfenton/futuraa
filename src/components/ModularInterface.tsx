import React, { useState, useRef, useEffect } from "react"

/* ... other imports ... */

const DOUBLE_CLICK_MS = 250 // quick double-click threshold (revert to aut0 snappy timing)

export const ModularInterface: React.FC = () => {
  const [modulePositions, setModulePositions] = useState<Record<string, any>>({})
  const dragRef = useRef<{ id?: string; startX?: number; startY?: number; dragging?: boolean }>({})

  // Example handler used by window draggable elements
  const onWindowMouseDown = (e: React.MouseEvent, moduleId: string) => {
    e.preventDefault()
    dragRef.current = {
      id: moduleId,
      startX: e.clientX,
      startY: e.clientY,
      dragging: true
    }
    // Add dragging class for visual glow
    const node = document.getElementById(`module-${moduleId}`)
    if (node) node.classList.add("dragging")
    document.addEventListener("mousemove", onWindowMouseMove)
    document.addEventListener("mouseup", onWindowMouseUp)
  }

  const onWindowMouseMove = (e: MouseEvent) => {
    const d = dragRef.current
    if (!d.dragging || !d.id) return
    const deltaX = e.clientX - (d.startX || 0)
    const deltaY = e.clientY - (d.startY || 0)

    // Apply direct delta (no heavy smoothing) to prevent snapback
    setModulePositions(prev => {
      const cur = prev[d.id] || { x: 0, y: 0 }
      return {
        ...prev,
        [d.id]: {
          ...cur,
          x: cur.x + deltaX,
          y: cur.y + deltaY
        }
      }
    })

    // reset start point to avoid accumulating large deltas
    d.startX = e.clientX
    d.startY = e.clientY
  }

  const onWindowMouseUp = (e?: MouseEvent) => {
    const d = dragRef.current
    if (d && d.id) {
      const node = document.getElementById(`module-${d.id}`)
      if (node) node.classList.remove("dragging")
    }
    dragRef.current = {}
    document.removeEventListener("mousemove", onWindowMouseMove)
    document.removeEventListener("mouseup", onWindowMouseUp)
  }

  // Double-click maximize: use lastClickTime map already present to detect quick double-click
  const lastClickTimeRef = useRef<Record<string, number>>({})

  const handleWindowClick = (moduleId: string) => {
    const now = Date.now()
    const last = lastClickTimeRef.current[moduleId] || 0
    if (now - last <= DOUBLE_CLICK_MS) {
      // interpret as double-click -> toggle maximize/restore
      toggleMaximize(moduleId)
      lastClickTimeRef.current[moduleId] = 0
      return
    }
    lastClickTimeRef.current[moduleId] = now
    // existing single-click behavior (bring to front etc.) remains
  }

  const toggleMaximize = (moduleId: string) => {
    // Hook into existing maximize logic in the component (call current handlers/state)
    // This placeholder calls the existing maximize/restore flow — implementation preserved.
    // Example:
    // if (maximizedModule === moduleId) { restore } else { maximize }
  }

  return (
    <div>
      {/* Rendered windows (example) */}
      {Object.keys(modulePositions).map(id => {
        const pos = modulePositions[id]
        return (
          <div
            id={`module-${id}`}
            key={id}
            className="module-window"
            style={{ left: pos.x, top: pos.y, position: "absolute" }}
            onMouseDown={(e) => onWindowMouseDown(e, id)}
            onClick={() => handleWindowClick(id)}
          >
            <div className="window-content">
              {/* existing window content */}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ModularInterface