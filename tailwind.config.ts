import type { Config } from 'tailwindcss';

/** rgb triplet var → color usable with Tailwind's /alpha modifier */
const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;
/** hsl triplet var → color usable with Tailwind's /alpha modifier */
const hsl = (v: string) => `hsl(var(${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Surfaces ── */
        background:  rgb('--background-rgb'),
        surface:     rgb('--surface-rgb'),
        'surface-2': rgb('--surface-2-rgb'),

        /* ── Text ── */
        foreground: hsl('--foreground'),
        muted:      hsl('--muted'),
        'muted-2':  hsl('--muted-2'),

        /* ── Brand accent (emerald) ── */
        accent: {
          DEFAULT: rgb('--accent-rgb'),
          strong:  rgb('--accent-strong-rgb'),
          text:    hsl('--accent-text'),
          soft:    rgb('--accent-soft-rgb'),
          line:    rgb('--accent-line-rgb'),
        },

        /* ── Nova (amethyst) ── */
        nova: {
          DEFAULT: rgb('--nova-rgb'),
          text:    hsl('--nova-text'),
          soft:    rgb('--nova-soft-rgb'),
          line:    rgb('--nova-line-rgb'),
        },

        /* ── Danger (rose) ── */
        danger: {
          DEFAULT: rgb('--danger-rgb'),
          text:    hsl('--danger-text'),
          soft:    rgb('--danger-soft-rgb'),
          line:    rgb('--danger-line-rgb'),
        },

        /* ── Borders ── */
        border:        rgb('--border-rgb'),
        'border-soft': rgb('--border-soft-rgb'),

        /* ── Legacy aliases — keep older classnames rendering ── */
        stellar: rgb('--accent-rgb'),
        jade:    rgb('--accent-rgb'),
        cyan:    rgb('--accent-rgb'),
        success: rgb('--accent-rgb'),
        gold:    rgb('--nova-rgb'),
        copper:  rgb('--nova-rgb'),
        warning: rgb('--nova-rgb'),
        clay:    rgb('--border-rgb'),
      },
      borderRadius: {
        sm:    '12px',
        lg:    '20px',
        xl:    '28px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        /* Apple-grade soft depth, theme-driven via CSS vars */
        'apple-sm':   'var(--shadow-sm)',
        'apple-card': 'var(--shadow-card)',
        'apple-pop':  'var(--shadow-pop)',
        'ring-accent':'var(--ring-accent)',
        /* legacy */
        vault:      'var(--shadow-card)',
        'vault-lg': 'var(--shadow-pop)',
        stellar:    '0 0 30px -5px rgb(var(--accent-rgb) / 0.4)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Outfit', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-sans)', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        serif:   ['var(--font-display)', 'Outfit', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'spring-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-up':    'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in':   'scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'slide-in':   'slide-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-14px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
