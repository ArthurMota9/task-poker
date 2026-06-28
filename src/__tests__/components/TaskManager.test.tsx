import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskManager } from '@/components/session/TaskManager';
import { Task } from '@/types';

const makeTask = (id: string, title: string, status: Task['status'] = 'pending'): Task => ({
  id,
  title,
  status,
  average: null,
  votes: {},
  createdAt: Number(id),
});

const onAddTask = jest.fn();
const onStartVoting = jest.fn();

beforeEach(() => {
  onAddTask.mockClear();
  onStartVoting.mockClear();
});

describe('TaskManager', () => {
  it('renders the add task form for host', () => {
    render(
      <TaskManager tasks={{}} currentTaskId={null} isHost onAddTask={onAddTask} onStartVoting={onStartVoting} />
    );
    expect(screen.getByRole('button', { name: 'add' })).toBeInTheDocument();
  });

  it('hides the add task form for non-host', () => {
    render(
      <TaskManager tasks={{}} currentTaskId={null} isHost={false} onAddTask={onAddTask} onStartVoting={onStartVoting} />
    );
    expect(screen.queryByRole('button', { name: 'add' })).not.toBeInTheDocument();
  });

  it('calls onAddTask when Add button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskManager tasks={{}} currentTaskId={null} isHost onAddTask={onAddTask} onStartVoting={onStartVoting} />
    );
    const input = screen.getByRole('textbox');
    await user.type(input, 'New story');
    await user.click(screen.getByRole('button', { name: 'add' }));
    expect(onAddTask).toHaveBeenCalledWith('New story');
  });

  it('calls onAddTask on Enter key press', async () => {
    const user = userEvent.setup();
    render(
      <TaskManager tasks={{}} currentTaskId={null} isHost onAddTask={onAddTask} onStartVoting={onStartVoting} />
    );
    const input = screen.getByRole('textbox');
    await user.type(input, 'Story via enter{Enter}');
    expect(onAddTask).toHaveBeenCalledWith('Story via enter');
  });

  it('renders pending tasks', () => {
    const tasks = { '1': makeTask('1', 'Fix bug') };
    render(
      <TaskManager tasks={tasks} currentTaskId={null} isHost onAddTask={onAddTask} onStartVoting={onStartVoting} />
    );
    expect(screen.getByText('Fix bug')).toBeInTheDocument();
  });

  it('shows vote button for host on pending tasks not being voted', async () => {
    const user = userEvent.setup();
    const tasks = { '1': makeTask('1', 'Fix bug') };
    render(
      <TaskManager tasks={tasks} currentTaskId={null} isHost onAddTask={onAddTask} onStartVoting={onStartVoting} />
    );
    await user.click(screen.getByRole('button', { name: 'vote' }));
    expect(onStartVoting).toHaveBeenCalledWith('1');
  });

  it('shows voting badge instead of vote button for the active task', () => {
    // Task remains 'pending' in the list but is the selected currentTaskId
    const tasks = { '1': makeTask('1', 'Active task', 'pending') };
    render(
      <TaskManager tasks={tasks} currentTaskId="1" isHost onAddTask={onAddTask} onStartVoting={onStartVoting} />
    );
    expect(screen.getByText('voting')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'vote' })).not.toBeInTheDocument();
  });

  it('shows empty message for host when no pending tasks', () => {
    render(
      <TaskManager tasks={{}} currentTaskId={null} isHost onAddTask={onAddTask} onStartVoting={onStartVoting} />
    );
    expect(screen.getByText('emptyHost')).toBeInTheDocument();
  });
});
