'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Clock, ShieldCheck, Unlock } from 'lucide-react';
import { Plan, Vault, VaultStatus } from '@/lib/api';
import { formatMoney, formatDate } from '@/lib/format';
import { CategoryIcon } from '@/components/common/CategoryIcon';
import { cn } from '@/lib/utils';

interface Props {
  plan: Plan;
  /** The most relevant vault for this plan, if it has been funded by a salary allocation. */
  vault?: Vault | null;
}

const PLAN_TYPE_LABEL: Record<Plan['planType'], string> = {
  BILL: 'Bill',
  EMERGENCY: 'Emergency',
  SAVINGS: 'Savings',
};

export function PlanCard({ plan, vault }: Props) {
  const locked = vault?.status === VaultStatus.LOCKED;
  const funded = !!vault;

  const status = !funded
    ? { label: 'Awaiting salary', bg: 'rgb(var(--surface-2-rgb))', border: 'rgb(var(--border-rgb))', color: 'hsl(var(--muted))' }
    : vault!.status === VaultStatus.LOCKED
      ? { label: 'Protected', bg: 'rgb(var(--accent-rgb) / 0.15)', border: 'rgb(var(--accent-rgb) / 0.3)', color: 'rgb(var(--accent-rgb))' }
      : vault!.status === VaultStatus.RELEASED
        ? { label: 'Released', bg: 'rgb(var(--nova-rgb) / 0.15)', border: 'rgb(var(--nova-rgb) / 0.3)', color: 'rgb(var(--nova-rgb))' }
        : { label: 'Withdrawn early', bg: 'rgb(var(--danger-rgb) / 0.15)', border: 'rgb(var(--danger-rgb) / 0.3)', color: 'rgb(var(--danger-rgb))' };

  const body = (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={funded ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn('vault-card transition-all p-5 bg-surface border border-border', funded && 'group')}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl grid place-items-center bg-surface-2 border border-border">
            <CategoryIcon category={plan.category} size={26} />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight text-foreground group-hover:text-accent-text transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}>
              {plan.name}
            </h3>
            <p className="text-xs capitalize font-medium mt-0.5 text-muted">{plan.category}</p>
          </div>
        </div>

        <div className="vault-lock bg-surface-2 border border-border text-accent-text"
          title={locked ? 'Protected in smart contract' : funded ? 'Vault settled' : 'Locks when your salary arrives'}>
          {locked ? <Lock size={14} strokeWidth={2.5} /> : funded ? <Unlock size={14} strokeWidth={2.5} /> : <Clock size={14} strokeWidth={2.5} />}
        </div>
      </div>

      <div className="mt-6 space-y-3 relative z-10">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-foreground" data-balance
            style={{ fontFamily: 'var(--font-mono)' }}>
            {formatMoney(plan.amount)}
          </div>
          <span className="text-xs font-mono font-bold text-muted-2">USDC</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.color }}>
            {locked && <ShieldCheck size={11} />}
            {status.label}
          </span>

          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface-2 border border-border text-muted">
            {PLAN_TYPE_LABEL[plan.planType]}
          </span>

          {locked && vault?.unlockDate ? (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface-2 border border-border text-muted">
              Due {formatDate(vault.unlockDate)}
            </span>
          ) : plan.planType === 'BILL' && plan.unlockDay ? (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface-2 border border-border text-muted">
              Bill day {plan.unlockDay}
            </span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );

  return funded ? <Link href={`/plans/${vault!.id}`} className="block">{body}</Link> : <div>{body}</div>;
}
