import { useState, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PatchPreset {
  id: string;
  name: string;
  fixtureName: string;
  fixtureId: string;
  modeName: string;
  modeChannels: number;
  quantity: number;
  startChannel: number;
  universe: number;
  startDmxAddress: number;
  label: string;
}

const STORAGE_KEY = "bridge_patch_presets";

// ── Styles ───────────────────────────────────────────────────────────────────

const monoSmall = {
  fontFamily: "'Space Mono', monospace",
  fontSize: "11px",
};

const labelStyle = {
  fontFamily: "'Space Mono', monospace",
  fontSize: "9px",
  color: "#666",
  letterSpacing: "0.12em",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

export function loadPresets(): PatchPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PatchPreset[];
  } catch {
    return [];
  }
}

export function savePresets(presets: PatchPreset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {}
}

export function findPresetByName(name: string): PatchPreset | undefined {
  const presets = loadPresets();
  const lower = name.toLowerCase().trim();
  return presets.find((p) => p.name.toLowerCase() === lower);
}

// ── Component ────────────────────────────────────────────────────────────────

interface PatchPresetsProps {
  onApply: (preset: PatchPreset) => void;
}

export default function PatchPresets({ onApply }: PatchPresetsProps) {
  const [presets, setPresets] = useState<PatchPreset[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setPresets(loadPresets());
  }, []);

  const deletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    savePresets(updated);
    setPresets(updated);
  };

  if (presets.length === 0) return null;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 18px",
          background: "rgba(139,92,246,0.03)",
          border: "none",
          borderBottom: expanded ? "1px solid rgba(255,255,255,0.04)" : "none",
          cursor: "pointer",
          color: "#a78bfa",
          ...labelStyle,
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
        }}
      >
        <span style={{ fontSize: "14px" }}>⚡</span>
        PATCH PRESETS ({presets.length})
        <span
          style={{
            marginLeft: "auto",
            fontSize: "10px",
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>

      {/* Preset List */}
      {expanded && (
        <div style={{ padding: "8px" }}>
          {presets.map((preset) => (
            <div
              key={preset.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                marginBottom: "4px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                transition: "all 0.15s",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...monoSmall, fontWeight: 700, color: "#a78bfa" }}>
                  {preset.name}
                </div>
                <div style={{ fontSize: "10px", color: "#555", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>
                  {preset.quantity}× {preset.fixtureName} — Ch {preset.startChannel}, U{preset.universe}, DMX {preset.startDmxAddress}
                </div>
              </div>
              <button
                onClick={() => onApply(preset)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "5px",
                  border: "1px solid rgba(34,197,94,0.3)",
                  background: "rgba(34,197,94,0.1)",
                  color: "#22c55e",
                  ...monoSmall,
                  fontSize: "9px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                APPLY
              </button>
              <button
                onClick={() => deletePreset(preset.id)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "5px",
                  border: "1px solid rgba(239,68,68,0.3)",
                  background: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  ...monoSmall,
                  fontSize: "9px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
