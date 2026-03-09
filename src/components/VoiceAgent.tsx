import { useConversation } from "@elevenlabs/react";
import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VoiceAgentProps {
  agentId: string;
  onTranscript?: (text: string, speaker: "user" | "agent") => void;
}

/**
 * Formats raw agent text into organized markdown instructions.
 * Splits on sentence boundaries and groups into numbered steps.
 */
function formatAsInstructions(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  // Split into sentences
  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 2) {
    // Short response — just return as-is with bold emphasis on key terms
    return trimmed;
  }

  // Build numbered steps
  const lines = sentences.map((s, i) => `${i + 1}. ${s}`);
  return `**Instructions:**\n\n${lines.join("\n")}`;
}

export default function VoiceAgent({ agentId, onTranscript }: VoiceAgentProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const agentBuffer = useRef<string>("");
  const wasSpeakingRef = useRef(false);

  const conversation = useConversation({
    onConnect: () => {
      setError(null);
      agentBuffer.current = "";
    },
    onDisconnect: () => {
      // Flush any remaining buffered agent text
      if (agentBuffer.current.trim() && onTranscript) {
        onTranscript(formatAsInstructions(agentBuffer.current), "agent");
        agentBuffer.current = "";
      }
    },
    onMessage: (message: any) => {
      if (message.type === "user_transcript" && onTranscript) {
        onTranscript(message.user_transcription_event?.user_transcript || "", "user");
      }
      if (message.type === "agent_response") {
        const text = message.agent_response_event?.agent_response || "";
        agentBuffer.current += (agentBuffer.current ? " " : "") + text;
      }
    },
    onError: (err: any) => {
      console.error("Voice agent error:", err);
      setError("Voice connection error");
    },
  });

  // Poll isSpeaking to detect when agent stops speaking → flush buffer as formatted instructions
  const checkSpeaking = useCallback(() => {
    if (wasSpeakingRef.current && !conversation.isSpeaking && agentBuffer.current.trim()) {
      if (onTranscript) {
        onTranscript(formatAsInstructions(agentBuffer.current), "agent");
      }
      agentBuffer.current = "";
    }
    wasSpeakingRef.current = conversation.isSpeaking;
  }, [conversation.isSpeaking, onTranscript]);

  // Run the check on every render (isSpeaking changes trigger re-render)
  checkSpeaking();

  const startConversation = useCallback(async () => {
    if (!agentId) {
      setError("No Agent ID configured");
      return;
    }
    setIsConnecting(true);
    setError(null);
    agentBuffer.current = "";
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const { data, error: fnError } = await supabase.functions.invoke(
        "elevenlabs-conversation-token",
        { body: { agentId } }
      );

      if (fnError || !data?.signed_url) {
        throw new Error(fnError?.message || "Failed to get signed URL");
      }

      await conversation.startSession({
        signedUrl: data.signed_url,
      });
    } catch (err: any) {
      console.error("Failed to start voice:", err);
      setError(err.message || "Failed to connect");
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isActive = conversation.status === "connected";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <button
        onClick={isActive ? stopConversation : startConversation}
        disabled={isConnecting}
        title={isActive ? "Stop voice agent" : "Start voice agent"}
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "8px",
          border: "none",
          background: isActive
            ? "linear-gradient(135deg, #EF4444, #DC2626)"
            : isConnecting
            ? "rgba(255,255,255,0.04)"
            : "linear-gradient(135deg, #10B981, #059669)",
          color: isConnecting ? "#555" : "#fff",
          cursor: isConnecting ? "not-allowed" : "pointer",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          boxShadow: isActive
            ? "0 0 16px rgba(239,68,68,0.5)"
            : conversation.isSpeaking
            ? "0 0 20px rgba(16,185,129,0.6)"
            : "none",
          animation: isActive && conversation.isSpeaking ? "pulse-glow 1.5s ease-in-out infinite" : "none",
          position: "relative",
        }}
      >
        {isConnecting ? (
          <span style={{ fontSize: "14px" }}>⏳</span>
        ) : isActive ? (
          <span>⏹</span>
        ) : (
          <span>🎙</span>
        )}
      </button>

      {isActive && (
        <div
          style={{
            fontSize: "10px",
            color: conversation.isSpeaking ? "#10B981" : "#888",
            fontFamily: "'Space Mono', monospace",
            letterSpacing: "0.5px",
          }}
        >
          {conversation.isSpeaking ? "SPEAKING" : "LISTENING"}
        </div>
      )}

      {error && (
        <div style={{ fontSize: "10px", color: "#EF4444", maxWidth: "120px" }}>
          {error}
        </div>
      )}
    </div>
  );
}
