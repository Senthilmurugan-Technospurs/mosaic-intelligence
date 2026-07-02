import AppHeader from '@/components/layout/AppHeader';
import { Skeleton } from '@/components/ui/MosaicUI';

export default function CampaignDetailLoading() {
  return (
    <div className="mosaic-page">
      <AppHeader />
      <main className="mosaic-main space-y-6">
        <Skeleton rows={1} />
        <Skeleton rows={4} />
        <Skeleton rows={8} />
      </main>
    </div>
  );
}
