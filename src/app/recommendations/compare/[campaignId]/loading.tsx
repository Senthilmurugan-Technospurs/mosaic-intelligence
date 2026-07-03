import { Skeleton } from '@/components/ui/MosaicUI';

export default function CampaignCompareLoading() {
  return (
    <div className="mosaic-page">
      <div className="sticky top-0 z-50 border-b border-[#dbe7ee] bg-white/95 px-6 py-3 shadow-sm">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <main className="mosaic-main space-y-4">
        <Skeleton rows={2} />
        <Skeleton rows={8} />
      </main>
    </div>
  );
}
