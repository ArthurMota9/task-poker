import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VotingArea } from '@/components/session/VotingArea';
import { Session, Task, Participant } from '@/types';

jest.mock('@/lib/session', () => ({
  revealVotes: jest.fn().mockResolvedValue(undefined),
  finishTask: jest.fn().mockResolvedValue(undefined),
  finishFreeRound: jest.fn().mockResolvedValue(undefined),
  clearVotes: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('canvas-confetti', () => ({ __esModule: true, default: jest.fn() }));

import { revealVotes, finishTask, finishFreeRound, clearVotes } from '@/lib/session';
const mockRevealVotes = revealVotes as jest.Mock;
const mockFinishTask = finishTask as jest.Mock;
const mockFinishFreeRound = finishFreeRound as jest.Mock;
const mockClearVotes = clearVotes as jest.Mock;

const onVote = jest.fn();
const onClearVotes = jest.fn();

const participants: Record<string, Participant> = {
  'user-1': { id: 'user-1', name: 'Alice', isHost: true, joinedAt: 0 },
};

const baseTask: Task = {
  id: 'task-1',
  title: 'Test task',
  status: 'voting',
  average: null,
  votes: {},
  createdAt: 0,
};

const baseSession: Session = {
  id: 'sess-1',
  name: 'Session',
  hostId: 'user-1',
  status: 'voting',
  votingSequence: 'fibonacci',
  anyoneCanControl: false,
  freeMode: false,
  currentTaskId: 'task-1',
  createdAt: 0,
  participants,
  tasks: { 'task-1': baseTask },
  history: {},
};

const defaultProps = {
  sessionId: 'sess-1',
  session: baseSession,
  currentTask: baseTask,
  userId: 'user-1',
  canControl: true,
  participants,
  totalParticipants: 1,
  myVote: null,
  onVote,
  onClearVotes,
};

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
});

describe('VotingArea', () => {
  it('renders voting cards', () => {
    render(<VotingArea {...defaultProps} />);
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
  });

  it('shows task title when not in freeMode', () => {
    render(<VotingArea {...defaultProps} />);
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('hides task title in freeMode', () => {
    const freeModeSession = { ...baseSession, freeMode: true };
    render(<VotingArea {...defaultProps} session={freeModeSession} />);
    expect(screen.queryByText('Test task')).not.toBeInTheDocument();
  });

  it('shows the waiting message when there is no task', () => {
    render(<VotingArea {...defaultProps} currentTask={null} />);
    expect(screen.getByText('hostWaiting')).toBeInTheDocument();
  });

  it('shows guestWaiting when canControl is false and no task', () => {
    render(<VotingArea {...defaultProps} currentTask={null} canControl={false} />);
    expect(screen.getByText('guestWaiting')).toBeInTheDocument();
  });

  it('shows reveal button for canControl when not revealed', () => {
    render(<VotingArea {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'revealVotes' })).toBeInTheDocument();
  });

  it('hides reveal button when canControl is false', () => {
    render(<VotingArea {...defaultProps} canControl={false} />);
    expect(screen.queryByRole('button', { name: 'revealVotes' })).not.toBeInTheDocument();
  });

  it('reveal button is disabled when there are no votes', () => {
    render(<VotingArea {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'revealVotes' })).toBeDisabled();
  });

  it('reveal button is enabled when there are votes', () => {
    const taskWithVotes = { ...baseTask, votes: { 'user-1': { value: '5', votedAt: 0 } } };
    render(<VotingArea {...defaultProps} currentTask={taskWithVotes} />);
    expect(screen.getByRole('button', { name: 'revealVotes' })).not.toBeDisabled();
  });

  it('calls revealVotes on reveal button click', async () => {
    const user = userEvent.setup();
    const taskWithVotes = { ...baseTask, votes: { 'user-1': { value: '5', votedAt: 0 } } };
    render(<VotingArea {...defaultProps} currentTask={taskWithVotes} />);
    await user.click(screen.getByRole('button', { name: 'revealVotes' }));
    expect(mockRevealVotes).toHaveBeenCalledWith('sess-1', 'task-1');
  });

  it('shows clearVotes button for canControl', () => {
    render(<VotingArea {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'clearVotes' })).toBeInTheDocument();
  });

  it('calls onClearVotes on button click', async () => {
    const user = userEvent.setup();
    render(<VotingArea {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'clearVotes' }));
    expect(onClearVotes).toHaveBeenCalled();
  });

  it('shows finishTask when revealed, canControl and not freeMode', () => {
    const revealedSession = { ...baseSession, status: 'revealed' as const };
    const revealedTask = { ...baseTask, status: 'revealed' as const };
    render(<VotingArea {...defaultProps} session={revealedSession} currentTask={revealedTask} />);
    expect(screen.getByRole('button', { name: 'finishTask' })).toBeInTheDocument();
  });

  it('shows finishRound when revealed, canControl and freeMode', () => {
    const revealedSession = { ...baseSession, status: 'revealed' as const, freeMode: true };
    const revealedTask = { ...baseTask, status: 'revealed' as const };
    render(<VotingArea {...defaultProps} session={revealedSession} currentTask={revealedTask} />);
    expect(screen.getByRole('button', { name: 'finishRound' })).toBeInTheDocument();
  });

  it('calls finishTask on button click', async () => {
    const user = userEvent.setup();
    const revealedSession = { ...baseSession, status: 'revealed' as const };
    const revealedTask = { ...baseTask, status: 'revealed' as const };
    render(<VotingArea {...defaultProps} session={revealedSession} currentTask={revealedTask} />);
    await user.click(screen.getByRole('button', { name: 'finishTask' }));
    expect(mockFinishTask).toHaveBeenCalledWith('sess-1', 'task-1');
  });

  it('calls finishFreeRound on button click in freeMode', async () => {
    const user = userEvent.setup();
    const revealedSession = { ...baseSession, status: 'revealed' as const, freeMode: true };
    const revealedTask = { ...baseTask, status: 'revealed' as const };
    render(<VotingArea {...defaultProps} session={revealedSession} currentTask={revealedTask} />);
    await user.click(screen.getByRole('button', { name: 'finishRound' }));
    expect(mockFinishFreeRound).toHaveBeenCalledWith('sess-1', 'task-1');
  });

  it('shows VoteResults when revealed', () => {
    const revealedSession = { ...baseSession, status: 'revealed' as const };
    const revealedTask = {
      ...baseTask,
      status: 'revealed' as const,
      votes: { 'user-1': { value: '5', votedAt: 0 } },
    };
    render(<VotingArea {...defaultProps} session={revealedSession} currentTask={revealedTask} />);
    // average label comes from mocked t('average') = 'average'
    expect(screen.getByText('average')).toBeInTheDocument();
  });

  it('shows consensus message when all votes match on first reveal', async () => {
    const revealedSession = { ...baseSession, status: 'revealed' as const };
    // task-1 seed = 116+97+115+107+45+49 = 529; 529 % 5 = 4; en[4] = 'Everyone agreed? Screenshot this, it may never happen again.'
    const consensusTask = {
      ...baseTask,
      id: 'task-1',
      status: 'revealed' as const,
      votes: {
        'user-1': { value: '5', votedAt: 0 },
        'user-2': { value: '5', votedAt: 0 },
      },
    };
    render(<VotingArea {...defaultProps} session={revealedSession} currentTask={consensusTask} />);
    await waitFor(() => {
      expect(
        screen.getByText('Everyone agreed? Screenshot this, it may never happen again.')
      ).toBeInTheDocument();
    });
  });

  it('does not show consensus message when votes differ', async () => {
    const revealedSession = { ...baseSession, status: 'revealed' as const };
    const noConsensusTask = {
      ...baseTask,
      status: 'revealed' as const,
      votes: {
        'user-1': { value: '5', votedAt: 0 },
        'user-2': { value: '8', votedAt: 0 },
      },
    };
    render(<VotingArea {...defaultProps} session={revealedSession} currentTask={noConsensusTask} />);
    // Wait a tick then verify none of the consensus messages appear
    await waitFor(() => {
      expect(
        screen.queryByText('Everyone agreed? Screenshot this, it may never happen again.')
      ).not.toBeInTheDocument();
    });
  });

  it('does not retrigger consensus when sessionStorage key is already set', async () => {
    sessionStorage.setItem('consensus-task-1', '1');
    const revealedSession = { ...baseSession, status: 'revealed' as const };
    const consensusTask = {
      ...baseTask,
      status: 'revealed' as const,
      votes: {
        'user-1': { value: '5', votedAt: 0 },
        'user-2': { value: '5', votedAt: 0 },
      },
    };
    render(<VotingArea {...defaultProps} session={revealedSession} currentTask={consensusTask} />);
    await waitFor(() => {
      expect(
        screen.queryByText('Everyone agreed? Screenshot this, it may never happen again.')
      ).not.toBeInTheDocument();
    });
  });
});
