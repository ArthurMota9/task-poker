interface LogoProps {
  size?: 'sm' | 'md';
}

export function Logo({ size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 24 : 30;
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
        {/* Card de trás */}
        <rect
          x="7"
          y="5"
          width="16"
          height="21"
          rx="3"
          className="fill-primary/25"
        />
        {/* Card da frente */}
        <rect
          x="4"
          y="3"
          width="16"
          height="21"
          rx="3"
          className="fill-primary"
        />
        {/* Valor do canto superior esquerdo */}
        <text
          x="7.5"
          y="11"
          fontSize="5"
          fontWeight="700"
          fontFamily="ui-monospace, monospace"
          className="fill-primary-foreground"
        >
          TP
        </text>
        {/* Símbolo central — losango */}
        <path
          d="M12 16 L14.5 12.5 L17 16 L14.5 19.5 Z"
          className="fill-primary-foreground/90"
        />
      </svg>

      <span className={`font-semibold tracking-tight ${textSize}`}>
        Task <span className="text-primary">Poker</span>
      </span>
    </div>
  );
}
