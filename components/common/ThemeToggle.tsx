'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/providers';

/**
 * Animated light/dark switch.
 *
 * `variant="pill"` (default) renders a compact icon button with a spring
 * rotate/scale crossfade between sun and moon — ideal for nav bars.
 * `variant="segmented"` renders a two-option track with a sliding thumb —
 * ideal for settings, where an explicit choice reads better than a toggle.
 */
export function ThemeToggle({
  variant = 'pill',
  className = '',
}: {
  variant?: 'pill' | 'segmented';
  className?: string;
}) {
  const { theme, setTheme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'segmented') {
    const options = [
      { key: 'light' as const, icon: Sun, label: 'Light' },
      { key: 'dark' as const, icon: Moon, label: 'Dark' },
    ];
    return (
      <div
        className={`relative inline-flex items-center rounded-full p-1 ${className}`}
        style={{ background: 'rgb(var(--surface-2-rgb))', border: '1px solid rgb(var(--border-rgb))' }}
        role="radiogroup"
        aria-label="Color theme"
      >
        {options.map(({ key, icon: Icon, label }) => {
          const active = theme === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setTheme(key)}
              className="relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300"
              style={{ color: active ? 'rgb(var(--accent-rgb))' : 'hsl(var(--muted))' }}
            >
              {active && (
                <motion.span
                  layoutId="theme-thumb"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'rgb(var(--surface-rgb))',
                    border: '1px solid rgb(var(--accent-rgb) / 0.4)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={16} className="relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl transition-all duration-300 ${className}`}
      style={{
        background: 'rgb(var(--surface-2-rgb))',
        border: '1px solid rgb(var(--border-rgb))',
        color: 'hsl(var(--foreground))',
      }}
    >
      <motion.span
        key={theme}
        initial={{ y: isDark ? 14 : -14, opacity: 0, rotate: isDark ? -40 : 40 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="grid place-items-center"
      >
        {isDark ? <Moon size={17} /> : <Sun size={17} />}
      </motion.span>
    </button>
  );
}

export default ThemeToggle;
