'use client';

import { useState } from 'react';
import { Btn, Card, Checkbox, Tooltip } from '@/components/ui/MosaicUI';
import { useToast } from '@/components/ui/Toast';
import { Recommendation } from '@/types/recommendation';
import CommentInput from './CommentInput';
import UndoCountdown from './UndoCountdown';
import ApplyConfirmModal from './ApplyConfirmModal';
import ValueChangeRow from './ValueChangeRow';
import { MosaicTag, MosaicScoreCompact } from '@/components/mosaic/MosaicSpurPieces';
import { spurTk } from '@/lib/spurMosaicTokens';
import { DATA_WINDOW_LABEL } from '@/types/generationRun';

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

  const borderColor = isApplied ? spurTk.green : isDismissed || isRolledBack ? spurTk.border : spurTk.accent;
  const nestIndent = indentLevel !== undefined ? indentLevel * 20 : indent ? 16 : 0;

  return (
    <>
      <Card
        padding
        style={{
          marginLeft: nestIndent,
          borderLeft: `3px solid ${borderColor}`,
          opacity: isDismissed || isRolledBack ? 0.65 : 1,
          background: nestIndent > 0 ? spurTk.surface2 : spurTk.surface,
          borderColor: spurTk.border,
          boxShadow: spurTk.shadowSm,
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
            <div className="flex flex-wrap items-center gap-1.5">
              <MosaicTag color={spurTk.muted}>
                {levelLabel[rec.level]}
                {rec.segmentDimension ? ` · ${rec.segmentDimension}` : ''}
              </MosaicTag>
              <MosaicTag color={spurTk.accent}>{typeLabel[rec.type]}</MosaicTag>
              <MosaicTag color={spurTk.muted}>{DATA_WINDOW_LABEL[rec.dataWindow]}</MosaicTag>
              {isApplied && <MosaicTag color={spurTk.green}>Applied</MosaicTag>}
              {isDismissed && <MosaicTag color={spurTk.muted}>Dismissed</MosaicTag>}
              {isRolledBack && <MosaicTag color={spurTk.red}>Rolled back</MosaicTag>}
            </div>

            <p
              className="text-[13px] font-bold"
              style={{
                textDecoration: isDismissed || isRolledBack ? 'line-through' : 'none',
                color: isDismissed || isRolledBack ? spurTk.muted : spurTk.text,
              }}
            >
              {rec.title}
            </p>

            <p className="text-xs leading-relaxed" style={{ color: spurTk.muted }}>{rec.description}</p>

            <ValueChangeRow
              currentValue={rec.currentValue}
              proposedValue={rec.proposedValue}
              estimatedImpact={rec.estimatedImpact}
            />

            <MosaicScoreCompact score={rec.score} />

            {isPending && showComment && <CommentInput value={comment} onChange={setComment} />}

            {isPending && !isPlatformNative && (
              <div className="flex flex-wrap items-center gap-2">
                <Btn size="sm" variant="primary" onClick={() => setConfirmOpen(true)}>
                  Apply
                </Btn>
                <Btn size="sm" variant="link" onClick={() => setShowComment((v) => !v)}>
                  {showComment ? 'Hide note' : '+ Add note'}
                </Btn>
                <Tooltip title="Dismiss">
                  <Btn size="sm" variant="danger" loading={dismissLoading} onClick={handleDismiss}>Dismiss</Btn>
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
