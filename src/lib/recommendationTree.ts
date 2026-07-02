import { Recommendation, RecType } from '@/types/recommendation';

export type CategoryKey = 'all' | RecType | 'dismissed';

export type AdSetGroup = {
  adSetId: string;
  adSetName: string;
  adSetRecs: Recommendation[];
  segments: Recommendation[];
};

export type RecommendationTree = {
  /** Nested ad-set → segment groups under the campaign primary. */
  adSetGroups: AdSetGroup[];
  /** Campaign-level supporting actions linked to the primary. */
  campaignLevelSupporting: Recommendation[];
  /** Recommendations without a parent link (e.g. rolled-back items). */
  orphans: Recommendation[];
  /** Flat list when no MOSAIC hierarchy exists (typical for platform-native recs). */
  standalone: Recommendation[];
  /** Whether this campaign uses primary + supporting hierarchy. */
  hasHierarchy: boolean;
};

export function matchesCategory(rec: Recommendation, category: CategoryKey): boolean {
  if (category === 'all') return true;
  if (category === 'dismissed') return rec.status === 'dismissed';
  return rec.type === category;
}

export function buildRecommendationTree(
  recs: Recommendation[],
  category: CategoryKey,
): RecommendationTree {
  const primary = recs.find((r) => r.isPrimary && r.level === 'campaign') ?? null;
  const nonPrimary = recs.filter((r) => !(r.isPrimary && r.level === 'campaign'));

  const linkedToPrimary = primary
    ? nonPrimary.filter((r) => r.parentRecommendationId === primary.id)
    : [];

  const hasHierarchy = Boolean(primary && linkedToPrimary.length > 0);

  if (!hasHierarchy) {
    return {
      adSetGroups: [],
      campaignLevelSupporting: [],
      orphans: [],
      standalone: nonPrimary.filter((r) => matchesCategory(r, category)),
      hasHierarchy: false,
    };
  }

  const orphans = nonPrimary.filter(
    (r) => !r.parentRecommendationId && matchesCategory(r, category),
  );

  const children = linkedToPrimary.filter((r) => matchesCategory(r, category));

  const campaignLevelSupporting = children.filter(
    (r) => r.level === 'campaign' || (!r.adSetId && r.level !== 'ad_set' && r.level !== 'segment'),
  );

  const hierarchyChildren = children.filter(
    (r) => r.level === 'ad_set' || r.level === 'segment',
  );

  const adSetMap = new Map<string, AdSetGroup>();

  for (const rec of hierarchyChildren) {
    if (rec.level === 'ad_set') {
      const id = rec.adSetId ?? rec.id;
      if (!adSetMap.has(id)) {
        adSetMap.set(id, {
          adSetId: id,
          adSetName: rec.adSetName ?? 'Ad Set',
          adSetRecs: [],
          segments: [],
        });
      }
      adSetMap.get(id)!.adSetRecs.push(rec);
    }
  }

  for (const rec of hierarchyChildren) {
    if (rec.level === 'segment') {
      const id = rec.adSetId ?? 'unknown';
      if (!adSetMap.has(id)) {
        adSetMap.set(id, {
          adSetId: id,
          adSetName: rec.adSetName ?? 'Ad Set',
          adSetRecs: [],
          segments: [],
        });
      }
      adSetMap.get(id)!.segments.push(rec);
    }
  }

  const adSetGroups = Array.from(adSetMap.values()).filter(
    (g) => g.adSetRecs.length > 0 || g.segments.length > 0,
  );

  return {
    adSetGroups,
    campaignLevelSupporting,
    orphans,
    standalone: [],
    hasHierarchy: true,
  };
}

export function countTreeItems(tree: RecommendationTree): number {
  const groupCount = tree.adSetGroups.reduce(
    (sum, g) => sum + g.adSetRecs.length + g.segments.length,
    0,
  );
  return (
    groupCount +
    tree.campaignLevelSupporting.length +
    tree.orphans.length +
    tree.standalone.length
  );
}
