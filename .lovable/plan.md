

# Fix: Choice Selection Feedback + Execution Visibility

## Problems
1. After clicking a disambiguation choice, the choice buttons remain visible/active — no visual indication of which was selected
2. The `executeAiOscCommands` re-adds a full user prompt line (line 1173) which is redundant after the "Selected: X" feedback
3. The choices persist in the UI even after selection, making it confusing

## Solution

### In `src/pages/Index.tsx`:

**A. Track selected state on disambiguation messages**
- Add an optional `selectedChoice?: string` field to the history entry type
- When a choice is clicked, mutate the original disambiguation message to set `selectedChoice` to the chosen `fixtureType`, which visually highlights the selected one and disables all buttons

**B. Skip duplicate user message on re-execution**
- When clicking a choice, the handler already adds "Selected: X" as a user message. But then `executeAiOscCommands` adds ANOTHER user message with the full rewritten prompt (line 1173). 
- Add an optional `skipUserMessage` parameter to `executeAiOscCommands` so the choice click path skips the redundant entry

**C. Visual feedback on choices**
- After selection: highlight the chosen button in green, grey out the others, disable all clicks
- Show a checkmark on the selected choice

### Files

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Add `selectedChoice` to history type, update choice click handler to mark selection, add `skipUserMessage` param to `executeAiOscCommands`, update choice rendering to show selected/disabled states |

