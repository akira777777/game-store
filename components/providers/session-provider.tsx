"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// #region agent log
fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'components/providers/session-provider.tsx:6', message: 'SessionProvider module load', data: { isBrowser: typeof window !== 'undefined' }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'E' }) }).catch(() => { });
// #endregion

export function SessionProvider({ children }: { children: ReactNode }) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'components/providers/session-provider.tsx:12', message: 'SessionProvider render', data: { isBrowser: typeof window !== 'undefined' }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'E' }) }).catch(() => { });
  // #endregion
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
