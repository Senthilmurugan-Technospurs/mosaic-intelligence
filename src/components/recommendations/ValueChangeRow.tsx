import { spurTk } from '@/lib/spurMosaicTokens';

export default function ValueChangeRow({
  currentValue,
  proposedValue,
  estimatedImpact,
}: {
  currentValue?: string;
  proposedValue?: string;
  estimatedImpact?: string;
}) {
  if (!currentValue && !proposedValue) return null;

  return (
    <div
      className="mb-3 flex flex-wrap items-center gap-4 rounded-[10px] p-3.5"
      style={{ background: spurTk.surface2 }}
    >
      <div>
        <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: spurTk.muted }}>
          Current
        </div>
        <div className="text-[13px]" style={{ color: spurTk.muted }}>
          {currentValue ?? '—'}
        </div>
      </div>
      <span className="text-lg" style={{ color: spurTk.accent }}>
        →
      </span>
      <div>
        <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: spurTk.muted }}>
          Proposed
        </div>
        <div className="text-[13px] font-bold" style={{ color: spurTk.text }}>
          {proposedValue ?? '—'}
        </div>
      </div>
      {estimatedImpact && (
        <>
          <div className="hidden h-8 w-px sm:block" style={{ background: spurTk.border }} />
          <div>
            <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: spurTk.muted }}>
              Est. impact
            </div>
            <div className="text-[13px] font-semibold" style={{ color: spurTk.green }}>
              {estimatedImpact}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
