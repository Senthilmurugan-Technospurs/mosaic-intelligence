'use client';

import { Btn, Input, Pill, Select } from '@/components/ui/MosaicUI';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ALIGNMENT_COLOR,
  ALIGNMENT_LABEL,
  CampaignCompareRow,
  CompareMatchType,
} from '@/lib/recommendationCompare';

interface CompareSummaryTableProps {
  data: CampaignCompareRow[];
  loading?: boolean;
}

export default function CompareSummaryTable({ data, loading }: CompareSummaryTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [alignmentFilter, setAlignmentFilter] = useState<CompareMatchType | 'all'>('all');
  const [page, setPage] = useState(0);
  const pageSize = 15;

  const filtered = data.filter((row) => {
    const matchName = row.campaignName.toLowerCase().includes(search.toLowerCase());
    const matchAlign = alignmentFilter === 'all' || row.alignment === alignmentFilter;
    return matchName && matchAlign;
  });

  const pageData = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div>
      <div className="mosaic-filter-bar">
        <Input
          placeholder="Search campaigns…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="w-full sm:w-72"
        />
        <Select
          value={alignmentFilter}
          onChange={(v) => { setAlignmentFilter(v as CompareMatchType | 'all'); setPage(0); }}
          options={[
            { label: 'All alignments', value: 'all' },
            { label: 'Aligned', value: 'aligned' },
            { label: 'Similar', value: 'similar' },
            { label: 'Conflict', value: 'conflict' },
            { label: 'MOSAIC only', value: 'mosaic_only' },
            { label: 'Platform only', value: 'platform_only' },
          ]}
          className="min-w-[180px]"
        />
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-[#5f7387]">Loading…</p>
      ) : (
        <>
          <div className="mosaic-table-wrap">
            <table className="mosaic-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>MOSAIC</th>
                  <th>Google Ads</th>
                  <th>Meta</th>
                  <th>Alignment</th>
                  <th>Summary</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((row) => (
                  <tr
                    key={row.campaignId}
                    className={`cursor-pointer ${row.alignment === 'conflict' ? 'bg-red-50' : ''}`}
                    onClick={() => router.push(`/recommendations/compare/${row.campaignId}`)}
                  >
                    <td>
                      <div className="font-semibold text-[#102131]">{row.campaignName}</div>
                      <Pill color="default" className="mt-1">{row.platform}</Pill>
                    </td>
                    <td className="text-center font-semibold text-purple-600">{row.mosaicCount}</td>
                    <td className="text-center font-semibold" style={{ color: row.googleCount ? '#ea4335' : '#9ca3af' }}>{row.googleCount}</td>
                    <td className="text-center font-semibold" style={{ color: row.metaCount ? '#1877f2' : '#9ca3af' }}>{row.metaCount}</td>
                    <td>
                      <Pill
                        className="border"
                        style={{
                          color: ALIGNMENT_COLOR[row.alignment],
                          borderColor: ALIGNMENT_COLOR[row.alignment],
                          background: `${ALIGNMENT_COLOR[row.alignment]}14`,
                        }}
                      >
                        {ALIGNMENT_LABEL[row.alignment]}
                      </Pill>
                    </td>
                    <td className="text-xs text-[#5f7387]">{row.topSummary}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Btn
                        size="sm"
                        variant="ghost"
                        onClick={() => router.push(`/recommendations/compare/${row.campaignId}`)}
                      >
                        ⇄ Compare
                      </Btn>
                    </td>
                  </tr>
                ))}
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
