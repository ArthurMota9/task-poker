import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Card de trás */}
          <rect x="7" y="5" width="16" height="21" rx="3" fill="#4f46e5" fillOpacity="0.35" />
          {/* Card da frente */}
          <rect x="4" y="3" width="16" height="21" rx="3" fill="#4f46e5" />
          {/* TP */}
          <text
            x="7.5"
            y="11"
            fontSize="5"
            fontWeight="700"
            fontFamily="monospace"
            fill="white"
          >
            TP
          </text>
          {/* Losango */}
          <path d="M12 16 L14.5 12.5 L17 16 L14.5 19.5 Z" fill="white" fillOpacity="0.9" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
