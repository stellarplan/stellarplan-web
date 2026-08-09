import { Skeleton } from '@/components/common/Skeleton';

/** Mirrors the dashboard layout while the first payload loads, so the page
 *  feels instant instead of showing a bare "Loading…" line. */
export function DashboardSkeleton() {
  return (
    <main className="min-h-screen pb-24 md:pb-12 max-w-3xl mx-auto" aria-busy="true">
      {/* Header */}
      <div className="px-5 pt-8 pb-6 flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-11 h-11 rounded-2xl" />
          <Skeleton className="w-24 h-10 rounded-xl" />
        </div>
      </div>

      {/* Scan card */}
      <div className="px-5 mb-6">
        <Skeleton className="h-20 rounded-2xl" />
      </div>

      {/* Balance cards */}
      <div className="px-5 grid grid-cols-2 gap-4 mb-6">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>

      {/* Progress */}
      <div className="px-5 mb-6">
        <Skeleton className="h-24 rounded-2xl" />
      </div>

      {/* Vaults */}
      <div className="px-5 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
