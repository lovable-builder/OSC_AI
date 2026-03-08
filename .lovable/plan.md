

## Plan: Import Cue List from EOS Console

### What's Possible

Yes, EOS consoles expose their cue list via OSC. The bridge can request cue data using `/eos/get/cue/1/list/<count>` and related endpoints, and the console replies with cue number, label, duration, etc. We can build a full "Import Cues from Console" feature.

### Current State

- The app has hardcoded demo cues (lines 865-872 in Index.tsx)
- The bridge already handles `request_patch` and `request_levels` — we need to add `request_cues`
- The `CueStack` component renders cues but from static state
- Console feedback handler already processes `active_cue` updates

### Implementation

**1. Bridge: Add `request_cues` handler**
- When bridge receives `{ type: "request_cues" }`, send OSC queries to the console:
  - `/eos/get/cue/1/count` — get total cue count
  - `/eos/get/cue/1/list/0` through `/eos/get/cue/1/list/N` — iterate cue list indices
  - `/eos/get/cue/1/{index}/label`, `/eos/get/cue/1/{index}/duration` — get details per cue
- Parse incoming `/out/get/cue/...` OSC replies and broadcast as `{ type: "console_feedback", subtype: "cue_list", cues: [...] }` to the web app

**2. Bridge: Parse cue list OSC responses**
- Add detection in `parseConsoleOscMessage` for addresses containing `/out/get/cue/` to extract cue number, label, up time, down time, and follow/hang data
- Accumulate cue data across multiple OSC replies and batch-broadcast when complete

**3. App: Replace hardcoded cues with live state**
- Change `const [cues]` from static to `useState` with setter
- Add handling in `handleBridgeMessage` for `subtype: "cue_list"` to populate cues from console data
- Each cue object: `{ id, label, time, upTime, downTime, followTime }`

**4. App: Add "Import Cues" button**
- Add a "Sync Cues from Console" button in the Live Stage panel (next to existing Request Patch / Request Levels buttons)
- Sends `{ type: "request_cues" }` to bridge
- Shows loading state while waiting for response
- Also add it to the auto-poll (slow poll, every 15s) so cue list stays current

**5. App: Enhanced Cue List display**
- Update `CueStack` component to show additional fields: up/down times, follow/hang, cue labels from console
- Show a badge indicating whether cues are "Live from Console" vs "Demo Data"
- Highlight active cue using the existing `consoleFeedback.activeCue` state

**6. Bridge: Add cue count to polling**  
- Include `/eos/get/cue/1/count` in the slow poll cycle alongside patch requests

### Files Changed
- `bridge.js` / `public/bridge.js` — add `request_cues` handler and cue OSC response parsing
- `src/pages/Index.tsx` — make cues stateful, add import button, update handleBridgeMessage, update CueStack

