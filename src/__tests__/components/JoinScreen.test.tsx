import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JoinScreen } from '@/components/session/JoinScreen';

jest.mock('@/lib/session', () => ({
  joinSession: jest.fn().mockResolvedValue(undefined),
}));

import { joinSession } from '@/lib/session';
const mockJoinSession = joinSession as jest.Mock;

beforeEach(() => mockJoinSession.mockClear());

describe('JoinScreen', () => {
  it('shows the session name', () => {
    render(<JoinScreen sessionId="sess-1" sessionName="Sprint Review" />);
    expect(screen.getByText('Sprint Review')).toBeInTheDocument();
  });

  it('has a name input field', () => {
    render(<JoinScreen sessionId="sess-1" sessionName="Session" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('has the submit button disabled when name is empty', () => {
    render(<JoinScreen sessionId="sess-1" sessionName="Session" />);
    expect(screen.getByRole('button', { name: 'joinSubmit' })).toBeDisabled();
  });

  it('enables the submit button when name is entered', async () => {
    const user = userEvent.setup();
    render(<JoinScreen sessionId="sess-1" sessionName="Session" />);
    await user.type(screen.getByRole('textbox'), 'Arthur');
    expect(screen.getByRole('button', { name: 'joinSubmit' })).not.toBeDisabled();
  });

  it('calls joinSession with trimmed name on submit', async () => {
    const user = userEvent.setup();
    render(<JoinScreen sessionId="sess-abc" sessionName="Session" />);
    await user.type(screen.getByRole('textbox'), '  Arthur  ');
    await user.click(screen.getByRole('button', { name: 'joinSubmit' }));
    expect(mockJoinSession).toHaveBeenCalledWith('sess-abc', 'Arthur');
  });

  it('does not submit when name is only spaces', async () => {
    const user = userEvent.setup();
    render(<JoinScreen sessionId="sess-1" sessionName="Session" />);
    await user.type(screen.getByRole('textbox'), '   ');
    // Button stays disabled for whitespace-only input
    expect(screen.getByRole('button', { name: 'joinSubmit' })).toBeDisabled();
    expect(mockJoinSession).not.toHaveBeenCalled();
  });
});
