import { calculateAverage, SEQUENCES, SEQUENCE_LABELS } from '@/lib/sequences';

describe('calculateAverage', () => {
  it('returns the average of numeric votes', () => {
    const votes = {
      u1: { value: '5', votedAt: 0 },
      u2: { value: '8', votedAt: 0 },
      u3: { value: '3', votedAt: 0 },
    };
    expect(calculateAverage(votes)).toBe(5.3);
  });

  it('rounds to one decimal place', () => {
    const votes = {
      u1: { value: '1', votedAt: 0 },
      u2: { value: '2', votedAt: 0 },
    };
    expect(calculateAverage(votes)).toBe(1.5);
  });

  it('ignores non-numeric values like ? and ∞', () => {
    const votes = {
      u1: { value: '8', votedAt: 0 },
      u2: { value: '?', votedAt: 0 },
      u3: { value: '∞', votedAt: 0 },
    };
    expect(calculateAverage(votes)).toBe(8);
  });

  it('returns null when all votes are non-numeric', () => {
    const votes = {
      u1: { value: '?', votedAt: 0 },
      u2: { value: '∞', votedAt: 0 },
    };
    expect(calculateAverage(votes)).toBeNull();
  });

  it('returns null for empty votes', () => {
    expect(calculateAverage({})).toBeNull();
  });

  it('handles a single vote', () => {
    expect(calculateAverage({ u1: { value: '13', votedAt: 0 } })).toBe(13);
  });
});

describe('SEQUENCES', () => {
  it('includes fibonacci, tshirt and powers_of_2', () => {
    expect(Object.keys(SEQUENCES)).toEqual(
      expect.arrayContaining(['fibonacci', 'tshirt', 'powers_of_2'])
    );
  });

  it('fibonacci includes expected values', () => {
    expect(SEQUENCES.fibonacci).toContain('5');
    expect(SEQUENCES.fibonacci).toContain('13');
    expect(SEQUENCES.fibonacci).toContain('?');
  });

  it('tshirt includes size labels', () => {
    expect(SEQUENCES.tshirt).toContain('XS');
    expect(SEQUENCES.tshirt).toContain('XL');
  });
});

describe('SEQUENCE_LABELS', () => {
  it('has a label for each sequence', () => {
    expect(SEQUENCE_LABELS.fibonacci).toBe('Fibonacci');
    expect(SEQUENCE_LABELS.tshirt).toBe('T-Shirt');
    expect(SEQUENCE_LABELS.powers_of_2).toBe('Potências de 2');
  });
});
