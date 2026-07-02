import { Recommendation } from '@/types/recommendation';

/** Pick highest-priority recommendation for hub display. */
export function pickPrimaryFromList(recs: Recommendation[]): Recommendation | null {
  if (!recs.length) return null;
  const primary = recs.find((r) => r.isPrimary);
  if (primary) return primary;
  const ranked = [...recs].sort((a, b) => b.score.expectedLift - a.score.expectedLift);
  return ranked[0] ?? null;
}
