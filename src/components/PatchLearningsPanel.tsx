import { useState, useEffect, useCallback } from "react";
import {
  loadWorkflows,
  loadStats,
  clearAllWorkflows,
  exportAllLearnings,
  type PatchWorkflow,
  type PatchStats,
} from "@/lib/patchMemoryDb";

interface PatchLearningsPanelProps {
  refreshKey: number; // increment to trigger refresh
}

export default function PatchLearningsPanel({ refreshKey }: PatchLearningsPanelProps) {
  const [stats, setStats] = useState<PatchStats | null>(null);
  const [workflows, setWorkflows] = useState<PatchWorkflow[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [s, w] = await Promise.all([loadStats(), loadWorkflows(10)]);
    setStats(s);
    setWorkflows(w);
  }, []);

  useEffect(() => { refresh(); }, [refresh, refreshKey]);

  const handleClear = async () => {
    await clearAllWorkflows();
    await refresh();
  };

  const handleExport = async () => {
    const json = await exportAllLearnings();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patch-learnings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const successRate = stats && stats.total_patches_attempted > 0
    ? Math.round((stats.successful_patches / stats.total_patches_attempted) * 100)
    : 0;

  const mono: React.CSSProperties = { fontFamily: "'Space Mono', monospace" };
  const labelStyle: React.CSSProperties = { ...mono, fontSize: "9px", color: "#9ca3af", letterSpacing: "0.1em" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Stats Row */}
      <div style={{ display: "flex", gap: "10px" }}>
        <StatBox label="ATTEMPTED" value={stats?.total_patches_attempted ?? 0} color="#6b7280" />
        <StatBox label="SUCCESS" value={stats?.successful_patches ?? 0} color="#22c55e" />
        <StatBox label="FAILED" value={stats?.failed_patches ?? 0} color="#ef4444" />
        <StatBox label="RATE" value={`${successRate}%`} color="#FF6B2B" />
      </div>

      {/* Common Errors */}
      {stats && stats.common_errors.length > 0 && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca",
          borderRadius: "8px", padding: "10px 14px",
        }}>
          <div style={{ ...labelStyle, color: "#ef4444", marginBottom: "6px" }}>COMMON ERRORS</div>
          {stats.common_errors.slice(0, 3).map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
              <span style={{ ...mono, fontSize: "10px", color: "#991b1b" }}>{e.error_text}</span>
              <span style={{ ...mono, fontSize: "9px", color: "#b91c1c" }}>×{e.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Learned Commands */}
      {stats && Object.keys(stats.learned_commands).length > 0 && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: "8px", padding: "10px 14px",
        }}>
          <div style={{ ...labelStyle, color: "#22c55e", marginBottom: "6px" }}>LEARNED COMMANDS</div>
          {Object.entries(stats.learned_commands).slice(0, 5).map(([key, cmd]) => (
            <div key={key} style={{ display: "flex", gap: "8px", marginBottom: "2px" }}>
              <span style={{ ...mono, fontSize: "9px", color: "#6b7280", width: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {key}
              </span>
              <span style={{ ...mono, fontSize: "10px", color: "#166534" }}>{cmd}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Workflows */}
      <div>
        <div style={{ ...labelStyle, marginBottom: "8px" }}>LAST {workflows.length} WORKFLOWS</div>
        {workflows.length === 0 && (
          <div style={{ ...mono, fontSize: "11px", color: "#d1d5db", textAlign: "center", padding: "16px" }}>
            No patch workflows recorded yet
          </div>
        )}
        {workflows.map(wf => (
          <div
            key={wf.id}
            onClick={() => setExpandedId(expandedId === wf.id ? null : wf.id)}
            style={{
              background: "#fff",
              border: `1px solid ${wf.feedback.success ? "#bbf7d0" : wf.feedback.error ? "#fecaca" : "#e5e7eb"}`,
              borderRadius: "8px",
              padding: "8px 12px",
              marginBottom: "6px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: wf.feedback.success ? "#22c55e" : wf.feedback.error ? "#ef4444" : "#f59e0b",
              }} />
              <span style={{ ...mono, fontSize: "10px", color: "#1f2937", flex: 1 }}>
                Ch {wf.input.channel} → {wf.input.fixtureType}
              </span>
              <span style={{ ...mono, fontSize: "9px", color: "#9ca3af" }}>
                {new Date(wf.timestamp).toLocaleTimeString("en-GB", { hour12: false })}
              </span>
            </div>
            {expandedId === wf.id && (
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #f3f4f6" }}>
                {wf.steps.map(s => (
                  <div key={s.step} style={{ display: "flex", gap: "8px", marginBottom: "3px", alignItems: "center" }}>
                    <span style={{
                      ...mono, fontSize: "9px", width: "18px", textAlign: "center",
                      color: s.status === "validated" ? "#22c55e" : s.status === "failed" ? "#ef4444" : "#9ca3af",
                    }}>
                      {s.status === "validated" ? "✓" : s.status === "failed" ? "✕" : s.status === "sent" ? "→" : "○"}
                    </span>
                    <span style={{ ...mono, fontSize: "10px", color: "#4b5563" }}>{s.action}</span>
                  </div>
                ))}
                {wf.feedback.error && (
                  <div style={{ ...mono, fontSize: "10px", color: "#ef4444", marginTop: "4px" }}>
                    Error: {wf.feedback.error}
                  </div>
                )}
                {wf.feedback.console_echo && (
                  <div style={{ ...mono, fontSize: "10px", color: "#6b7280", marginTop: "4px" }}>
                    Console: {wf.feedback.console_echo}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={handleExport}
          style={{
            flex: 1, padding: "8px", borderRadius: "7px",
            border: "1px solid #e5e7eb", background: "#fff",
            ...mono, fontSize: "10px", fontWeight: "700",
            color: "#6b7280", cursor: "pointer", letterSpacing: "0.05em",
          }}
        >
          EXPORT JSON
        </button>
        <button
          onClick={handleClear}
          style={{
            flex: 1, padding: "8px", borderRadius: "7px",
            border: "1px solid #fecaca", background: "#fff",
            ...mono, fontSize: "10px", fontWeight: "700",
            color: "#ef4444", cursor: "pointer", letterSpacing: "0.05em",
          }}
        >
          CLEAR MEMORY
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{
      flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb",
      borderRadius: "8px", padding: "8px 10px", textAlign: "center",
    }}>
      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: "18px",
        fontWeight: "700", color, lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: "8px",
        color: "#9ca3af", letterSpacing: "0.1em", marginTop: "4px",
      }}>
        {label}
      </div>
    </div>
  );
}
