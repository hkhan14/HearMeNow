import { apiFetch } from "@/lib/api";

// Local fallback heuristic; mirrors server fallback
function heuristic(text: string) {
  const lc = text.toLowerCase();
  if (lc.includes("happy") || lc.includes("thank") || lc.includes("love") || lc.includes("great") || lc.includes("amazing")) return "happy";
  if (lc.includes("sorry") || lc.includes("sad") || lc.includes("depressed") || lc.includes("unhappy")) return "sad";
  if (lc.includes("angry") || lc.includes("hate") || lc.includes("frustrat")) return "angry";
  if (lc.includes("calm") || lc.includes("relax") || lc.includes("peace")) return "calm";
  if (lc.includes("wow") || lc.includes("surpris") || lc.includes("what!?")) return "surprised";
  if (lc.includes("excited") || lc.includes("thrill") || lc.includes("pump")) return "excited";
  return "neutral";
}

export async function detectEmotion(text: string) {
  try {
    const res = await apiFetch<{ emotion?: string; provider?: string; reason?: string; raw?: any }>("/api/detect-emotion", {
      method: "POST",
      body: { text },
    });

    // If server indicated fallback or didn't return an emotion, use client heuristic
    if (!res || !res.emotion) {
      return { emotion: heuristic(text), provider: "client_fallback" };
    }

    return res;
  } catch (err) {
    // network or other error — use local heuristic
    return { emotion: heuristic(text), provider: "client_fallback", error: err instanceof Error ? err.message : String(err) };
  }
}

export type DetectedEmotion = Awaited<ReturnType<typeof detectEmotion>>;
