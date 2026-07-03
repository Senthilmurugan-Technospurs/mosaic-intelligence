'use client';

import { RecScore, Recommendation, RecType } from '@/types/recommendation';
import { DATA_WINDOW_LABEL } from '@/types/generationRun';
import { spurAlpha, spurTk } from '@/lib/spurMosaicTokens';
import PlatformSourceIcon from '@/components/branding/PlatformSourceIcon';
import { platformSourceLabel } from '@/lib/recommendationSources';
import { MOSAIC_PRODUCT_NAME } from '@/lib/mosaicBranding';
import { RecommendationSource } from '@/types/recommendation';
import { Tooltip } from '@/components/ui/MosaicUI';
import { AVG_LIFT_STATS_TOOLTIP } from '@/lib/recommendationLift';

const TYPE_COL: Record<RecType, string> = {
  budget_orchestration: spurTk.violet,
  bid_policy: spurTk.accent,
  audience_strategy: spurTk.cyan,
  placement: spurTk.pink,
  geo_daypart: spurTk.accent2,
};

const TYPE_LABEL: Record<RecType, string> = {
  budget_orchestration: 'Budget Orchestration',
  bid_policy: 'Bid Policy',
  audience_strategy: 'Audience Strategy',
  placement: 'Placement',
  geo_daypart: 'Geo & Daypart',
};

const RISK_COL: Record<string, string> = {
  low: spurTk.green,
  medium: spurTk.orange,
  high: spurTk.red,
};

const REV_COL: Record<string, string> = {
  easy: spurTk.green,
  moderate: spurTk.orange,
  hard: spurTk.red,
};

export function MosaicTag({ color = spurTk.muted, children }: { color?: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: 999,
        background: spurAlpha(color, 12),
        color,
        border: `1px solid ${spurAlpha(color, 28)}`,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
      }}
    >
      {children}
    </span>
  );
}

export function PlatformSourceLabel({
  source = 'mosaic',
  iconSize = 20,
}: {
  source?: RecommendationSource;
  iconSize?: number;
}) {
  const label = source === 'mosaic' ? MOSAIC_PRODUCT_NAME : platformSourceLabel(source);
  return (
    <div className="flex items-center gap-2">
      <PlatformSourceIcon source={source} size={iconSize} />
      <span
        className="text-xs font-bold uppercase tracking-wide"
        style={{ color: spurTk.text }}
      >
        {label}
      </span>
    </div>
  );
}

export function recMetaTags(rec: Recommendation) {
  return (
    <div className="mb-2 flex flex-wrap gap-1.5">
      {rec.isPrimary && <MosaicTag color={spurTk.yellow}>Primary</MosaicTag>}
      <MosaicTag color={TYPE_COL[rec.type]}>{TYPE_LABEL[rec.type]}</MosaicTag>
      <MosaicTag color={spurTk.muted}>{DATA_WINDOW_LABEL[rec.dataWindow]}</MosaicTag>
      {rec.status === 'applied' && <MosaicTag color={spurTk.green}>Applied</MosaicTag>}
      {rec.status === 'dismissed' && <MosaicTag color={spurTk.muted}>Dismissed</MosaicTag>}
      {rec.status === 'rolled_back' && <MosaicTag color={spurTk.red}>Rolled back</MosaicTag>}
    </div>
  );
}

export function MosaicScoreGrid({ score }: { score: RecScore }) {
  const tiles = [
    { lbl: 'Expected lift', val: `+${score.expectedLift}%`, col: spurTk.accent },
    { lbl: 'Confidence', val: `${score.confidence}%`, col: spurTk.cyan },
    { lbl: 'Risk', val: score.risk, col: RISK_COL[score.risk] },
    { lbl: 'Reversibility', val: score.reversibility, col: REV_COL[score.reversibility] },
  ];

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}
    >
      {tiles.map((s) => (
        <div
          key={s.lbl}
          style={{
            padding: '10px 12px',
            borderRadius: spurTk.radius,
            background: spurTk.surface2,
            border: `1px solid ${spurTk.border}`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: s.col, fontFamily: spurTk.mono, lineHeight: 1.1 }}>
            {s.val}
          </div>
          <div
            style={{
              fontSize: 10,
              color: spurTk.muted,
              marginTop: 4,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              fontWeight: 600,
            }}
          >
            {s.lbl}
          </div>
        </div>
      ))}
    </div>
  );
}

export interface RecommendationTileStats {
  totalRecommendations: number;
  appliedRecommendations: number;
  dismissedRecommendations: number;
  ignoredRecommendations: number;
  pendingRecommendations: number;
  potentialLiftAvg: number;
}

const STAT_TILES: Array<{
  key: keyof RecommendationTileStats;
  label: string;
  icon: string;
  color: string;
  suffix?: string;
  tip?: string;
}> = [
  { key: 'totalRecommendations', label: 'Total', icon: '📊', color: spurTk.accent },
  { key: 'appliedRecommendations', label: 'Applied', icon: '✓', color: spurTk.green },
  { key: 'dismissedRecommendations', label: 'Dismissed', icon: '✕', color: spurTk.muted },
  { key: 'ignoredRecommendations', label: 'Ignored', icon: '⏳', color: spurTk.orange },
  { key: 'pendingRecommendations', label: 'Pending', icon: '◎', color: spurTk.yellow },
  {
    key: 'potentialLiftAvg',
    label: 'Avg lift',
    icon: '↗',
    color: spurTk.cyan,
    suffix: '%',
    tip: AVG_LIFT_STATS_TOOLTIP,
  },
];

export function MosaicScoreCompact({ score }: { score: RecScore }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <MosaicTag color={spurTk.accent}>+{score.expectedLift}% lift</MosaicTag>
      <MosaicTag color={spurTk.cyan}>{score.confidence}% conf</MosaicTag>
      <MosaicTag color={RISK_COL[score.risk]}>{score.risk} risk</MosaicTag>
      <MosaicTag color={REV_COL[score.reversibility]}>{score.reversibility} undo</MosaicTag>
    </div>
  );
}

export function MosaicCampaignStatsBar({ stats }: { stats: RecommendationTileStats }) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}
    >
      {STAT_TILES.map((t) => (
        <div
          key={t.key}
          style={{
            padding: '14px 16px',
            borderRadius: spurTk.radiusLg,
            background: spurTk.surface,
            border: `1px solid ${spurTk.border}`,
            boxShadow: spurTk.shadowSm,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: spurAlpha(t.color, 12),
              fontSize: 14,
            }}
          >
            {t.icon}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: t.color,
              fontFamily: spurTk.mono,
              lineHeight: 1.1,
            }}
          >
            {stats[t.key]}
            {t.suffix ?? ''}
          </div>
          <div style={{ fontSize: 11, color: spurTk.muted, marginTop: 4, fontWeight: 600 }}>
            {t.tip ? (
              <Tooltip title={t.tip}>
                <span className="inline-flex cursor-help items-center gap-0.5">
                  {t.label}
                  <span style={{ opacity: 0.65 }}>ⓘ</span>
                </span>
              </Tooltip>
            ) : (
              t.label
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
