import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleTouchIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          background: 'linear-gradient(135deg, #3b82f6 0%, #2b00d9 50%, #1e0096 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '40px',
          fontWeight: 800,
          fontFamily: 'sans-serif',
          boxShadow: 'inset 0 0 0 4px rgba(255,255,255,0.25)',
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  );
}
