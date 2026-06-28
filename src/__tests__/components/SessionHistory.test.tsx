import { render, screen } from '@testing-library/react';
import { SessionHistory } from '@/components/session/SessionHistory';
import { HistoryEntry } from '@/types';

const makeEntry = (overrides: Partial<HistoryEntry> = {}): HistoryEntry => ({
  id: 'entry-1',
  title: 'My Task',
  average: 5,
  votes: {},
  completedAt: 1000,
  ...overrides,
});

describe('SessionHistory', () => {
  it('renders nothing when history is empty', () => {
    const { container } = render(<SessionHistory history={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows the task title and average', () => {
    const history = { 'entry-1': makeEntry() };
    render(<SessionHistory history={history} />);
    expect(screen.getByText('My Task')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows multiple entries sorted by completedAt', () => {
    const history = {
      'entry-2': makeEntry({ id: 'entry-2', title: 'Second', completedAt: 2000 }),
      'entry-1': makeEntry({ id: 'entry-1', title: 'First', completedAt: 1000 }),
    };
    render(<SessionHistory history={history} />);
    const items = screen.getAllByText(/First|Second/);
    expect(items[0]).toHaveTextContent('First');
    expect(items[1]).toHaveTextContent('Second');
  });

  it('shows round label for free mode entries with roundNumber', () => {
    const history = {
      'entry-1': makeEntry({ title: '', roundNumber: 3 }),
    };
    render(<SessionHistory history={history} />);
    // useTranslations mock returns the key: 'round'
    expect(screen.getByText('round')).toBeInTheDocument();
  });

  it('shows the history card heading', () => {
    const history = { 'entry-1': makeEntry() };
    render(<SessionHistory history={history} />);
    // useTranslations mock returns key
    expect(screen.getByText('history')).toBeInTheDocument();
  });
});
