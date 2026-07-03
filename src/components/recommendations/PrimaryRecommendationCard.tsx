'use client';

import { useState } from 'react';
import { Btn, Card } from '@/components/ui/MosaicUI';
import { useToast } from '@/components/ui/Toast';
import { Recommendation } from '@/types/recommendation';
import CommentInput from './CommentInput';
import UndoCountdown from './UndoCountdown';
import ApplyConfirmModal from './ApplyConfirmModal';
import ValueChangeRow from './ValueChangeRow';
import { recMetaTags, MosaicScoreGrid } from '@/components/mosaic/MosaicSpurPieces';
import { spurTk } from '@/lib/spurMosaicTokens';

interface PrimaryRecommendationCardProps {
  recommendation: Recommendation;
  onApply: (id: string, comment: string) => Promise<void>;
  onDismiss: (id: string) => Promise<void>;
  onUndo: (id: string) => Promise<void>;
}

export default function PrimaryRecommendationCard({
  recommendation: rec,
  onApply,
  onDismiss,
  onUndo,
}: PrimaryRecommendationCardProps) {
  const toast = useToast();
  const [comment, setComment] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [dismissLoading, setDismissLoading] = useState(false);
  const [undoLoading, setUndoLoading] = useState(false);
  const [rationaleOpen, setRationaleOpen] = useState(false);

  const isPending = rec.status === 'pending';
  const isApplied = rec.status === 'applied';
  const isDismissed = rec.status === 'dismissed';
  const isRolledBack = rec.status === 'rolled_back';
  const isPlatformNative = rec.source === 'google_ads' || rec.source === 'meta';

  const borderCol = isApplied
    ? spurTk.green
    : isDismissed || isRolledBack
      ? spurTk.border
      : spurTk.accent;

  const handleConfirmApply = async () => {
    setApplyLoading(true);
    try {
      await onApply(rec.id, comment);
      toast('Recommendation applied successfully', 'success');
      setConfirmOpen(false);
      setComment('');
    } catch {
      toast('Failed to apply recommendation. Please try again.', 'error');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleDismiss = async () => {
    setDismissLoading(true);
    try {
      await onDismiss(rec.id);
      toast('Recommendation dismissed', 'info');
    } catch {
      toast('Failed to dismiss. Please try again.', 'error');
    } finally {
      setDismissLoading(false);
    }
  };

  const handleUndo = async () => {
    setUndoLoading(true);
    try {
      await onUndo(rec.id);
      toast('Recommendation rolled back', 'success');
    } catch {
      toast('Failed to undo. Please try again.', 'error');
    } finally {
      setUndoLoading(false);
    }
  };

  return (
    <>
      <Card
        style={{
          borderLeft: `4px solid ${borderCol}`,
          opacity: isDismissed || isRolledBack ? 0.8 : 1,
          boxShadow: spurTk.shadowMd,
          borderColor: spurTk.border,
        }}
      >
        {recMetaTags(rec)}
        <h4 className="mb-2 text-[15px] font-bold" style={{ color: spurTk.text }}>
          {rec.title}
        </h4>
        <p className="mb-3 text-[13px] leading-relaxed" style={{ color: spurTk.text, opacity: 0.9 }}>
          {rec.description}
        </p>

        <button
          type="button"
          onClick={() => setRationaleOpen((v) => !v)}
          className="mb-3 text-xs font-semibold hover:underline"
          style={{ color: spurTk.accent, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          {rationaleOpen ? 'Hide rationale' : 'View rationale'}
        </button>
        {rationaleOpen && (
          <p
            className="mb-3 rounded-lg p-3 text-xs leading-relaxed"
            style={{ color: spurTk.muted, background: spurTk.surface2 }}
          >
            {rec.rationale}
          </p>
        )}

        <ValueChangeRow
          currentValue={rec.currentValue}
          proposedValue={rec.proposedValue}
          estimatedImpact={rec.estimatedImpact}
        />
        <MosaicScoreGrid score={rec.score} />

        <div className="mt-4 border-t pt-4" style={{ borderColor: spurTk.border }}>
          {isPending && !isPlatformNative && (
            <div className="space-y-3">
              <CommentInput value={comment} onChange={setComment} />
              <div className="flex flex-wrap gap-2">
                <Btn variant="primary" onClick={() => setConfirmOpen(true)}>
                  Apply
                </Btn>
                <Btn variant="danger" loading={dismissLoading} onClick={handleDismiss}>
                  Dismiss
                </Btn>
              </div>
            </div>
          )}

          {isPending && isPlatformNative && rec.managerDeepLink && (
            <a href={rec.managerDeepLink} target="_blank" rel="noreferrer">
              <Btn variant="ghost">Open in {rec.source === 'google_ads' ? 'Google Ads' : 'Meta'} Manager</Btn>
            </a>
          )}

          {isApplied && rec.canUndo && rec.undoDeadline && (
            <UndoCountdown undoDeadline={rec.undoDeadline} onUndo={handleUndo} loading={undoLoading} />
          )}

          {isApplied && rec.appliedBy && (
            <p className="text-[11px]" style={{ color: spurTk.muted }}>
              Applied by <strong style={{ color: spurTk.text }}>{rec.appliedBy}</strong>
              {rec.comment && <> · {rec.comment}</>}
            </p>
          )}

          {isRolledBack && (
            <p className="text-[11px]" style={{ color: spurTk.muted }}>
              This recommendation was rolled back.
            </p>
          )}
        </div>
      </Card>

      <ApplyConfirmModal
        open={confirmOpen}
        recommendation={rec}
        comment={comment}
        loading={applyLoading}
        onConfirm={handleConfirmApply}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
