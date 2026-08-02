'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Plan } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { Lock, Sparkles, CheckCircle2, ArrowDownRight } from 'lucide-react';

export interface AllocationAnimationProps {
  salary: number;
  plans: Plan[];
  onComplete(): void;
}

export function AllocationAnimation({ salary, plans, onComplete }: AllocationAnimationProps) {
  const [phase, setPhase] = useState<'receive' | 'allocate' | 'done'>('receive');

  useEffect(() => {
    // Phase 1: salary received, 1.4s bounce
    const t1 = setTimeout(() => setPhase('allocate'), 1_400);
    // Phase 2: money splits into plans, 350ms between each
    const t2 = setTimeout(() => {
      setPhase('done');
      setTimeout(onComplete, 1_200);
    }, 1_400 + (plans.length || 1) * 350 + 1_000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [plans.length, onComplete]);

  return (
    <div className="min-h-[60vh] w-full max-w-md mx-auto flex flex-col items-center justify-center gap-8 px-4 text-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-72 h-72 bg-jade/20 rounded-full blur-3xl -top-10 animate-pulse pointer-events-none" />
      <div className="absolute w-60 h-60 bg-copper/20 rounded-full blur-3xl -bottom-10 pointer-events-none" />

      {/* Main Income Orb */}
      <AnimatePresence mode="wait">
        {phase === 'receive' && (
          <motion.div
            key="receive-card"
            initial={{ scale: 0.3, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="card !bg-surface/95 border-2 border-jade/40 p-8 shadow-2xl glow-jade max-w-xs w-full flex flex-col items-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="w-16 h-16 rounded-full bg-jade/15 grid place-items-center text-4xl mb-3 shadow-inner"
            >
              💵
            </motion.div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-jade uppercase tracking-wider bg-jade/10 px-3 py-1 rounded-full mb-2">
              <Sparkles size={13} /> Income Detected
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-foreground font-mono" data-balance>
              +{formatMoney(salary || 2500)}
            </p>
            <p className="text-muted text-xs font-medium mt-1">Directing into monthly vaults...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Allocation Stream */}
      {phase !== 'receive' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full space-y-3 z-10"
        >
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Securing Salary into Vaults</span>
            <span className="text-xs font-mono text-jade font-bold">{plans.length} Plans Active</span>
          </div>

          <div className="space-y-2.5">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ x: -60, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.28, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="card !py-3.5 !px-4 flex items-center justify-between border-clay/60 bg-surface/90 shadow-md hover:border-jade/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-clay/50 grid place-items-center text-xl shadow-inner">
                    {plan.icon ?? '📦'}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-foreground">{plan.name}</p>
                    <p className="text-[11px] text-muted capitalize">{plan.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-jade">
                      {formatMoney(Number(plan.amount))}
                    </p>
                    <span className="text-[10px] text-copper-dark font-medium inline-flex items-center gap-0.5">
                      <Lock size={10} /> Time-Locked
                    </span>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.28 + 0.2, type: 'spring' }}
                    className="w-7 h-7 rounded-full bg-copper/15 text-copper-dark grid place-items-center"
                  >
                    <Lock size={13} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Completion Confirmation */}
      {phase === 'done' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-success font-semibold text-sm bg-success/10 border border-success/30 px-5 py-2.5 rounded-full shadow-sm"
        >
          <CheckCircle2 size={18} />
          <span>All essential monthly expenses secured and locked!</span>
        </motion.div>
      )}
    </div>
  );
}
