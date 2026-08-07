import type { Metadata, Viewport } from 'next';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/common/AppShell';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
});

// Runs before first paint: pick the theme, set the class + color-scheme, and
// hold off color transitions for one frame so the initial render doesn't flash.
const themeInit = `(function(){try{var e=document.documentElement;var t=localStorage.getItem('sp_theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';e.classList.add('no-transition');requestAnimationFrame(function(){requestAnimationFrame(function(){e.classList.remove('no-transition')})})}catch(e){}})()`;

export const metadata: Metadata = {
  title: 'StellarPlan — Smart Contract Paycheck Vaults',
  description: 'Automatically lock rent, bills, and emergency savings into Soroban smart vaults when your salary lands.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F5F7' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0C0F' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
