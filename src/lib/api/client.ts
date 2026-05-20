const rawBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/** Public base URL without trailing slash (for static uploads like `/uploads/...`). */
export function getPublicBase(): string {
  return rawBaseURL.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const base = getPublicBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export type RequestOptions = RequestInit & { token?: string };

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const msg = (data as { message?: unknown; error?: unknown }).message ?? (data as { error?: unknown }).error;
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg) && typeof msg[0] === "string") return msg[0];
  return null;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers: initHeaders, body, ...rest } = options;
  const headers = new Headers(initHeaders ?? {});

  // Set Accept header for JSON responses
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  if (!(body instanceof FormData)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(apiUrl(path), {
    ...rest,
    headers,
    body
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  let data: unknown = null;

  if (response.status !== 204 && response.status !== 205) {
    if (isJson) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    }
  }

  if (!response.ok) {
    const message = extractErrorMessage(data) ?? `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }

  return data as T;
}
