'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Key, CheckCircle2 } from 'lucide-react';

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
    if (open) { setStep('confirm'); setPassword(''); setSeconds(10); setError(''); }
  }, [open]);

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
  const pct = ((10 - seconds) / 10) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
        onClick={dismissible ? () => onClose(false) : undefined}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative max-w-md w-full p-6 md:p-8 space-y-6 z-10 rounded-2xl"
        style={{ background: 'rgba(14,20,32,0.98)', border: '1px solid rgba(239,68,68,0.25)', boxShadow: '0 0 60px rgba(239,68,68,0.1), 0 32px 80px rgba(0,0,0,0.6)' }}
        role="dialog" aria-modal="true" aria-label="Withdraw early"
      >

        {/* CONFIRM */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <AlertTriangle size={30} style={{ color: 'hsl(0,84%,60%)' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Early Vault Release?</h2>
              <p className="text-xs leading-relaxed max-w-xs mx-auto" style={{ color: 'hsl(222,22%,55%)' }}>
                You are requesting early withdrawal for your <strong style={{ color: 'hsl(228,60%,93%)' }}>{purpose}</strong> vault.
                This action breaks the smart contract lock before the designated payment date.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-ghost text-sm py-3 rounded-xl" onClick={() => onClose(false)}>Keep Protected</button>
              <button id="proceed-auth-btn"
                className="py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: 'hsl(0,84%,60%)' }}
                onClick={() => setStep('auth')}>
                Proceed to Auth
              </button>
            </div>
          </div>
        )}

        {/* AUTH */}
        {step === 'auth' && (
          <div className="space-y-5">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl grid place-items-center mx-auto"
                style={{ background: 'rgba(30,45,69,0.8)', border: '1px solid rgba(30,45,69,0.9)' }}>
                <Key size={24} style={{ color: 'hsl(228,60%,93%)' }} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Confirm Identity</h2>
              <p className="text-xs" style={{ color: 'hsl(222,22%,55%)' }}>Enter your account password to authorize the smart contract unlock.</p>
            </div>
            {error && <p className="text-xs text-center font-semibold" style={{ color: 'hsl(0,84%,60%)' }}>{error}</p>}
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (password) { setError(''); setStep('countdown'); } }}>
              <input
                id="break-vault-password"
                className="input text-center text-sm font-semibold"
                type="password"
                aria-label="Account password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus required
              />
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="btn-ghost text-sm py-3 rounded-xl" onClick={() => setStep('confirm')}>Back</button>
                <button type="submit" id="authorize-release-btn" className="btn-primary text-sm py-3 rounded-xl">Authorize Release</button>
              </div>
            </form>
          </div>
        )}

        {/* COUNTDOWN */}
        {step === 'countdown' && (
          <div className="text-center space-y-5 py-4" aria-live="polite">
            <div className="relative w-32 h-32 mx-auto grid place-items-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path strokeWidth="3" stroke="rgba(30,45,69,0.8)" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path
                  strokeDasharray={`${pct}, 100`}
                  strokeWidth="3" strokeLinecap="round" fill="none"
                  stroke="hsl(0,84%,60%)"
                  className="transition-all duration-1000 ease-linear"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-4xl font-extrabold" data-balance
                style={{ color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-mono)' }}>
                {seconds}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold" style={{ color: 'hsl(228,60%,93%)' }}>Preparing Withdrawal</p>
              <p className="text-xs" style={{ color: 'hsl(222,22%,50%)' }}>Cooldown active to prevent accidental impulse spending.</p>
            </div>
          </div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto"
              style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
              <CheckCircle2 size={32} style={{ color: 'hsl(189,95%,43%)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Withdrawal Complete</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'hsl(222,22%,55%)' }}>
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
