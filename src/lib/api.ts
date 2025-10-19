// Lightweight API client for the frontend to talk to the backend
// Uses VITE_API_BASE_URL and supports JSON and Blob responses.

// Use VITE_API_BASE_URL if provided (trim trailing slash), otherwise default to relative paths
const rawBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
export const BASE_URL = rawBase ? rawBase.replace(/\/+$/, "") : "";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function buildCandidates(path: string) {
  const candidates: string[] = [];
  if (path.match(/^https?:\/\//)) {
    candidates.push(path);
    return candidates;
  }
  // relative path first to allow Vite dev proxy
  candidates.push(path);
  // explicit localhost fallback
  candidates.push(`http://localhost:3000${path.startsWith("/") ? "" : "/"}${path}`);
  // configured base url last
  if (BASE_URL) candidates.push(`${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`);
  return candidates;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: { method?: HttpMethod; body?: any; headers?: Record<string, string> } = {}
): Promise<T> {
  const candidates = buildCandidates(path);

  const headersBase: Record<string, string> = {
    ...(options.headers || {}),
  };

  const bodyIsJson = options.body !== undefined && !(options.body instanceof FormData);
  if (bodyIsJson) headersBase["Content-Type"] = "application/json";

  let lastErr: any = null;
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: options.method ?? "GET",
        headers: headersBase,
        body: bodyIsJson ? JSON.stringify(options.body) : options.body,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return (await res.json()) as T;
      }
      return (await res.text()) as unknown as T;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
      const isNetwork = msg.includes("network error") || msg.includes("failed to fetch") || msg.includes("unable to connect") || msg.includes("getaddrinfo");
      if (!isNetwork) throw err;
      // eslint-disable-next-line no-console
      console.warn(`apiFetch: network error when trying ${url} — trying next candidate.`, err);
    }
  }

  const finalMsg = lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new Error(`Network error: ${finalMsg}. Attempted URLs: ${candidates.join(", ")}`);
}

export async function apiFetchBlob(
  path: string,
  options: { method?: HttpMethod; body?: any; headers?: Record<string, string> } = {}
): Promise<Blob> {
  const candidates = buildCandidates(path);

  const headersBase: Record<string, string> = {
    ...(options.headers || {}),
  };
  const bodyIsJson = options.body !== undefined && !(options.body instanceof FormData);
  if (bodyIsJson) headersBase["Content-Type"] = "application/json";

  let lastErr: any = null;
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: options.method ?? "GET",
        headers: headersBase,
        body: bodyIsJson ? JSON.stringify(options.body) : options.body,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
      }

      return await res.blob();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
      const isNetwork = msg.includes("network error") || msg.includes("failed to fetch") || msg.includes("unable to connect") || msg.includes("getaddrinfo");
      if (!isNetwork) throw err;
      // eslint-disable-next-line no-console
      console.warn(`apiFetchBlob: network error when trying ${url} — trying next candidate.`, err);
    }
  }

  const finalMsg = lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new Error(`Network error: ${finalMsg}. Attempted URLs: ${candidates.join(", ")}`);
}
