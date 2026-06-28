'use client';

import { SEQUENCES } from '@/lib/sequences';
import { VotingSequence } from '@/types';
import { cn } from '@/lib/utils';

interface VotingCardsProps {
  sequence: VotingSequence;
  selectedValue: string | null;
  onVote: (value: string) => void;
  disabled?: boolean;
}

export function VotingCards({ sequence, selectedValue, onVote, disabled }: VotingCardsProps) {
  const values = SEQUENCES[sequence];

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {values.map((value) => {
        const isSelected = selectedValue === value;
        return (
          <button
            key={value}
            onClick={() => !disabled && onVote(value)}
            disabled={disabled}
            className={cn(
              'w-12 h-16 rounded-lg border-2 text-base font-semibold transition-all duration-150 select-none',
              'flex items-center justify-center',
              isSelected
                ? 'border-primary bg-primary text-primary-foreground shadow-sm scale-105'
                : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent',
              disabled && 'opacity-40 cursor-not-allowed hover:scale-100 hover:border-border hover:bg-card'
            )}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
