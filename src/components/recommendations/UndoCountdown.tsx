'use client';

import { useEffect, useState } from 'react';
import { Btn } from '@/components/ui/MosaicUI';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

interface UndoCountdownProps {
  undoDeadline: string;
  onUndo: () => void;
  loading?: boolean;
}

export default function UndoCountdown({ undoDeadline, onUndo, loading }: UndoCountdownProps) {
  const [remaining, setRemaining] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = dayjs(undoDeadline).diff(dayjs());
      if (diff <= 0) {
        setExpired(true);
        setRemaining('00:00:00');
        return;
      }
      const d = dayjs.duration(diff);
      const h = String(d.hours()).padStart(2, '0');
      const m = String(d.minutes()).padStart(2, '0');
      const s = String(d.seconds()).padStart(2, '0');
      setRemaining(`${h}:${m}:${s}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [undoDeadline]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!expired && (
        <Btn size="sm" variant="outline" onClick={onUndo} loading={loading} className="border-amber-300 text-amber-600">
          ↩ Undo
        </Btn>
      )}
      <span className={`font-mono text-xs ${expired ? 'text-[#9ca3af]' : 'text-amber-600'}`}>
        {expired ? 'Undo window expired' : `Undo available: ${remaining}`}
      </span>
    </div>
  );
}
