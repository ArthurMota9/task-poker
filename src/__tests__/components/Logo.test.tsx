import { render, screen } from '@testing-library/react';
import { Logo } from '@/components/Logo';

describe('Logo', () => {
  it('renders the Task Poker text', () => {
    render(<Logo />);
    expect(screen.getByText('Task')).toBeInTheDocument();
    expect(screen.getByText('Poker')).toBeInTheDocument();
  });

  it('renders an SVG icon', () => {
    const { container } = render(<Logo />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders a smaller SVG when size is sm', () => {
    const { container: smContainer } = render(<Logo size="sm" />);
    const { container: mdContainer } = render(<Logo size="md" />);

    const smSvg = smContainer.querySelector('svg')!;
    const mdSvg = mdContainer.querySelector('svg')!;

    expect(Number(smSvg.getAttribute('width'))).toBeLessThan(
      Number(mdSvg.getAttribute('width'))
    );
  });
});
