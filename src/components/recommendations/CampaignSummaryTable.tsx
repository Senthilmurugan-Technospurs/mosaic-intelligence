'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useCallback } from 'react';
import { CampaignRecommendationSummary, CampaignStatus } from '@/types/campaign';
import { FREQUENCY_LABEL } from '@/types/generationRun';
import { CampaignSourceCounts, campaignHasMultiSource } from '@/lib/campaignSourceCounts';
import { Btn, Input, Pill, Select, Tooltip } from '@/components/ui/MosaicUI';
import { MOSAIC_PRODUCT_NAME } from '@/lib/mosaicBranding';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
  
const statusPill: Record<CampaignStatus, string> = {
  active: 'green', paused: 'orange', ended: 'red', draft: 'default',
};

const platformPill: Record<string, string> = {
  Meta: 'blue', Google: 'red', DV360: 'purple',
};

interface CampaignSummaryTableProps {
  data: CampaignRecommendationSummary[];
  loading: boolean;
  sourceByCampaign: Map<string, CampaignSourceCounts>;
}

function SourceCount({ value, color }: { value: number; color: string }) {
  return (
    <span className="font-semibold" style={{ color: value > 0 ? color : '#9ca3af' }}>
      {value}
    </span>
  );
}

function Th({ children, tip }: { children: React.ReactNode; tip?: string }) {
  return (
    <th>
      <Tooltip title={tip ?? ''}>
        <span className="inline-flex items-center gap-1">{children}{tip ? ' ⓘ' : ''}</span>
      </Tooltip>
    </th>
  );
}

export default function CampaignSummaryTable({ data, loading, sourceByCampaign }: CampaignSummaryTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [sortField, setSortField] = useState<'pending' | 'lift'>('pending');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const prefetchCampaign = useCallback(
    (campaignId: string) => {
      router.prefetch(`/recommendations/${campaignId}`);
      router.prefetch(`/recommendations/compare/${campaignId}`);
    },
    [router],
  );

  const filtered = useMemo(
    () =>
      data
        .filter((c) => {
          const matchName = c.campaignName.toLowerCase().includes(search.toLowerCase());
          const matchStatus = statusFilter === 'all' || c.status === statusFilter;
          return matchName && matchStatus;
        })
        .sort((a, b) =>
          sortField === 'pending'
            ? b.pendingRecommendations - a.pendingRecommendations
            : b.potentialLiftAvg - a.potentialLiftAvg,
        ),
    [data, search, statusFilter, sortField],
  );

  const pageData = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div>
      <div className="mosaic-filter-bar">
        <Input
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="w-full sm:w-72"
        />
        <Select
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v as CampaignStatus | 'all'); setPage(0); }}
          options={[
            { label: 'All statuses', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Paused', value: 'paused' },
            { label: 'Ended', value: 'ended' },
            { label: 'Draft', value: 'draft' },
          ]}
          className="min-w-[150px]"
        />
        <Select
          value={sortField}
          onChange={(v) => setSortField(v as 'pending' | 'lift')}
          options={[
            { label: 'Sort: pending count', value: 'pending' },
            { label: 'Sort: avg lift', value: 'lift' },
          ]}
          className="min-w-[180px]"
        />
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-[#5f7387]">Loading campaigns…</p>
      ) : (
        <>
          <div className="mosaic-table-wrap">
            <table className="mosaic-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <Th tip={`${MOSAIC_PRODUCT_NAME} AI — hierarchical orchestration across modules`}>MOSAIC</Th>
                  <Th tip="Google Ads native suggestions">Google</Th>
                  <Th tip="Meta Ads native suggestions">Meta</Th>
                  <Th tip="Pending recommendations">Pending</Th>
                  <th>Avg lift</th>
                  <th>Schedule</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((record) => {
                  const src = sourceByCampaign.get(record.campaignId);
                  const showCompare = campaignHasMultiSource(src);
                  return (
                    <tr
                      key={record.campaignId}
                      className="cursor-pointer"
                      onMouseEnter={() => prefetchCampaign(record.campaignId)}
                      onClick={() => router.push(`/recommendations/${record.campaignId}`)}
                    >
                      <td>
                        <div className="font-bold text-[#102131]">{record.campaignName}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          {record.hasNewRecommendations && (
                            <span className="rounded-full bg-[#22c7ee] px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span>
                          )}
                          <Pill color={statusPill[record.status]}>{record.status.toUpperCase()}</Pill>
                          <Pill color={platformPill[record.platform] ?? 'default'}>{record.platform}</Pill>
                        </div>
                      </td>
                      <td className="text-center">
                        <SourceCount value={src?.mosaic ?? 0} color="#8b5cf6" />
                      </td>
                      <td className="text-center">
                        <SourceCount value={src?.google ?? 0} color="#ea4335" />
                      </td>
                      <td className="text-center">
                        <SourceCount value={src?.meta ?? 0} color="#1877f2" />
                      </td>
                      <td className="text-center font-semibold" style={{ color: record.pendingRecommendations > 0 ? '#f59e0b' : '#6b7280' }}>
                        {record.pendingRecommendations}
                      </td>
                      <td className="font-semibold text-[#22c7ee]">
                        {record.potentialLiftAvg > 0 ? `+${record.potentialLiftAvg}%` : '—'}
                      </td>
                      <td className="text-xs text-[#5f7387]">
                        <Pill color="cyan">{FREQUENCY_LABEL[record.generationFrequency]}</Pill>
                        <div className="mt-1">{dayjs(record.lastGeneratedAt).fromNow()}</div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1.5">
                          <Btn variant="ghost" size="sm" onClick={() => router.push(`/recommendations/${record.campaignId}`)}>
                            Open →
                          </Btn>
                          {showCompare && (
                            <Btn size="sm" variant="outline" onClick={() => router.push(`/recommendations/compare/${record.campaignId}`)}>
                              Compare
                            </Btn>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex justify-end gap-2">
              <Btn size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>←</Btn>
              <span className="flex items-center text-sm text-[#5f7387]">Page {page + 1} / {totalPages}</span>
              <Btn size="sm" variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>→</Btn>
            </div>
          )}
        </>
      )}
    </div>
  );
}
