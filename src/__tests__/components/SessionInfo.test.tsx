import { render, screen } from '@testing-library/react';
import { SessionInfo } from '@/components/session/SessionInfo';

jest.mock('@/hooks/useTimer', () => ({
  useTimer: () => ({ elapsed: 125, formatted: '02:05' }),
}));

describe('SessionInfo', () => {
  it('renders the session name', () => {
    render(<SessionInfo sessionName="Sprint Planning" sessionId="abc123" createdAt={0} />);
    expect(screen.getByText('Sprint Planning')).toBeInTheDocument();
  });

  it('renders the session id', () => {
    render(<SessionInfo sessionName="Session" sessionId="xyz-789" createdAt={0} />);
    expect(screen.getByText('xyz-789')).toBeInTheDocument();
  });

  it('renders the formatted timer from useTimer', () => {
    render(<SessionInfo sessionName="Session" sessionId="abc" createdAt={0} />);
    expect(screen.getByText('02:05')).toBeInTheDocument();
  });
});
