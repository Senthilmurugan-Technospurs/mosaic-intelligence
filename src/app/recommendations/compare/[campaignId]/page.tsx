'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppHeader from '@/components/layout/AppHeader';
import ComparePairPanel from '@/components/recommendations/ComparePairPanel';
import { useCampaignRecommendations } from '@/hooks/useCampaignRecommendations';
import { Alert, Breadcrumb, Card, Pill, Skeleton, StatCard } from '@/components/ui/MosaicUI';

export default function CampaignComparePage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { data, isLoading, error } = useCampaignRecommendations(campaignId);

  if (isLoading) {
    return (
      <div className="mosaic-page">
        <AppHeader />
        <main className="mosaic-main space-y-4">
          <Skeleton rows={2} />
          <Skeleton rows={8} />
        </main>
      </div>
    );
  }

  if (error || !data?.campaign) {
    return (
      <div className="mosaic-page">
        <AppHeader />
        <main className="mosaic-main">
          <Alert type="error">Campaign not found</Alert>
        </main>
      </div>
    );
  }

  const { campaign, comparePairs = [] } = data;
  const conflicts = comparePairs.filter((p) => p.matchType === 'conflict').length;
  const aligned = comparePairs.filter((p) => p.matchType === 'aligned').length;
  const mosaicCount = comparePairs.filter((p) => p.mosaic).length;
  const googleCount = comparePairs.filter((p) => p.google).length;
  const metaCount = comparePairs.filter((p) => p.meta).length;

  return (
    <div className="mosaic-page">
      <AppHeader />
      <main className="mosaic-main space-y-6">
        <Breadcrumb
          items={[
            { title: <Link href="/recommendations/all">Hub</Link> },
            { title: <Link href="/recommendations/compare">Compare</Link> },
            { title: campaign.campaignName },
          ]}
        />

        <Card className="mosaic-hero">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-[#102131]">{campaign.campaignName}</h1>
                <Pill color="blue">{campaign.platform}</Pill>
                {conflicts > 0 && <Pill color="red">{conflicts} conflict{conflicts !== 1 ? 's' : ''}</Pill>}
                {aligned > 0 && <Pill color="green">{aligned} aligned</Pill>}
              </div>
              <p className="mt-2 text-sm text-[#5f7387]">
                Modern side-by-side workspace for MOSAIC, Google Ads, and Meta recommendations.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard title="MOSAIC" value={mosaicCount} color="#8b5cf6" />
              <StatCard title="Google" value={googleCount} color="#ea4335" />
              <StatCard title="Meta" value={metaCount} color="#1877f2" />
              <StatCard title="Conflicts" value={conflicts} color="#ef4444" />
            </div>
          </div>
        </Card>

        <ComparePairPanel pairs={comparePairs} />

        <div className="text-center text-sm">
          <Link href={`/recommendations/${campaignId}`} className="text-[#0891b2] hover:underline">
            View full recommendation workflow →
          </Link>
        </div>
      </main>
    </div>
  );
}
