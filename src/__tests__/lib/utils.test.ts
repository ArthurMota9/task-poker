import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates tailwind conflicting classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'active')).toBe('base active');
  });

  it('handles undefined and null gracefully', () => {
    expect(cn('base', undefined, null as unknown as string)).toBe('base');
  });
});
