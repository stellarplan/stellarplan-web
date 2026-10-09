import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CATEGORY_ICONS,
  FALLBACK_ICON,
  categoryIconSrc,
  formatDate,
  formatMoney,
  formatRelative,
} from '@/lib/format';
import { cn } from '@/lib/utils';

describe('formatMoney', () => {
  it('formats numbers with two decimals and the currency code', () => {
    expect(formatMoney(1234.5)).toBe('$1,234.50 USDC');
    expect(formatMoney(0)).toBe('$0.00 USDC');
  });

  it('accepts decimal strings, as returned by the API', () => {
    expect(formatMoney('900.0000000')).toBe('$900.00 USDC');
  });

  it('uses the currency label it is given', () => {
    expect(formatMoney(5, 'XLM')).toBe('$5.00 XLM');
  });

  it('never renders NaN for unparseable input', () => {
    expect(formatMoney('not a number')).toBe('$0.00 USDC');
    expect(formatMoney('')).toBe('$0.00 USDC');
    expect(formatMoney(Number.NaN)).toBe('$0.00 USDC');
    expect(formatMoney(Number.POSITIVE_INFINITY)).toBe('$0.00 USDC');
  });

  it('formats negative amounts', () => {
    expect(formatMoney(-12.3)).toBe('-$12.30 USDC');
  });
});

describe('formatDate', () => {
  it('returns a dash for missing values', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate(undefined)).toBe('—');
    expect(formatDate('')).toBe('—');
  });

  it('formats an ISO date', () => {
    expect(formatDate('2026-03-05T12:00:00Z')).toBe('Mar 5, 2026');
  });

  it('returns a dash instead of "Invalid Date" for garbage', () => {
    expect(formatDate('definitely not a date')).toBe('—');
  });
});

describe('formatRelative', () => {
  afterEach(() => vi.useRealTimers());

  const NOW = new Date('2026-06-15T12:00:00Z');
  const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

  it('uses minutes, hours, and days as time passes', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    expect(formatRelative(ago(10_000))).toBe('just now');
    expect(formatRelative(ago(5 * 60_000))).toBe('5m ago');
    expect(formatRelative(ago(3 * 3_600_000))).toBe('3h ago');
    expect(formatRelative(ago(2 * 86_400_000))).toBe('2d ago');
  });

  it('switches to a calendar date after 30 days', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    expect(formatRelative(ago(45 * 86_400_000))).toBe('May 1, 2026');
  });

  it('treats a timestamp slightly in the future as just now', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    expect(formatRelative(new Date(NOW.getTime() + 5_000).toISOString())).toBe('just now');
  });
});

describe('categoryIconSrc', () => {
  it('resolves known categories case-insensitively', () => {
    expect(categoryIconSrc('Rent')).toBe('/icons/rent.png');
    expect(categoryIconSrc('  ELECTRICITY ')).toBe('/icons/electricity.png');
  });

  it('folds synonyms onto the same icon', () => {
    expect(categoryIconSrc('wifi')).toBe(categoryIconSrc('internet'));
    expect(categoryIconSrc('tuition')).toBe(categoryIconSrc('school'));
  });

  it('falls back for unknown or missing categories', () => {
    expect(categoryIconSrc('skydiving')).toBe(FALLBACK_ICON);
    expect(categoryIconSrc(undefined as unknown as string)).toBe(FALLBACK_ICON);
  });

  it('only points at icons under /icons', () => {
    for (const src of Object.values(CATEGORY_ICONS)) expect(src).toMatch(/^\/icons\/[a-z]+\.png$/);
  });
});

describe('cn', () => {
  it('joins truthy class names and drops falsy ones', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
    expect(cn()).toBe('');
  });
});
