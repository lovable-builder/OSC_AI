

## Plan: Dedicated Patch Panel with Single-Line Command

### What the user wants

From the EOS console screenshot, the correct patch syntax is **one single command line**:
```
Chan 401 Address 626 Type Martin Mac Viper Profile 16B
```

Not three separate commands. The panel should build this single `/eos/newcmd` string and send it after entering Patch mode.

### Changes

#### 1. Replace the Patching tab with a dedicated Patch Panel

When `oscTab === "Patching"`, instead of rendering generic `OscCard` inputs, render a custom panel:

- **Channel Number** — numeric input
- **Fixture Type** — text input with live search dropdown using `loadEOSFixtures()` + `searchEOSFixtures()`. User types to filter, clicks to select from filtered list. Shows manufacturer, model name, and DMX channel count.
- **DMX Address** — numeric input
- **PATCH button** — sends exactly 2 OSC messages:
  1. `/eos/key/patch` (enter patch mode)
  2. After 900ms: `/eos/newcmd` with value `Chan {channel} Address {address} Type {fixtureType} Enter` — **all in one line**

#### 2. Remove patching logic from AI/voice flow

- In `executeAiOscCommands`: when prompt matches patching intent (`/\bpatch\b/i`), short-circuit with a chat message: "For accurate patching, use the Patching panel in the OSC Control tab."
- Remove `isSimplePatchAddressFlow`, fixture disambiguation choices, `forceFixtureType` parameter, and related plumbing from `executeAiOscCommands`.

#### 3. Update OSC agent edge function

Add instruction to `supabase/functions/osc-agent/index.ts` system prompt: when user asks to patch, respond directing them to the Patching panel.

#### 4. Update `OSC_COMMANDS.Patching`

Keep only `Unpatch` in the generic commands list. The main patch flow is handled by the new panel.

### Files to modify

- **`src/pages/Index.tsx`** — Add `PatchPanel` UI (inline), replace Patching tab rendering, strip fixture resolution from AI flow
- **`supabase/functions/osc-agent/index.ts`** — Update system prompt

