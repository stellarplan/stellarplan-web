'use client';

import { Vault, VaultStatus, PlanType } from '@/lib/api';
import { iconFor, formatMoney, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CHIP: Record<VaultStatus, string> = {
  LOCKED: 'chip-copper',
  RELEASED: 'chip-success',
  EARLY_WITHDRAWN: 'chip-warning',
};

const LABEL: Record<VaultStatus, string> = {
  LOCKED: 'Protected',
  RELEASED: 'Released',
  EARLY_WITHDRAWN: 'Withdrawn early',
};

interface Props {
  vault: Vault;
  big?: boolean;
}

export function VaultCard({ vault, big }: Props) {
  const locked = vault.status === VaultStatus.LOCKED;
  const href = `/plans/${vault.id}`;
  const icon = iconFor(vault.category, vault.budgetPlan?.icon);

  const card = (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn('vault-card p-5 cursor-pointer block', big && 'p-7')}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl mb-3" aria-hidden>{icon}</div>
          <h3 className="font-semibold text-lg leading-tight">{vault.name}</h3>
          <p className="text-muted text-sm capitalize">{vault.category}</p>
        </div>
        <div className="vault-lock" title={locked ? 'Protected' : 'Unlocked'}>
          {locked ? '🔒' : '🔓'}
        </div>
      </div>

      <div className="mt-5 space-y-1">
        <div className="text-2xl font-semibold" data-balance>
          {formatMoney(vault.amount)}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(CHIP[vault.status], vault.status === VaultStatus.LOCKED && 'chip-copper')}>
            {LABEL[vault.status]}
          </span>
          {locked && vault.unlockDate && (
            <span className="surface-chip bg-clay/60 text-muted">
              Unlocks {formatDate(vault.unlockDate)}
            </span>
          )}
          {vault.planType === 'EMERGENCY' && locked && (
            <span className="surface-chip bg-clay/60 text-muted">Always protected</span>
          )}
        </div>
      </div>
    </motion.div>
  );

  return <Link href={href}>{card}</Link>;
}
