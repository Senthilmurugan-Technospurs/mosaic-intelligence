"""Generate MOSAIC UI guide PDF."""
from pathlib import Path
from fpdf import FPDF

PDF = Path(__file__).parent / "MOSAIC-Recommendations-UI-Guide.pdf"


class GuidePDF(FPDF):
    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(100, 115, 130)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")

    def section(self, title: str, level: int = 1):
        self.ln(4 if level == 1 else 2)
        sizes = {1: 16, 2: 13, 3: 11}
        self.set_font("Helvetica", "B", sizes.get(level, 10))
        self.set_text_color(8, 145, 178) if level == 2 else self.set_text_color(16, 33, 49)
        self.set_x(self.l_margin)
        self.multi_cell(0, 7, title)
        self.ln(1)

    def para(self, text: str):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(16, 33, 49)
        self.set_x(self.l_margin)
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def bullet(self, text: str):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(16, 33, 49)
        self.set_x(self.l_margin)
        self.multi_cell(0, 5.5, "- " + text)


def build():
    pdf = GuidePDF()
    pdf.set_auto_page_break(True, margin=15)
    pdf.add_page()

    pdf.section("MOSAIC Recommendations UI - Complete Guide", 1)
    pdf.para("Product: MOSAIC Intelligence (AI Tools)")
    pdf.para("Project: tsp-mosaic-frontend | Local: http://localhost:3010")

    pdf.section("1. Overview", 2)
    pdf.para(
        "Campaign-centric dashboard for optimization suggestions from MOSAIC, "
        "Google Ads, and Meta. The dashboard lists campaigns only. "
        "Campaign detail shows full recommendations by source, hierarchy, compare, and history."
    )

    pdf.section("2. Routes", 2)
    pdf.bullet("/recommendations/all - Campaign dashboard (hub)")
    pdf.bullet("/recommendations/[campaignId] - Single campaign detail")
    pdf.bullet("/recommendations/compare - All campaigns compare workspace")
    pdf.bullet("/recommendations/compare/[campaignId] - One campaign compare")

    pdf.section("3. Dashboard", 2)
    pdf.section("KPI cards", 3)
    pdf.bullet("Total, Applied, Dismissed, Ignored, Pending, Avg lift")
    pdf.section("Campaign table", 3)
    pdf.bullet("Campaign: name, NEW badge, status, platform")
    pdf.bullet("MOSAIC, Google, Meta: recommendation counts per source")
    pdf.bullet("Pending, Avg lift, Schedule (frequency + last run)")
    pdf.bullet("Open: navigate to campaign detail")
    pdf.bullet("Compare: shown when 2+ sources have recommendations")
    pdf.bullet("Filters: search, status, sort by pending or lift")
    pdf.bullet("Row hover prefetches campaign route for faster open")

    pdf.section("4. Campaign Detail", 2)
    pdf.section("Header", 3)
    pdf.bullet("Campaign info, budget, bid strategy, source count chips")

    pdf.section("Tab: By source", 3)
    pdf.bullet("Source tabs: All, MOSAIC, Google, Meta")
    pdf.bullet("PRIMARY ACTION: main campaign-level recommendation")
    pdf.bullet("SUPPORTING ACTIONS: nested by ad set and segment")
    pdf.bullet("Campaign-level supporting and orphan recommendations")
    pdf.bullet("Filter by module: Budget, Bid, Audience, Placement, Geo/Daypart, Dismissed")
    pdf.bullet("Info banner when other sources also have suggestions")

    pdf.section("Tab: Cross-platform", 3)
    pdf.bullet("Side-by-side MOSAIC vs Google vs Meta (ComparePairPanel)")
    pdf.bullet("Match types: aligned, similar, conflict, mosaic_only, platform_only")

    pdf.section("Tab: History", 3)
    pdf.bullet("Audit log: applied, dismissed, rolled back with actor and timestamp")

    pdf.section("Actions", 3)
    pdf.bullet("MOSAIC: Apply (with note), Dismiss, Undo (24h), bulk select")
    pdf.bullet("Google/Meta: view-only, link to Open in ad manager")
    pdf.bullet("No checkbox on platform-native cards")

    pdf.section("5. Compare Workspace", 2)
    pdf.bullet("Compare hub lists all campaigns with alignment summary")
    pdf.bullet("Campaign compare shows pairs by category (budget, bid, etc.)")

    pdf.section("6. Components", 2)
    for line in [
        "AppHeader - top navigation",
        "CampaignSummaryTable - dashboard table",
        "PrimaryRecommendationCard - main action card",
        "RecommendationCard - supporting recommendation",
        "RecommendationHierarchy - ad set / segment nesting",
        "RecommendationScoreBadges - lift, confidence, risk",
        "SourceTag - MOSAIC, Google, Meta badge",
        "ApplyConfirmModal - confirm before apply",
        "BulkActionBar - bulk apply for selected MOSAIC recs",
        "CompareSummaryTable - compare hub table",
        "ComparePairPanel - side-by-side compare cards",
        "HistoryPanel - audit timeline",
    ]:
        pdf.bullet(line)

    pdf.section("7. Data Layer", 2)
    pdf.bullet("mocks/recommendations.ts - MOSAIC demo with parent/child links")
    pdf.bullet("mocks/platformRecommendations.ts - Google and Meta demo")
    pdf.bullet("lib/allRecommendations.ts - merges all sources")
    pdf.bullet("lib/campaignSourceCounts.ts - per-campaign source counts")
    pdf.bullet("lib/recommendationTree.ts - primary to ad set to segment tree")
    pdf.bullet("lib/recommendationCompare.ts - cross-source alignment")
    pdf.bullet("lib/campaignDetailCache.ts - instant mock data for fast load")
    pdf.bullet("API /api/recommendations/* - mock endpoints and mutations")

    pdf.section("8. Hooks", 2)
    pdf.bullet("useRecommendations - dashboard data")
    pdf.bullet("useCampaignRecommendations - campaign + recs + compare pairs")
    pdf.bullet("useCampaignHistory - audit log")
    pdf.bullet("useApplyRecommendation, useDismiss, useUndo, useBulkApply - mutations")

    pdf.section("9. Recommendation Modules", 2)
    pdf.bullet("budget_orchestration -> Budget (raise budget, reallocate)")
    pdf.bullet("bid_policy -> Bid (bid cap, target CPA)")
    pdf.bullet("audience_strategy -> Audience (overlap, lookalike)")
    pdf.bullet("placement -> Placement (Reels, publishers)")
    pdf.bullet("geo_daypart -> Geo and Daypart (geo shift, dayparting)")

    pdf.section("10. User Flow", 2)
    pdf.para(
        "Dashboard -> Open campaign -> By source (apply MOSAIC) -> "
        "Cross-platform tab -> Compare button or header Compare -> full workspace."
    )

    pdf.section("11. Performance", 2)
    pdf.bullet("Use port 3010 (npm run dev or npm run dev:clean)")
    pdf.bullet("First campaign open in dev compiles JS once (~10-25s)")
    pdf.bullet("loading.tsx shows skeleton during compile")
    pdf.bullet("Lazy-loaded History and Compare tabs")
    pdf.bullet("localhost:3000 is SpurAdConnect, not MOSAIC")

    pdf.section("12. Live Integration", 2)
    pdf.para(
        "Google and Meta APIs require a backend mapper to the normalized Recommendation shape. "
        "UI is ready: platform recs stay flat, compare uses category heuristics, "
        "Apply for platform recs via their APIs or Open in manager links."
    )

    pdf.output(str(PDF))
    print(str(PDF.resolve()))


if __name__ == "__main__":
    build()
