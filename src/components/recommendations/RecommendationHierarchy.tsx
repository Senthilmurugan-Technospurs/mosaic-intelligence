'use client';

import { Recommendation } from '@/types/recommendation';
import { RecommendationTree } from '@/lib/recommendationTree';
import RecommendationCard from './RecommendationCard';

interface RecommendationHierarchyProps {
  tree: RecommendationTree;
  selectedIds: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
  onApply: (id: string, comment: string) => Promise<void>;
  onDismiss: (id: string) => Promise<void>;
  onUndo: (id: string) => Promise<void>;
}

import { spurTk } from '@/lib/spurMosaicTokens';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-[11px] font-bold tracking-widest"
      style={{ color: spurTk.muted }}
    >
      {children}
    </span>
  );
}

function AdSetHeader({ name, count }: { name: string; count: number }) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg px-3 py-2"
      style={{
        borderLeft: `3px solid ${spurTk.accent}`,
        background: spurTk.surface2,
      }}
    >
      <span className="text-sm font-semibold" style={{ color: spurTk.text }}>{name}</span>
      <span className="text-xs" style={{ color: spurTk.muted }}>{count} action{count === 1 ? '' : 's'}</span>
    </div>
  );
}

function renderCard(
  rec: Recommendation,
  indentLevel: 0 | 1 | 2,
  props: Omit<RecommendationHierarchyProps, 'tree'>,
) {
  return (
    <RecommendationCard
      key={rec.id}
      recommendation={rec}
      selected={props.selectedIds.has(rec.id)}
      onSelect={props.onSelect}
      onApply={props.onApply}
      onDismiss={props.onDismiss}
      onUndo={props.onUndo}
      indentLevel={indentLevel}
    />
  );
}

export default function RecommendationHierarchy({
  tree,
  selectedIds,
  onSelect,
  onApply,
  onDismiss,
  onUndo,
}: RecommendationHierarchyProps) {
  const cardProps = { selectedIds, onSelect, onApply, onDismiss, onUndo };

  if (!tree.hasHierarchy) {
    return (
      <div className="space-y-4">
        {tree.standalone.map((rec) => renderCard(rec, 0, cardProps))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tree.adSetGroups.length > 0 && (
        <div className="space-y-4">
          <SectionLabel>SUPPORTING BY AD SET</SectionLabel>
          {tree.adSetGroups.map((group) => {
            const count = group.adSetRecs.length + group.segments.length;
            return (
              <div key={group.adSetId} className="space-y-3">
                <AdSetHeader name={group.adSetName} count={count} />
                <div className="space-y-3 pl-2">
                  {group.adSetRecs.map((rec) => renderCard(rec, 1, cardProps))}
                  {group.segments.map((rec) => renderCard(rec, 2, cardProps))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tree.campaignLevelSupporting.length > 0 && (
        <div className="space-y-3">
          <SectionLabel>CAMPAIGN-LEVEL SUPPORTING</SectionLabel>
          {tree.campaignLevelSupporting.map((rec) => renderCard(rec, 1, cardProps))}
        </div>
      )}

      {tree.orphans.length > 0 && (
        <div className="space-y-3">
          <SectionLabel>OTHER RECOMMENDATIONS</SectionLabel>
          {tree.orphans.map((rec) => renderCard(rec, 0, cardProps))}
        </div>
      )}
    </div>
  );
}
