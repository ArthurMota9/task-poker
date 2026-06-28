import { render, screen } from '@testing-library/react';
import { VoteResults } from '@/components/session/VoteResults';
import { Task, Participant } from '@/types';

const participants: Record<string, Participant> = {
  'user-1': { id: 'user-1', name: 'Alice', isHost: true, joinedAt: 0 },
  'user-2': { id: 'user-2', name: 'Bob', isHost: false, joinedAt: 1 },
};

const makeTask = (votes: Task['votes']): Task => ({
  id: 'task-1',
  title: 'Test task',
  status: 'revealed',
  average: null,
  votes,
  createdAt: 0,
});

describe('VoteResults', () => {
  it('shows the calculated average', () => {
    const task = makeTask({
      'user-1': { value: '5', votedAt: 0 },
      'user-2': { value: '8', votedAt: 0 },
    });
    render(<VoteResults task={task} participants={participants} />);
    expect(screen.getByText('6.5')).toBeInTheDocument();
  });

  it('shows — when all votes are non-numeric', () => {
    const task = makeTask({
      'user-1': { value: '?', votedAt: 0 },
    });
    render(<VoteResults task={task} participants={participants} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders participant names with their vote values', () => {
    const task = makeTask({
      'user-1': { value: '5', votedAt: 0 },
      'user-2': { value: '8', votedAt: 0 },
    });
    render(<VoteResults task={task} participants={participants} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows vote distribution bars', () => {
    const task = makeTask({
      'user-1': { value: '5', votedAt: 0 },
      'user-2': { value: '5', votedAt: 0 },
    });
    const { container } = render(<VoteResults task={task} participants={participants} />);
    // bar at 100% width when all votes are equal
    const bar = container.querySelector('[style*="width: 100%"]');
    expect(bar).toBeInTheDocument();
  });

  it('falls back to — for unknown participant', () => {
    const task = makeTask({ 'unknown-user': { value: '3', votedAt: 0 } });
    render(<VoteResults task={task} participants={participants} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
