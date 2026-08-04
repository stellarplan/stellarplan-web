'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, CheckCircle2, Shield } from 'lucide-react';

export interface BreakVaultModalProps {
  open: boolean;
  purpose: string;
  onClose(success?: boolean): void;
  onConfirm(password: string): Promise<void>;
}

export function BreakVaultModal({ open, purpose, onClose, onConfirm }: BreakVaultModalProps) {
  const [step, setStep] = useState<'confirm' | 'countdown' | 'done'>('confirm');
  const [freighter, setFreighter] = useState<{ isConnected: boolean; getPublicKey(): Promise<string> } | null>(null);
  const [seconds, setSeconds] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const w = window as any;
    if (w.freighter?.isConnected) setFreighter(w.freighter);
  }, []);

  useEffect(() => {
    if (open) { setStep('confirm'); setSeconds(10); setError(''); }
  }, [open]);

  useEffect(() => {
    if (step !== 'countdown') return;
    if (seconds <= 0) {
      setSubmitting(true);
      onConfirm('freighter_sig')
        .then(() => setStep('done'))
        .catch((e) => { setError(e.message ?? 'Withdrawal failed'); setStep('confirm'); })
        .finally(() => setSubmitting(false));
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds, onConfirm]);

  if (!open) return null;
  const dismissible = !submitting && step !== 'countdown';
  const pct = ((10 - seconds) / 10) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Solid Dark Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={dismissible ? () => onClose(false) : undefined}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative max-w-md w-full p-6 md:p-8 space-y-6 z-10 rounded-2xl bg-slate-900 border border-rose-800/60 shadow-2xl"
        role="dialog" aria-modal="true" aria-label="Withdraw early"
      >

        {/* CONFIRM */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto bg-rose-950 border border-rose-800">
                <AlertTriangle size={30} className="text-rose-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100" style={{ fontFamily: 'var(--font-display)' }}>Early Vault Release?</h2>
              <p className="text-xs leading-relaxed max-w-xs mx-auto text-slate-400">
                You are requesting early withdrawal for your <strong className="text-slate-200">{purpose}</strong> vault.
                This action breaks the smart contract lock before the designated payment date.
              </p>
            </div>

            {error && <p className="text-xs text-center font-semibold text-rose-400">{error}</p>}

            <div className="space-y-3">
              <button
                id="freighter-confirm-break-btn"
                className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                onClick={() => setStep('countdown')}
              >
                <Zap size={16} /> Confirm Release with Freighter Wallet
              </button>
              <button className="btn-ghost w-full py-3 rounded-xl text-sm" onClick={() => onClose(false)}>Keep Protected</button>
            </div>
          </div>
        )}

        {/* COUNTDOWN */}
        {step === 'countdown' && (
          <div className="text-center space-y-5 py-4" aria-live="polite">
            <div className="relative w-32 h-32 mx-auto grid place-items-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path strokeWidth="3" stroke="#1E263E" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path
                  strokeDasharray={`${pct}, 100`}
                  strokeWidth="3" strokeLinecap="round" fill="none"
                  stroke="#F43F5E"
                  className="transition-all duration-1000 ease-linear"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-4xl font-extrabold text-slate-100">
                {seconds}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-100">Preparing Withdrawal Signature</p>
              <p className="text-xs text-slate-400">Cooldown active to prevent accidental impulse spending.</p>
            </div>
          </div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto bg-cyan-950 border border-cyan-800 text-cyan-400">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-100" style={{ fontFamily: 'var(--font-display)' }}>Withdrawal Complete</h3>
            <p className="text-xs leading-relaxed text-slate-400">
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
