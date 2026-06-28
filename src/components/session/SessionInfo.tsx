'use client';

import { useTimer } from '@/hooks/useTimer';
import { Badge } from '@/components/ui/badge';

interface SessionInfoProps {
  sessionName: string;
  sessionId: string;
  createdAt: number;
}

export function SessionInfo({ sessionName, sessionId, createdAt }: SessionInfoProps) {
  const { formatted } = useTimer(createdAt);

  return (
    <div className="flex items-center justify-between gap-2 px-1">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{sessionName}</p>
        <p className="text-muted-foreground text-xs font-mono">{sessionId}</p>
      </div>
      <Badge variant="secondary" className="text-xs font-medium tabular-nums shrink-0">
        {formatted}
      </Badge>
    </div>
  );
}
