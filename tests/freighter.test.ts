import { beforeEach, describe, expect, it, vi } from 'vitest';

const freighter = {
  isConnected: vi.fn(),
  requestAccess: vi.fn(),
  getAddress: vi.fn(),
  signMessage: vi.fn(),
};

vi.mock('@stellar/freighter-api', () => freighter);

const apiMock = {
  authChallenge: vi.fn(),
  authVerify: vi.fn(),
  breakChallenge: vi.fn(),
  breakVault: vi.fn(),
};
const setTokens = vi.fn();
vi.mock('@/lib/api', () => ({ api: apiMock, setTokens }));

async function load() {
  return import('@/lib/freighter');
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('isFreighterAvailable', () => {
  it('is true when the extension reports it is connected (v4 shape)', async () => {
    freighter.isConnected.mockResolvedValue({ isConnected: true });
    expect(await (await load()).isFreighterAvailable()).toBe(true);
  });

  it('accepts the older boolean shape', async () => {
    freighter.isConnected.mockResolvedValue(true);
    expect(await (await load()).isFreighterAvailable()).toBe(true);
  });

  it('is false when not connected or when the call throws', async () => {
    const { isFreighterAvailable } = await load();
    freighter.isConnected.mockResolvedValue({ isConnected: false });
    expect(await isFreighterAvailable()).toBe(false);
    freighter.isConnected.mockRejectedValue(new Error('no extension'));
    expect(await isFreighterAvailable()).toBe(false);
  });
});

describe('connectFreighter', () => {
  it('returns the address granted by the permission prompt', async () => {
    freighter.requestAccess.mockResolvedValue({ address: 'GABC' });
    expect(await (await load()).connectFreighter()).toBe('GABC');
    expect(freighter.getAddress).not.toHaveBeenCalled();
  });

  it('falls back to getAddress when access was already granted', async () => {
    freighter.requestAccess.mockResolvedValue({});
    freighter.getAddress.mockResolvedValue({ address: 'GDEF' });
    expect(await (await load()).connectFreighter()).toBe('GDEF');
  });

  it('surfaces a rejection as a readable error', async () => {
    freighter.requestAccess.mockResolvedValue({ error: { message: 'User declined access' } });
    await expect((await load()).connectFreighter()).rejects.toThrow('User declined access');
  });

  it('accepts a plain string error', async () => {
    freighter.requestAccess.mockResolvedValue({ error: 'Locked' });
    await expect((await load()).connectFreighter()).rejects.toThrow('Locked');
  });

  it('fails clearly when no address can be read at all', async () => {
    freighter.requestAccess.mockResolvedValue({});
    freighter.getAddress.mockResolvedValue({});
    await expect((await load()).connectFreighter()).rejects.toThrow(/Could not read wallet address/);
  });
});

describe('signMessageBase64', () => {
  const BYTES = [1, 2, 3, 250, 251, 252];
  const BASE64 = btoa(String.fromCharCode(...BYTES));

  it('passes a base64 string through unchanged', async () => {
    freighter.signMessage.mockResolvedValue({ signedMessage: 'AQID', signerAddress: 'GABC' });
    expect(await (await load()).signMessageBase64('hi')).toEqual({ signature: 'AQID', address: 'GABC' });
  });

  it('encodes a Uint8Array', async () => {
    freighter.signMessage.mockResolvedValue({ signedMessage: Uint8Array.from(BYTES) });
    expect((await (await load()).signMessageBase64('hi')).signature).toBe(BASE64);
  });

  it('encodes a plain number array', async () => {
    freighter.signMessage.mockResolvedValue({ signedMessage: BYTES });
    expect((await (await load()).signMessageBase64('hi')).signature).toBe(BASE64);
  });

  it('encodes a serialised Buffer ({ type, data })', async () => {
    freighter.signMessage.mockResolvedValue({ signedMessage: { type: 'Buffer', data: BYTES } });
    expect((await (await load()).signMessageBase64('hi')).signature).toBe(BASE64);
  });

  it('reports a missing signature and an unknown format', async () => {
    const { signMessageBase64 } = await load();
    freighter.signMessage.mockResolvedValue({});
    await expect(signMessageBase64('hi')).rejects.toThrow(/no signature/);
    freighter.signMessage.mockResolvedValue({ signedMessage: 42 });
    await expect(signMessageBase64('hi')).rejects.toThrow(/Unrecognised signature format/);
  });

  it('surfaces the user rejecting the signature', async () => {
    freighter.signMessage.mockResolvedValue({ error: { message: 'User rejected' } });
    await expect((await load()).signMessageBase64('hi')).rejects.toThrow('User rejected');
  });
});

describe('loginWithFreighter', () => {
  it('connects, signs the server challenge, and stores the tokens', async () => {
    freighter.requestAccess.mockResolvedValue({ address: 'GABC' });
    apiMock.authChallenge.mockResolvedValue({ message: 'sign this', nonce: 'n1' });
    freighter.signMessage.mockResolvedValue({ signedMessage: 'c2ln' });
    apiMock.authVerify.mockResolvedValue({ accessToken: 'a', refreshToken: 'r' });

    const address = await (await load()).loginWithFreighter();

    expect(address).toBe('GABC');
    expect(apiMock.authChallenge).toHaveBeenCalledWith('GABC');
    expect(freighter.signMessage).toHaveBeenCalledWith('sign this');
    expect(apiMock.authVerify).toHaveBeenCalledWith('GABC', 'n1', 'c2ln');
    expect(setTokens).toHaveBeenCalledWith({ accessToken: 'a', refreshToken: 'r' });
  });

  it('stores no tokens when the user rejects the signature', async () => {
    freighter.requestAccess.mockResolvedValue({ address: 'GABC' });
    apiMock.authChallenge.mockResolvedValue({ message: 'sign this', nonce: 'n1' });
    freighter.signMessage.mockResolvedValue({ error: 'User rejected' });

    await expect((await load()).loginWithFreighter()).rejects.toThrow('User rejected');
    expect(apiMock.authVerify).not.toHaveBeenCalled();
    expect(setTokens).not.toHaveBeenCalled();
  });
});

describe('signAndBreakVault', () => {
  it('signs the break challenge and submits it for the right vault', async () => {
    apiMock.breakChallenge.mockResolvedValue({ message: 'break it', nonce: 'n2' });
    freighter.signMessage.mockResolvedValue({ signedMessage: 'c2ln' });
    apiMock.breakVault.mockResolvedValue({ id: 'v1', status: 'EARLY_WITHDRAWN' });

    const vault = await (await load()).signAndBreakVault('v1');

    expect(apiMock.breakChallenge).toHaveBeenCalledWith('v1');
    expect(apiMock.breakVault).toHaveBeenCalledWith('v1', 'n2', 'c2ln');
    expect(vault).toEqual({ id: 'v1', status: 'EARLY_WITHDRAWN' });
  });

  it('never submits the break when the wallet refuses to sign', async () => {
    apiMock.breakChallenge.mockResolvedValue({ message: 'break it', nonce: 'n2' });
    freighter.signMessage.mockResolvedValue({ error: 'User rejected' });

    await expect((await load()).signAndBreakVault('v1')).rejects.toThrow('User rejected');
    expect(apiMock.breakVault).not.toHaveBeenCalled();
  });
});
