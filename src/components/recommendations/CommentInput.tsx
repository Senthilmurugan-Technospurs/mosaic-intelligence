'use client';

import { TextArea } from '@/components/ui/MosaicUI';

interface CommentInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function CommentInput({ value, onChange, placeholder }: CommentInputProps) {
  return (
    <div>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Optional note before applying (max 500 characters)'}
        rows={2}
        maxLength={500}
      />
      <p className="mt-1 text-right text-xs text-[#9ca3af]">{value.length}/500</p>
    </div>
  );
}
