// ── Patch Transaction Tracking & Undo ──────────────────────────────────────────

export interface PatchCommand {
  path: string;
  value?: string;
}

export interface PatchRecord {
  channel: number;
  universe: number;
  dmxAddress: number;
  fixture?: string;
  label?: string;
}

export interface PatchTransaction {
  id: string;
  timestamp: number;
  patches: PatchRecord[];
  status: "pending" | "completed" | "failed";
  commands: PatchCommand[];
}

const MAX_TRANSACTIONS = 5;
const STORAGE_KEY = "bridge_patch_transactions";

/**
 * Create a new transaction record.
 */
export function createTransaction(patches: PatchRecord[]): PatchTransaction {
  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    patches,
    status: "pending",
    commands: [],
  };
}

/**
 * Build the inverse unpatch OSC commands for a transaction.
 * Returns commands wrapped with /eos/key/patch and /eos/key/live.
 */
export function buildUnpatchCommands(transaction: PatchTransaction): PatchCommand[] {
  const commands: PatchCommand[] = [
    { path: "/eos/key/patch" },
  ];

  for (const patch of transaction.patches) {
    commands.push({
      path: "/eos/newcmd",
      value: `Chan ${patch.channel} Address 0 Enter`,
    });
  }

  commands.push({ path: "/eos/key/live" });
  return commands;
}

/**
 * Save a transaction to localStorage (keeps last N).
 */
export function saveTransaction(transaction: PatchTransaction): void {
  const existing = loadTransactions();
  existing.unshift(transaction);
  if (existing.length > MAX_TRANSACTIONS) existing.length = MAX_TRANSACTIONS;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // localStorage full — silently fail
  }
}

/**
 * Load saved transactions from localStorage.
 */
export function loadTransactions(): PatchTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PatchTransaction[];
  } catch {
    return [];
  }
}

/**
 * Remove a transaction by ID.
 */
export function removeTransaction(id: string): void {
  const existing = loadTransactions().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

/**
 * Update a transaction's status.
 */
export function updateTransactionStatus(
  id: string,
  status: PatchTransaction["status"]
): void {
  const existing = loadTransactions();
  const tx = existing.find((t) => t.id === id);
  if (tx) {
    tx.status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
}
