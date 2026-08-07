'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export interface BreakVaultModalProps {
  open: boolean;
  purpose: string;
  onClose(success?: boolean): void;
  /** Runs the real break flow (challenge → Freighter signature → submit). */
  onConfirm(): Promise<void>;
}

export function BreakVaultModal({ open, purpose, onClose, onConfirm }: BreakVaultModalProps) {
  const [step, setStep] = useState<'confirm' | 'signing' | 'done'>('confirm');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setStep('confirm'); setError(''); }
  }, [open]);

  async function handleConfirm() {
    setError('');
    setStep('signing');
    try {
      await onConfirm();
      setStep('done');
    } catch (e: any) {
      setError(e?.message ?? 'Withdrawal failed or was rejected');
      setStep('confirm');
    }
  }

  if (!open) return null;
  const dismissible = step !== 'signing';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Solid Dark Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={dismissible ? () => onClose(false) : undefined}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative max-w-md w-full p-6 md:p-8 space-y-6 z-10 rounded-2xl bg-surface border border-danger-line shadow-2xl"
        role="dialog" aria-modal="true" aria-label="Withdraw early"
      >

        {/* CONFIRM */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto bg-danger-soft border border-danger-line">
                <AlertTriangle size={30} className="text-danger-text" />
              </div>
              <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Early Vault Release?</h2>
              <p className="text-xs leading-relaxed max-w-xs mx-auto text-muted">
                You are requesting early withdrawal for your <strong className="text-foreground">{purpose}</strong> vault.
                This breaks the smart-contract lock before the designated payment date. Freighter will ask you to sign to confirm.
              </p>
            </div>

            {error && <p className="text-xs text-center font-semibold text-danger-text">{error}</p>}

            <div className="space-y-3">
              <button
                id="freighter-confirm-break-btn"
                className="btn-primary w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                onClick={handleConfirm}
              >
                <Zap size={16} /> Confirm Release with Freighter Wallet
              </button>
              <button className="btn-ghost w-full py-3 rounded-xl text-sm" onClick={() => onClose(false)}>Keep Protected</button>
            </div>
          </div>
        )}

        {/* SIGNING */}
        {step === 'signing' && (
          <div className="text-center space-y-5 py-6" aria-live="polite">
            <div className="w-16 h-16 rounded-full grid place-items-center mx-auto border-2 border-accent-line border-t-emerald-500 animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">Waiting for your signature</p>
              <p className="text-xs text-muted">Approve the signature request in the Freighter popup to release these funds.</p>
            </div>
          </div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto bg-accent-soft border border-accent-line text-accent-text">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Withdrawal Complete</h3>
            <p className="text-xs leading-relaxed text-muted">
              Funds have been released back to your available balance.
            </p>
            <button id="return-to-dashboard-btn" className="btn-primary w-full py-3.5 rounded-xl" onClick={() => onClose(true)}>
              Return to Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
