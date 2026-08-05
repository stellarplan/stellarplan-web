'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Plan } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export interface AllocationAnimationProps {
  salary: number;
  plans: Plan[];
  onComplete(): void;
}

export function AllocationAnimation({ salary, plans, onComplete }: AllocationAnimationProps) {
  const [phase, setPhase] = useState<'receive' | 'allocate' | 'done'>('receive');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('allocate'), 1_400);
    const t2 = setTimeout(() => {
      setPhase('done');
      setTimeout(onComplete, 1_200);
    }, 1_400 + (plans.length || 1) * 350 + 1_000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [plans.length, onComplete]);

  return (
    <div className="min-h-[60vh] w-full max-w-sm mx-auto flex flex-col items-center justify-center gap-8 px-4 text-center relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute w-80 h-80 rounded-full -top-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)', filter: 'blur(30px)' }} />
      <div className="absolute w-72 h-72 rounded-full -bottom-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)', filter: 'blur(30px)' }} />

      {/* Receive phase */}
      <AnimatePresence mode="wait">
        {phase === 'receive' && (
          <motion.div
            key="receive-card"
            initial={{ scale: 0.3, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="rounded-2xl p-8 flex flex-col items-center max-w-xs w-full shadow-2xl"
            style={{ background: '#141519', border: '1px solid #10B981', boxShadow: '0 0 60px rgba(16,185,129,0.15)' }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="w-16 h-16 rounded-full grid place-items-center text-4xl mb-4"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
              💵
            </motion.div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>
              <Sparkles size={12} /> Salary Detected
            </div>
            <p className="text-4xl font-bold tracking-tight mb-1" data-balance
              style={{ color: '#FAFAFA', fontFamily: 'var(--font-mono)' }}>
              +{formatMoney(salary)}
            </p>
            <p className="text-sm" style={{ color: '#A1A1AA' }}>Directing into smart vaults…</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Allocation stream */}
      {phase !== 'receive' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-3 z-10">
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A1A1AA' }}>Securing Salary into Vaults</span>
            <span className="text-xs font-mono font-bold" style={{ color: '#10B981', fontFamily: 'var(--font-mono)' }}>{plans.length} Plans Active</span>
          </div>

          <div className="space-y-2.5">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ x: -60, opacity: 0, scale: 0.92 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.28, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl px-4 py-3.5 flex items-center justify-between"
                style={{ background: '#141519', border: '1px solid #2B2C33' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-xl"
                    style={{ background: '#1C1D22', border: '1px solid #2B2C33' }}>
                    {plan.icon ?? '📦'}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm" style={{ color: '#FAFAFA' }}>{plan.name}</p>
                    <p className="text-xs capitalize" style={{ color: '#A1A1AA' }}>{plan.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold" style={{ color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                      {formatMoney(Number(plan.amount))}
                    </p>
                    <span className="text-[10px] font-bold inline-flex items-center gap-0.5" style={{ color: '#10B981' }}>
                      <Lock size={9} /> Locked
                    </span>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.28 + 0.2, type: 'spring' }}
                    className="w-7 h-7 rounded-full grid place-items-center"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <Lock size={13} style={{ color: '#10B981' }} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Done */}
      {phase === 'done' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-full"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', color: '#10B981' }}>
          <CheckCircle2 size={18} />
          All monthly expenses secured and locked!
        </motion.div>
      )}
    </div>
  );
}
