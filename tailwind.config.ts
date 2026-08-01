import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        clay: 'hsl(var(--clay))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        jade: 'hsl(var(--jade))',
        'jade-soft': 'hsl(var(--jade-soft))',
        copper: 'hsl(var(--copper))',
        'copper-dark': 'hsl(var(--copper-dark))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        danger: 'hsl(var(--danger))',
      },
      borderRadius: { sm: '14px', lg: '24px', xl: '32px' },
      boxShadow: {
        vault: '0 2px 6px rgba(46,38,32,.04), 0 18px 40px rgba(46,38,32,.10), inset 0 1px 0 rgba(255,255,255,.9)',
        'vault-lg': '0 3px 8px rgba(46,38,32,.05), 0 24px 48px rgba(46,38,32,.13), inset 0 1px 0 rgba(255,255,255,.95)',
      },
    },
  },
  plugins: [],
};
export default config;
