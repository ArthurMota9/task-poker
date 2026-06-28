'use client';

import { useTranslations } from 'next-intl';
import { HistoryEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SessionHistoryProps {
  history: Record<string, HistoryEntry>;
}

export function SessionHistory({ history }: SessionHistoryProps) {
  const t = useTranslations('session');
  const tTask = useTranslations('taskManager');
  const entries = Object.values(history).sort((a, b) => a.completedAt - b.completedAt);

  if (entries.length === 0) return null;

  return (
    <Card className="shadow-none border">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {t('history')}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 space-y-1">
        {entries.map((entry, index) => (
          <div key={entry.id} className="flex items-center justify-between gap-2 py-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-muted-foreground tabular-nums w-4 shrink-0">{index + 1}.</span>
              <span className={`text-xs truncate ${!entry.title ? 'text-muted-foreground italic' : 'text-foreground'}`}>
                {entry.title || tTask('untitled')}
              </span>
            </div>
            <span className="text-xs font-semibold tabular-nums shrink-0 text-foreground">
              {entry.average ?? '?'}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
