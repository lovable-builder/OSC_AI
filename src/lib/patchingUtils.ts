// ── DMX Address Collision Detection & Reservation ──────────────────────────────

export interface PatchEntry {
  id: string;
  startChannel: number;
  universe: number;
  dmxAddress: number;
  channelCount: number;
  label?: string;
  fixture?: string;
}

export interface ConsolePatchEntry {
  channel: number;
  universe: number;
  address: number;
  fixture?: string;
  label?: string;
}

export interface CollisionWarning {
  type: "overlap" | "channel_conflict";
  message: string;
  conflictingChannel?: number;
  conflictingDmxRange?: string;
}

/**
 * Find the next available contiguous DMX address block in a given universe.
 */
export function getNextAvailableDMXAddress(
  universe: number,
  patchList: PatchEntry[],
  consolePatch: ConsolePatchEntry[],
  channelCount: number
): number {
  // Collect all occupied DMX ranges for this universe
  const occupied: Array<{ start: number; end: number }> = [];

  patchList
    .filter((p) => p.universe === universe)
    .forEach((p) => {
      occupied.push({ start: p.dmxAddress, end: p.dmxAddress + p.channelCount - 1 });
    });

  consolePatch
    .filter((p) => p.universe === universe && p.address > 0)
    .forEach((p) => {
      // Assume 1 channel for console entries unless we know better
      occupied.push({ start: p.address, end: p.address });
    });

  // Sort by start address
  occupied.sort((a, b) => a.start - b.start);

  // Find first gap that fits channelCount
  let candidate = 1;
  for (const range of occupied) {
    if (candidate + channelCount - 1 < range.start) {
      return candidate;
    }
    candidate = Math.max(candidate, range.end + 1);
  }

  // Check we don't exceed 512
  if (candidate + channelCount - 1 > 512) {
    return -1; // No space available
  }

  return candidate;
}

/**
 * Validate a patch address range for collisions.
 * Returns an array of warnings (empty = no conflicts).
 */
export function validatePatchAddress(
  startChannel: number,
  universe: number,
  dmxAddress: number,
  quantity: number,
  channelsPerFixture: number,
  patchList: PatchEntry[],
  consolePatch: ConsolePatchEntry[]
): CollisionWarning[] {
  const warnings: CollisionWarning[] = [];

  for (let i = 0; i < quantity; i++) {
    const ch = startChannel + i;
    const addrStart = dmxAddress + i * channelsPerFixture;
    const addrEnd = addrStart + channelsPerFixture - 1;

    // Check DMX range overflow
    if (addrEnd > 512) {
      warnings.push({
        type: "overlap",
        message: `Channel ${ch}: DMX ${addrStart}–${addrEnd} exceeds universe limit (512)`,
      });
    }

    // Check against existing patch list
    for (const p of patchList) {
      if (p.universe !== universe) continue;
      const pEnd = p.dmxAddress + p.channelCount - 1;

      if (addrStart <= pEnd && addrEnd >= p.dmxAddress) {
        warnings.push({
          type: "overlap",
          message: `Channel ${ch} (DMX ${addrStart}–${addrEnd}) overlaps with "${p.label || p.fixture || `Ch ${p.startChannel}`}" (DMX ${p.dmxAddress}–${pEnd})`,
          conflictingChannel: p.startChannel,
          conflictingDmxRange: `${p.dmxAddress}–${pEnd}`,
        });
      }
    }

    // Check against console patch data
    for (const cp of consolePatch) {
      if (cp.universe !== universe || cp.address <= 0) continue;

      if (addrStart <= cp.address && addrEnd >= cp.address) {
        warnings.push({
          type: "overlap",
          message: `Channel ${ch} (DMX ${addrStart}–${addrEnd}) conflicts with console channel ${cp.channel} at DMX ${cp.address}`,
          conflictingChannel: cp.channel,
          conflictingDmxRange: `${cp.address}`,
        });
      }
    }

    // Check channel number conflicts in patch list
    const channelConflict = patchList.find((p) => p.startChannel === ch);
    if (channelConflict) {
      warnings.push({
        type: "channel_conflict",
        message: `Channel ${ch} is already patched to ${channelConflict.fixture || "a fixture"}`,
        conflictingChannel: ch,
      });
    }
  }

  return warnings;
}

/**
 * Get the status of a DMX address: "free", "warning" (adjacent), or "occupied"
 */
export function getAddressStatus(
  universe: number,
  dmxAddress: number,
  channelsNeeded: number,
  patchList: PatchEntry[],
  consolePatch: ConsolePatchEntry[]
): "free" | "warning" | "occupied" {
  const endAddr = dmxAddress + channelsNeeded - 1;

  for (const p of patchList) {
    if (p.universe !== universe) continue;
    const pEnd = p.dmxAddress + p.channelCount - 1;
    if (dmxAddress <= pEnd && endAddr >= p.dmxAddress) return "occupied";
    // Adjacent warning: within 2 addresses
    if (Math.abs(dmxAddress - pEnd) <= 2 || Math.abs(endAddr - p.dmxAddress) <= 2) {
      // Only warn, don't override occupied
    }
  }

  for (const cp of consolePatch) {
    if (cp.universe !== universe || cp.address <= 0) continue;
    if (dmxAddress <= cp.address && endAddr >= cp.address) return "occupied";
  }

  // Check adjacency for warning
  for (const p of patchList) {
    if (p.universe !== universe) continue;
    const pEnd = p.dmxAddress + p.channelCount - 1;
    if (Math.abs(dmxAddress - (pEnd + 1)) <= 1 || Math.abs(p.dmxAddress - (endAddr + 1)) <= 1) {
      return "warning";
    }
  }

  return "free";
}
