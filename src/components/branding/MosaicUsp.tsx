'use client';

import { MOSAIC_PRODUCT_NAME, MOSAIC_TAGLINE, MOSAIC_USP, MOSAIC_USP_SHORT } from '@/lib/mosaicBranding';

export function MosaicUspBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-100 to-cyan-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-800 ${className}`}
    >
      <span className="text-cyan-600">⚡</span>
      {MOSAIC_PRODUCT_NAME} AI
    </span>
  );
}

export function MosaicUspStrip({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-[#5f7387]">
        <span className="font-semibold text-violet-700">{MOSAIC_PRODUCT_NAME}</span>
        {' · '}
        {MOSAIC_USP_SHORT}
      </p>
    );
  }
  return (
    <div className="rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50/80 to-cyan-50/50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <MosaicUspBadge />
        <span className="text-xs font-semibold text-[#102131]">{MOSAIC_TAGLINE}</span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-[#5f7387]">{MOSAIC_USP}</p>
    </div>
  );
}
