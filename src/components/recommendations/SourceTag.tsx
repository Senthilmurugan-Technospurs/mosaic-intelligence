'use client';

import { Pill } from '@/components/ui/MosaicUI';
import { RecommendationSource } from '@/types/recommendation';

const SOURCE_LABEL: Record<RecommendationSource, string> = {
  mosaic: 'MOSAIC',
  google_ads: 'Google Ads',
  meta: 'Meta',
};

const SOURCE_COLOR: Record<RecommendationSource, string> = {
  mosaic: 'purple',
  google_ads: 'red',
  meta: 'blue',
};

export default function SourceTag({ source }: { source?: RecommendationSource }) {
  const s = source || 'mosaic';
  return (
    <Pill color={SOURCE_COLOR[s]} className="text-[10px] tracking-wide">
      {SOURCE_LABEL[s]}
    </Pill>
  );
}
