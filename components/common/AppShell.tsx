'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getTokens } from '@/lib/api';
import { NavShell } from '@/components/common/NavShell';

const PUBLIC = ['/', '/welcome', '/login', '/signup', '/onboarding'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isAuthed = !!getTokens()?.accessToken;
    setAuthed(isAuthed);

    const isPublic = PUBLIC.includes(pathname);
    if (!isAuthed && !isPublic) router.replace('/login');
    if (isAuthed && ['/login', '/signup', '/welcome'].includes(pathname)) router.replace('/dashboard');
    if (isAuthed && pathname === '/') router.replace('/dashboard');
  }, [pathname, router]);

  const bare = PUBLIC.includes(pathname);
  if (!mounted) return <div className="min-h-screen bg-background" />;
  if (!authed && !bare) return <div className="min-h-screen bg-background" />;

  return bare ? <>{children}</> : <NavShell>{children}</NavShell>;
}
