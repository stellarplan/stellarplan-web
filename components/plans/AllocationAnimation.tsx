'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Plan } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { Lock } from 'lucide-react';

export interface AllocationAnimationProps {
  salary: number;
  plans: Plan[];
  onComplete(): void;
}

export function AllocationAnimation({ salary, plans, onComplete }: AllocationAnimationProps) {
  const [phase, setPhase] = useState<'receive' | 'allocate' | 'done'>('receive');

  useEffect(() => {
    // Phase 1: salary received, 2s bounce
    const t1 = setTimeout(() => setPhase('allocate'), 1_200);
    // Phase 2: money splits into plans, 300ms between each
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1_200 + plans.length * 320 + 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [plans.length, onComplete]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6">
      {/* salary blob */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={
          phase === 'receive'
            ? { scale: [0, 1.15, 1], opacity: 1 }
            : phase === 'allocate'
              ? { scale: [1, 0.7, 0], opacity: [1, 1, 0], y: -80 }
              : { scale: 0, opacity: 0 }
        }
        transition={{
          scale: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
          opacity: { duration: 0.3 },
          y: { duration: 0.5, delay: 0.2 },
        }}
        className="text-center"
      >
        <div className="text-6xl mb-2">💵</div>
        <p className="text-2xl font-semibold">+{formatMoney(salary)}</p>
        <p className="text-muted text-sm">Salary received</p>
      </motion.div>

      {/* allocations flowing out */}
      {phase !== 'receive' && (
        <div className="flex flex-col gap-2">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ x: -120, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.25, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 surface-chip bg-surface border border-clay/50 shadow px-4 py-2"
            >
              <span className="text-lg">{plan.icon ?? '📦'}</span>
              <span className="font-medium text-sm">{plan.name}</span>
              <span className="mono text-sm text-jade font-semibold">
                → {formatMoney(Number(plan.amount))}
              </span>
              <Lock size={13} className="text-copper" />
            </motion.div>
          ))}
        </div>
      )}

      {phase === 'done' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted text-sm"
        >
          All set. Your plans are protected.
        </motion.p>
      )}
    </div>
  );
}
