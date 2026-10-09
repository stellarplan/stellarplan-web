import { beforeEach, describe, expect, it, vi } from 'vitest';

type ApiModule = typeof import('@/lib/api');

const BASE = 'http://localhost:4000/api/v1';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Load a fresh copy of the module so its in-memory token cache starts empty. */
async function load(): Promise<ApiModule> {
  vi.resetModules();
  return import('@/lib/api');
}

function authHeader(init?: RequestInit): string | null {
  return new Headers(init?.headers).get('Authorization');
}

beforeEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe('token storage', () => {
  it('starts empty', async () => {
    const { getTokens } = await load();
    expect(getTokens()).toBeNull();
  });

  it('persists tokens and clears them again', async () => {
    const { getTokens, setTokens } = await load();
    setTokens({ accessToken: 'a', refreshToken: 'r' });
    expect(JSON.parse(localStorage.getItem('sp_tokens')!)).toEqual({
      accessToken: 'a',
      refreshToken: 'r',
    });
    setTokens(null);
    expect(localStorage.getItem('sp_tokens')).toBeNull();
    expect(getTokens()).toBeNull();
  });

  it('reads tokens saved by an earlier page load', async () => {
    localStorage.setItem('sp_tokens', JSON.stringify({ accessToken: 'a', refreshToken: 'r' }));
    const { getTokens } = await load();
    expect(getTokens()).toEqual({ accessToken: 'a', refreshToken: 'r' });
  });

  it('treats corrupted storage as signed out instead of crashing', async () => {
    localStorage.setItem('sp_tokens', '{not json');
    const { getTokens } = await load();
    expect(() => getTokens()).not.toThrow();
    expect(getTokens()).toBeNull();
  });
});

describe('snapshot cache', () => {
  it('remembers, returns, and clears values', async () => {
    const { cachedSnapshot, rememberSnapshot, clearSnapshots } = await load();
    expect(cachedSnapshot('dash')).toBeUndefined();
    expect(rememberSnapshot('dash', { n: 1 })).toEqual({ n: 1 });
    expect(cachedSnapshot('dash')).toEqual({ n: 1 });
    clearSnapshots();
    expect(cachedSnapshot('dash')).toBeUndefined();
  });
});

describe('requests', () => {
  it('sends the access token on authenticated calls', async () => {
    const { api, setTokens } = await load();
    setTokens({ accessToken: 'tok', refreshToken: 'ref' });
    const fetchMock = vi.fn().mockResolvedValue(json([]));
    vi.stubGlobal('fetch', fetchMock);

    await api.plans();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE}/plans`);
    expect(authHeader(init)).toBe('Bearer tok');
  });

  it('does not send credentials on the login calls', async () => {
    const { api, setTokens } = await load();
    setTokens({ accessToken: 'tok', refreshToken: 'ref' });
    const fetchMock = vi.fn().mockResolvedValue(json({ message: 'm', nonce: 'n' }));
    vi.stubGlobal('fetch', fetchMock);

    await api.authChallenge('GABC');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE}/auth/challenge`);
    expect(authHeader(init)).toBeNull();
    expect(JSON.parse(init.body)).toEqual({ walletAddress: 'GABC' });
  });

  it('builds the transactions query string', async () => {
    const { api } = await load();
    const fetchMock = vi.fn().mockResolvedValue(json([]));
    vi.stubGlobal('fetch', fetchMock);

    await api.transactions();
    await api.transactions(5, 'RELEASE');

    expect(fetchMock.mock.calls[0][0]).toBe(`${BASE}/transactions?limit=20`);
    expect(fetchMock.mock.calls[1][0]).toBe(`${BASE}/transactions?limit=5&type=RELEASE`);
  });

  it('turns an error response into an ApiError with status and message', async () => {
    const { api, ApiError } = await load();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ message: 'Vault not found' }, 404)));

    const error = await api.vault('v1').catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(404);
    expect(error.message).toBe('Vault not found');
  });

  it('falls back to the status text when the error body is not JSON', async () => {
    const { api } = await load();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('<html>bad gateway</html>', { status: 502, statusText: 'Bad Gateway' })),
    );
    const error = await api.plans().catch((e) => e);
    expect(error.status).toBe(502);
    expect(error.message).toBe('Bad Gateway');
  });
});

describe('automatic token refresh', () => {
  /**
   * A tiny fake server that behaves like the real API: access token "old" is
   * expired, and each refresh token can be used exactly once (they rotate).
   */
  function fakeServer() {
    const usedRefreshTokens = new Set<string>();
    let refreshCalls = 0;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith('/auth/refresh')) {
        refreshCalls += 1;
        const { refreshToken } = JSON.parse(String(init?.body));
        if (refreshToken !== 'ref-1' || usedRefreshTokens.has(refreshToken)) {
          return json({ message: 'Invalid refresh token' }, 401);
        }
        usedRefreshTokens.add(refreshToken);
        return json({ accessToken: 'new', refreshToken: 'ref-2' });
      }
      return authHeader(init) === 'Bearer new' ? json({ ok: url }) : json({ message: 'expired' }, 401);
    });
    return { fetchMock, refreshCalls: () => refreshCalls };
  }

  it('refreshes once and retries the original request', async () => {
    const { api, setTokens, getTokens } = await load();
    setTokens({ accessToken: 'old', refreshToken: 'ref-1' });
    const server = fakeServer();
    vi.stubGlobal('fetch', server.fetchMock);

    const result = await api.plan('p1');

    expect(result).toEqual({ ok: `${BASE}/plans/p1` });
    expect(server.refreshCalls()).toBe(1);
    expect(getTokens()).toEqual({ accessToken: 'new', refreshToken: 'ref-2' });
  });

  it('shares one refresh between requests that expire together', async () => {
    // The dashboard fires several calls at once. Refresh tokens rotate, so a
    // second refresh with the same token fails and would sign the user out.
    const { api, setTokens, getTokens } = await load();
    setTokens({ accessToken: 'old', refreshToken: 'ref-1' });
    const server = fakeServer();
    vi.stubGlobal('fetch', server.fetchMock);

    const results = await Promise.all([api.plans(), api.vaults(), api.notifications(), api.me()]);

    expect(results).toHaveLength(4);
    expect(server.refreshCalls()).toBe(1);
    expect(getTokens()).toEqual({ accessToken: 'new', refreshToken: 'ref-2' });
  });

  it('signs the user out when the refresh token is rejected', async () => {
    const { api, setTokens, getTokens, ApiError } = await load();
    setTokens({ accessToken: 'old', refreshToken: 'ref-dead' });
    vi.stubGlobal('fetch', fakeServer().fetchMock);

    const error = await api.plans().catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(401);
    expect(error.message).toBe('Session expired');
    expect(getTokens()).toBeNull();
    expect(localStorage.getItem('sp_tokens')).toBeNull();
  });

  it('does not try to refresh when there is no refresh token', async () => {
    const { api } = await load();
    const fetchMock = vi.fn().mockResolvedValue(json({ message: 'Unauthorized' }, 401));
    vi.stubGlobal('fetch', fetchMock);

    const error = await api.plans().catch((e) => e);

    expect(error.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('can refresh again later, after an earlier refresh finished', async () => {
    const { api, setTokens } = await load();
    setTokens({ accessToken: 'old', refreshToken: 'ref-1' });
    const server = fakeServer();
    vi.stubGlobal('fetch', server.fetchMock);
    await api.plans();

    // Expire the new token and hand out a fresh refresh token for round two.
    setTokens({ accessToken: 'old', refreshToken: 'ref-1b' });
    const second = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith('/auth/refresh')) return json({ accessToken: 'new', refreshToken: 'ref-3' });
      return authHeader(init) === 'Bearer new' ? json({ ok: true }) : json({}, 401);
    });
    vi.stubGlobal('fetch', second);

    await expect(api.plans()).resolves.toEqual({ ok: true });
    expect(second.mock.calls.filter(([u]) => String(u).endsWith('/auth/refresh'))).toHaveLength(1);
  });

  it('reuses a newer token when another request refreshed while this one was in flight', async () => {
    const { api, setTokens } = await load();
    setTokens({ accessToken: 'old', refreshToken: 'ref-1' });

    let refreshCalls = 0;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith('/auth/refresh')) {
        refreshCalls += 1;
        return json({ message: 'already used' }, 401);
      }
      if (authHeader(init) === 'Bearer old') {
        // Meanwhile a different request finished refreshing.
        setTokens({ accessToken: 'new', refreshToken: 'ref-2' });
        return json({ message: 'expired' }, 401);
      }
      return json({ ok: true });
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(api.plans()).resolves.toEqual({ ok: true });
    expect(refreshCalls).toBe(0);
  });
});
