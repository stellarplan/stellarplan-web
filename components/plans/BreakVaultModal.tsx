'use client';

import { useEffect, useState } from 'react';

export interface BreakVaultModalProps {
  open: boolean;
  purpose: string;
  onClose(): void;
  onConfirm(): Promise<void>;
}

export function BreakVaultModal({ open, purpose, onClose, onConfirm }: BreakVaultModalProps) {
  const [step, setStep] = useState<'confirm' | 'countdown' | 'done'>('confirm');
  const [seconds, setSeconds] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setStep('confirm'); setSeconds(30); setError(''); }
  }, [open]);

  useEffect(() => {
    if (step !== 'countdown') return;
    if (seconds <= 0) {
      setSubmitting(true);
      onConfirm()
        .then(() => setStep('done'))
        .catch((e) => { setError(e.message); setStep('confirm'); })
        .finally(() => setSubmitting(false));
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds, onConfirm]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!submitting ? onClose : undefined} />

      <div className="relative card max-w-md w-full p-6 space-y-6" role="dialog" aria-modal>
        {step === 'confirm' && (
          <>
            <div className="text-center space-y-2">
              <div className="text-4xl">⚠️</div>
              <h2 className="text-2xl">Withdraw early?</h2>
              <p className="text-muted text-sm leading-relaxed">
                You are about to withdraw from your <strong>{purpose}</strong> plan.
                This may affect your ability to pay this bill on time.
              </p>
              <p className="text-sm text-muted">Continue?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn-copper" onClick={() => setStep('countdown')}>Yes, withdraw</button>
            </div>
          </>
        )}

        {step === 'countdown' && (
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl font-semibold">{seconds}</div>
            <p className="text-muted text-sm">Preparing withdrawal — waiting before final signature.</p>
            <div className="h-2 bg-clay rounded-full overflow-hidden">
              <div
                className="h-full bg-copper transition-all duration-1000 ease-linear"
                style={{ width: `${((30 - seconds) / 30) * 100}%` }}
              />
            </div>
            {submitting && <p className="text-xs text-muted">Releasing funds…</p>}
            {error && <p className="text-danger text-sm">{error}</p>}
          </div>
        )}

        {step === 'done' && (
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl">✅</div>
            <h3 className="text-2xl">Withdrawn</h3>
            <p className="text-muted text-sm">Funds are back in your available balance.</p>
            <button className="btn-primary w-full" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
