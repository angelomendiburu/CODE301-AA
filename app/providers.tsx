"use client";

import { SessionProvider } from "next-auth/react";
import { ActivityLogger } from '@/components/ActivityLogger';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ActivityLogger />
      {children}
    </SessionProvider>
  );
}
