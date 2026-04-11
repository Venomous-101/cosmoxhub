import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'CosmoxHub — 28+ Free Online Tools for Everyone'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0F172A, #020617)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <div style={{
            background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
          }}>
            C
          </div>
          <h1 style={{ color: 'white', fontSize: '72px', fontWeight: 900, letterSpacing: '-2px', margin: 0 }}>
            CosmoxHub
          </h1>
        </div>
        <p style={{ color: '#94A3B8', fontSize: '32px', textAlign: 'center', maxWidth: '800px', lineHeight: 1.4 }}>
          28+ Free Online Tools in one place. AI Image Upscaler, Background Remover, PDF Utilities, and more.
        </p>
        <div style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          gap: '20px',
        }}>
          {['100% Free', 'No Signup required', 'Blazing Fast'].map((tag) => (
            <span key={tag} style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#60A5FA',
              padding: '12px 24px',
              borderRadius: '99px',
              fontSize: '24px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
