'use client';

import { useEffect, useState } from 'react';
import { subscribeToSession, getOrCreateAnonymousUser } from '@/lib/session';
import { Session } from '@/types';

export function useSession(sessionId: string) {
  const [session, setSession] = useState<Session | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubSession: (() => void) | null = null;
    let cancelled = false;

    async function init() {
      const uid = await getOrCreateAnonymousUser();
      if (cancelled) return;
      setUserId(uid);

      unsubSession = subscribeToSession(sessionId, (data) => {
        if (cancelled) return;
        setSession(data);
        setLoading(false);
      });
    }

    init().catch(() => setLoading(false));

    return () => {
      cancelled = true;
      unsubSession?.();
    };
  }, [sessionId]);

  const currentParticipant = userId && session?.participants?.[userId]?.name
    ? session.participants[userId]
    : null;

  const isHost = currentParticipant?.isHost ?? false;

  return { session, userId, loading, currentParticipant, isHost };
}
