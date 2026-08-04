'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Vault } from '@/lib/api';
import { VaultCard } from '@/components/plans/VaultCard';
import { FadeIn } from '@/components/common/FadeIn';
import { Search, Plus } from 'lucide-react';

type Filter = 'ALL' | 'LOCKED' | 'RELEASED' | 'EARLY_WITHDRAWN';
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'LOCKED', label: 'Locked' },
  { value: 'RELEASED', label: 'Released' },
  { value: 'EARLY_WITHDRAWN', label: 'Withdrawn' },
];

export default function PlansPage() {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.vaults().then(setVaults).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = vaults
    .filter((v) => filter === 'ALL' || v.status === filter)
    .filter((v) => !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.category.includes(search.toLowerCase()));

  return (
    <main className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto px-5 pt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Plans</h1>
        <Link href="/budgets/new" id="plans-new-btn" className="btn-primary !py-2 !px-4 text-sm rounded-xl">
          <Plus size={16} /> New
        </Link>
      </div>
      <p className="mb-8 text-sm" style={{ color: 'hsl(222,22%,50%)' }}>Everything your salary protects, all in one place.</p>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'hsl(222,22%,50%)' }} />
        <input
          id="plans-search"
          className="input pl-11"
          placeholder="Search by name or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            id={`filter-${value.toLowerCase()}`}
            onClick={() => setFilter(value)}
            className="text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200"
            style={filter === value ? {
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.35)',
              color: 'hsl(217,91%,60%)',
            } : {
              background: 'rgba(14,20,32,0.8)',
              border: '1px solid rgba(30,45,69,0.8)',
              color: 'hsl(222,22%,55%)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-8" style={{ color: 'hsl(222,22%,50%)' }}>
          <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(59,130,246,0.3)', borderTopColor: 'hsl(217,91%,60%)' }} />
          <span className="text-sm">Loading vaults…</span>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl text-center py-16 space-y-4"
          style={{ background: 'rgba(14,20,32,0.7)', border: '1px solid rgba(30,45,69,0.7)' }}>
          <div className="text-4xl">🔍</div>
          <p className="text-sm" style={{ color: 'hsl(222,22%,55%)' }}>No plans match your search.</p>
          <button onClick={() => { setSearch(''); setFilter('ALL'); }}
            className="text-xs font-bold hover:underline" style={{ color: 'hsl(217,91%,60%)' }}>
            Clear filters
          </button>
        </div>
      )}

      {/* Grid */}
      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((v) => <VaultCard key={v.id} vault={v} />)}
        </div>
      </FadeIn>
    </main>
  );
}
