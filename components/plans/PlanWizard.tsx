'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanType } from '@/lib/api';
import { Shield, Lock, ArrowRight, ArrowLeft, Home, PiggyBank } from 'lucide-react';
import { CategoryIcon } from '@/components/common/CategoryIcon';

export interface NewPlan {
  name: string;
  category: string;
  amount: number;
  unlockDay?: number;
  planType: PlanType;
  description?: string;
}

interface Props {
  onComplete(plan: NewPlan): void;
  onCancel(): void;
}

const PRESETS: Array<{ label: string; category: string }> = [
  { label: 'House Rent', category: 'rent' },
  { label: 'Electricity', category: 'electricity' },
  { label: 'Water', category: 'water' },
  { label: 'Internet', category: 'internet' },
  { label: 'School Fees', category: 'school' },
  { label: 'Transport', category: 'transport' },
  { label: 'Groceries', category: 'groceries' },
  { label: 'Emergency Fund', category: 'emergency' },
  { label: 'Savings', category: 'savings' },
];

const STEPS = ['Category', 'Amount', 'Unlock'] as const;

export function PlanWizard({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [unlockDay, setUnlockDay] = useState('28');
  const [planType, setPlanType] = useState<PlanType>('BILL');

  function next() {
    if (step === 2) {
      onComplete({
        name: name.trim(),
        category: category || name.toLowerCase(),
        amount: parseFloat(amount),
        unlockDay: planType === 'BILL' && unlockDay ? parseInt(unlockDay, 10) : undefined,
        planType,
      });
    } else setStep((s) => s + 1);
  }

  return (
    <div className="max-w-md w-full mx-auto p-6 md:p-8 space-y-7 rounded-3xl bg-surface border border-border shadow-2xl">
      {/* Step Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-muted">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </span>
          <span className="font-mono font-bold text-accent-text">
            {Math.round(((step + 1) / STEPS.length) * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className="h-1.5 flex-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? 'rgb(var(--accent-rgb))' : 'rgb(var(--border-rgb))' }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                What should your salary protect first?
              </h2>
              <p className="text-xs mt-1 text-muted">Select an essential expense category or create a custom plan.</p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {PRESETS.map((p) => {
                const selected = category === p.category;
                return (
                  <button
                    key={p.category}
                    type="button"
                    className="flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 text-xs transition-all"
                    style={selected ? { background: 'rgb(var(--accent-rgb))', color: '#000000', border: '1px solid rgb(var(--accent-rgb))' } : { background: 'rgb(var(--surface-2-rgb))', color: 'hsl(var(--foreground))', border: '1px solid rgb(var(--border-rgb))' }}
                    onClick={() => {
                      setName(p.label);
                      setCategory(p.category);
                    }}
                  >
                    <span className="mb-0.5"><CategoryIcon category={p.category} size={30} /></span>
                    <span className="line-clamp-1 font-semibold">{p.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Plan Name</label>
              <input className="input text-sm font-semibold" placeholder="e.g. House Rent, Electricity" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <CategoryIcon category={category} size={32} />
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{name}</h2>
              </div>
              <p className="text-xs text-muted">Set the exact monthly amount to auto-lock upon salary deposit.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Monthly Lock Target</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-2">$</span>
                <input
                  className="input !pl-10 text-3xl font-bold font-mono tracking-tight"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="650.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted-2">USDC</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Protection Strategy</label>
              <div className="grid grid-cols-3 gap-2">
                {(['BILL', 'EMERGENCY', 'SAVINGS'] as const).map((t) => {
                  const selected = planType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPlanType(t)}
                      className="rounded-2xl p-3 text-center transition-all"
                      style={selected ? { background: 'rgb(var(--accent-rgb))', color: '#000000', border: '1px solid rgb(var(--accent-rgb))' } : { background: 'rgb(var(--surface-2-rgb))', color: 'hsl(var(--foreground))', border: '1px solid rgb(var(--border-rgb))' }}
                    >
                      <div className="grid place-items-center mb-1">
                        {t === 'BILL' ? <Home size={20} /> : t === 'EMERGENCY' ? <Shield size={20} /> : <PiggyBank size={20} />}
                      </div>
                      <div className="text-xs font-bold">{t === 'BILL' ? 'Monthly Bill' : t === 'EMERGENCY' ? 'Emergency' : 'Savings'}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>When should it unlock?</h2>
              <p className="text-xs mt-1 text-muted">Select the day of the month this expense is due for payment.</p>
            </div>

            {planType === 'BILL' ? (
              <div className="space-y-3">
                <input className="input text-3xl font-bold font-mono text-center" type="number" min={1} max={28} placeholder="28" value={unlockDay} onChange={(e) => setUnlockDay(e.target.value)} />
                <p className="text-xs text-center font-medium text-muted">
                  Unlocks automatically on the <strong className="text-foreground">{unlockDay || '28'}th</strong> of every month.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl p-5 text-center space-y-2 bg-accent-soft border border-accent-line">
                <div className="w-12 h-12 rounded-full grid place-items-center mx-auto text-xl bg-accent-soft text-accent-text">
                  {planType === 'EMERGENCY' ? <Shield size={22} /> : <Lock size={22} />}
                </div>
                <p className="text-sm font-bold text-foreground">{planType === 'EMERGENCY' ? 'Permanent Smart Contract Protection' : 'Targeted Vault Savings'}</p>
                <p className="text-xs leading-relaxed text-muted">
                  {planType === 'EMERGENCY'
                    ? 'Emergency funds stay securely locked in the Soroban smart contract until you trigger early withdrawal.'
                    : 'Savings remain protected until your explicit release date.'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 pt-2">
        <button type="button" className="btn-ghost flex-1" onClick={step === 0 ? onCancel : () => setStep((s) => s - 1)}>
          <ArrowLeft size={16} /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        <button type="button" className="btn-primary flex-1" onClick={next} disabled={(step === 0 && !name.trim()) || (step === 1 && (!amount || parseFloat(amount) <= 0))}>
          {step === 2 ? 'Create Vault' : 'Continue'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
