'use client';

import { Vault, VaultStatus } from '@/lib/api';
import { formatMoney, formatDate } from '@/lib/format';
import { CategoryIcon } from '@/components/common/CategoryIcon';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Unlock } from 'lucide-react';

const STATUS_STYLE: Record<VaultStatus, { bg: string; border: string; textColor: string; label: string }> = {
  LOCKED:           { bg: 'rgb(var(--accent-rgb) / 0.15)',  border: 'rgb(var(--accent-rgb) / 0.3)',  textColor: 'rgb(var(--accent-rgb))',  label: 'Protected' },
  RELEASED:         { bg: 'rgb(var(--nova-rgb) / 0.15)',  border: 'rgb(var(--nova-rgb) / 0.3)',  textColor: 'rgb(var(--nova-rgb))',  label: 'Released' },
  EARLY_WITHDRAWN:  { bg: 'rgb(var(--danger-rgb) / 0.15)',   border: 'rgb(var(--danger-rgb) / 0.3)',   textColor: 'rgb(var(--danger-rgb))',  label: 'Withdrawn early' },
};

interface Props { vault: Vault; big?: boolean; }

export function VaultCard({ vault, big }: Props) {
  const locked = vault.status === VaultStatus.LOCKED;
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
        className={cn('vault-card transition-all bg-surface border border-border', big ? 'p-7' : 'p-5')}
      >
        {/* Top row */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl grid place-items-center bg-surface-2 border border-border">
              <CategoryIcon category={vault.category} size={26} />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight text-foreground group-hover:text-accent-text transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}>
                {vault.name}
              </h3>
              <p className="text-xs capitalize font-medium mt-0.5 text-muted">{vault.category}</p>
            </div>
          </div>

          <div className="vault-lock bg-surface-2 border border-border text-accent-text"
            title={locked ? 'Protected in smart contract' : 'Unlocked'}>
            {locked ? <Lock size={14} strokeWidth={2.5} /> : <Unlock size={14} strokeWidth={2.5} />}
          </div>
        </div>

        {/* Amount + Status */}
        <div className="mt-6 space-y-3 relative z-10">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-foreground" data-balance
              style={{ fontFamily: 'var(--font-mono)' }}>
              {formatMoney(vault.amount)}
            </div>
            <span className="text-xs font-mono font-bold text-muted-2">USDC</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.textColor }}>
              {locked && <ShieldCheck size={11} />}
              {statusStyle.label}
            </span>

            {locked && vault.unlockDate && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface-2 border border-border text-muted">
                Due {formatDate(vault.unlockDate)}
              </span>
            )}

            {vault.planType === 'EMERGENCY' && locked && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-danger-soft border border-danger-line text-danger-text">
                Always Protected
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
