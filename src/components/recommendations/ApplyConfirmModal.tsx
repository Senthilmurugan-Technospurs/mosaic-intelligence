'use client';

import { Btn, Modal, Pill } from '@/components/ui/MosaicUI';
import { Recommendation } from '@/types/recommendation';

const riskColor = { low: 'green', medium: 'orange', high: 'red' } as const;
const reversibilityIcon = { easy: '↩', moderate: '⚠', hard: '🔒' };

interface ApplyConfirmModalProps {
  open: boolean;
  recommendation: Recommendation | null;
  comment: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ApplyConfirmModal({
  open,
  recommendation: rec,
  comment,
  loading,
  onConfirm,
  onCancel,
}: ApplyConfirmModalProps) {
  if (!rec) return null;

  return (
    <Modal
      open={open}
      title="Confirm: Apply Recommendation"
      onClose={onCancel}
      footer={
        <>
          <Btn variant="outline" onClick={onCancel} disabled={loading}>Cancel</Btn>
          <Btn variant="primary" loading={loading} onClick={onConfirm}>Apply Now</Btn>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-[#102131]">{rec.title}</h4>
          <p className="mt-1 text-sm text-[#5f7387]">{rec.description}</p>
        </div>

        {(rec.currentValue || rec.proposedValue) && (
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <div className="flex-1 text-center">
              <div className="text-[11px] text-[#5f7387]">CURRENT</div>
              <div className="text-sm font-semibold text-[#6b7280]">{rec.currentValue ?? '—'}</div>
            </div>
            <div className="text-xl text-indigo-600">→</div>
            <div className="flex-1 text-center">
              <div className="text-[11px] text-[#5f7387]">PROPOSED</div>
              <div className="text-sm font-semibold text-[#102131]">{rec.proposedValue ?? '—'}</div>
            </div>
          </div>
        )}

        {rec.estimatedImpact && (
          <p className="text-sm text-[#102131]">
            <strong>Estimated Impact:</strong> {rec.estimatedImpact}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Pill color="blue">+{rec.score.expectedLift}% expected lift</Pill>
          <Pill color="geekblue">{rec.score.confidence}% confidence</Pill>
          <Pill color={riskColor[rec.score.risk]}>{rec.score.risk} risk</Pill>
          <Pill>{reversibilityIcon[rec.score.reversibility]} {rec.score.reversibility} to undo</Pill>
        </div>

        {comment && (
          <div className="rounded-xl bg-indigo-50 p-3">
            <div className="text-xs text-[#6b7280]">YOUR NOTE</div>
            <p className="text-sm">{comment}</p>
          </div>
        )}

        <p className="text-xs text-[#5f7387]">You can undo this action within 24 hours of applying.</p>
      </div>
    </Modal>
  );
}
