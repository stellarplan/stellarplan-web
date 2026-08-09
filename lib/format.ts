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

/**
 * Maps a plan category to one of the bundled PNG icons in /public/icons.
 * Synonyms fold onto the same icon so custom category names still resolve.
 */
export const CATEGORY_ICONS: Record<string, string> = {
  rent: '/icons/rent.png', house: '/icons/rent.png', housing: '/icons/rent.png',
  electricity: '/icons/electricity.png', power: '/icons/electricity.png', energy: '/icons/electricity.png',
  water: '/icons/water.png', utility: '/icons/water.png',
  internet: '/icons/internet.png', wifi: '/icons/internet.png', broadband: '/icons/internet.png',
  school: '/icons/school.png', tuition: '/icons/school.png', education: '/icons/school.png', fees: '/icons/school.png',
  transport: '/icons/transport.png', commute: '/icons/transport.png', travel: '/icons/transport.png', bus: '/icons/transport.png',
  groceries: '/icons/groceries.png', food: '/icons/groceries.png',
  emergency: '/icons/emergency.png', insurance: '/icons/emergency.png', health: '/icons/emergency.png',
  savings: '/icons/savings.png', invest: '/icons/savings.png', family: '/icons/savings.png',
};

/** Neutral fallback icon for categories with no dedicated artwork. */
export const FALLBACK_ICON = '/icons/savings.png';

/** Resolve the icon path for a category (case-insensitive), with a safe fallback. */
export function categoryIconSrc(category: string): string {
  const key = (category ?? '').toLowerCase().trim();
  return CATEGORY_ICONS[key] ?? FALLBACK_ICON;
}
