

## AI Agent OSC Execution via Chat Prompts

### What we're building
An AI-powered chat input in the OSC Control tab where users type natural language (e.g., "set channel 5 to 80%", "fire cue 3", "blackout everything") and the AI translates it into OSC commands that get executed on the console via the bridge.

### Architecture

```text
User prompt → Edge Function (osc-agent) → Lovable AI → JSON OSC commands → Frontend sendOsc() → Bridge → Console
```

### 1. New Edge Function: `supabase/functions/osc-agent/index.ts`

- Receives `{ prompt, consoleName, context }` where context includes current active cue, channel count, etc.
- System prompt instructs the AI to return a JSON array of OSC commands: `[{ path, value?, description }]`
  - e.g. `[{ "path": "/eos/newcmd", "value": "Chan 5 At 80 Enter", "description": "Set channel 5 to 80%" }]`
- Uses the full `OSC_COMMANDS` reference in the system prompt so the AI knows valid paths and patterns
- Uses `google/gemini-3-flash-preview` for speed
- Handles 429/402 errors

### 2. Frontend: Add AI prompt bar to OSC Control tab (`src/pages/Index.tsx`)

- Add a chat-style input at the top of the OSC Control module (above the command tabs)
- New state: `aiOscInput`, `aiOscLoading`, `aiOscHistory` (array of `{role, text, commands?}`)
- On submit:
  1. Call the `osc-agent` edge function with the prompt + console context
  2. Receive array of OSC commands
  3. Display them in a mini-log with descriptions
  4. Execute each command via `sendOsc()` sequentially (with small delays between commands)
  5. Show confirmation in the chat area
- Add a "preview mode" toggle — when on, show commands before executing and require user confirmation

### 3. System Prompt Design

The AI system prompt will include:
- All valid OSC paths and their parameter patterns (derived from the `OSC_COMMANDS` constant)
- EOS command syntax rules (e.g., `Chan X At Y Enter`, `Cue X Go`)
- Instructions to return ONLY a JSON array of commands, no markdown
- Current console state (active cue, online status) for context-aware responses

### Files to create/modify
- **Create** `supabase/functions/osc-agent/index.ts` — new edge function
- **Modify** `src/pages/Index.tsx` — add AI prompt bar in OSC Control section, new state, execution logic

