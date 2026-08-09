'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Plan, Vault, VaultStatus, cachedSnapshot, rememberSnapshot } from '@/lib/api';
import { PlanCard } from '@/components/plans/PlanCard';
import { Skeleton } from '@/components/common/Skeleton';
import { FadeIn } from '@/components/common/FadeIn';
import { Search, Plus } from 'lucide-react';

type Filter = 'ALL' | 'PROTECTED' | 'AWAITING';
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PROTECTED', label: 'Protected' },
  { value: 'AWAITING', label: 'Awaiting salary' },
];

/** The vault that best represents a plan's current state: a live lock if any,
 *  otherwise its most recent settled vault. Null means "not funded yet". */
function chooseVault(vaults: Vault[]): Vault | null {
  if (vaults.length === 0) return null;
  const locked = vaults.find((v) => v.status === VaultStatus.LOCKED);
  if (locked) return locked;
  return [...vaults].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[] | null>(() => cachedSnapshot<Plan[]>('plans') ?? null);
  const [vaults, setVaults] = useState<Vault[]>(() => cachedSnapshot<Vault[]>('vaults') ?? []);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([api.plans(), api.vaults()])
      .then(([p, v]) => {
        setPlans(rememberSnapshot('plans', p));
        setVaults(rememberSnapshot('vaults', v));
      })
      .catch(console.error);
  }, []);

  const loading = plans === null;
  const vaultFor = (planId: string) => chooseVault(vaults.filter((v) => v.budgetPlanId === planId));

  const filtered = (plans ?? [])
    .filter((p) => {
      const v = vaultFor(p.id);
      if (filter === 'PROTECTED') return v?.status === VaultStatus.LOCKED;
      if (filter === 'AWAITING') return !v;
      return true;
    })
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.includes(search.toLowerCase()));

  return (
    <main className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto px-5 pt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Plans</h1>
        <Link href="/budgets/new" id="plans-new-btn" className="btn-primary !py-2 !px-4 text-sm rounded-xl">
          <Plus size={16} /> New
        </Link>
      </div>
      <p className="mb-8 text-sm text-muted">Everything your salary protects, all in one place.</p>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-2" />
        <input id="plans-search" className="input pl-11" placeholder="Search by name or category"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {FILTERS.map(({ value, label }) => (
          <button key={value} id={`filter-${value.toLowerCase()}`} onClick={() => setFilter(value)}
            className="text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200"
            style={filter === value ? {
              background: 'rgb(var(--accent-rgb) / 0.15)',
              border: '1px solid rgb(var(--accent-rgb))',
              color: 'rgb(var(--accent-rgb))',
            } : {
              background: 'rgb(var(--surface-rgb))',
              border: '1px solid rgb(var(--border-rgb))',
              color: 'hsl(var(--muted))',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-5 bg-surface border border-border space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-6 w-40 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Truly empty — no plans created yet */}
      {!loading && (plans ?? []).length === 0 && (
        <div className="rounded-2xl text-center py-16 space-y-4 bg-surface border border-border">
          <img src="/icons/search.png" alt="" width={40} height={40} draggable={false}
            className="category-icon mx-auto" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          <p className="text-sm text-muted">You haven&apos;t created any plans yet.</p>
          <Link href="/budgets/new" className="btn-primary !py-2 !px-4 text-sm rounded-xl inline-flex">
            <Plus size={16} /> Create your first plan
          </Link>
        </div>
      )}

      {/* Have plans, but none match the current filter/search */}
      {!loading && (plans ?? []).length > 0 && filtered.length === 0 && (
        <div className="rounded-2xl text-center py-16 space-y-4 bg-surface border border-border">
          <img src="/icons/search.png" alt="" width={40} height={40} draggable={false}
            className="category-icon mx-auto" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          <p className="text-sm text-muted">No plans match your search.</p>
          <button onClick={() => { setSearch(''); setFilter('ALL'); }}
            className="text-xs font-bold hover:underline text-accent-text">
            Clear filters
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((p) => <PlanCard key={p.id} plan={p} vault={vaultFor(p.id)} />)}
          </div>
        </FadeIn>
      )}
    </main>
  );
}
