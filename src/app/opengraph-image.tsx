import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Task Poker — Planning Poker online para times ágeis';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Card decorations */}
        <div style={{ position: 'absolute', top: 40, left: 60, display: 'flex', gap: 12, opacity: 0.2 }}>
          {['1', '2', '3', '5', '8'].map((v) => (
            <div key={v} style={{
              width: 48, height: 64, borderRadius: 8,
              background: 'white', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700, color: '#1e1b4b',
            }}>{v}</div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 60, display: 'flex', gap: 12, opacity: 0.2 }}>
          {['13', '21', '34', '?', '∞'].map((v) => (
            <div key={v} style={{
              width: 48, height: 64, borderRadius: 8,
              background: 'white', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700, color: '#1e1b4b',
            }}>{v}</div>
          ))}
        </div>

        {/* Logo icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <div style={{
            width: 72, height: 90, borderRadius: 12,
            background: '#6366f1', position: 'relative', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 20, height: 20,
              background: 'white',
              transform: 'rotate(45deg)',
              opacity: 0.9,
            }} />
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 72, fontWeight: 800, color: 'white', lineHeight: 1 }}>Task</span>
              <span style={{ fontSize: 72, fontWeight: 800, color: '#818cf8', lineHeight: 1 }}>Poker</span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 28,
          color: '#c7d2fe',
          textAlign: 'center',
          margin: 0,
          maxWidth: 700,
          lineHeight: 1.4,
        }}>
          Planning Poker online para times ágeis
        </p>

        {/* Features row */}
        <div style={{ display: 'flex', gap: 24, marginTop: 48 }}>
          {['Gratuito', 'Sem cadastro', 'Tempo real', 'Multi-idioma'].map((f) => (
            <div key={f} style={{
              background: 'rgba(99, 102, 241, 0.3)',
              border: '1px solid rgba(129, 140, 248, 0.4)',
              borderRadius: 100,
              padding: '8px 20px',
              fontSize: 18,
              color: '#e0e7ff',
              fontWeight: 500,
            }}>{f}</div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
