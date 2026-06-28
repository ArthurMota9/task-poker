import { VotingSequence } from '@/types';

export const SEQUENCES: Record<VotingSequence, string[]> = {
  fibonacci: ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?', '∞'],
  tshirt: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'],
  powers_of_2: ['1', '2', '4', '8', '16', '32', '64', '?', '∞'],
};

export const SEQUENCE_LABELS: Record<VotingSequence, string> = {
  fibonacci: 'Fibonacci',
  tshirt: 'T-Shirt',
  powers_of_2: 'Potências de 2',
};

export function calculateAverage(votes: Record<string, { value: string }>): number | null {
  const numeric = Object.values(votes)
    .map((v) => parseFloat(v.value))
    .filter((n) => !isNaN(n));

  if (numeric.length === 0) return null;
  return Math.round((numeric.reduce((a, b) => a + b, 0) / numeric.length) * 10) / 10;
}
