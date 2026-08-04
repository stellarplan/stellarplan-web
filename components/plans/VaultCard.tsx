'use client';

import { Vault, VaultStatus } from '@/lib/api';
import { iconFor, formatMoney, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Unlock } from 'lucide-react';

const STATUS_STYLE: Record<VaultStatus, { bg: string; border: string; textColor: string; label: string }> = {
  LOCKED:           { bg: 'rgba(79,70,229,0.15)',  border: 'rgba(99,102,241,0.3)',  textColor: '#818CF8',  label: 'Protected' },
  RELEASED:         { bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.3)',   textColor: '#06B6D4',  label: 'Released' },
  EARLY_WITHDRAWN:  { bg: 'rgba(244,63,94,0.15)',  border: 'rgba(244,63,94,0.3)',  textColor: '#F43F5E',   label: 'Withdrawn early' },
};

interface Props { vault: Vault; big?: boolean; }

export function VaultCard({ vault, big }: Props) {
  const locked = vault.status === VaultStatus.LOCKED;
  const icon = iconFor(vault.category, vault.budgetPlan?.icon);
  const statusStyle = STATUS_STYLE[vault.status];

  return (
    <Link href={`/plans/${vault.id}`} className="block group">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn('vault-card transition-all bg-slate-900 border border-slate-800', big ? 'p-7' : 'p-5')}
      >
        {/* Top row */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl bg-slate-950 border border-slate-800">
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight text-slate-100 group-hover:text-indigo-400 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}>
                {vault.name}
              </h3>
              <p className="text-xs capitalize font-medium mt-0.5 text-slate-400">{vault.category}</p>
            </div>
          </div>

          <div className="vault-lock bg-slate-950 border border-slate-800 text-indigo-400"
            title={locked ? 'Protected in smart contract' : 'Unlocked'}>
            {locked ? <Lock size={14} strokeWidth={2.5} /> : <Unlock size={14} strokeWidth={2.5} />}
          </div>
        </div>

        {/* Amount + Status */}
        <div className="mt-6 space-y-3 relative z-10">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-slate-100" data-balance
              style={{ fontFamily: 'var(--font-mono)' }}>
              {formatMoney(vault.amount)}
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">USDC</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.textColor }}>
              {locked && <ShieldCheck size={11} />}
              {statusStyle.label}
            </span>

            {locked && vault.unlockDate && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                Due {formatDate(vault.unlockDate)}
              </span>
            )}

            {vault.planType === 'EMERGENCY' && locked && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-950/50 border border-rose-800 text-rose-400">
                Always Protected
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
