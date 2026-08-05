'use client';

/**
 * Thin wrapper over @stellar/freighter-api that:
 *  - loads the API only in the browser (it touches window),
 *  - normalises the v4 `{ error }`-returning shape into thrown errors, and
 *  - normalises the `signMessage` result (Buffer | base64 | Uint8Array) into a
 *    base64 string the backend can verify.
 *
 * The backend verifies signatures per SEP-53, which is exactly what Freighter's
 * signMessage produces — see stellarplan-api/src/common/signature.ts.
 */

import { api, setTokens } from './api';

type SignMessageResult = {
  signedMessage: unknown;
  signerAddress?: string;
};

async function mod() {
  // Dynamic import keeps the extension bridge out of the server bundle.
  return import('@stellar/freighter-api');
}

/** True if the Freighter extension is installed and reachable. */
export async function isFreighterAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const api = await mod();
    const res = await api.isConnected();
    // v4 returns { isConnected }, older returns boolean.
    return typeof res === 'boolean' ? res : !!res?.isConnected;
  } catch {
    return false;
  }
}

/**
 * Prompt the user to grant access and return their public key (G...).
 * Throws if the user rejects or the extension is missing.
 */
export async function connectFreighter(): Promise<string> {
  const api = await mod();

  // requestAccess triggers the permission prompt on first use.
  const access: any = await api.requestAccess();
  if (access?.error) throw new Error(normaliseError(access.error));
  if (access?.address) return access.address;

  const addr: any = await api.getAddress();
  if (addr?.error) throw new Error(normaliseError(addr.error));
  if (!addr?.address) throw new Error('Could not read wallet address from Freighter');
  return addr.address;
}

/**
 * Ask Freighter to sign `message` and return the signature as base64.
 * Throws if the user rejects the signature request.
 */
export async function signMessageBase64(message: string): Promise<{ signature: string; address: string }> {
  const api = await mod();
  const res: any = (await api.signMessage(message)) as SignMessageResult & { error?: unknown };
  if (res?.error) throw new Error(normaliseError(res.error));
  if (res?.signedMessage == null) throw new Error('Freighter returned no signature');

  return {
    signature: toBase64(res.signedMessage),
    address: res.signerAddress ?? '',
  };
}

/** Coerce Buffer / Uint8Array / base64 string / {data:[]} into a base64 string. */
function toBase64(value: unknown): string {
  if (typeof value === 'string') {
    // Already base64 (or hex-looking) — assume base64 as Freighter uses it.
    return value;
  }
  if (value instanceof Uint8Array) {
    return uint8ToBase64(value);
  }
  if (Array.isArray(value)) {
    return uint8ToBase64(Uint8Array.from(value as number[]));
  }
  // Node-style Buffer serialised as { type: 'Buffer', data: number[] }.
  if (value && typeof value === 'object' && Array.isArray((value as any).data)) {
    return uint8ToBase64(Uint8Array.from((value as any).data));
  }
  throw new Error('Unrecognised signature format from Freighter');
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function normaliseError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) return String((error as any).message);
  return 'Freighter request failed';
}

/* ------------------------------------------------------------------ */
/* High-level flows                                                    */
/* ------------------------------------------------------------------ */

import { api, setTokens } from './api';

/**
 * Full Freighter login: connect → request a challenge → sign it → exchange the
 * signature for tokens, which are then stored. Returns the wallet address.
 * Every error path throws with a user-presentable message.
 */
export async function loginWithFreighter(): Promise<string> {
  const walletAddress = await connectFreighter();
  const { message, nonce } = await api.authChallenge(walletAddress);
  const { signature } = await signMessageBase64(message);
  const tokens = await api.authVerify(walletAddress, nonce, signature);
  setTokens(tokens);
  return walletAddress;
}

/**
 * Sign the break-vault challenge for `vaultId` and submit it. Returns the
 * updated vault. Throws if the user rejects the signature.
 */
export async function signAndBreakVault(vaultId: string) {
  const { message, nonce } = await api.breakChallenge(vaultId);
  const { signature } = await signMessageBase64(message);
  return api.breakVault(vaultId, nonce, signature);
}
