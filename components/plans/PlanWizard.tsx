'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanType } from '@/lib/api';
import { iconFor } from '@/lib/format';
import { Check, Shield, Lock, Calendar, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

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

const PRESETS: Array<{ label: string; category: string; icon: string }> = [
  { label: 'House Rent', category: 'rent', icon: '🏠' },
  { label: 'Electricity', category: 'electricity', icon: '⚡' },
  { label: 'Water', category: 'water', icon: '💧' },
  { label: 'Internet', category: 'internet', icon: '📶' },
  { label: 'School Fees', category: 'school', icon: '🎓' },
  { label: 'Transport', category: 'transport', icon: '🚌' },
  { label: 'Groceries', category: 'groceries', icon: '🛒' },
  { label: 'Emergency Fund', category: 'emergency', icon: '🛡️' },
  { label: 'Savings', category: 'savings', icon: '🌱' },
];

const STEPS = ['Category', 'Amount', 'Unlock'] as const;

export function PlanWizard({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('📦');
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
    <div className="card max-w-md w-full mx-auto p-6 md:p-8 space-y-7 border-clay/60 shadow-2xl glow-jade">
      {/* Step Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </span>
          <span className="text-xs font-mono text-jade font-bold">
            {Math.round(((step + 1) / STEPS.length) * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-gradient-to-r from-jade to-emerald-400 shadow-sm' : 'bg-clay/50'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-2xl font-bold font-serif text-foreground">
                What should your salary protect first?
              </h2>
              <p className="text-muted text-xs mt-1">Select an essential expense category or create a custom plan.</p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {PRESETS.map((p) => {
                const selected = category === p.category;
                return (
                  <button
                    key={p.category}
                    type="button"
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs transition-all duration-200 ${
                      selected
                        ? 'border-jade bg-jade/15 text-jade font-bold shadow-sm scale-105 ring-1 ring-jade/30'
                        : 'border-clay/60 bg-surface/80 hover:border-jade/40 hover:bg-clay/30 text-foreground'
                    }`}
                    onClick={() => {
                      setName(p.label);
                      setCategory(p.category);
                      setIcon(p.icon);
                    }}
                  >
                    <span className="text-2xl mb-0.5">{p.icon}</span>
                    <span className="line-clamp-1">{p.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">Plan Name</label>
              <input
                className="input text-sm font-semibold"
                placeholder="e.g. House Rent, Electricity, Water"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">{icon}</span>
                <h2 className="text-2xl font-bold font-serif text-foreground">{name}</h2>
              </div>
              <p className="text-muted text-xs">Set the exact monthly amount to auto-lock upon salary deposit.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">Monthly Lock Target</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-2xl font-bold">$</span>
                <input
                  className="input !pl-10 text-3xl font-bold font-mono tracking-tight text-foreground"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="650.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted">
                  USDC
                </span>
              </div>
            </div>

            {/* plan type selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">Protection Strategy</label>
              <div className="grid grid-cols-3 gap-2">
                {(['BILL', 'EMERGENCY', 'SAVINGS'] as const).map((t) => {
                  const selected = planType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPlanType(t)}
                      className={`rounded-2xl border p-3 text-center transition-all ${
                        selected
                          ? 'border-jade bg-jade/15 text-jade font-bold shadow-sm'
                          : 'border-clay/60 bg-surface/80 text-foreground hover:border-jade/30'
                      }`}
                    >
                      <div className="text-xl mb-1">
                        {t === 'BILL' ? '🏠' : t === 'EMERGENCY' ? '🛡️' : '🌱'}
                      </div>
                      <div className="text-xs font-bold">
                        {t === 'BILL' ? 'Monthly Bill' : t === 'EMERGENCY' ? 'Emergency' : 'Savings'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-2xl font-bold font-serif text-foreground">When should it unlock?</h2>
              <p className="text-muted text-xs mt-1">Select the day of the month this expense is due for payment.</p>
            </div>

            {planType === 'BILL' ? (
              <div className="space-y-3">
                <input
                  className="input text-3xl font-bold font-mono text-center"
                  type="number"
                  min={1}
                  max={28}
                  placeholder="28"
                  value={unlockDay}
                  onChange={(e) => setUnlockDay(e.target.value)}
                />
                <p className="text-xs text-muted text-center font-medium">
                  Unlocks automatically on the <span className="font-bold text-foreground">{unlockDay || '28'}th</span> of every month.
                </p>
              </div>
            ) : (
              <div className="card !p-5 bg-copper/10 border-copper/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-copper/20 text-copper-dark grid place-items-center text-2xl mx-auto shadow-inner">
                  {planType === 'EMERGENCY' ? <Shield size={24} /> : <Lock size={24} />}
                </div>
                <p className="text-sm font-bold text-foreground">
                  {planType === 'EMERGENCY'
                    ? 'Permanent Smart Contract Protection'
                    : 'Targeted Vault Savings'}
                </p>
                <p className="text-xs text-muted leading-relaxed">
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
        <button
          type="button"
          className="btn-ghost flex-1"
          onClick={step === 0 ? onCancel : () => setStep((s) => s - 1)}
        >
          <ArrowLeft size={16} />
          {step === 0 ? 'Cancel' : 'Back'}
        </button>
        <button
          type="button"
          className="btn-primary flex-1"
          onClick={next}
          disabled={
            (step === 0 && !name.trim()) ||
            (step === 1 && (!amount || parseFloat(amount) <= 0)) ||
            (step === 2 && planType === 'BILL' && (!unlockDay || +unlockDay < 1 || +unlockDay > 28))
          }
        >
          {step === 2 ? 'Create Vault' : 'Continue'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
