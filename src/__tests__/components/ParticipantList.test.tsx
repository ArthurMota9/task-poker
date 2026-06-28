import { render, screen } from '@testing-library/react';
import { ParticipantList } from '@/components/session/ParticipantList';
import { Participant, Task } from '@/types';

const participants: Record<string, Participant> = {
  'user-1': { id: 'user-1', name: 'Alice', isHost: true, joinedAt: 0 },
  'user-2': { id: 'user-2', name: 'Bob', isHost: false, joinedAt: 1 },
};

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  title: 'Task',
  status: 'voting',
  average: null,
  votes: {},
  createdAt: 0,
  ...overrides,
});

describe('ParticipantList', () => {
  it('renders all participant names', () => {
    render(
      <ParticipantList
        participants={participants}
        currentTask={makeTask()}
        revealed={false}
        currentUserId={null}
      />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows host badge next to the host', () => {
    render(
      <ParticipantList
        participants={participants}
        currentTask={makeTask()}
        revealed={false}
        currentUserId={null}
      />
    );
    expect(screen.getByText('host')).toBeInTheDocument();
  });

  it('marks the current user with (you)', () => {
    render(
      <ParticipantList
        participants={participants}
        currentTask={makeTask()}
        revealed={false}
        currentUserId="user-2"
      />
    );
    expect(screen.getByText('(you)')).toBeInTheDocument();
  });

  it('shows checkmark card when participant has voted but not revealed', () => {
    const task = makeTask({ votes: { 'user-1': { value: '5', votedAt: 0 } } });
    const { container } = render(
      <ParticipantList
        participants={participants}
        currentTask={task}
        revealed={false}
        currentUserId={null}
      />
    );
    expect(container).toHaveTextContent('✓');
  });

  it('shows vote value when revealed', () => {
    const task = makeTask({
      status: 'revealed',
      votes: { 'user-1': { value: '8', votedAt: 0 } },
    });
    render(
      <ParticipantList
        participants={participants}
        currentTask={task}
        revealed={true}
        currentUserId={null}
      />
    );
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('does not show vote cards when there is no task', () => {
    const { container } = render(
      <ParticipantList
        participants={participants}
        currentTask={null}
        revealed={false}
        currentUserId={null}
      />
    );
    // No checkmark or vote values
    expect(container).not.toHaveTextContent('✓');
  });
});
