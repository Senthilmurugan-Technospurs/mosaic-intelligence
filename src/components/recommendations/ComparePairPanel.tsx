'use client';

import { Card, Empty, Pill, Segmented } from '@/components/ui/MosaicUI';
import { useMemo, useState } from 'react';
import { Recommendation, RecommendationSource } from '@/types/recommendation';
import {
  ALIGNMENT_COLOR,
  ALIGNMENT_LABEL,
  RecommendationComparePair,
} from '@/lib/recommendationCompare';
import SourceTag from './SourceTag';

type CompareView = 'all' | 'mosaic' | 'google_ads' | 'meta';

function MiniRecCard({ rec }: { rec: Recommendation }) {
  return (
    <div className="rounded-xl border border-[#e2ebf0] bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <SourceTag source={rec.source} />
        <p className="text-sm font-semibold leading-snug text-[#102131]">{rec.title}</p>
        <p className="text-xs leading-relaxed text-[#5f7387]">{rec.description}</p>
        {(rec.currentValue || rec.proposedValue) && (
          <div className="rounded-lg bg-gray-50 p-3 text-xs">
            <div><span className="text-[#5f7387]">Current:</span> {rec.currentValue || '—'}</div>
            <div className="mt-1"><strong>Proposed:</strong> {rec.proposedValue || '—'}</div>
          </div>
        )}
        {rec.estimatedImpact && (
          <p className="text-xs font-semibold text-emerald-600">{rec.estimatedImpact}</p>
        )}
        {rec.managerDeepLink && (
          <a href={rec.managerDeepLink} target="_blank" rel="noreferrer" className="inline-block text-xs text-[#0891b2] hover:underline">
            Open in Ads Manager →
          </a>
        )}
      </div>
    </div>
  );
}

function CompareColumn({ label, rec }: { label: string; rec?: Recommendation | null }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h4 className="text-xs font-bold uppercase tracking-wide text-[#5f7387]">{label}</h4>
      {rec ? (
        <MiniRecCard rec={rec} />
      ) : (
        <div className="flex min-h-[88px] items-center justify-center rounded-xl border border-dashed border-[#dbe7ee] bg-slate-50/80 px-4 py-6">
          <span className="text-xs text-[#9ca3af]">—</span>
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
            <h3 className="font-bold text-[#102131]">Recommendation Views</h3>
            <p className="text-xs text-[#5f7387]">
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
        <Card key={pair.id} className="overflow-hidden shadow-md">
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
            <span className="text-xs capitalize text-[#5f7387]">{pair.category.replace(/_/g, ' ')}</span>
          </div>

          <p className="mb-4 text-xs text-[#5f7387]">{pair.summary}</p>

          {view === 'all' && (
            <div className="rounded-xl border border-[#e2ebf0] bg-slate-50/60 p-4">
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
                <CompareColumn label="MOSAIC" rec={pair.mosaic} />
                <CompareColumn label="Google Ads" rec={pair.google} />
                <CompareColumn label="Meta" rec={pair.meta} />
              </div>
            </div>
          )}

          {view === 'mosaic' && pair.mosaic && <MiniRecCard rec={pair.mosaic} />}
          {view === 'google_ads' && pair.google && <MiniRecCard rec={pair.google} />}
          {view === 'meta' && pair.meta && <MiniRecCard rec={pair.meta} />}
        </Card>
      ))}
    </div>
  );
}
