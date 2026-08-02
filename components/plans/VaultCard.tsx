'use client';

import { Vault, VaultStatus } from '@/lib/api';
import { iconFor, formatMoney, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Unlock } from 'lucide-react';

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

  return (
    <Link href={href} className="block group">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        whileHover={{ y: -5, scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'vault-card p-5 relative overflow-hidden transition-all duration-300',
          big ? 'p-7' : '',
          locked && 'border-copper/30 hover:border-copper/60'
        )}
      >
        {/* Subtle envelope fold background texture */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-copper/10 via-transparent to-transparent pointer-events-none rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-clay/40 border border-clay/60 grid place-items-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight text-foreground group-hover:text-jade transition-colors">
                {vault.name}
              </h3>
              <p className="text-muted text-xs capitalize font-medium">{vault.category}</p>
            </div>
          </div>

          <div
            className={cn(
              'vault-lock shadow-md transition-transform group-hover:rotate-6',
              locked ? 'bg-gradient-to-br from-[#F5E6D0] to-[#C9A982] text-copper-dark' : 'bg-success/20 text-success'
            )}
            title={locked ? 'Protected in smart contract' : 'Unlocked'}
          >
            {locked ? <Lock size={15} className="stroke-[2.5]" /> : <Unlock size={15} className="stroke-[2.5]" />}
          </div>
        </div>

        <div className="mt-6 space-y-2 relative z-10">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-foreground" data-balance>
              {formatMoney(vault.amount)}
            </div>
            <span className="text-xs text-muted font-mono font-medium">USDC</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className={cn(CHIP[vault.status], locked && 'bg-copper/15 text-copper-dark font-semibold')}>
              {locked && <ShieldCheck size={12} className="inline mr-1" />}
              {LABEL[vault.status]}
            </span>

            {locked && vault.unlockDate && (
              <span className="surface-chip bg-clay/50 text-muted border border-clay/70">
                Due {formatDate(vault.unlockDate)}
              </span>
            )}
            {vault.planType === 'EMERGENCY' && locked && (
              <span className="surface-chip bg-jade/10 text-jade border border-jade/20">
                Always Protected
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
