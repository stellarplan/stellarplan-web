import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Background surfaces */
        background: 'rgb(var(--background-rgb))',
        surface: 'rgb(var(--surface-rgb))',
        'surface-2': 'rgb(var(--surface-2-rgb))',

        /* Text */
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',

        /* Accents */
        stellar: 'hsl(var(--stellar))',
        nova:    'hsl(var(--nova))',
        gold:    'hsl(var(--gold))',
        'gold-dark': 'hsl(var(--gold-dark))',
        cyan:    'hsl(var(--cyan))',
        danger:  'hsl(var(--danger))',

        /* Legacy aliases — keep all existing classnames working */
        jade:         'hsl(var(--stellar))',
        'jade-soft':  'hsl(var(--stellar))',
        copper:       'hsl(var(--gold))',
        'copper-dark':'hsl(var(--gold-dark))',
        success:      'hsl(var(--cyan))',
        warning:      'hsl(var(--gold))',

        /* Borders */
        border: 'rgb(var(--border-rgb))',
        clay:   'rgb(var(--border-rgb))',
      },
      borderRadius: {
        sm:  '12px',
        lg:  '20px',
        xl:  '28px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        vault:    '0 4px 16px rgba(0,0,0,0.4), 0 24px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
        'vault-lg': '0 4px 20px rgba(0,0,0,0.5), 0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        stellar:  '0 0 30px -5px rgba(59,130,246,0.4)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        serif:   ['var(--font-display)', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer-move 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
