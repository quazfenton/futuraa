# Visual Restoration Plan: aut0 Visuals to 6daze

## Objective
Restore visual aspects from the "aut0" commit while preserving advancements from "6daze" and fixing current faults. Focus on visual elements only - maintain current functionality and internal mechanisms.

## Technical Steps

### 1. Sidebar Restoration
**Target Components:** `Sidebar.tsx`, `Sidebar.css`

**Visual Reversions:**
- Move sidebar to left position
- Restore hover expansion effect for list items
- Revert selection highlighting visual style
- Keep toggle functionality (bottom-right page)
  - Change toggle button to black color
- **Keep:** Fully hideable functionality via toggle button

**Additional Changes:**
- Replace "System/Resolution" section with Creator's info and black social links
- Add scrolling limits (top/bottom) if content overpopulates

**Specific Implementation:**
```css
/* Revert to aut0 sidebar positioning */
.sidebar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

/* Restore hover expansion effect */
.sidebar-item:hover .expanded-content {
  transform: translateX(0);
  opacity: 1;
}

/* Original selection highlighting */
.sidebar-item.selected {
  background: [aut0-selection-color];
  border-left: [aut0-border-style];
}
```

### 2. Bottom Dock Buttons Restoration
**Target Components:** `Dock.tsx`, `Dock.css`

**Visual Reversions:**
- Revert button style and size to aut0 appearance
- Keep current scrolling functionality
- Keep toggle/deselect ability when button pressed again

**Specific Implementation:**
```css
.dock-button {
  /* Revert to aut0 dimensions */
  width: [aut0-width];
  height: [aut0-height];
  /* Restore aut0 visual styling */
  background: [aut0-background];
  border: [aut0-border];
  /* Keep current functionality */
  cursor: pointer;
}
```

### 3. Background Restoration
**Target Components:** `Background.tsx` or `App.css`

**Visual Reversions:**
- Revert tile size to aut0 dimensions
- Reduce excess sprites/pixel density
- Keep "infinite canvas" background draggability

**Specific Implementation:**
```css
.background-tile {
  /* Revert to aut0 tile size */
  width: [aut0-tile-width];
  height: [aut0-tile-height];
  /* Reduce sprite density */
  background-size: [aut0-background-size];
}
```

### 4. Windows Restoration
**Target Components:** `Window.tsx`, `Window.css`

**Visual Reversions:**
- Remove top border/bar
- Re-add expand icon
- Restore glow effect during drag
- Change color pitch closer to black (similar to aut0 empty window)
- **Keep:** Current additional icons
- **Keep:** Manual edge expansion ability

**Fix Required:**
- Fix window dragging (currently snaps back to stuck position)
- Implement double-click to expand/collapse
- Maintain current expand icon functionality

**Specific Implementation:**
```css
.window {
  /* Remove top border/bar */
  border-top: none;
  border-radius: [aut0-border-radius];
  background: [darker-aut0-color];
  box-shadow: [aut0-glow-effect];
  /* Fix drag behavior */
  transition: transform 0.1s ease;
}

.window.expand-icon {
  /* Re-add expand icon */
  position: [aut0-expand-icon-position];
  content: [aut0-expand-icon-content];
}

.window:hover {
  box-shadow: [drag-glow-effect];
}
```

**Drag Fix Implementation:**
```javascript
// Prevent snap-back behavior
const handleDrag = (e) => {
  // Apply new position without constraints that cause snapping
  setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
};

// Double-click to expand/collapse
window.addEventListener('dblclick', () => {
  setExpanded(!isExpanded);
});
```

### 5. Info/Modules Box Restoration
**Target Components:** `InfoBox.tsx`, `InfoBox.css`

**Visual Reversions:**
- Move to top-right location
- Revert to darker box appearance
- **Keep:** Loading of selected app's info
- **Keep:** Light mode/close icons

**Additional Changes:**
- Replace "System status" with current Window's hyperlink
- Make light mode a dimmer white gradient
- Windows should turn white in light mode

**Specific Implementation:**
```css
.info-box {
  /* Revert to top-right position */
  top: [top-value];
  right: [right-value];
  background: [darker-aut0-background];
}

.light-mode {
  background: [dimmer-white-gradient];
}

.window.light-mode {
  background: white;
}
```

### 6. Mouse Cursor/Trail Restoration
**Target Components:** `Cursor.tsx` or global CSS

**Visual Reversions:**
- Revert to aut0 cursor/trail effect

**Specific Implementation:**
```css
body {
  cursor: none;
}

.cursor-trail {
  /* Revert to aut0 trail effect */
  width: [aut0-size];
  height: [aut0-size];
  background: [aut0-color];
  border-radius: 50%;
  pointer-events: none;
  position: fixed;
  z-index: 9999;
  /* Add trail animation */
  animation: [aut0-animation];
}
```

### 7. Font Restoration
**Target Components:** `index.css`, `tailwind.config.ts`

**Visual Reversions:**
- Revert to aut0 fonts

**Specific Implementation:**
```css
body {
  font-family: [aut0-font-family], sans-serif;
}

/* Update in tailwind config if necessary */
```

## Integration Strategy

### Phase 1: Safe Visual Reversions
1. Create component backup before each change
2. Implement visual reversion for one component at a time
3. Test to ensure functionality remains intact
4. Commit after each component restoration

### Phase 2: Bug Fixes
1. Address window dragging issue
2. Implement double-click expand functionality
3. Test all restored visual elements

### Phase 3: Integration Testing
1. Test all components together
2. Verify no breaking changes
3. Ensure current functionality preserved
4. Final visual polish

## Risk Mitigation
- Maintain current functionality during visual changes
- Use version control to track each change
- Test frequently during implementation
- Keep current improvements while reverting only visuals