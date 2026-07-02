'use client';

import { useState } from 'react';
import { Btn, Card, Checkbox, Pill, Tooltip } from '@/components/ui/MosaicUI';
import { useToast } from '@/components/ui/Toast';
import { Recommendation } from '@/types/recommendation';
import { DATA_WINDOW_LABEL } from '@/types/generationRun';
import RecommendationScoreBadges from './RecommendationScoreBadges';
import CommentInput from './CommentInput';
import UndoCountdown from './UndoCountdown';
import ApplyConfirmModal from './ApplyConfirmModal';
import SourceTag from './SourceTag';

const levelLabel: Record<string, string> = {
  ad_set: 'Ad Set',
  segment: 'Segment',
  campaign: 'Campaign',
};

const typeLabel: Record<string, string> = {
  budget_orchestration: 'Budget',
  bid_policy: 'Bid',
  audience_strategy: 'Audience',
  placement: 'Placement',
  geo_daypart: 'Geo/Daypart',
};

const typeColor: Record<string, string> = {
  budget_orchestration: 'purple',
  bid_policy: 'blue',
  audience_strategy: 'cyan',
  placement: 'magenta',
  geo_daypart: 'geekblue',
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onApply: (id: string, comment: string) => Promise<void>;
  onDismiss: (id: string) => Promise<void>;
  onUndo: (id: string) => Promise<void>;
  indent?: boolean;
  indentLevel?: 0 | 1 | 2;
  selectable?: boolean;
}

export default function RecommendationCard({
  recommendation: rec,
  selected,
  onSelect,
  onApply,
  onDismiss,
  onUndo,
  indent = false,
  indentLevel,
  selectable,
}: RecommendationCardProps) {
  const toast = useToast();
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [dismissLoading, setDismissLoading] = useState(false);
  const [undoLoading, setUndoLoading] = useState(false);

  const isPending = rec.status === 'pending';
  const isApplied = rec.status === 'applied';
  const isDismissed = rec.status === 'dismissed';
  const isRolledBack = rec.status === 'rolled_back';
  const isPlatformNative = rec.source === 'google_ads' || rec.source === 'meta';
  const canSelect =
    selectable !== undefined
      ? selectable && isPending
      : isPending && !isPlatformNative;

  const handleConfirmApply = async () => {
    setApplyLoading(true);
    try {
      await onApply(rec.id, comment);
      toast('Applied', 'success');
      setConfirmOpen(false);
      setComment('');
      setShowComment(false);
    } catch {
      toast('Failed to apply', 'error');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleDismiss = async () => {
    setDismissLoading(true);
    try {
      await onDismiss(rec.id);
      toast('Dismissed', 'info');
    } catch {
      toast('Failed to dismiss', 'error');
    } finally {
      setDismissLoading(false);
    }
  };

  const handleUndo = async () => {
    setUndoLoading(true);
    try {
      await onUndo(rec.id);
      toast('Rolled back', 'success');
    } catch {
      toast('Failed to undo', 'error');
    } finally {
      setUndoLoading(false);
    }
  };

  const borderColor = isApplied ? '#10b981' : isDismissed || isRolledBack ? '#e5e7eb' : '#e0e7ff';
  const nestIndent = indentLevel !== undefined ? indentLevel * 20 : indent ? 16 : 0;

  return (
    <>
      <Card
        className="shadow-sm"
        padding
        style={{
          marginLeft: nestIndent,
          borderLeft: `3px solid ${borderColor}`,
          opacity: isDismissed || isRolledBack ? 0.6 : 1,
          backgroundColor: nestIndent > 0 ? '#fafafa' : '#fff',
        } as React.CSSProperties}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            {canSelect ? (
              <Checkbox checked={selected} onChange={(checked) => onSelect(rec.id, checked)} />
            ) : (
              <div className="w-4" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <SourceTag source={rec.source} />
              <Pill color="default">
                {levelLabel[rec.level]}
                {rec.segmentDimension ? ` · ${rec.segmentDimension}` : ''}
              </Pill>
              <Pill color={typeColor[rec.type]}>{typeLabel[rec.type]}</Pill>
              <Pill color="cyan">{DATA_WINDOW_LABEL[rec.dataWindow]}</Pill>
              {isApplied && <Pill color="green">✓ Applied</Pill>}
              {isDismissed && <Pill color="default">Dismissed</Pill>}
              {isRolledBack && <Pill color="red">Rolled Back</Pill>}
            </div>

            <p
              className="text-sm font-semibold"
              style={{
                textDecoration: isDismissed || isRolledBack ? 'line-through' : 'none',
                color: isDismissed || isRolledBack ? '#9ca3af' : '#111827',
              }}
            >
              {rec.title}
            </p>

            <p className="text-xs leading-relaxed text-[#5f7387]">{rec.description}</p>

            {(rec.currentValue || rec.proposedValue) && (
              <div className="flex flex-wrap gap-3 rounded bg-gray-50 p-2 text-xs">
                <span><span className="text-[#5f7387]">Current: </span><strong className="text-[#6b7280]">{rec.currentValue}</strong></span>
                <span className="text-indigo-600">→</span>
                <span><span className="text-[#5f7387]">Proposed: </span><strong>{rec.proposedValue}</strong></span>
                {rec.estimatedImpact && (
                  <span><span className="text-[#5f7387]">Impact: </span><strong className="text-emerald-600">{rec.estimatedImpact}</strong></span>
                )}
              </div>
            )}

            <RecommendationScoreBadges score={rec.score} compact />

            {isPending && showComment && <CommentInput value={comment} onChange={setComment} />}

            {isPending && !isPlatformNative && (
              <div className="flex flex-wrap items-center gap-2">
                <Btn size="sm" variant="primary" onClick={() => setConfirmOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20">
                  Apply
                </Btn>
                <Btn size="sm" variant="link" onClick={() => setShowComment((v) => !v)}>
                  {showComment ? 'Hide note' : '+ Add note'}
                </Btn>
                <Tooltip title="Dismiss">
                  <Btn size="sm" variant="danger" loading={dismissLoading} onClick={handleDismiss}>✕</Btn>
                </Tooltip>
              </div>
            )}

            {isPending && isPlatformNative && rec.managerDeepLink && (
              <a href={rec.managerDeepLink} target="_blank" rel="noreferrer" className="text-xs text-[#0891b2] hover:underline">
                Open in {rec.source === 'google_ads' ? 'Google Ads' : 'Meta'} →
              </a>
            )}

            {isApplied && rec.canUndo && rec.undoDeadline && (
              <UndoCountdown undoDeadline={rec.undoDeadline} onUndo={handleUndo} loading={undoLoading} />
            )}

            {isApplied && rec.appliedBy && (
              <p className="text-[11px] text-[#5f7387]">
                Applied by {rec.appliedBy}{rec.comment ? ` · ${rec.comment}` : ''}
              </p>
            )}
          </div>
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
