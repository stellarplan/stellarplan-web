'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ────────────────────────────────────────────────────────────
   Theme (light / dark) — self-rolled, no next-themes dependency.
   The <head> boot script has already set the correct class on
   <html> before hydration, so we read it back on mount to avoid
   any flash or SSR mismatch. Persistence key: `sp_theme`.
   ──────────────────────────────────────────────────────────── */

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme(t: Theme): void;
  toggleTheme(): void;
}

const ThemeCtx = createContext<ThemeState | null>(null);

function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', t === 'dark');
  root.style.colorScheme = t;
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  // SSR default; reconciled with the DOM on mount below.
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setThemeState(isDark ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem('sp_theme', t);
    } catch {
      /* private mode / storage disabled — non-fatal */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  }, [setTheme]);

  // Follow the OS only while the user hasn't chosen explicitly.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem('sp_theme');
      } catch {
        /* ignore */
      }
      if (stored !== 'light' && stored !== 'dark') {
        setThemeState(e.matches ? 'dark' : 'light');
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return <ThemeCtx.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used inside <Providers>');
  return ctx;
}

/* ────────────────────────────────────────────────────────────
   App shell state (sidebar)
   ──────────────────────────────────────────────────────────── */

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen(v: boolean): void;
}

const Ctx = createContext<AppState | null>(null);

function AppProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <Ctx.Provider value={{ sidebarOpen, setSidebarOpen }}>{children}</Ctx.Provider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside <Providers>');
  return ctx;
}
