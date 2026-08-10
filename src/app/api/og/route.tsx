import { ImageResponse } from 'next/og';
import { INITIAL_25_PRODUCTS } from '@/domain/seed-data';
import { evaluateSoftware } from '@/domain/decision-engine';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const customTitle = searchParams.get('title');

  let title = customTitle || 'SaaS Decision Engine';
  let subtitle = 'Deterministic 5-Way Evaluation (Keep, Switch, Self-Host, Automate, Build)';
  let scores = { keep: 85, switch: 42, selfHost: 20, automate: 60, build: 35 };

  if (slug) {
    const product = INITIAL_25_PRODUCTS.find((p) => p.slug === slug);
    if (product) {
      title = `${product.name} Decision Intelligence`;
      subtitle = `${product.categoryName} • Deterministic Evaluation & TCO Analysis`;
      const computed = evaluateSoftware(product.assessment as any);
      scores = {
        keep: computed.keepScore,
        switch: computed.switchScore,
        selfHost: computed.selfHostScore,
        automate: computed.automateScore,
        build: computed.buildScore,
      };
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                backgroundColor: '#2b00d9',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '6px 16px',
                borderRadius: '9999px',
                letterSpacing: '1px',
              }}
            >
              SAAS DECISION ENGINE v1.0
            </span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
            {title}
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8', margin: 0 }}>
            {subtitle}
          </p>
        </div>

        {/* Score Badges */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
          <ScoreBadge label="KEEP" score={scores.keep} color="#15803d" bg="#dcfce7" />
          <ScoreBadge label="SWITCH" score={scores.switch} color="#b45309" bg="#fef3c7" />
          <ScoreBadge label="SELF-HOST" score={scores.selfHost} color="#4338ca" bg="#e0e7ff" />
          <ScoreBadge label="AUTOMATE" score={scores.automate} color="#0369a1" bg="#e0f2fe" />
          <ScoreBadge label="BUILD" score={scores.build} color="#b91c1c" bg="#fee2e2" />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifySelf: 'flex-end', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '24px' }}>
          <span style={{ fontSize: '16px', color: '#64748b' }}>
            Deterministically calculated from 19 verified technical & financial parameters
          </span>
          <span style={{ fontSize: '16px', color: '#38bdf8', fontWeight: 'bold' }}>
            saasdecision.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

function ScoreBadge({ label, score, color, bg }: { label: string; score: number; color: string; bg: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        padding: '16px 24px',
        borderRadius: '20px',
        minWidth: '160px',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 'bold', color }}>{label}</span>
      <span style={{ fontSize: '36px', fontWeight: '900', color }}>{score}</span>
    </div>
  );
}
