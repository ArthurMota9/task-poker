'use client';

import { useTranslations } from 'next-intl';
import { Task, Participant } from '@/types';
import { calculateAverage } from '@/lib/sequences';

interface VoteResultsProps {
  task: Task;
  participants: Record<string, Participant>;
}

export function VoteResults({ task, participants }: VoteResultsProps) {
  const t = useTranslations('results');
  const votes = Object.entries(task.votes);
  const average = calculateAverage(task.votes);

  const voteCounts = votes.reduce<Record<string, number>>((acc, [, vote]) => {
    acc[vote.value] = (acc[vote.value] ?? 0) + 1;
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(voteCounts), 1);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{t('average')}</p>
        <p className="text-4xl font-bold text-foreground tabular-nums">
          {average !== null ? average : '—'}
        </p>
      </div>

      <div className="space-y-1.5">
        {Object.entries(voteCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([value, count]) => (
            <div key={value} className="flex items-center gap-3">
              <span className="w-7 text-right text-sm font-semibold text-foreground tabular-nums">{value}</span>
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 tabular-nums">{count}{t('times')}</span>
            </div>
          ))}
      </div>

      <div className="border-t pt-3 space-y-1">
        {votes.map(([uid, vote]) => (
          <div key={uid} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{participants[uid]?.name ?? '—'}</span>
            <span className="font-semibold tabular-nums">{vote.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
