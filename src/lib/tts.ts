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
  const blob = await apiFetchBlob("/api/tts", {
    method: "POST",
    body: { text, emotion, voiceId, format },
    headers: { Accept: format },
  });
  return blob;
}
