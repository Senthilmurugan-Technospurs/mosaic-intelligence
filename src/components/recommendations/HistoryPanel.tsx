'use client';

import { Empty, Pill } from '@/components/ui/MosaicUI';
import { AuditLogEntry } from '@/types/recommendation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const actionConfig = {
  applied: { color: 'green', icon: '✓', label: 'Applied' },
  dismissed: { color: 'default', icon: '−', label: 'Dismissed' },
  rolled_back: { color: 'red', icon: '↩', label: 'Rolled Back' },
};

interface HistoryPanelProps {
  entries: AuditLogEntry[];
}

export default function HistoryPanel({ entries }: HistoryPanelProps) {
  if (entries.length === 0) {
    return (
      <Empty description="No history yet — applied or dismissed recommendations will appear here." />
    );
  }

  const sorted = [...entries].sort(
    (a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf(),
  );

  return (
    <div className="space-y-0">
      {sorted.map((entry, i) => {
        const cfg = actionConfig[entry.action];
        return (
          <div key={entry.id ?? i} className="relative flex gap-4 pb-6 last:pb-0">
            {i < sorted.length - 1 && (
              <div className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-200" />
            )}
            <div className="z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
              {entry.actorName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[#102131]">{entry.actorName}</span>
                <Pill color={cfg.color}>{cfg.label}</Pill>
                <span className="text-[11px] text-[#5f7387]">{dayjs(entry.timestamp).fromNow()}</span>
              </div>
              <p
                className="text-sm"
                style={{
                  textDecoration: entry.action === 'rolled_back' ? 'line-through' : 'none',
                  color: entry.action === 'rolled_back' ? '#9ca3af' : '#374151',
                }}
              >
                {entry.recommendationTitle}
              </p>
              {(entry.comment || entry.reason) && (
                <p className="text-xs text-[#5f7387]">&quot;{entry.comment ?? entry.reason}&quot;</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
