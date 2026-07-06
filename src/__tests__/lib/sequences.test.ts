import { calculateAverage, SEQUENCES, SEQUENCE_LABELS } from '@/lib/sequences';

describe('calculateAverage', () => {
  it('returns the average of numeric votes', () => {
    const votes = {
      u1: { value: '5' },
      u2: { value: '8' },
      u3: { value: '3' },
    };
    expect(calculateAverage(votes)).toBe(5.33);
  });

  it('rounds to two decimal places', () => {
    const votes = {
      u1: { value: '1' },
      u2: { value: '2' },
    };
    expect(calculateAverage(votes)).toBe(1.5);
  });

  it('handles comma as decimal separator', () => {
    const votes = {
      u1: { value: '0,5' },
      u2: { value: '1' },
    };
    expect(calculateAverage(votes)).toBe(0.75);
  });

  it('ignores non-numeric values like ? and ∞', () => {
    const votes = {
      u1: { value: '8' },
      u2: { value: '?' },
      u3: { value: '∞' },
    };
    expect(calculateAverage(votes)).toBe(8);
  });

  it('returns null when all votes are non-numeric', () => {
    const votes = {
      u1: { value: '?' },
      u2: { value: '∞' },
    };
    expect(calculateAverage(votes)).toBeNull();
  });

  it('returns null for empty votes', () => {
    expect(calculateAverage({})).toBeNull();
  });

  it('handles a single vote', () => {
    expect(calculateAverage({ u1: { value: '13' } })).toBe(13);
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
