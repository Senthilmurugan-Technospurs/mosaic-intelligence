'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Recommendation } from '@/types/recommendation';
import ApplyConfirmModal from './ApplyConfirmModal';
import { useToast } from '@/components/ui/Toast';

export default function ApplyFromQueryLauncher({
  recommendations,
  onApply,
}: {
  recommendations: Recommendation[];
  onApply: (id: string, comment: string) => Promise<void>;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [target, setTarget] = useState<Recommendation | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const applyId = searchParams.get('apply');
    if (!applyId || recommendations.length === 0) return;

    const rec = recommendations.find((r) => r.id === applyId);
    if (!rec || rec.source === 'google_ads' || rec.source === 'meta') return;

    setTarget(rec);
    router.replace(`/recommendations/${rec.campaignId}`, { scroll: false });
  }, [searchParams, recommendations, router]);

  if (!target) return null;

  return (
    <ApplyConfirmModal
      open
      recommendation={target}
      comment={comment}
      loading={loading}
      onCancel={() => setTarget(null)}
      onConfirm={async () => {
        setLoading(true);
        try {
          await onApply(target.id, comment);
          toast('Applied', 'success');
          setTarget(null);
          setComment('');
        } catch {
          toast('Failed to apply', 'error');
        } finally {
          setLoading(false);
        }
      }}
    />
  );
}
