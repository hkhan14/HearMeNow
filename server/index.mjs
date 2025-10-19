import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load .env.local first (if present), then .env to allow local overrides
dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, provider: "elevenlabs", hasKey: Boolean(process.env.ELEVENLABS_API_KEY) });
});

// Map our UI emotions to optional ElevenLabs voice settings (tweak as needed)
function settingsForEmotion(emotion) {
  /**
   * ElevenLabs voice_settings:
   * - stability: 0-1 (lower = more expressive/variable, higher = more consistent)
   * - similarity_boost: 0-1 (higher = closer to original voice)
   * - style: 0-1 (higher = more exaggerated/expressive)
   * - use_speaker_boost: true (recommended for more natural output)
   *
   * Each emotion is tuned for distinct tone and delivery:
   */
  switch (emotion) {
    case "happy":
      // Happy: expressive, warm, natural smile, moderate pitch variation
      // Lower stability for more expressiveness, high style for brightness, high similarity for naturalness
      return { stability: 0.35, similarity_boost: 0.92, style: 0.85, use_speaker_boost: true };
    case "excited":
      // Excited: animated, energetic, high pitch and style
      // Very low stability for maximum expressiveness, max style, moderate similarity
      return { stability: 0.12, similarity_boost: 0.7, style: 1.0, use_speaker_boost: true };
    case "angry":
      // Angry: forceful, clipped, intense
      // Very low stability for sharpness, high style for intensity, lower similarity for edge
      return { stability: 0.08, similarity_boost: 0.4, style: 0.98, use_speaker_boost: true };
    case "sad":
      // Sad: slow, soft, emotional
      // High stability for consistency, very low style for softness, max similarity for natural sadness
      return { stability: 0.97, similarity_boost: 1.0, style: 0.02, use_speaker_boost: true };
    case "calm":
      // Calm: steady, soothing, relaxed
      // Highest stability for smoothness, very low style, high similarity
      return { stability: 1.0, similarity_boost: 0.97, style: 0.01, use_speaker_boost: true };
    case "surprised":
      // Surprised: dynamic, expressive, big pitch changes
      // Very low stability for variability, max style, moderate similarity
      return { stability: 0.09, similarity_boost: 0.65, style: 1.0, use_speaker_boost: true };
    case "neutral":
    default:
      // Neutral: balanced, conversational, moderate style
      // Moderate stability and style, high similarity for naturalness
      return { stability: 0.65, similarity_boost: 0.9, style: 0.5, use_speaker_boost: true };
  }
}

app.post("/api/tts", async (req, res) => {
  try {
    const { text, emotion = "neutral", voiceId, format = "audio/mpeg" } = req.body || {};

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing 'text' in request body" });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const resolvedVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;
    if (!apiKey) return res.status(500).json({ error: "ELEVENLABS_API_KEY not configured" });
    if (!resolvedVoiceId) return res.status(500).json({ error: "ELEVENLABS_VOICE_ID not configured" });

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}`;

    const body = {
      text,
      // model_id: "eleven_monolingual_v1", // optionally configure
      voice_settings: settingsForEmotion(emotion),
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        accept: format,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const textErr = await resp.text().catch(() => "");
      return res.status(resp.status).json({ error: textErr || resp.statusText });
    }

    const arrayBuffer = await resp.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    res.setHeader("Content-Type", format);
    res.setHeader("Content-Length", String(buf.length));
    return res.status(200).send(buf);
  } catch (err) {
    const message = err?.message || "Unknown error";
    return res.status(500).json({ error: message });
  }
});

// Helper: list available voices to pick a valid ELEVENLABS_VOICE_ID
app.get("/api/voices", async (req, res) => {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "ELEVENLABS_API_KEY not configured" });

    const url = "https://api.elevenlabs.io/v1/voices";
    const resp = await fetch(url, {
      headers: {
        "xi-api-key": apiKey,
        accept: "application/json",
      },
    });
    if (!resp.ok) {
      const textErr = await resp.text().catch(() => "");
      return res.status(resp.status).json({ error: textErr || resp.statusText });
    }
    const data = await resp.json();
    // Return a trimmed list of voices for convenience
    const voices = (data?.voices || []).map((v) => ({ id: v.voice_id, name: v.name, category: v.category }));
    return res.json({ voices });
  } catch (err) {
    const message = err?.message || "Unknown error";
    return res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`);
});
