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

  const voteGroups = votes.reduce<Record<string, string[]>>((acc, [uid, vote]) => {
    const name = participants[uid]?.name ?? '—';
    (acc[vote.value] ??= []).push(name);
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(voteGroups).map((n) => n.length), 1);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{t('average')}</p>
        <p className="text-4xl font-bold text-foreground tabular-nums">
          {average !== null ? average : '—'}
        </p>
      </div>

      <div className="space-y-1.5">
        {Object.entries(voteGroups)
          .sort((a, b) => b[1].length - a[1].length)
          .map(([value, names]) => (
            <div key={value} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground truncate w-28 shrink-0">
                {names.join(', ')}
              </span>
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((names.length / votes.length) * 100)}%` }}
                />
              </div>
              <div className="flex items-baseline gap-1 shrink-0 justify-end w-16">
                <span className="text-sm font-semibold text-foreground tabular-nums">{value}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  ({Math.round((names.length / votes.length) * 100)}%)
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
