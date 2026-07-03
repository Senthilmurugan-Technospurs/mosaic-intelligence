/** SpurAdConnect-aligned MOSAIC design tokens (light theme). */
export const spurTk = {
  surface: '#ffffff',
  surface2: '#f4f6f8',
  border: '#dbe7ee',
  text: '#102131',
  muted: '#5f7387',
  accent: '#3b82f6',
  accent2: '#8b5cf6',
  cyan: '#06b6d4',
  green: '#10b981',
  yellow: '#f59e0b',
  orange: '#f97316',
  red: '#ef4444',
  violet: '#8b5cf6',
  pink: '#ec4899',
  shadowSm: '0 1px 2px rgba(15, 23, 42, 0.06)',
  shadowMd: '0 6px 18px -4px rgba(15, 23, 42, 0.08)',
  radius: '10px',
  radiusLg: '12px',
  mono: "ui-monospace, 'JetBrains Mono', 'Fira Code', monospace",
} as const;

export function spurAlpha(color: string, pct: number) {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}
