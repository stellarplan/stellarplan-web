export function formatMoney(value: number | string, currency = 'USDC'): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n) + ' ' + currency;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export const PLAN_ICONS: Record<string, string> = {
  rent: '🏠', house: '🏠', housing: '🏠',
  electricity: '⚡', power: '⚡', energy: '⚡',
  water: '💧', utility: '💧',
  internet: '📶', wifi: '📶', broadband: '📶',
  school: '🎓', tuition: '🎓', education: '🎓',
  transport: '🚌', commute: '🚌', travel: '🚌',
  groceries: '🛒', food: '🛒',
  emergency: '🛡', insurance: '🛡', health: '🛡',
  savings: '🌱', invest: '🌱', family: '❤️',
};

export function iconFor(category: string, custom?: string | null): string {
  if (custom && custom.length > 0) return custom;
  const key = category.toLowerCase();
  return PLAN_ICONS[key] ?? '📦';
}
