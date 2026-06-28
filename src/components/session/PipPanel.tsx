'use client';

import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Task, Participant, VotingSequence } from '@/types';
import { SEQUENCES } from '@/lib/sequences';
import { calculateAverage } from '@/lib/sequences';
import { cn } from '@/lib/utils';

interface PipPanelProps {
  pipWindow: Window;
  task: Task | null;
  sessionName: string;
  sequence: VotingSequence;
  selectedVote: string | null;
  revealed: boolean;
  totalVotes: number;
  totalParticipants: number;
  participants: Record<string, Participant>;
  timerFormatted: string;
  onVote: (value: string) => void;
  onReveal: () => void;
  onClose: () => void;
}

function PipContent({
  task,
  sessionName,
  sequence,
  selectedVote,
  revealed,
  totalVotes,
  totalParticipants,
  participants,
  timerFormatted,
  onVote,
  onReveal,
  onClose,
}: Omit<PipPanelProps, 'pipWindow'>) {
  const t = useTranslations('session');
  const values = SEQUENCES[sequence];
  const average = task ? calculateAverage(task.votes) : null;

  return (
    <div className="bg-background text-foreground flex flex-col p-2 gap-2">
      {/* Header: nome + timer + fechar numa linha só */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold truncate">{sessionName}</p>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-muted-foreground tabular-nums">{timerFormatted}</span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground leading-none w-4 h-4 flex items-center justify-center"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
      </div>

      {/* Tarefa */}
      {task && (
        <div className="flex items-center justify-between gap-2 border-b border-border pb-1.5">
          <p className={cn('text-xs leading-snug truncate', !task.title && 'italic text-muted-foreground')}>
            {task.title || t('untitled')}
          </p>
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
            {totalVotes}/{totalParticipants}
          </span>
        </div>
      )}

      {/* Média + votos revelados inline */}
      {task && revealed && (
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg px-2 py-1 shrink-0 min-w-[40px]">
            <span className="text-[10px] text-muted-foreground uppercase leading-none mb-0.5">avg</span>
            <span className="text-base font-bold tabular-nums leading-none">
              {average !== null ? average : '—'}
            </span>
          </div>
          <div className="flex-1 space-y-0.5 overflow-hidden">
            {Object.entries(task.votes).map(([uid, vote]) => (
              <div key={uid} className="flex justify-between text-xs">
                <span className="text-muted-foreground truncate">{participants[uid]?.name ?? '—'}</span>
                <span className="font-semibold tabular-nums ml-1 shrink-0">{vote.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards de votação */}
      {task && (
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap justify-center gap-1">
            {values.map((value) => (
              <button
                key={value}
                onClick={() => onVote(value)}
                className={cn(
                  'w-8 h-10 rounded-md border-2 text-xs font-semibold transition-all duration-150 select-none flex items-center justify-center',
                  selectedVote === value
                    ? 'border-primary bg-primary text-primary-foreground scale-105'
                    : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent'
                )}
              >
                {value}
              </button>
            ))}
          </div>
          {!revealed && (
            <button
              onClick={onReveal}
              disabled={totalVotes === 0}
              className="w-full py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium disabled:opacity-40 hover:bg-primary/90 transition-colors"
            >
              {t('revealVotes')}
            </button>
          )}
        </div>
      )}

      {!task && (
        <p className="text-xs text-center text-muted-foreground py-2">{t('guestWaiting')}</p>
      )}
    </div>
  );
}

export function PipPanel(props: PipPanelProps) {
  return createPortal(
    <PipContent {...props} />,
    props.pipWindow.document.body
  );
}
