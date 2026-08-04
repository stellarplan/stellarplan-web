const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

/* ------------------------------------------------------------------ */
/* Types (mirror the NestJS DTOs & Prisma models)                       */
/* ------------------------------------------------------------------ */
export type PlanType = 'BILL' | 'EMERGENCY' | 'SAVINGS';
export const VaultStatus = {
  LOCKED: 'LOCKED', RELEASED: 'RELEASED', EARLY_WITHDRAWN: 'EARLY_WITHDRAWN',
} as const;
export type VaultStatus = (typeof VaultStatus)[keyof typeof VaultStatus];

export interface User {
  id: string;
  email: string;
  name: string;
  walletAddress: string | null;
  vaultContractId: string | null;
  createdAt: string;
}

export interface Tokens { accessToken: string; refreshToken: string; }

export interface Plan {
  id: string;
  name: string;
  category: string;
  amount: string;      // decimal as string
  unlockDay: number | null;
  planType: PlanType;
  description: string | null;
  icon: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vault {
  id: string;
  budgetPlanId: string | null;
  category: string;
  name: string;
  amount: string;
  status: VaultStatus;
  unlockDate: string | null;
  planType: PlanType;
  releasedAt: string | null;
  earlyWithdrawnAt: string | null;
  releaseTxHash: string | null;
  breakTxHash: string | null;
  createdAt: string;
  budgetPlan?: { icon: string | null; category: string } | null;
}

export interface Transaction {
  id: string;
  wallet: string;
  amount: string;
  type: 'SALARY_DEPOSIT' | 'ALLOCATION' | 'RELEASE' | 'EARLY_WITHDRAWAL' | 'DEPOSIT';
  description: string | null;
  txHash: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Dashboard {
  user: Pick<User, 'id' | 'name' | 'walletAddress' | 'vaultContractId'>;
  balances: { protected: number; planned: number; releasedThisMonth: number; onChainAvailable: number };
  plans: Plan[];
  vaults: Vault[];
  recentTransactions: Transaction[];
  unreadNotifications: number;
}

/* ------------------------------------------------------------------ */
/* Token storage                                                       */
/* ------------------------------------------------------------------ */
let cached: Tokens | null = null;

export function getTokens(): Tokens | null {
  if (cached) return cached;
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('sp_tokens');
  cached = raw ? JSON.parse(raw) : null;
  return cached;
}

export function setTokens(t: Tokens | null) {
  cached = t;
  if (typeof window === 'undefined') return;
  if (t) localStorage.setItem('sp_tokens', JSON.stringify(t));
  else localStorage.removeItem('sp_tokens');
}

/* ------------------------------------------------------------------ */
/* Low-level fetch with auto-refresh                                    */
/* ------------------------------------------------------------------ */
async function raw<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  if (auth) {
    let tokens = getTokens();
    if (tokens?.accessToken) headers.set('Authorization', `Bearer ${tokens.accessToken}`);

    let res = await fetch(`${API}${path}`, { ...init, headers });

    if (res.status === 401 && tokens?.refreshToken) {
      const refreshed = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });
      if (refreshed.ok) {
        const next = await refreshed.json();
        setTokens(next);
        headers.set('Authorization', `Bearer ${next.accessToken}`);
        res = await fetch(`${API}${path}`, { ...init, headers });
      } else {
        setTokens(null);
        throw new ApiError(401, 'Session expired');
      }
    }

    return handle<T>(res);
  }

  const res = await fetch(`${API}${path}`, { ...init, headers });
  return handle<T>(res);
}

async function handle<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body?.message ?? res.statusText, body);
  return body as T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) { super(message); this.name = 'ApiError'; }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */
export const api = {
  /* auth */
  register: (email: string, password: string, name: string) =>
    raw<Tokens>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }, false),
  login: (email: string, password: string) =>
    raw<Tokens>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false),
  loginWithWallet: (walletAddress: string, walletId = 'FREIGHTER') =>
    raw<Tokens>('/auth/wallet', { method: 'POST', body: JSON.stringify({ walletAddress, walletId }) }, false),
  logout: () => raw<{ ok: true }>('/auth/logout', { method: 'POST' }),
  me: () => raw<User>('/auth/me'),

  /* users */
  dashboard: () => raw<Dashboard>('/users/dashboard'),

  /* wallet */
  connectWallet: (walletId: string, address: string) =>
    raw<User>('/wallet/connect', { method: 'POST', body: JSON.stringify({ walletId, address }) }),

  /* plans */
  plans: () => raw<Plan[]>('/plans'),
  plan: (id: string) => raw<Plan>(`/plans/${id}`),
  createPlan: (data: Partial<Plan>) =>
    raw<Plan>('/plans', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (id: string, data: Partial<Plan>) =>
    raw<Plan>(`/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlan: (id: string) => raw<Plan>(`/plans/${id}`, { method: 'DELETE' }),

  /* vaults */
  vaults: () => raw<Vault[]>('/vaults'),
  vault: (id: string) => raw<Vault>(`/vaults/${id}`),
  breakVault: (vaultId: string, password?: string) =>
    raw<Vault>('/vaults/break', { method: 'POST', body: JSON.stringify({ vaultId, password: password ?? 'wallet_auth' }) }),

  /* allocations */
  detectAllocations: (walletAddress?: string) =>
    raw<{ allocated: number; vaults: string[]; skipped: number; paymentsProcessed: number }>(
      '/allocations/detect',
      { method: 'POST', body: JSON.stringify(walletAddress ? { walletAddress } : {}) },
    ),
  allocationHistory: () =>
    raw<Array<{ txHash: string; vaultCount: number; totalAmount: number; date: string }>>('/allocations/history'),

  /* transactions */
  transactions: (limit = 20, type?: string) =>
    raw<Transaction[]>(`/transactions?limit=${limit}${type ? `&type=${type}` : ''}`),

  /* notifications */
  notifications: () => raw<Notification[]>('/notifications'),
  markNotificationRead: (id: string) =>
    raw<Notification>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () =>
    raw<{ count: number }>('/notifications/read-all', { method: 'PATCH' }),
};
