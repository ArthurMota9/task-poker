import { renderHook, act } from '@testing-library/react';
import { useTimer } from '@/hooks/useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts at 00:00 when given a current timestamp', () => {
    const now = Date.now();
    const { result } = renderHook(() => useTimer(now));
    expect(result.current.formatted).toBe('00:00');
    expect(result.current.elapsed).toBe(0);
  });

  it('returns 00:00 when startTimestamp is null', () => {
    const { result } = renderHook(() => useTimer(null));
    expect(result.current.formatted).toBe('00:00');
  });

  it('updates elapsed every second', () => {
    const start = Date.now();
    const { result } = renderHook(() => useTimer(start));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.elapsed).toBe(5);
    expect(result.current.formatted).toBe('00:05');
  });

  it('formats minutes and seconds correctly', () => {
    const start = Date.now();
    const { result } = renderHook(() => useTimer(start));

    act(() => {
      jest.advanceTimersByTime(90_000);
    });

    expect(result.current.formatted).toBe('01:30');
  });

  it('includes hours when elapsed > 3600s', () => {
    const start = Date.now();
    const { result } = renderHook(() => useTimer(start));

    act(() => {
      jest.advanceTimersByTime(3_661_000);
    });

    expect(result.current.formatted).toBe('01:01:01');
  });

  it('does not show hours section when under 1 hour', () => {
    const start = Date.now();
    const { result } = renderHook(() => useTimer(start));

    act(() => {
      jest.advanceTimersByTime(3_599_000);
    });

    expect(result.current.formatted).not.toMatch(/^\d{2}:\d{2}:\d{2}/);
    expect(result.current.formatted).toMatch(/^\d{2}:\d{2}$/);
  });
});
