'use client';

import { Vault, VaultStatus } from '@/lib/api';
import { iconFor, formatMoney, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Unlock } from 'lucide-react';

const STATUS_STYLE: Record<VaultStatus, { bg: string; border: string; textColor: string; label: string }> = {
  LOCKED:           { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)',  textColor: 'hsl(217,91%,60%)',  label: 'Protected' },
  RELEASED:         { bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.25)',   textColor: 'hsl(189,95%,43%)',  label: 'Released' },
  EARLY_WITHDRAWN:  { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  textColor: 'hsl(38,92%,50%)',   label: 'Withdrawn early' },
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
        whileHover={{ y: -5, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={cn('vault-card transition-all duration-300', big ? 'p-7' : 'p-5')}
      >
        {/* Cosmic corner accent */}
        <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none rounded-bl-full opacity-40 group-hover:opacity-80 transition-opacity"
          style={{ background: locked
            ? 'radial-gradient(circle at top right, rgba(59,130,246,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle at top right, rgba(6,182,212,0.1) 0%, transparent 70%)' }} />

        {/* Top row */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'rgba(22,30,48,0.9)', border: '1px solid rgba(30,45,69,0.8)' }}>
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight transition-colors duration-200 group-hover:text-stellar"
                style={{ color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>
                {vault.name}
              </h3>
              <p className="text-xs capitalize font-medium mt-0.5" style={{ color: 'hsl(222,22%,50%)' }}>{vault.category}</p>
            </div>
          </div>

          {/* Lock icon */}
          <div className="vault-lock transition-all duration-300"
            style={locked ? {} : { background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', color: 'hsl(189,95%,43%)' }}
            title={locked ? 'Protected in smart contract' : 'Unlocked'}>
            {locked ? <Lock size={14} strokeWidth={2.5} /> : <Unlock size={14} strokeWidth={2.5} />}
          </div>
        </div>

        {/* Amount + Status */}
        <div className="mt-6 space-y-3 relative z-10">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight" data-balance
              style={{ color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-mono)' }}>
              {formatMoney(vault.amount)}
            </div>
            <span className="text-xs font-mono font-bold" style={{ color: 'hsl(222,22%,45%)' }}>USDC</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status chip */}
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.textColor }}>
              {locked && <ShieldCheck size={11} />}
              {statusStyle.label}
            </span>

            {/* Unlock date chip */}
            {locked && vault.unlockDate && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(30,45,69,0.7)', border: '1px solid rgba(30,45,69,0.9)', color: 'hsl(222,22%,50%)' }}>
                Due {formatDate(vault.unlockDate)}
              </span>
            )}

            {/* Emergency chip */}
            {vault.planType === 'EMERGENCY' && locked && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: 'hsl(38,92%,50%)' }}>
                Always Protected
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
