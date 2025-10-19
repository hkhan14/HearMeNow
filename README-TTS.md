# ElevenLabs TTS Integration

This project uses a lightweight Express server that proxies TTS requests to ElevenLabs.

## Configure environment

Create `.env.local` (already added to .gitignore) in the project root with:

```
ELEVENLABS_API_KEY=your_xi_api_key
ELEVENLABS_VOICE_ID=your_voice_id
PORT=3000
VITE_API_BASE_URL=http://localhost:3000
VITE_TTS_PROVIDER=elevenlabs
```

Notes:
- Do not expose ELEVENLABS_API_KEY in client-side env vars (no `VITE_` prefix).
- The Vite client uses `VITE_API_BASE_URL` for the proxy base.

## Run locally

- Start the backend and frontend together:

```
npm run dev:full
```

- Or run separately in two terminals:

```
npm run dev:server
npm run dev
```

The frontend dev server proxies `/api/*` to the backend.

## Frontend usage

`src/lib/tts.ts` calls `/api/tts` with `{ text, emotion }` and returns a Blob. `Index.tsx` turns it into an Object URL and plays it in `AudioPlayer`.

## Endpoint reference

- `POST /api/tts` JSON: `{ text: string, emotion: 'happy'|'sad'|'angry'|'calm'|'surprised'|'excited'|'neutral', voiceId?: string, format?: 'audio/mpeg'|'audio/wav'|'audio/ogg' }`
  - Response: Audio bytes
- `GET /api/health` → `{ ok: true, provider: 'elevenlabs', hasKey: boolean }`

## Troubleshooting

- 401/403 from ElevenLabs: Check `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`.
- CORS errors: The backend enables CORS for dev; ensure requests go to `/api` and the proxy is active.
- No audio: Check network tab for `/api/tts` response; ensure `Content-Type` is audio and not JSON error.

### Common issue: "Network error when contacting TTS server"
+

- The backend defaults to port 3000 but will automatically try the next port if 3000 is in use. If you see a popup saying "Network error when contacting TTS server", the frontend now attempts a small range of localhost ports (3000-3010) before failing. The error message will include the exact attempted URLs to help debugging.
- Ensure you start the backend with `npm run dev:server` (or `npm run dev:full` to start both). If you prefer a fixed port, set `PORT=3000` in `.env.local`.
- If you're running the frontend on a different machine or container, set `VITE_API_BASE_URL` in `.env.local` to `http://<host>:<port>` so the Vite proxy routes `/api` correctly.

