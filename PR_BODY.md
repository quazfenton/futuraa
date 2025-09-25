# feat: integrate binG chat and plugins as mini-apps + auth postMessage bridge

## Summary
Integrates the existing binG chat UI (chat.quazfenton.xyz) and several binG plugins as embedded mini-app windows in the futuraa homepage. Adds a parent→iframe auth bridge using postMessage, preserves the avant‑garde UI/UX, improves window management, and updates navigation and dock.

Mini-apps embedded:
- LLM Chat (binG): https://chat.quazfenton.xyz?embed=1
- Notes: https://chat.quazfenton.xyz/embed/notes
- Hugging Face Spaces: https://chat.quazfenton.xyz/embed/hf-spaces
- Network Request Builder: https://chat.quazfenton.xyz/embed/network
- GitHub Explorer: https://chat.quazfenton.xyz/embed/github

## Key changes
- New modules in `src/components/ModularInterface.tsx` with embedded iframes
- Right-side navigation updated in `src/components/FluidNavigation.tsx`
- Dock enhancements: drag scroll, active glow, tooltips
- Window system: randomized spawn, bring-to-front z-index, double-click maximize/restore, state persistence
- Info box: light/dark toggle, close/open, animated cyber text
- Background: pan by dragging empty space, subtle ambient visuals

## Auth bridge (no login UI)
- Added `postAuthToIframes(token)` in `ModularInterface.tsx`
  - Broadcasts `{ type: 'bing:auth', token }` to all plugin iframes using `data-module` attribute
  - Call this once you have a token from your central auth flow
- binG conversation/embed pages already listen for `bing:auth` and persist token to `localStorage('token')`

## Files touched (high-level)
- `src/components/ModularInterface.tsx`: new modules, iframe attributes, auth broadcast helper, window UX
- `src/components/FluidNavigation.tsx`: added items for Notes, HF Spaces, Network, GitHub
- `src/index.css`: additional animations and styles (cyber text glow, enhanced interactions)

## Testing
- Desktop + mobile manual testing:
  - Open/close each mini-app from dock and right navigation
  - Drag/resize windows; double-click to maximize/restore
  - Confirm iframe loads for each app and is interactive
  - Toggle light mode; verify aesthetic preserved
  - Drag background; verify subtle grid panning
  - Dock drag-to-scroll when many apps enabled
- Auth bridge manual test (when token available):
  - In browser devtools, emulate auth: `window.postMessage({ type: 'bing:auth', token: '...'}, 'https://chat.quazfenton.xyz')` to the iframes or call `postAuthToIframes` from app code after auth
  - Verify binG receives token and treats user as authenticated

## Rollout notes
- If using CSP, ensure `frame-ancestors` (or equivalent) allows `www.quazfenton.xyz` to embed `chat.quazfenton.xyz` and vice versa as needed
- Consider adding `<link rel="preconnect" href="https://chat.quazfenton.xyz">` for faster iframe startup
- binG side embed pages deployed and reachable

## Security
- Iframes sandboxed: `allow-scripts allow-same-origin allow-forms allow-popups`, plus permissions as needed for chat (clipboard, mic, camera, autoplay)
- Auth propagation is token-based via postMessage; receivers are locked to origin `https://chat.quazfenton.xyz`

## Screenshots
- N/A (please request if desired)

## Checklist
- [ ] QA on desktop & mobile
- [ ] Verify CSP/frame-ancestors in production
- [ ] Confirm auth bridge path in prod login flow
- [ ] (Optional) Add `preconnect` to speed up first load
