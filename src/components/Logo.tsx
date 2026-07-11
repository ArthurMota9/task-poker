interface LogoProps {
  size?: 'sm' | 'md';
}

export function Logo({ size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 26 : 32;
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ficha dourada atrás da carta */}
        <rect x="7" y="5" width="16" height="21" rx="3.5" className="fill-primary/40" />
        {/* Carta da frente — card stock fixo, igual às cartas de votação */}
        <rect
          x="4"
          y="3"
          width="16"
          height="21"
          rx="3.5"
          className="fill-card-stock stroke-primary"
          strokeWidth="1"
        />
        {/* Índice de canto */}
        <text
          x="6.4"
          y="9.6"
          fontSize="4.6"
          fontWeight="700"
          fontFamily="var(--font-mono)"
          className="fill-card-stock-foreground"
        >
          T
        </text>
        {/* Naipe central */}
        <path
          d="M12 9.8c1.9 1.6 3.4 2.9 3.4 4.6a2 2 0 0 1-3.4 1.4 2 2 0 0 1-3.4-1.4c0-1.7 1.5-3 3.4-4.6Z"
          className="fill-suit-red"
        />
        <path d="M11 15.6h2v3.6h-2z" className="fill-suit-red" />
      </svg>

      <span className={`font-heading font-semibold tracking-tight ${textSize}`}>
        Task <span className="text-primary">Poker</span>
      </span>
    </div>
  );
}
