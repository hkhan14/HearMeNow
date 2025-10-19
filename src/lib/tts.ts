import type { Emotion } from "@/components/EmotionSelector";
import { apiFetchBlob } from "@/lib/api";

export interface SynthesizeOptions {
  text: string;
  emotion: Emotion;
  voiceId?: string; // optional future extension
  format?: "audio/mpeg" | "audio/wav" | "audio/ogg";
}

/**
 * Calls backend TTS endpoint which integrates with ElevenLabs.
 * Expected backend route: POST /api/tts -> returns audio blob.
 */
export async function synthesizeSpeech({ text, emotion, voiceId, format = "audio/mpeg" }: SynthesizeOptions) {
  try {
    const blob = await apiFetchBlob("/api/tts", {
      method: "POST",
      body: { text, emotion, voiceId, format },
      headers: { Accept: format },
    });
    return blob;
  } catch (err) {
    // Normalize error for UI consumption
    const message = err instanceof Error ? err.message : String(err);
    // Provide actionable hint if it's a network issue
    if (message.toLowerCase().includes("network error") || message.toLowerCase().includes("failed to fetch")) {
      throw new Error("Network error when contacting TTS server. Make sure the backend (server/index.mjs) is running on port 3000 and that VITE_API_BASE_URL is set correctly.");
    }
    throw err;
  }
}
