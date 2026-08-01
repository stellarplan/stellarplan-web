'use client';

import { createContext, useContext, useState } from 'react';

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen(v: boolean): void;
}

const Ctx = createContext<AppState | null>(null);

function Provider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <Ctx.Provider value={{ sidebarOpen, setSidebarOpen }}>{children}</Ctx.Provider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside <Providers>');
  return ctx;
}
