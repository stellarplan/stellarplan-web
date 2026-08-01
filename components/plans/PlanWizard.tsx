'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanType } from '@/lib/api';
import { iconFor } from '@/lib/format';

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
  { label: 'Emergency Fund', category: 'emergency', icon: '🛡' },
  { label: 'Savings', category: 'savings', icon: '🌱' },
];

const STEPS = ['Category', 'Amount', 'Unlock'] as const;

export function PlanWizard({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('');
  const [amount, setAmount] = useState('');
  const [unlockDay, setUnlockDay] = useState('');
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
    <div className="card max-w-md w-full mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={
                  i === step
                    ? 'w-8 h-8 rounded-full bg-jade text-white grid place-items-center text-xs font-semibold'
                    : i < step
                      ? 'w-8 h-8 rounded-full bg-jade/20 text-jade grid place-items-center text-xs font-semibold'
                      : 'w-8 h-8 rounded-full bg-clay/60 text-muted grid place-items-center text-xs font-semibold'
                }
              >
                {i + 1}
              </div>
              <span className={`text-sm ${i === step ? 'font-semibold' : 'text-muted'}`}>{s}</span>
              {i < STEPS.length - 1 && <span className="text-clay">→</span>}
            </div>
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
            className="space-y-4"
          >
            <h2 className="text-2xl">What should your salary take care of first?</h2>

            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.category}
                  type="button"
                  className={
                    'flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs transition ' +
                    (category === p.category
                      ? 'border-jade bg-jade/10 text-jade'
                      : 'border-clay hover:border-jade/50')
                  }
                  onClick={() => {
                    setName(p.label);
                    setCategory(p.category);
                    setIcon(p.icon);
                  }}
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
              <button
                type="button"
                className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-clay p-3 text-xs text-muted hover:border-jade/50"
                onClick={() => { setName(''); setCategory(''); setIcon('📦'); }}
              >
                <span className="text-2xl">➕</span>
                <span>Custom</span>
              </button>
            </div>

            <input
              className="input"
              placeholder="Plan name (e.g. House Rent)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              <h2 className="text-2xl mb-1">{icon} {name}</h2>
              <p className="text-muted text-sm">How much should be protected each month?</p>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-2xl">$</span>
              <input
                className="input pl-10 text-3xl font-semibold"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>

            {/* plan type selector */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">Type</p>
              <div className="grid grid-cols-3 gap-2">
                {(['BILL', 'EMERGENCY', 'SAVINGS'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPlanType(t)}
                    className={
                      'rounded-xl border p-3 text-center transition ' +
                      (planType === t ? 'border-jade bg-jade/10 text-jade' : 'border-clay')
                    }
                  >
                    <div className="text-xl mb-1">
                      {t === 'BILL' ? '🏠' : t === 'EMERGENCY' ? '🛡' : '🌱'}
                    </div>
                    <div className="text-xs font-semibold">{t === 'BILL' ? 'Bill' : t === 'EMERGENCY' ? 'Emergency' : 'Savings'}</div>
                    <div className="text-[10px] text-muted mt-0.5">
                      {t === 'BILL' ? 'Auto-release on date' : t === 'EMERGENCY' ? 'Break only' : 'Until target date'}
                    </div>
                  </button>
                ))}
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
            className="space-y-4"
          >
            <div>
              <h2 className="text-2xl mb-1">When should it unlock?</h2>
              <p className="text-muted text-sm">Pick the day of the month this bill is due.</p>
            </div>

            {planType === 'BILL' ? (
              <>
                <input
                  className="input text-2xl font-semibold text-center"
                  type="number" min={1} max={28} placeholder="e.g. 30"
                  value={unlockDay}
                  onChange={(e) => setUnlockDay(e.target.value)}
                />
                <p className="text-xs text-muted text-center">Bills unlock on the 1st – 28th of every month.</p>
              </>
            ) : (
              <div className="card !p-4 bg-clay/30 text-center space-y-1">
                <div className="text-3xl">{planType === 'EMERGENCY' ? '🛡' : '🌱'}</div>
                <p className="text-sm">
                  {planType === 'EMERGENCY'
                    ? 'Emergency funds stay locked until you manually withdraw.'
                    : 'Savings stay protected until your target date.'}
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
          {step === 2 ? 'Create plan' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
