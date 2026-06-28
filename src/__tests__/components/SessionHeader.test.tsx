import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionHeader } from '@/components/session/SessionHeader';

jest.mock('@/components/Logo', () => ({ Logo: () => <div data-testid="logo" /> }));
jest.mock('@/components/LanguageSwitcher', () => ({ LanguageSwitcher: () => <div data-testid="lang-switcher" /> }));
jest.mock('@/components/ThemeToggle', () => ({ ThemeToggle: () => <div data-testid="theme-toggle" /> }));

Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: jest.fn().mockResolvedValue(undefined) },
  configurable: true,
});

const defaultProps = {
  sessionId: 'sess-1',
  isParticipant: true,
  pipSupported: true,
  pipOpen: false,
  onOpenPip: jest.fn(),
  onClosePip: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe('SessionHeader', () => {
  it('renders the logo', () => {
    render(<SessionHeader {...defaultProps} />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('renders the language switcher and theme toggle', () => {
    render(<SessionHeader {...defaultProps} />);
    expect(screen.getByTestId('lang-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('renders the copy link button', () => {
    render(<SessionHeader {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'copyLink' })).toBeInTheDocument();
  });

  it('shows copied feedback after clicking the copy link button', async () => {
    const user = userEvent.setup();
    render(<SessionHeader {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'copyLink' }));
    // setCopied(true) is synchronous — feedback shows immediately
    expect(screen.getByRole('button', { name: 'copied' })).toBeInTheDocument();
  });

  it('shows PiP open button when supported and participant', () => {
    render(<SessionHeader {...defaultProps} pipOpen={false} />);
    expect(screen.getByRole('button', { name: 'pipOpen' })).toBeInTheDocument();
  });

  it('shows PiP close button when PiP is open', () => {
    render(<SessionHeader {...defaultProps} pipOpen={true} />);
    expect(screen.getByRole('button', { name: 'pipClose' })).toBeInTheDocument();
  });

  it('hides PiP button when not supported', () => {
    render(<SessionHeader {...defaultProps} pipSupported={false} />);
    expect(screen.queryByRole('button', { name: 'pipOpen' })).not.toBeInTheDocument();
  });

  it('hides PiP button when not a participant', () => {
    render(<SessionHeader {...defaultProps} isParticipant={false} />);
    expect(screen.queryByRole('button', { name: 'pipOpen' })).not.toBeInTheDocument();
  });

  it('calls onOpenPip when clicking the PiP open button', async () => {
    const user = userEvent.setup();
    const onOpenPip = jest.fn();
    render(<SessionHeader {...defaultProps} pipOpen={false} onOpenPip={onOpenPip} />);
    await user.click(screen.getByRole('button', { name: 'pipOpen' }));
    expect(onOpenPip).toHaveBeenCalled();
  });

  it('calls onClosePip when clicking the PiP close button', async () => {
    const user = userEvent.setup();
    const onClosePip = jest.fn();
    render(<SessionHeader {...defaultProps} pipOpen={true} onClosePip={onClosePip} />);
    await user.click(screen.getByRole('button', { name: 'pipClose' }));
    expect(onClosePip).toHaveBeenCalled();
  });
});
