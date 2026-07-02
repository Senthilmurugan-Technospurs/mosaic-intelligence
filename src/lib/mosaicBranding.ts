/** Central MOSAIC product copy — swap via env on go-live without UI refactors. */
export const MOSAIC_PRODUCT_NAME =
  process.env.NEXT_PUBLIC_MOSAIC_PRODUCT_NAME ?? 'MOSAIC';

export const MOSAIC_TAGLINE =
  process.env.NEXT_PUBLIC_MOSAIC_TAGLINE ??
  'Cross-platform AI recommendation engine';

export const MOSAIC_USP =
  process.env.NEXT_PUBLIC_MOSAIC_USP ??
  'Orchestrates budget, bid, and audience actions across channels — with ad-set level hierarchy native platforms do not offer.';

export const MOSAIC_USP_SHORT =
  'AI orchestration · hierarchical actions · cross-platform compare';
