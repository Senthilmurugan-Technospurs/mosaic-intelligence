'use client';

import { Pill, Tooltip } from '@/components/ui/MosaicUI';
import { RecScore } from '@/types/recommendation';

const riskConfig = {
  low: { color: 'green', label: 'Low Risk' },
  medium: { color: 'orange', label: 'Medium Risk' },
  high: { color: 'red', label: 'High Risk' },
};

const reversibilityConfig = {
  easy: { icon: '↩', label: 'Easy to Undo', color: '#10b981' },
  moderate: { icon: '⚠', label: 'Moderate to Undo', color: '#f59e0b' },
  hard: { icon: '🔒', label: 'Hard to Undo', color: '#ef4444' },
};

function CircleProgress({ percent, color }: { percent: number; color: string }) {
  const r = 24;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width="56" height="56" className="-rotate-90">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text x="28" y="32" textAnchor="middle" className="rotate-90 origin-center text-[11px] font-bold" fill={color}>
        +{percent}%
      </text>
    </svg>
  );
}

interface RecommendationScoreBadgesProps {
  score: RecScore;
  compact?: boolean;
}

export default function RecommendationScoreBadges({
  score,
  compact = false,
}: RecommendationScoreBadgesProps) {
  const risk = riskConfig[score.risk];
  const rev = reversibilityConfig[score.reversibility];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        <Tooltip title={`Expected Lift: +${score.expectedLift}%`}>
          <Pill color="blue">+{score.expectedLift}% lift</Pill>
        </Tooltip>
        <Tooltip title={`Confidence: ${score.confidence}%`}>
          <Pill color="geekblue">{score.confidence}% conf</Pill>
        </Tooltip>
        <Tooltip title={risk.label}>
          <Pill color={risk.color}>{risk.label}</Pill>
        </Tooltip>
        <Tooltip title={rev.label}>
          <Pill className="border" style={{ color: rev.color, borderColor: rev.color } as React.CSSProperties}>
            {rev.icon} {score.reversibility}
          </Pill>
        </Tooltip>
      </div>
    );
  }

  const confColor = score.confidence >= 80 ? '#10b981' : score.confidence >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="flex flex-col items-center gap-1">
        <CircleProgress percent={score.expectedLift} color="#3b82f6" />
        <span className="text-center text-[11px] text-[#6b7280]">Expected Lift</span>
      </div>

      <div className="flex flex-col justify-center gap-2">
        <div className="flex justify-between text-xs">
          <span className="text-[#374151]">Confidence</span>
          <span className="font-semibold text-[#374151]">{score.confidence}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full" style={{ width: `${score.confidence}%`, backgroundColor: confColor }} />
        </div>
        <span className="text-[11px] text-[#6b7280]">
          {score.confidence >= 80 ? 'High confidence' : score.confidence >= 60 ? 'Moderate confidence' : 'Low confidence'}
        </span>
      </div>

      <div className="flex flex-col justify-center gap-2">
        <span className="text-xs text-[#6b7280]">Risk Level</span>
        <Pill color={risk.color}>{risk.label}</Pill>
      </div>

      <div className="flex flex-col justify-center gap-2">
        <span className="text-xs text-[#6b7280]">Reversibility</span>
        <Pill className="border" style={{ color: rev.color, borderColor: rev.color, backgroundColor: `${rev.color}15` } as React.CSSProperties}>
          {rev.icon} {score.reversibility.charAt(0).toUpperCase() + score.reversibility.slice(1)}
        </Pill>
      </div>
    </div>
  );
}
