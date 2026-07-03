'use client';

import Link from 'next/link';
import { Card, Empty, Pill, Segmented } from '@/components/ui/MosaicUI';
import { useMemo, useState } from 'react';
import { Recommendation, RecommendationSource } from '@/types/recommendation';
import {
  ALIGNMENT_COLOR,
  ALIGNMENT_LABEL,
  RecommendationComparePair,
} from '@/lib/recommendationCompare';
import {
  getRecommendationApplyHref,
  isExternalRecommendationHref,
} from '@/lib/recommendationApplyUrl';
import { spurTk } from '@/lib/spurMosaicTokens';
import { PlatformSourceLabel } from '@/components/mosaic/MosaicSpurPieces';
import ValueChangeRow from './ValueChangeRow';

type CompareView = 'all' | 'mosaic' | 'google_ads' | 'meta';

const CATEGORY_LABEL: Record<string, string> = {
  budget_orchestration: 'Budget Orchestration',
  bid_policy: 'Bid Policy',
  audience_strategy: 'Audience Strategy',
  placement: 'Placement',
  geo_daypart: 'Geo & Daypart',
};

function ClickableRecTile({ rec }: { rec: Recommendation }) {
  const href = getRecommendationApplyHref(rec);
  const external = isExternalRecommendationHref(href);
  const isPlatform = rec.source === 'google_ads' || rec.source === 'meta';

  const body = (
    <>
      <p className="text-[13px] font-bold leading-snug" style={{ color: spurTk.text }}>
        {rec.title}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed" style={{ color: spurTk.muted }}>
        {rec.description}
      </p>
      <ValueChangeRow
        currentValue={rec.currentValue}
        proposedValue={rec.proposedValue}
        estimatedImpact={rec.estimatedImpact}
      />
      <p className="text-[11px] font-semibold" style={{ color: spurTk.accent }}>
        {isPlatform ? 'Open in platform to apply →' : 'Review & apply →'}
      </p>
    </>
  );

  const className =
    'group block w-full rounded-[10px] border bg-white p-3.5 text-left no-underline transition-all ' +
    'hover:border-[#3b82f6]/50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b82f6]';

  const style = {
    borderColor: spurTk.border,
    boxShadow: spurTk.shadowSm,
  } as const;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} style={style}>
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style}>
      {body}
    </Link>
  );
}

function CompareColumn({
  source,
  rec,
}: {
  source: RecommendationSource;
  rec?: Recommendation | null;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <PlatformSourceLabel source={source} iconSize={22} />
      {rec ? (
        <ClickableRecTile rec={rec} />
      ) : (
        <div
          className="flex min-h-[88px] items-center justify-center rounded-[10px] border border-dashed px-4 py-6"
          style={{ borderColor: spurTk.border, background: `${spurTk.surface2}cc` }}
        >
          <span className="text-xs" style={{ color: spurTk.muted }}>
            —
          </span>
        </div>
      )}
    </div>
  );
}

interface ComparePairPanelProps {
  pairs: RecommendationComparePair[];
}

function pairHasSource(pair: RecommendationComparePair, source: RecommendationSource | 'mosaic') {
  if (source === 'mosaic') return !!pair.mosaic;
  if (source === 'google_ads') return !!pair.google;
  return !!pair.meta;
}

export default function ComparePairPanel({ pairs }: ComparePairPanelProps) {
  const [view, setView] = useState<CompareView>('all');

  const filteredPairs = useMemo(() => {
    if (view === 'all') return pairs;
    return pairs.filter((pair) => pairHasSource(pair, view));
  }, [pairs, view]);

  if (!pairs.length) {
    return <Empty description="No recommendations to compare for this campaign." />;
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-white to-slate-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold" style={{ color: spurTk.text }}>
              Recommendation Views
            </h3>
            <p className="text-xs" style={{ color: spurTk.muted }}>
              Switch between the unified comparison, MOSAIC suggestions, and native platform recommendations.
            </p>
          </div>
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { label: `All (${pairs.length})`, value: 'all' },
              { label: `MOSAIC (${pairs.filter((p) => p.mosaic).length})`, value: 'mosaic' },
              { label: `Google (${pairs.filter((p) => p.google).length})`, value: 'google_ads' },
              { label: `Meta (${pairs.filter((p) => p.meta).length})`, value: 'meta' },
            ]}
          />
        </div>
      </Card>

      {filteredPairs.map((pair) => (
        <Card
          key={pair.id}
          className="overflow-hidden"
          style={{ boxShadow: spurTk.shadowMd, borderColor: spurTk.border }}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Pill
              className="border"
              style={{
                color: ALIGNMENT_COLOR[pair.matchType],
                borderColor: ALIGNMENT_COLOR[pair.matchType],
                background: `${ALIGNMENT_COLOR[pair.matchType]}14`,
              }}
            >
              {ALIGNMENT_LABEL[pair.matchType]}
            </Pill>
            <span className="text-xs font-semibold" style={{ color: spurTk.text }}>
              {CATEGORY_LABEL[pair.category] ?? pair.category.replace(/_/g, ' ')}
            </span>
          </div>

          <p className="mb-4 text-xs" style={{ color: spurTk.muted }}>
            {pair.summary}
          </p>

          {view === 'all' && (
            <div
              className="rounded-[12px] border p-4"
              style={{ borderColor: spurTk.border, background: `${spurTk.surface2}99` }}
            >
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
                <CompareColumn source="mosaic" rec={pair.mosaic} />
                <CompareColumn source="google_ads" rec={pair.google} />
                <CompareColumn source="meta" rec={pair.meta} />
              </div>
            </div>
          )}

          {view === 'mosaic' && pair.mosaic && (
            <div className="space-y-2">
              <PlatformSourceLabel source="mosaic" iconSize={22} />
              <ClickableRecTile rec={pair.mosaic} />
            </div>
          )}
          {view === 'google_ads' && pair.google && (
            <div className="space-y-2">
              <PlatformSourceLabel source="google_ads" iconSize={22} />
              <ClickableRecTile rec={pair.google} />
            </div>
          )}
          {view === 'meta' && pair.meta && (
            <div className="space-y-2">
              <PlatformSourceLabel source="meta" iconSize={22} />
              <ClickableRecTile rec={pair.meta} />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
