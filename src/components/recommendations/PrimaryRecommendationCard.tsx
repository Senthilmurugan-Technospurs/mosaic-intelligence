'use client';

import { useState } from 'react';
import { Btn, Card, Divider, Pill } from '@/components/ui/MosaicUI';
import { useToast } from '@/components/ui/Toast';
import { Recommendation } from '@/types/recommendation';
import { DATA_WINDOW_LABEL } from '@/types/generationRun';
import RecommendationScoreBadges from './RecommendationScoreBadges';
import CommentInput from './CommentInput';
import UndoCountdown from './UndoCountdown';
import ApplyConfirmModal from './ApplyConfirmModal';
import SourceTag from './SourceTag';
import { MosaicUspBadge } from '@/components/branding/MosaicUsp';

const typeLabel: Record<string, string> = {
  budget_orchestration: 'Budget Orchestration',
  bid_policy: 'Bid Policy',
  audience_strategy: 'Audience Strategy',
  placement: 'Placement',
  geo_daypart: 'Geo & Daypart',
};

const typeColor: Record<string, string> = {
  budget_orchestration: 'purple',
  bid_policy: 'blue',
  audience_strategy: 'cyan',
  placement: 'magenta',
  geo_daypart: 'geekblue',
};

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

  const borderColor = isApplied ? '#10b981' : isDismissed || isRolledBack ? '#d1d5db' : '#4f46e5';

  return (
    <>
      <Card
        className="shadow-md"
        style={{
          borderLeft: `4px solid ${borderColor}`,
          opacity: isDismissed || isRolledBack ? 0.75 : 1,
        }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-[#102131]">{rec.title}</h3>
            <MosaicUspBadge />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <SourceTag source={rec.source} />
            <Pill color="gold">★ Primary</Pill>
            <Pill color="default">Campaign Level</Pill>
            <Pill color={typeColor[rec.type]}>{typeLabel[rec.type]}</Pill>
            <Pill color="cyan">{DATA_WINDOW_LABEL[rec.dataWindow]}</Pill>
            {isApplied && <Pill color="green">✓ Applied</Pill>}
            {isDismissed && <Pill color="default">Dismissed</Pill>}
            {isRolledBack && <Pill color="red">Rolled Back</Pill>}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-[#374151]">{rec.description}</p>

          <button
            type="button"
            onClick={() => setRationaleOpen((v) => !v)}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            {rationaleOpen ? 'Hide Rationale' : 'View Rationale'}
          </button>
          {rationaleOpen && (
            <p className="text-sm leading-relaxed text-[#5f7387]">{rec.rationale}</p>
          )}

          <Divider className="my-2" />

          {(rec.currentValue || rec.proposedValue) && (
            <div className="flex flex-wrap items-center gap-4 rounded-xl bg-gray-50 p-4">
              <div>
                <div className="text-[11px] text-[#5f7387]">CURRENT</div>
                <div className="text-sm font-semibold text-[#6b7280]">{rec.currentValue ?? '—'}</div>
              </div>
              <span className="text-lg text-indigo-600">→</span>
              <div>
                <div className="text-[11px] text-[#5f7387]">PROPOSED</div>
                <div className="text-sm font-semibold">{rec.proposedValue ?? '—'}</div>
              </div>
              {rec.estimatedImpact && (
                <>
                  <div className="hidden h-8 w-px bg-slate-200 sm:block" />
                  <div>
                    <div className="text-[11px] text-[#5f7387]">ESTIMATED IMPACT</div>
                    <div className="text-sm font-semibold text-emerald-600">{rec.estimatedImpact}</div>
                  </div>
                </>
              )}
            </div>
          )}

          <RecommendationScoreBadges score={rec.score} />

          <Divider className="my-2" />

          {isPending && !isPlatformNative && (
            <div className="space-y-3">
              <CommentInput value={comment} onChange={setComment} />
              <div className="flex flex-wrap gap-2">
                <Btn variant="primary" onClick={() => setConfirmOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20">
                  Apply Recommendation
                </Btn>
                <Btn variant="danger" loading={dismissLoading} onClick={handleDismiss}>Dismiss</Btn>
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
            <p className="text-xs text-[#5f7387]">
              Applied by <strong>{rec.appliedBy}</strong>
              {rec.comment && <> · Note: {rec.comment}</>}
            </p>
          )}

          {isRolledBack && (
            <p className="text-xs text-[#5f7387]">This recommendation was rolled back.</p>
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
