export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  status?: number;
}

type Fetcher = typeof fetch;

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  fetcher: Fetcher = fetch
): Promise<ApiResult<T>> {
  try {
    const res = await fetcher(input, init);
    const contentType = res.headers.get('content-type') || '';
    let body: any = undefined;
    if (contentType.includes('application/json')) {
      body = await res.json();
    } else if (contentType.startsWith('text/')) {
      body = await res.text();
    }
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: (body && (body.error || body.message)) || `Request failed (${res.status})`,
      };
    }
    return { ok: true, data: body as T, status: res.status };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Network error' };
  }
}

export function unwrap<T>(result: ApiResult<T>): T {
  if (!result.ok) throw new Error(result.error || 'Unknown error');
  return result.data as T;
}
