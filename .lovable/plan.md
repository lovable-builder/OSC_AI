

## Why the cue labels are wrong

The app initializes the cue list with **hardcoded placeholder data** (lines 1005-1012 in Index.tsx):

```
"Opening — Warm Wash", "Scene 2 — Spot DS", "Transition — Fade to Blue", etc.
```

When the real console sends cue data, it updates entries that match by cue number — but any cue whose label hasn't arrived yet (or whose `cue_property` label message was dropped/batched away) keeps the fake placeholder label. This creates the mismatch you're seeing between the app and the actual EOS console.

## Fix

**Start with an empty cue list** and populate it entirely from console data:

### Index.tsx (line 1005-1012)
Replace the hardcoded cues array with an empty array:
```typescript
const [cues, setCues] = useState([]);
```

This way the cue stack only shows what the console actually reports — no fake labels, no mismatches. The cue list will populate once the bridge receives cue data from EOS.

