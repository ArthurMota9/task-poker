'use client';

import { useTranslations } from 'next-intl';
import { Participant, Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ParticipantListProps {
  participants: Record<string, Participant>;
  currentTask: Task | null;
  revealed: boolean;
  currentUserId: string | null;
}

export function ParticipantList({ participants, currentTask, revealed, currentUserId }: ParticipantListProps) {
  const t = useTranslations('participant');
  const list = Object.values(participants).sort((a, b) => a.joinedAt - b.joinedAt);
  const isVotingOrRevealed = currentTask?.status === 'voting' || currentTask?.status === 'revealed';

  return (
    <div className="space-y-1">
      {list.map((participant) => {
        const vote = currentTask?.votes[participant.id];
        const hasVoted = !!vote;

        return (
          <div key={participant.id} className="flex items-center justify-between px-2 py-1.5 rounded-md">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm truncate">
                {participant.name}
                {participant.id === currentUserId && (
                  <span className="text-muted-foreground text-xs font-normal"> ({t('you')})</span>
                )}
              </span>
              {participant.isHost && (
                <Badge variant="secondary" className="text-xs py-0 px-1.5 shrink-0">{t('host')}</Badge>
              )}
            </div>

            {isVotingOrRevealed && (
              <div
                className={cn(
                  'shrink-0 w-7 h-9 rounded border-2 flex items-center justify-center text-xs font-semibold transition-all duration-300 tabular-nums',
                  revealed && hasVoted
                    ? 'border-primary bg-primary/10 text-primary'
                    : hasVoted
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-dashed border-border bg-muted text-transparent'
                )}
              >
                {revealed && hasVoted ? vote!.value : hasVoted ? '✓' : '·'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
