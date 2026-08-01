'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, setTokens, ApiError } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const tokens = await api.register(email, password, name);
      setTokens(tokens);
      router.push('/onboarding');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="card max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl mb-2">Create account</h1>
          <p className="text-muted text-sm">One-time setup takes less than a minute.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="surface-chip chip-danger w-full !justify-start text-sm py-3 px-4">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-2">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-2">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-2">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <p className="text-xs text-muted mt-1">Minimum 8 characters.</p>
          </div>

          <button className="btn-primary w-full" disabled={busy}>
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Already have one?{' '}
          <Link href="/login" className="text-jade font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
