

## Bugs and Fixes

### Bug 3 — Frontend ignores `cue_complete` batch event
The bridge already sends `cue_complete` with a full sorted cues array, but `Index.tsx` has no handler for it. When the cue list finishes loading, the app never populates the cue stack.

**Fix in `src/pages/Index.tsx`**: Add a `cue_complete` case in `flushMessages` that replaces the entire cues state with the received list.

### Bug 4 — Patch field name mismatches
The bridge sends patch entries with fields `dmxAddress`, `fixture_type`, `notes` — but the frontend maps `p.address`, `p.fixture`, `p.label`. None of them match, so patch data appears empty.

**Fix in `src/pages/Index.tsx`** (line 864-870): Add the bridge's actual field names to the fallback chain:
```typescript
address: p.dmxAddress ?? p.address ?? p.addr ?? p.dmx,
fixture: p.fixture_type ?? p.fixture ?? p.type ?? "",
label: p.notes ?? p.label ?? "",
```

### Bug 4b — Patch parser doesn't handle empty args
When EOS returns a patch entry at `/eos/out/get/patch/1/{index}` with no args (empty channel), the parser creates an entry with `channel: null` and skips storing it. This is valid — it means that index has no patched channel. But for entries where data IS in the address path, we should extract the index.

**Fix in `public/bridge.js`** (line 454-476): When args are empty, extract the channel index from the address path as a fallback, and skip entries where channel is truly null (unpatched slots).

### Files to change
- `src/pages/Index.tsx` — add `cue_complete` handler, fix patch field mapping
- `public/bridge.js` — handle empty args in patch parser

