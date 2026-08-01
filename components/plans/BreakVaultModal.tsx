'use client';

import { useEffect, useState } from 'react';

export interface BreakVaultModalProps {
  open: boolean;
  purpose: string;
  onClose(success?: boolean): void;
  onConfirm(password: string): Promise<void>;
}

/**
 * PRD §6 — early withdrawal carries intentional friction:
 *   1. confirm the action
 *   2. re-authenticate (password; wallet-signature equivalent for the MVP)
 *   3. short countdown before execution
 */
export function BreakVaultModal({ open, purpose, onClose, onConfirm }: BreakVaultModalProps) {
  const [step, setStep] = useState<'confirm' | 'auth' | 'countdown' | 'done'>('confirm');
  const [password, setPassword] = useState('');
  const [seconds, setSeconds] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setStep('confirm'); setPassword(''); setSeconds(10); setError(''); }
  }, [open]);

  // countdown -> on zero, submit with the password entered in the auth step
  useEffect(() => {
    if (step !== 'countdown') return;
    if (seconds <= 0) {
      setSubmitting(true);
      onConfirm(password)
        .then(() => setStep('done'))
        .catch((e) => { setError(e.message ?? 'Withdrawal failed'); setStep('auth'); })
        .finally(() => setSubmitting(false));
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds, onConfirm, password]);

  if (!open) return null;
  const dismissible = !submitting && step !== 'countdown';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={dismissible ? () => onClose(false) : undefined}
      />

      <div className="relative card max-w-md w-full p-6 space-y-6" role="dialog" aria-modal="true" aria-label="Withdraw early">
        {step === 'confirm' && (
          <>
            <div className="text-center space-y-2">
              <div className="text-4xl" aria-hidden>⚠️</div>
              <h2 className="text-2xl">Withdraw early?</h2>
              <p className="text-muted text-sm leading-relaxed">
                You are about to withdraw from your <strong>{purpose}</strong> plan.
                This may affect your ability to pay this bill when it's due.
              </p>
              <p className="text-sm text-muted">Continue?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-ghost" onClick={() => onClose(false)}>Keep it protected</button>
              <button className="btn-copper" onClick={() => setStep('auth')}>Continue anyway</button>
            </div>
          </>
        )}

        {step === 'auth' && (
          <>
            <div className="text-center space-y-2">
              <div className="text-4xl" aria-hidden>🔑</div>
              <h2 className="text-2xl">Confirm it's you</h2>
              <p className="text-muted text-sm">Enter your account password to authorize this withdrawal.</p>
            </div>
            {error && <p className="text-danger text-sm text-center">{error}</p>}
            <form
              className="space-y-3"
              onSubmit={(e) => { e.preventDefault(); if (password) { setError(''); setStep('countdown'); } }}
            >
              <input
                className="input"
                type="password"
                aria-label="Account password"
                placeholder="Account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="btn-ghost" onClick={() => setStep('confirm')}>Back</button>
                <button type="submit" className="btn-primary">Authorize</button>
              </div>
            </form>
          </>
        )}

        {step === 'countdown' && (
          <div className="text-center space-y-4 py-4" aria-live="polite">
            <div className="text-5xl font-semibold" data-balance>{seconds}</div>
            <p className="text-muted text-sm">Preparing withdrawal — take a breath, your plan thanks you.</p>
            <div className="h-2 bg-clay rounded-full overflow-hidden" role="progressbar" aria-valuenow={10 - seconds} aria-valuemax={10}>
              <div className="h-full bg-copper transition-all duration-1000 ease-linear" style={{ width: `${((10 - seconds) / 10) * 100}%` }} />
            </div>
            {submitting && <p className="text-xs text-muted">Releasing funds…</p>}
          </div>
        )}

        {step === 'done' && (
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl" aria-hidden>✅</div>
            <h3 className="text-2xl">Withdrawn</h3>
            <p className="text-muted text-sm">Funds are back in your available balance.</p>
            <button className="btn-primary w-full" onClick={() => onClose(true)}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
