'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lock, ShieldAlert, Key, CheckCircle2 } from 'lucide-react';

export interface BreakVaultModalProps {
  open: boolean;
  purpose: string;
  onClose(success?: boolean): void;
  onConfirm(password: string): Promise<void>;
}

export function BreakVaultModal({ open, purpose, onClose, onConfirm }: BreakVaultModalProps) {
  const [step, setStep] = useState<'confirm' | 'auth' | 'countdown' | 'done'>('confirm');
  const [password, setPassword] = useState('');
  const [seconds, setSeconds] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setStep('confirm');
      setPassword('');
      setSeconds(10);
      setError('');
    }
  }, [open]);

  useEffect(() => {
    if (step !== 'countdown') return;
    if (seconds <= 0) {
      setSubmitting(true);
      onConfirm(password)
        .then(() => setStep('done'))
        .catch((e) => {
          setError(e.message ?? 'Withdrawal failed');
          setStep('auth');
        })
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={dismissible ? () => onClose(false) : undefined}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative card max-w-md w-full p-6 md:p-8 space-y-6 border-copper/40 shadow-2xl glow-copper z-10"
        role="dialog"
        aria-modal="true"
        aria-label="Withdraw early"
      >
        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-copper/20 text-copper-dark grid place-items-center text-3xl mx-auto shadow-inner">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-bold font-serif text-foreground">Early Vault Release?</h2>
              <p className="text-muted text-xs leading-relaxed max-w-xs mx-auto">
                You are requesting early withdrawal for your <strong className="text-foreground">{purpose}</strong> vault.
                This action breaks the smart contract lock before the designated payment date.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button className="btn-ghost text-xs" onClick={() => onClose(false)}>
                Keep Protected
              </button>
              <button className="btn-copper text-xs" onClick={() => setStep('auth')}>
                Proceed to Auth
              </button>
            </div>
          </div>
        )}

        {step === 'auth' && (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-clay/50 text-foreground grid place-items-center text-2xl mx-auto shadow-inner">
                <Key size={26} />
              </div>
              <h2 className="text-2xl font-bold font-serif text-foreground">Confirm Identity</h2>
              <p className="text-muted text-xs">Enter your account password to authorize the smart contract unlock.</p>
            </div>
            {error && <p className="text-danger text-xs text-center font-semibold">{error}</p>}
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (password) {
                  setError('');
                  setStep('countdown');
                }
              }}
            >
              <input
                className="input text-center text-sm font-semibold"
                type="password"
                aria-label="Account password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="btn-ghost text-xs" onClick={() => setStep('confirm')}>
                  Back
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Authorize Release
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'countdown' && (
          <div className="text-center space-y-5 py-4" aria-live="polite">
            <div className="relative w-28 h-28 mx-auto grid place-items-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-clay/40"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-copper transition-all duration-1000 ease-linear"
                  strokeDasharray={`${((10 - seconds) / 10) * 100}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-4xl font-extrabold text-foreground" data-balance>
                {seconds}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">Preparing Smart Contract Withdrawal</p>
              <p className="text-muted text-xs">Cooldown active to prevent accidental impulse spending.</p>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-success/20 text-success grid place-items-center text-3xl mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold font-serif text-foreground">Withdrawal Complete</h3>
            <p className="text-muted text-xs leading-relaxed">
              Funds have been released back to your available balance.
            </p>
            <button className="btn-primary w-full text-xs py-3" onClick={() => onClose(true)}>
              Return to Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
