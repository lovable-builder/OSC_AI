

## Problem: Cue Import Not Working

The bridge's `syncCues` function requests cues by **sequential index** (`/eos/get/cue/1/0`, `/eos/get/cue/1/1`, `/eos/get/cue/1/2`...), but EOS interprets these as **cue numbers**, not indices. If your cues are numbered 1, 2, 5, 10, 20 — requesting cue "0" returns nothing, and requesting cue "3" returns nothing because it doesn't exist.

The correct EOS OSC API for index-based retrieval is:
```
/eos/get/cue/{list}/index/{i}
```

### Fix (public/bridge.js, line 635)

Change the cue fetch URL from:
```javascript
enqueue({ address: withUser(`/eos/get/cue/${cueList}/${i}`), args: [] }, host, port);
```
to:
```javascript
enqueue({ address: withUser(`/eos/get/cue/${cueList}/index/${i}`), args: [] }, host, port);
```

This single-line fix ensures EOS returns cue data for all cues by their position in the list rather than by number, so the frontend receives and populates the full cue stack.

### Files to change
- `public/bridge.js` — one line in `syncCues()`

