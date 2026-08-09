import { cn } from '@/lib/utils';

/** A single shimmering placeholder block used while data loads. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-surface-2', className)} />;
}
