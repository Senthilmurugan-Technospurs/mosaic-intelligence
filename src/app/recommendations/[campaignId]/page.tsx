'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import AppHeader from '@/components/layout/AppHeader';
import PrimaryRecommendationCard from '@/components/recommendations/PrimaryRecommendationCard';
import BulkActionBar from '@/components/recommendations/BulkActionBar';
import RecommendationHierarchy from '@/components/recommendations/RecommendationHierarchy';
import { useCampaignRecommendations } from '@/hooks/useCampaignRecommendations';
import { useApplyRecommendation } from '@/hooks/useApplyRecommendation';
import { useDismissRecommendation } from '@/hooks/useDismissRecommendation';
import { useUndoRecommendation } from '@/hooks/useUndoRecommendation';
import { useBulkApply } from '@/hooks/useBulkApply';
import { useCampaignHistory } from '@/hooks/useCampaignHistory';
import { useToast } from '@/components/ui/Toast';
import { CampaignStatus } from '@/types/campaign';
import { RecommendationSource } from '@/types/recommendation';
import { campaignHasMultiSource } from '@/lib/campaignSourceCounts';
import {
  buildRecommendationTree,
  countTreeItems,
  type CategoryKey,
} from '@/lib/recommendationTree';
import { getMosaicRecs, getPlatformRecs } from '@/lib/recommendationSources';
import PlatformSpecificPanel from '@/components/recommendations/PlatformSpecificPanel';
import ApplyFromQueryLauncher from '@/components/recommendations/ApplyFromQueryLauncher';
import { MosaicUspStrip } from '@/components/branding/MosaicUsp';
import { MOSAIC_PRODUCT_NAME } from '@/lib/mosaicBranding';
import { spurTk } from '@/lib/spurMosaicTokens';
import {
  Alert,
  Breadcrumb,
  Card,
  Divider,
  Empty,
  Pill,
  Segmented,
  Skeleton,
  StatCard,
  Tabs,
} from '@/components/ui/MosaicUI';

const HistoryPanel = dynamic(
  () => import('@/components/recommendations/HistoryPanel'),
  { loading: () => <Skeleton rows={4} /> },
);

const ComparePairPanel = dynamic(
  () => import('@/components/recommendations/ComparePairPanel'),
  { loading: () => <Skeleton rows={3} /> },
);

const statusColor: Record<CampaignStatus, string> = {
  active: 'green',
  paused: 'orange',
  ended: 'red',
  draft: 'default',
};

type SourceTab = 'all' | RecommendationSource;

const categoryLabel: Record<CategoryKey, string> = {
  all: 'All Recommendations',
  budget_orchestration: 'Budget Orchestration',
  bid_policy: 'Bid Policy',
  audience_strategy: 'Audience Strategy',
  placement: 'Placement',
  geo_daypart: 'Geo & Daypart',
  dismissed: 'Dismissed',
};

const categoryOrder: CategoryKey[] = [
  'all',
  'budget_orchestration',
  'bid_policy',
  'audience_strategy',
  'placement',
  'geo_daypart',
  'dismissed',
];

export default function CampaignDetailPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const toast = useToast();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [sourceTab, setSourceTab] = useState<SourceTab>('all');
  const [mainTab, setMainTab] = useState('recommendations');

  const { data, isPending, error } = useCampaignRecommendations(campaignId);
  const { data: history = [] } = useCampaignHistory(campaignId);

  const applyMutation = useApplyRecommendation(campaignId);
  const dismissMutation = useDismissRecommendation(campaignId);
  const undoMutation = useUndoRecommendation(campaignId);
  const bulkApplyMutation = useBulkApply(campaignId);

  const handleApply = async (id: string, comment: string) => {
    await applyMutation.mutateAsync({ id, comment });
  };

  const handleDismiss = async (id: string) => {
    await dismissMutation.mutateAsync({ id });
  };

  const handleUndo = async (id: string) => {
    await undoMutation.mutateAsync({ id });
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const recs = useMemo(() => data?.recommendations ?? [], [data]);
  const campaign = data?.campaign;
  const comparePairs = useMemo(() => data?.comparePairs ?? [], [data]);

  const handleBulkApply = async (comment: string) => {
    const actionableSelected = Array.from(selectedIds).filter((id) =>
      recs.find((r) => r.id === id && r.status === 'pending'),
    );
    if (actionableSelected.length === 0) {
      toast('No pending recommendations selected.', 'info');
      return;
    }
    await bulkApplyMutation.mutateAsync({ ids: actionableSelected, comment });
    toast(`${actionableSelected.length} recommendations applied`, 'success');
    setSelectedIds(new Set());
  };

  const primaryRec = useMemo(
    () => recs.find((r) => r.isPrimary && r.level === 'campaign') ?? null,
    [recs],
  );

  const sourceCounts = useMemo(() => ({
    all: recs.length,
    mosaic: recs.filter((r) => !r.source || r.source === 'mosaic').length,
    google_ads: recs.filter((r) => r.source === 'google_ads').length,
    meta: recs.filter((r) => r.source === 'meta').length,
  }), [recs]);

  const multiSource = campaignHasMultiSource({
    mosaic: sourceCounts.mosaic,
    google: sourceCounts.google_ads,
    meta: sourceCounts.meta,
  });

  const mosaicWorkflowRecs = useMemo(() => {
    const mosaic = getMosaicRecs(recs);
    if (sourceTab === 'mosaic' || sourceTab === 'all') return mosaic;
    return [];
  }, [recs, sourceTab]);

  const platformRecs = useMemo(
    () => getPlatformRecs(recs, sourceTab),
    [recs, sourceTab],
  );

  const otherSourceHint = useMemo(() => {
    if (sourceTab === 'mosaic' && platformRecs.length > 0) {
      return `${platformRecs.length} native suggestion${platformRecs.length !== 1 ? 's' : ''} from Google/Meta below — separate from MOSAIC AI recommendations.`;
    }
    if (sourceTab === 'all' && platformRecs.length > 0) {
      return `MOSAIC recommendations are shown above. ${platformRecs.length} additional native platform suggestion${platformRecs.length !== 1 ? 's' : ''} are listed in the platform-specific section below.`;
    }
    if (sourceTab === 'google_ads' && sourceCounts.mosaic > 0) {
      return `Switch to the MOSAIC tab for ${sourceCounts.mosaic} AI-generated recommendation${sourceCounts.mosaic !== 1 ? 's' : ''}.`;
    }
    if (sourceTab === 'meta' && sourceCounts.mosaic > 0) {
      return `Switch to the MOSAIC tab for ${sourceCounts.mosaic} AI-generated recommendation${sourceCounts.mosaic !== 1 ? 's' : ''}.`;
    }
    return null;
  }, [sourceTab, platformRecs.length, sourceCounts.mosaic]);

  const primaryForSource = useMemo(() => {
    if (!primaryRec || !(!primaryRec.source || primaryRec.source === 'mosaic')) return null;
    if (sourceTab === 'all' || sourceTab === 'mosaic') return primaryRec;
    return null;
  }, [primaryRec, sourceTab]);

  const mosaicNonPrimary = useMemo(
    () => mosaicWorkflowRecs.filter((r) => !(r.isPrimary && r.level === 'campaign')),
    [mosaicWorkflowRecs],
  );

  const recommendationTree = useMemo(
    () => buildRecommendationTree(mosaicWorkflowRecs, selectedCategory),
    [mosaicWorkflowRecs, selectedCategory],
  );

  const visibleSupportingCount = countTreeItems(recommendationTree);

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryKey, number> = {
      all: mosaicNonPrimary.length,
      budget_orchestration: 0,
      bid_policy: 0,
      audience_strategy: 0,
      placement: 0,
      geo_daypart: 0,
      dismissed: 0,
    };
    for (const rec of mosaicNonPrimary) {
      counts[rec.type] += 1;
      if (rec.status === 'dismissed') counts.dismissed += 1;
    }
    return counts;
  }, [mosaicNonPrimary]);

  const hasMosaicWorkflow = mosaicWorkflowRecs.length > 0;
  const showPlatformPanel = platformRecs.length > 0;
  const platformPanelCollapsed = sourceTab === 'mosaic' || sourceTab === 'all';

  const hasVisibleSupporting = visibleSupportingCount > 0;

  if (isPending && !data) {
    return (
      <div className="mosaic-page">
        <AppHeader />
        <main className="mosaic-main space-y-4">
          <Skeleton rows={2} />
          <Skeleton rows={6} />
          <Skeleton rows={4} />
        </main>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="mosaic-page">
        <AppHeader />
        <main className="mosaic-main">
          <Alert type="error">
            Campaign not found. Could not load campaign data.{' '}
            <Link href="/recommendations/all" className="underline">← Back to dashboard</Link>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="mosaic-page" style={{ paddingBottom: selectedIds.size > 0 ? 100 : 0 }}>
      <AppHeader />
      <main className="mosaic-main space-y-6">
        <Breadcrumb
          items={[
            { title: <Link href="/recommendations/all">Recommendations</Link> },
            { title: campaign.campaignName },
          ]}
        />

        <Card
          className="mosaic-hero"
          style={{
            border: `1px solid ${spurTk.border}`,
            background: `linear-gradient(135deg, ${spurTk.surface} 0%, color-mix(in srgb, ${spurTk.accent} 6%, ${spurTk.surface}) 100%)`,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-[#102131]">{campaign.campaignName}</h1>
                <Pill color={statusColor[campaign.status]}>{campaign.status.toUpperCase()}</Pill>
                <Pill color="blue">{campaign.platform}</Pill>
              </div>
              <p className="mt-1 text-sm text-[#5f7387]">
                {campaign.objective} · {campaign.flightStart} → {campaign.flightEnd}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Pill color="purple">{MOSAIC_PRODUCT_NAME} {sourceCounts.mosaic}</Pill>
                <Pill color="red">Google {sourceCounts.google_ads}</Pill>
                <Pill color="blue">Meta {sourceCounts.meta}</Pill>
                {multiSource && (
                  <Link href={`/recommendations/compare/${campaignId}`}>
                    <Pill color="cyan" className="cursor-pointer">Compare sources →</Pill>
                  </Link>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard title="Total Budget" value={`$${campaign.totalBudget}`} color="#102131" />
              <StatCard title="Daily Budget" value={`$${campaign.dailyBudget}`} color="#102131" />
              <StatCard title="Bid Strategy" value={campaign.bidStrategy} color="#5f7387" />
            </div>
          </div>
        </Card>

        <MosaicUspStrip compact />

        <Tabs
          activeKey={mainTab}
          onChange={setMainTab}
          items={[
            {
              key: 'recommendations',
              label: `By source (${recs.length})`,
              children: (
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-white to-slate-50">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#102131]">Recommendation source</p>
                        <p className="text-xs text-[#5f7387]">
                          <strong className="text-violet-700">{MOSAIC_PRODUCT_NAME}</strong> delivers hierarchical, cross-platform AI actions.
                          Google Ads and Meta list their own native suggestions separately below.
                        </p>
                      </div>
                      <Segmented
                        value={sourceTab}
                        onChange={(value) => {
                          setSourceTab(value as SourceTab);
                          setSelectedIds(new Set());
                          setSelectedCategory('all');
                        }}
                        options={[
                          { label: `All (${sourceCounts.all})`, value: 'all' },
                          { label: `MOSAIC (${sourceCounts.mosaic})`, value: 'mosaic' },
                          { label: `Google (${sourceCounts.google_ads})`, value: 'google_ads' },
                          { label: `Meta (${sourceCounts.meta})`, value: 'meta' },
                        ]}
                      />
                    </div>
                    {otherSourceHint && (
                      <div className="mt-3">
                        <Alert type="info">{otherSourceHint}</Alert>
                      </div>
                    )}
                  </Card>

                  {hasMosaicWorkflow && primaryForSource ? (
                    <div>
                      <p
                        className="mb-2 text-[11px] font-bold tracking-widest"
                        style={{ color: spurTk.muted }}
                      >
                        PRIMARY ACTION
                      </p>
                      <PrimaryRecommendationCard
                          recommendation={primaryForSource}
                          onApply={handleApply}
                          onDismiss={handleDismiss}
                          onUndo={handleUndo}
                        />
                    </div>
                  ) : hasMosaicWorkflow ? null : sourceTab === 'google_ads' || sourceTab === 'meta' ? (
                    <p className="text-sm text-[#5f7387]">
                      Native {sourceTab === 'google_ads' ? 'Google Ads' : 'Meta'} suggestions are listed in the platform-specific section below.
                      {' '}MOSAIC AI recommendations are on the <strong className="text-[#102131]">MOSAIC</strong> tab.
                    </p>
                  ) : (
                    <Empty description="No MOSAIC recommendations for this campaign yet." />
                  )}

                  {hasMosaicWorkflow && (
                    <>
                      <Divider className="my-1" />

                      {hasVisibleSupporting || recommendationTree.hasHierarchy ? (
                        <div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold tracking-widest text-[#5f7387]">
                                {recommendationTree.hasHierarchy
                                  ? `SUPPORTING ACTIONS (${visibleSupportingCount})`
                                  : `MOSAIC RECOMMENDATIONS (${visibleSupportingCount})`}
                              </p>
                              {recommendationTree.hasHierarchy && (
                                <p className="mt-1 text-xs text-[#5f7387]">
                                  Grouped under the primary action by ad set and segment. Use the module filter below to narrow.
                                </p>
                              )}
                            </div>
                            <p className="text-xs font-semibold tracking-widest text-[#5f7387]">FILTER BY MODULE</p>
                            <Segmented
                              value={selectedCategory}
                              onChange={(value) => {
                                setSelectedCategory(value as CategoryKey);
                                setSelectedIds(new Set());
                              }}
                              options={categoryOrder.map((key) => ({
                                label: `${categoryLabel[key]} (${categoryCounts[key]})`,
                                value: key,
                              }))}
                              block
                            />
                          </div>
                          <div className="mt-4">
                            {hasVisibleSupporting ? (
                              <RecommendationHierarchy
                                tree={recommendationTree}
                                selectedIds={selectedIds}
                                onSelect={handleSelect}
                                onApply={handleApply}
                                onDismiss={handleDismiss}
                                onUndo={handleUndo}
                              />
                            ) : (
                              <Empty description={`No MOSAIC recommendations in ${categoryLabel[selectedCategory]}.`} />
                            )}
                          </div>
                        </div>
                      ) : (
                        !primaryForSource && <Empty description="No additional MOSAIC recommendations." />
                      )}
                    </>
                  )}

                  {showPlatformPanel && (
                    <PlatformSpecificPanel
                      recommendations={platformRecs}
                      defaultCollapsed={platformPanelCollapsed}
                    />
                  )}

                  {!hasMosaicWorkflow && !showPlatformPanel && (
                    <Empty description="No recommendations in this source tab." />
                  )}
                </div>
              ),
            },
            {
              key: 'compare',
              label: `Cross-platform (${comparePairs.length})`,
              children: (
                <div className="space-y-4">
                  <Card>
                    <p className="font-semibold text-[#102131]">What each engine recommends</p>
                    <p className="mt-1 text-sm text-[#5f7387]">
                      Side-by-side view of MOSAIC vs Google Ads vs Meta for aligned, conflicting, or unique suggestions.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Pill color="purple">MOSAIC {sourceCounts.mosaic}</Pill>
                      <Pill color="red">Google {sourceCounts.google_ads}</Pill>
                      <Pill color="blue">Meta {sourceCounts.meta}</Pill>
                    </div>
                  </Card>
                  {comparePairs.length > 0 ? (
                    <ComparePairPanel pairs={comparePairs} />
                  ) : (
                    <Empty description="Only one source has recommendations for this campaign — nothing to compare yet." />
                  )}
                  {multiSource && (
                    <div className="text-center text-sm">
                      <Link href={`/recommendations/compare/${campaignId}`} className="text-[#0891b2] hover:underline">
                        Open full compare workspace →
                      </Link>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'history',
              label: `History (${history.length})`,
              children: (
                <Card>
                  <HistoryPanel entries={history} />
                </Card>
              ),
            },
          ]}
        />
      </main>

      <BulkActionBar
        selectedCount={selectedIds.size}
        onBulkApply={handleBulkApply}
        onClearSelection={() => setSelectedIds(new Set())}
      />

      <ApplyFromQueryLauncher
        recommendations={data?.recommendations ?? []}
        onApply={handleApply}
      />
    </div>
  );
}
