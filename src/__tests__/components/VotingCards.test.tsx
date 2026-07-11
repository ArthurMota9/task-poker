import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VotingCards } from '@/components/session/VotingCards';

const onVote = jest.fn();

beforeEach(() => onVote.mockClear());

describe('VotingCards', () => {
  it('renders all cards for fibonacci sequence', () => {
    render(<VotingCards sequence="fibonacci" selectedValue={null} onVote={onVote} />);
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '13' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '?' })).toBeInTheDocument();
  });

  it('renders all cards for tshirt sequence', () => {
    render(<VotingCards sequence="tshirt" selectedValue={null} onVote={onVote} />);
    expect(screen.getByRole('button', { name: 'XS' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'XL' })).toBeInTheDocument();
  });

  it('calls onVote with the clicked value', async () => {
    const user = userEvent.setup();
    render(<VotingCards sequence="fibonacci" selectedValue={null} onVote={onVote} />);
    await user.click(screen.getByRole('button', { name: '8' }));
    expect(onVote).toHaveBeenCalledWith('8');
  });

  it('applies selected styles to the chosen card', () => {
    render(<VotingCards sequence="fibonacci" selectedValue="5" onVote={onVote} />);
    const selectedButton = screen.getByRole('button', { name: '5' });
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
    expect(selectedButton).toHaveClass('border-primary');
  });

  it('does not call onVote when disabled', async () => {
    const user = userEvent.setup();
    render(<VotingCards sequence="fibonacci" selectedValue={null} onVote={onVote} disabled />);
    const button = screen.getByRole('button', { name: '5' });
    await user.click(button);
    expect(onVote).not.toHaveBeenCalled();
  });
});
