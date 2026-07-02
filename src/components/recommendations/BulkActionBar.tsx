'use client';

import { useState } from 'react';
import { Btn, TextArea } from '@/components/ui/MosaicUI';

interface BulkActionBarProps {
  selectedCount: number;
  onBulkApply: (comment: string) => Promise<void>;
  onClearSelection: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onBulkApply,
  onClearSelection,
}: BulkActionBarProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);

  if (selectedCount === 0) return null;

  const handleBulkApply = async () => {
    setLoading(true);
    try {
      await onBulkApply(comment);
      setComment('');
      setShowComment(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t-[3px] border-indigo-600 bg-white px-6 py-4 shadow-2xl">
      <div className="mx-auto max-w-screen-xl">
        {showComment && (
          <div className="mb-3">
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a shared note for all selected recommendations (optional)…"
              rows={2}
              maxLength={500}
            />
          </div>
        )}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-indigo-600">
            {selectedCount} recommendation{selectedCount > 1 ? 's' : ''} selected
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Btn variant="link" onClick={() => setShowComment((v) => !v)}>
              {showComment ? 'Hide note' : '+ Add note'}
            </Btn>
            <Btn variant="outline" onClick={onClearSelection} disabled={loading}>Clear</Btn>
            <Btn variant="primary" loading={loading} onClick={handleBulkApply} className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20">
              ✓ Apply {selectedCount} selected
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
