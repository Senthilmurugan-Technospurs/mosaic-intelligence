# MOSAIC Recommendations UI — Complete Guide

**Product:** MOSAIC Intelligence (AI Tools)  
**Project:** tsp-mosaic-frontend  
**Version:** Demo / July 2026

---

## 1. Overview

The MOSAIC Recommendations UI is a campaign-centric dashboard for reviewing AI-generated optimization suggestions from three sources:

- **MOSAIC** — our recommendation engine
- **Google Ads** — native platform suggestions (demo)
- **Meta** — native platform suggestions (demo)

The information architecture follows a clear hierarchy:

1. **Dashboard** — campaigns only (no recommendation cards)
2. **Campaign detail** — full recommendations by source, with hierarchy and compare
3. **Compare workspace** — cross-platform alignment and conflicts

**Base URL (local dev):** http://localhost:3010

---

## 2. Application Routes

| Route | Purpose |
|-------|---------|
| `/` | Redirects to dashboard |
| `/recommendations/all` | Campaign dashboard (hub) |
| `/recommendations/[campaignId]` | Single campaign detail |
| `/recommendations/compare` | All campaigns compare workspace |
| `/recommendations/compare/[campaignId]` | One campaign compare view |

---

## 3. Dashboard (`/recommendations/all`)

### Purpose
Campaign-level overview. Users see which campaigns have recommendations and from which sources, then drill into a campaign or compare.

### Sections

#### AppHeader
- Sticky top navigation with MOSAIC branding
- **Hub** — returns to dashboard
- **Compare (N)** — N = number of campaigns with recommendations from **2 or more sources** (e.g. MOSAIC + Meta)

#### Hero & KPI Cards
Aggregate stats across all campaigns:

| Metric | Description |
|--------|-------------|
| Total | All recommendations |
| Applied | Successfully applied |
| Dismissed | User dismissed |
| Ignored | Superseded / stale |
| Pending | Awaiting action |
| Avg lift | Average expected lift % on pending items |

#### CampaignSummaryTable
Main data table — one row per campaign.

| Column | Meaning |
|--------|---------|
| Campaign | Name, NEW badge, status (Active/Paused/Ended), platform |
| MOSAIC | Count from our AI engine |
| Google | Count from Google Ads (demo) |
| Meta | Count from Meta (demo) |
| Pending | Pending actions for that campaign |
| Avg lift | Expected lift % |
| Schedule | Generation frequency + last run |
| Open | Navigate to campaign detail |
| Compare | Shown only when 2+ sources have recs |

**Interactions:**
- Click row → open campaign detail
- Hover row → prefetch campaign route (faster open)
- Search, status filter, sort by pending or lift

---

## 4. Campaign Detail (`/recommendations/[campaignId]`)

### Purpose
Everything for one campaign: recommendations by source, nested hierarchy, cross-platform compare, and audit history.

### Header Card
- Campaign name, status, platform, flight dates
- Source count chips: MOSAIC | Google | Meta
- Link to compare when multiple sources exist
- Budget, daily budget, bid strategy

### Tab 1: By Source

Recommendations filtered by **who suggested them**:

| Source Tab | Content |
|------------|---------|
| All | MOSAIC + Google + Meta combined |
| MOSAIC | Our engine — full nested hierarchy |
| Google | Flat list, view-only, "Open in Google Ads" |
| Meta | Flat list, view-only, "Open in Meta" |

**Structure within a source:**

1. **PRIMARY ACTION** — one campaign-level main recommendation
2. **SUPPORTING ACTIONS** — nested tree:
   - **By ad set** — ad-set recommendations
   - **Segments** — nested under their ad set (geo, placement, daypart)
   - **Campaign-level supporting** — linked to primary, not under ad set
   - **Other** — orphans (e.g. rolled-back items)
3. **Filter by module** — Budget, Bid, Audience, Placement, Geo & Daypart, Dismissed

### Tab 2: Cross-Platform
Side-by-side view of what MOSAIC, Google, and Meta each recommend.

**Match types:**
- **Aligned** — same intent and direction
- **Similar** — same category, review values
- **Conflict** — different focus or opposite budget direction
- **MOSAIC only** — not in ad platform
- **Platform only** — not from MOSAIC

### Tab 3: History
Audit log: applied, dismissed, rolled back — who, when, optional comment.

### Actions (MOSAIC only)
- **Apply** — with optional note (confirm modal)
- **Dismiss** — remove from pending
- **Undo** — within 24h window after apply
- **Bulk select** — pending MOSAIC recs only; bar at bottom
- Google/Meta: no checkbox; link to ad manager instead

---

## 5. Compare Workspace

| Page | Purpose |
|------|---------|
| `/recommendations/compare` | All campaigns — counts, conflicts, alignment summary |
| `/recommendations/compare/[id]` | Deep compare for one campaign |

Each **compare pair** groups recommendations on the same topic (e.g. budget) across sources.

---

## 6. Components Reference

| Component | Role |
|-----------|------|
| AppHeader | Top navigation bar |
| CampaignSummaryTable | Dashboard table + filters |
| PrimaryRecommendationCard | Main campaign-level action card |
| RecommendationCard | Single supporting recommendation |
| RecommendationHierarchy | Nests cards under ad sets / segments |
| RecommendationScoreBadges | Lift, confidence, risk, reversibility |
| SourceTag | MOSAIC (purple), Google (red), Meta (blue) |
| ApplyConfirmModal | Confirm apply + optional note |
| CommentInput | Note on apply |
| UndoCountdown | 24h undo after apply |
| BulkActionBar | Fixed bar for bulk apply |
| CompareSummaryTable | Compare hub campaign list |
| ComparePairPanel | Side-by-side compare cards |
| HistoryPanel | Audit timeline |

---

## 7. Data & Logic Layer

| Module | Role |
|--------|------|
| `mocks/recommendations.ts` | MOSAIC demo data with parent/child links |
| `mocks/platformRecommendations.ts` | Google + Meta demo data |
| `lib/allRecommendations.ts` | Merges all sources |
| `lib/campaignSourceCounts.ts` | Per-campaign source counts |
| `lib/recommendationTree.ts` | Primary → ad set → segment tree |
| `lib/recommendationCompare.ts` | Cross-source alignment logic |
| `lib/campaignDetailCache.ts` | Instant mock data for fast load |
| API `/api/recommendations/*` | Serves mock data; mutations in memory |

### Hooks

| Hook | Purpose |
|------|---------|
| useRecommendations | Dashboard data |
| useCampaignRecommendations | Campaign + recs + compare pairs |
| useCampaignHistory | Audit log |
| useApplyRecommendation | Apply mutation |
| useDismissRecommendation | Dismiss mutation |
| useUndoRecommendation | Rollback mutation |
| useBulkApply | Bulk apply mutation |

---

## 8. Recommendation Modules (Types)

| MOSAIC Type | UI Label | Examples |
|-------------|----------|----------|
| budget_orchestration | Budget | Raise daily budget, reallocate spend |
| bid_policy | Bid | Bid cap, target CPA, bidding strategy |
| audience_strategy | Audience | Overlap, lookalike, exclusions |
| placement | Placement | Reels, placements, publishers |
| geo_daypart | Geo & Daypart | Geo shift, dayparting |

---

## 9. User Flows

```
Dashboard (/recommendations/all)
    │
    ├─► Click row / Open
    │       └─► Campaign detail
    │               ├─► By source → Apply MOSAIC recs
    │               ├─► Cross-platform → See conflicts
    │               └─► History → Audit trail
    │
    ├─► Compare (row) — when 2+ sources
    │       └─► /recommendations/compare/[id]
    │
    └─► Compare (header)
            └─► /recommendations/compare
```

---

## 10. Performance Notes

| Issue | Mitigation |
|-------|------------|
| Slow first campaign open (dev) | Webpack compiles ~17kB route on first visit; use port 3010 |
| Blank screen while compiling | `loading.tsx` skeleton on campaign route |
| API wait | `initialData` / mock cache — instant paint |
| Repeat visits | Route prefetch on table row hover; lazy-loaded History/Compare tabs |

**Dev commands:**
```
npm run dev        → http://localhost:3010
npm run dev:clean  → clear .next cache + start fresh
```

**Note:** `localhost:3000` is SpurAdConnect, not MOSAIC.

---

## 11. Live Integration (Future)

When connecting real Google/Meta APIs:

- UI is ready — use a **mapper layer** on the backend
- Platform recs stay **flat** (no fake nesting)
- Apply for platform recs via their APIs or "Open in manager" links
- Compare logic may need tuning with real recommendation wording

---

*Generated for tsp-mosaic-frontend — MOSAIC Intelligence UI documentation.*
