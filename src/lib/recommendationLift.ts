/** Tooltip for the dashboard “Avg lift” stat tile (% rollup). */
export const AVG_LIFT_STATS_TOOLTIP =
  'Average expected performance uplift (%) across pending recommendations on active campaigns — the mean of each suggestion’s expected lift score.';

/** Tooltip on the “Projected lift” table column header. */
export const PROJECTED_LIFT_COLUMN_TOOLTIP =
  'Projected business outcome if you apply pending recommendations — e.g. extra conversions, MQLs, or CPA/ROAS change. Sourced from the primary pending MOSAIC suggestion for each campaign.';

export const AVG_LIFT_DEFINITION_SHORT =
  'Estimated conversions, MQLs, or efficiency gain from pending recommendations.';

export const PROJECTED_LIFT_COLUMN_LABEL = 'Projected lift';

/** @deprecated use PROJECTED_LIFT_COLUMN_TOOLTIP or AVG_LIFT_STATS_TOOLTIP */
export const AVG_LIFT_DEFINITION = PROJECTED_LIFT_COLUMN_TOOLTIP;
