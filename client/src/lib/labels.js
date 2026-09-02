export const WEAKNESS_LABELS = {
  lowKD: "Low K/D",
  lowWinRate: "Low Win Rate",
  lowHeadshot: "Low Headshot %",
  highFirstDeaths: "Frequent First Deaths",
  lowACS: "Low ACS",
  lowADR: "Low ADR",
};

export const STRENGTH_LABELS = {
  highKD: "Strong K/D",
  highWinRate: "Strong Win Rate",
  highHeadshot: "Sharp Aim",
  strongEntry: "Strong Entry Timing",
  highACS: "High Combat Score",
  highADR: "High Damage Output",
};

export const STRENGTH_ICONS = {
  highKD: "⚔️",
  highWinRate: "🏆",
  highHeadshot: "🎯",
  strongEntry: "🚪",
  highACS: "🔥",
  highADR: "💥",
};

export const CRIME_ICONS = {
  firstDeaths: "💀",
  headshotPercentage: "🎯",
  winRate: "📉",
  kd: "🧱",
};

export function severityColor(severity) {
  switch (severity) {
    case "Built Different":
      return "var(--success)";
    case "Mildly Roastable":
      return "#8fd694";
    case "Questionable":
      return "var(--warning)";
    case "Severe Liability":
      return "#ff7a4d";
    case "Certified Menace":
    default:
      return "var(--danger)";
  }
}
