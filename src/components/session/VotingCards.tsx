'use client';

import { SEQUENCES } from '@/lib/sequences';
import { VotingSequence } from '@/types';
import { cn } from '@/lib/utils';

interface VotingCardsProps {
  sequence: VotingSequence;
  customSequence?: string[];
  selectedValue: string | null;
  onVote: (value: string) => void;
  disabled?: boolean;
}

// Alternating red/black suits, like a real deck — spades, hearts, diamonds, clubs.
const SUITS = [
  { glyph: '♠', red: false },
  { glyph: '♥', red: true },
  { glyph: '♦', red: true },
  { glyph: '♣', red: false },
] as const;

export function VotingCards({ sequence, customSequence, selectedValue, onVote, disabled }: VotingCardsProps) {
  const values = sequence === 'custom' ? (customSequence ?? []) : SEQUENCES[sequence];

  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {values.map((value, i) => {
        const isSelected = selectedValue === value;
        const suit = SUITS[i % SUITS.length];
        const tone = suit.red ? 'text-suit-red' : 'text-suit-black';

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => !disabled && onVote(value)}
            disabled={disabled}
            className={cn(
              'group relative h-20 w-14 shrink-0 select-none rounded-lg border bg-card-stock',
              'transition-all duration-200 ease-out',
              isSelected
                ? '-translate-y-2.5 border-primary shadow-lg ring-2 ring-primary/50'
                : 'border-card-stock-foreground/15 shadow-sm hover:-translate-y-1 hover:border-primary/40 hover:shadow-md',
              disabled && 'opacity-40 hover:translate-y-0 hover:border-card-stock-foreground/15 hover:shadow-sm'
            )}
          >
            <span className={cn('absolute left-1.5 top-1 text-xs leading-none', tone)} aria-hidden="true">
              {suit.glyph}
            </span>
            <span className={cn('absolute right-1.5 bottom-1 rotate-180 text-xs leading-none', tone)} aria-hidden="true">
              {suit.glyph}
            </span>
            <span
              className={cn(
                'flex h-full w-full items-center justify-center px-1 text-center font-heading font-semibold',
                tone,
                value.length > 2 ? 'text-base' : 'text-xl'
              )}
            >
              {value}
            </span>
          </button>
        );
      })}
    </div>
  );
}
