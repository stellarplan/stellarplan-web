import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/common/AppShell';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', weight: ['600', '700'] });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '600', '700'] });
const plex = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'] });

export const metadata: Metadata = {
  title: 'StellarPlan — Plan once. Get paid. Stay protected.',
  description: 'Automatically protect your essential monthly expenses the moment your salary arrives.',
};

export const viewport: Viewport = {
  themeColor: '#F2EEE8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${plex.variable}`}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
