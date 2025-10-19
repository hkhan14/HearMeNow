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
    // Log the outgoing TTS request (no API key printed)
    // eslint-disable-next-line no-console
    console.log("/api/tts -> calling ElevenLabs TTS", { voiceId: resolvedVoiceId, emotion, format });

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
      // Log error details to server console for debugging
      // eslint-disable-next-line no-console
      console.error("ElevenLabs TTS error", { status: resp.status, statusText: resp.statusText, body: textErr });
      return res.status(resp.status).json({ error: textErr || resp.statusText, provider: "elevenlabs" });
    }

    const arrayBuffer = await resp.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    res.setHeader("Content-Type", format);
    res.setHeader("Content-Length", String(buf.length));
    // eslint-disable-next-line no-console
    console.log(`/api/tts -> ElevenLabs OK, returning ${buf.length} bytes`);
    return res.status(200).send(buf);
  } catch (err) {
    const message = err?.message || "Unknown error";
    // Log full error for debugging
    // eslint-disable-next-line no-console
    console.error("/api/tts caught error:", err);
    return res.status(500).json({ error: message, stack: err?.stack });
  }
});

// Helper: list available voices to pick a valid ELEVENLABS_VOICE_ID
app.get("/api/voices", async (req, res) => {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "ELEVENLABS_API_KEY not configured" });

    const url = "https://api.elevenlabs.io/v1/voices";
    // eslint-disable-next-line no-console
    console.log("/api/voices -> calling ElevenLabs voices list");
    const resp = await fetch(url, {
      headers: {
        "xi-api-key": apiKey,
        accept: "application/json",
      },
    });
    if (!resp.ok) {
      const textErr = await resp.text().catch(() => "");
      // eslint-disable-next-line no-console
      console.error("ElevenLabs voices error", { status: resp.status, statusText: resp.statusText, body: textErr });
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

// Emotion detection: uses OpenAI (if configured) to classify a short piece of text
// into one of the supported emotions: happy, sad, angry, calm, surprised, excited, neutral
app.post("/api/detect-emotion", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing 'text' in request body" });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    // Allow explicitly disabling OpenAI calls (useful when quota is exhausted)
    if (process.env.DISABLE_OPENAI_DETECT === "1" || process.env.DISABLE_OPENAI_DETECT === "true") {
      // eslint-disable-next-line no-console
      console.log("OpenAI detection disabled via DISABLE_OPENAI_DETECT; using heuristic fallback.");
      return res.json({ emotion: fallback(text), provider: "disabled_fallback", reason: "disabled_by_env" });
    }

    // Local fallback heuristic (very simple) if no OpenAI key is available
    const fallback = (t) => {
      const lc = t.toLowerCase();
      if (lc.includes("happy") || lc.includes("thank") || lc.includes("love") || lc.includes("great") || lc.includes("amazing")) return "happy";
      if (lc.includes("sorry") || lc.includes("sad") || lc.includes("depressed") || lc.includes("unhappy")) return "sad";
      if (lc.includes("angry") || lc.includes("hate") || lc.includes("frustrat")) return "angry";
      if (lc.includes("calm") || lc.includes("relax") || lc.includes("peace")) return "calm";
      if (lc.includes("wow") || lc.includes("surpris") || lc.includes("what!?")) return "surprised";
      if (lc.includes("excited") || lc.includes("thrill") || lc.includes("pump")) return "excited";
      return "neutral";
    };

    if (!openaiKey) {
      return res.json({ emotion: fallback(text), provider: "fallback" });
    }

    // Call OpenAI completions/chat to classify the emotion into one of our labels.
    // We keep the prompt strict so the model returns only the label.
    const prompt = `Classify the emotional tone of the following text into one of these labels: happy, sad, angry, calm, surprised, excited, neutral. Return only the single label without punctuation.\n\nText: "${text.replace(/"/g, '\\"')}"\n\nLabel:`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({ model, input: prompt }),
    });

    if (!response.ok) {
      const txt = await response.text().catch(() => "");
      // Try to parse error JSON to detect quota/insufficient_quota
      let parsedErr = null;
      try {
        parsedErr = JSON.parse(txt || "null");
      } catch (e) {
        // ignore
      }

      const isQuota = response.status === 429 ||
        (parsedErr && ((parsedErr.error && parsedErr.error.type && parsedErr.error.type === "insufficient_quota") ||
          (parsedErr.error && parsedErr.error.code && parsedErr.error.code === "insufficient_quota") ||
          (parsedErr.error && parsedErr.error.message && typeof parsedErr.error.message === "string" && parsedErr.error.message.toLowerCase().includes("quota"))));

      // Also treat server errors as fallback to keep UX working
      const isServerError = response.status >= 500;

      if (isQuota || isServerError) {
        // Log and fall back to local heuristic to avoid breaking UX when quota exceeded
        // eslint-disable-next-line no-console
        console.warn("OpenAI quota/server error detected; falling back to heuristic for emotion detection", { status: response.status, parsedErr, txt });
        return res.json({ emotion: fallback(text), provider: "openai_fallback", reason: isQuota ? "insufficient_quota" : "server_error", raw: parsedErr || txt });
      }

      return res.status(response.status).json({ error: txt || response.statusText });
    }

    const data = await response.json();
    // Attempt to find the returned text
    let label = null;
    try {
      // new Responses API may put output in data.output[0].content[0].text or data.output_text
      if (data.output_text) label = data.output_text;
      else if (Array.isArray(data.output) && data.output[0] && data.output[0].content) {
        const content = data.output[0].content.find((c) => c.type === "output_text" || c.type === "text");
        if (content) label = content.text || content; 
      }
    } catch (e) {
      // ignore
    }

    // fallback to parsing choices if present (older chat completions style)
    if (!label && data.choices && data.choices[0] && data.choices[0].message) {
      label = data.choices[0].message.content;
    }

    if (!label || typeof label !== "string") {
      return res.json({ emotion: fallback(text), provider: "openai", raw: data });
    }

    // Normalize label to one of allowed tokens
    const normalized = label.trim().toLowerCase().match(/happy|sad|angry|calm|surpris|excited|neutral/);
    let emotion = "neutral";
    if (normalized) {
      const found = normalized[0];
      if (found.startsWith("surpris")) emotion = "surprised";
      else emotion = found === "excited" ? "excited" : found === "happy" ? "happy" : found === "sad" ? "sad" : found === "angry" ? "angry" : found === "calm" ? "calm" : "neutral";
    }

    return res.json({ emotion, provider: "openai" });
  } catch (err) {
    const message = err?.message || "Unknown error";
    return res.status(500).json({ error: message });
  }
});

// Robust startup: attempt to listen and on EADDRINUSE try the next port once.
function startServer(port, triedPorts = new Set()) {
  if (triedPorts.has(port)) {
    // eslint-disable-next-line no-console
    console.error(`Unable to start server: ports attempted: ${[...triedPorts].join(", ")}`);
    process.exit(1);
  }

  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      // eslint-disable-next-line no-console
      console.warn(`Port ${port} already in use. Trying port ${port + 1}...`);
      triedPorts.add(port);
      // allow time for OS to release resources if needed
      setTimeout(() => startServer(port + 1, triedPorts), 300);
      return;
    }
    // eslint-disable-next-line no-console
    console.error("Server error:", err);
    process.exit(1);
  });
}

startServer(Number(PORT));

// Lightweight debug endpoint to confirm server environment (no secrets exposed)
app.get("/api/debug", (req, res) => {
  const hasEleven = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  return res.json({ ok: true, port: PORT, provider: { elevenlabs: hasEleven, openai: hasOpenAI } });
});
