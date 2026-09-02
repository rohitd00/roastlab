const {
  calculateKD,
  calculateWinRate,
  average,
  calculateHeadshotPercentage,
  calculateFirstDeathRatio,
  clamp,
  round,
} = require("../utils/calculations");

function aggregateStats(matches) {
  const games = matches.length;
  const wins = matches.filter((m) => m.result === "win").length;
  const losses = games - wins;

  const totalKills = matches.reduce((sum, m) => sum + m.kills, 0);
  const totalDeaths = matches.reduce((sum, m) => sum + m.deaths, 0);
  const totalAssists = matches.reduce((sum, m) => sum + m.assists, 0);
  const totalHeadshots = matches.reduce((sum, m) => sum + m.headshots, 0);
  const totalFirstKills = matches.reduce((sum, m) => sum + m.firstKills, 0);
  const totalFirstDeaths = matches.reduce((sum, m) => sum + m.firstDeaths, 0);

  const winRate = calculateWinRate(wins, games);
  const kd = calculateKD(totalKills, totalDeaths);
  const acs = average(matches.map((m) => m.acs));
  const adr = average(matches.map((m) => m.adr));
  const headshotPercentage = calculateHeadshotPercentage(totalHeadshots, totalKills);
  const firstDeathRatio = calculateFirstDeathRatio(totalFirstDeaths, totalFirstKills);

  return {
    games,
    wins,
    losses,
    winRate: round(winRate, 1),
    kills: totalKills,
    deaths: totalDeaths,
    assists: totalAssists,
    kd: round(kd, 2),
    acs: round(acs),
    adr: round(adr),
    headshotPercentage: round(headshotPercentage, 1),
    firstKills: totalFirstKills,
    firstDeaths: totalFirstDeaths,
    firstDeathRatio: round(firstDeathRatio, 2),
  };
}

function fraggingLabel(kd) {
  if (kd < 0.7) return "Very poor fragging";
  if (kd < 0.9) return "Below average";
  if (kd < 1.1) return "Average";
  if (kd < 1.3) return "Good";
  return "Excellent";
}

function aimLabel(hs) {
  if (hs < 12) return "Critical";
  if (hs < 18) return "Weak";
  if (hs < 25) return "Average";
  if (hs <= 30) return "Good";
  return "Excellent";
}

function winningLabel(winRate) {
  if (winRate < 35) return "Disaster";
  if (winRate < 45) return "Bad";
  if (winRate < 55) return "Average";
  if (winRate <= 65) return "Good";
  return "Excellent";
}

function entryLabel(firstKills, firstDeaths) {
  if (firstDeaths > firstKills * 1.5) return "frequent_first_death";
  if (firstKills > firstDeaths * 1.5) return "strong_entry";
  return "balanced";
}

// Normalize a stat to a 0-100 "penalty" score: higher = more roastable.
function penaltyFromRange(value, worst, best) {
  const ratio = clamp((best - value) / (best - worst), 0, 1);
  return ratio * 100;
}

function calculateRoastScore(stats) {
  const kdPenalty = penaltyFromRange(stats.kd, 0.4, 1.6);
  const winRatePenalty = penaltyFromRange(stats.winRate, 20, 70);
  const hsPenalty = penaltyFromRange(stats.headshotPercentage, 5, 35);
  const firstDeathPenalty = penaltyFromRange(stats.firstDeathRatio, 0.5, 2.5);
  const acsPenalty = penaltyFromRange(stats.acs, 100, 280);

  const weighted =
    kdPenalty * 0.3 +
    winRatePenalty * 0.2 +
    hsPenalty * 0.2 +
    firstDeathPenalty * 0.15 +
    acsPenalty * 0.15;

  return round(clamp(weighted, 0, 100));
}

function severityFromScore(score) {
  if (score <= 20) return "Built Different";
  if (score <= 40) return "Mildly Roastable";
  if (score <= 60) return "Questionable";
  if (score <= 80) return "Severe Liability";
  return "Certified Menace";
}

function detectWeaknessesAndStrengths(stats) {
  const weaknesses = [];
  const strengths = [];

  if (stats.kd < 0.9) weaknesses.push("lowKD");
  else if (stats.kd >= 1.1) strengths.push("highKD");

  if (stats.winRate < 45) weaknesses.push("lowWinRate");
  else if (stats.winRate >= 55) strengths.push("highWinRate");

  if (stats.headshotPercentage < 18) weaknesses.push("lowHeadshot");
  else if (stats.headshotPercentage >= 25) strengths.push("highHeadshot");

  if (stats.firstDeaths > stats.firstKills * 1.5) weaknesses.push("highFirstDeaths");
  else if (stats.firstKills > stats.firstDeaths * 1.5) strengths.push("strongEntry");

  if (stats.acs < 180) weaknesses.push("lowACS");
  else if (stats.acs >= 230) strengths.push("highACS");

  if (stats.adr < 120) weaknesses.push("lowADR");
  else if (stats.adr >= 150) strengths.push("highADR");

  return { weaknesses, strengths };
}

function performanceBreakdown(stats, roastScore) {
  const fragging = round(clamp(penaltyFromRange(stats.kd, 0.4, 1.6), 0, 100));
  const aim = round(clamp(penaltyFromRange(stats.headshotPercentage, 5, 35), 0, 100));
  const entry = round(
    clamp(penaltyFromRange(stats.firstDeathRatio, 0.5, 2.5), 0, 100)
  );
  const winning = round(clamp(penaltyFromRange(stats.winRate, 20, 70), 0, 100));
  const consistency = round(clamp(roastScore, 0, 100));

  return { fragging, aim, entry, winning, consistency };
}

function recentForm(matches, count = 5) {
  return matches.slice(0, count).map((m) => (m.result === "win" ? "W" : "L"));
}

function agentBreakdown(matches) {
  const byAgent = {};
  matches.forEach((m) => {
    if (!byAgent[m.agent]) byAgent[m.agent] = { games: 0, wins: 0, kills: 0, deaths: 0 };
    byAgent[m.agent].games += 1;
    if (m.result === "win") byAgent[m.agent].wins += 1;
    byAgent[m.agent].kills += m.kills;
    byAgent[m.agent].deaths += m.deaths;
  });

  const entries = Object.entries(byAgent).map(([agent, data]) => ({
    agent,
    games: data.games,
    winRate: round(calculateWinRate(data.wins, data.games), 1),
    kd: round(calculateKD(data.kills, data.deaths), 2),
  }));

  entries.sort((a, b) => b.games - a.games);
  const mostPlayed = entries[0] || null;
  const sortedByWinRate = [...entries].sort((a, b) => b.winRate - a.winRate);
  const best = sortedByWinRate[0] || null;
  const worst = sortedByWinRate[sortedByWinRate.length - 1] || null;

  return { mostPlayed, best, worst, all: entries };
}

function mapBreakdown(matches) {
  const byMap = {};
  matches.forEach((m) => {
    if (!byMap[m.map]) byMap[m.map] = { games: 0, wins: 0, kills: 0, deaths: 0 };
    byMap[m.map].games += 1;
    if (m.result === "win") byMap[m.map].wins += 1;
    byMap[m.map].kills += m.kills;
    byMap[m.map].deaths += m.deaths;
  });

  const entries = Object.entries(byMap).map(([map, data]) => ({
    map,
    games: data.games,
    wins: data.wins,
    losses: data.games - data.wins,
    winRate: round(calculateWinRate(data.wins, data.games), 1),
    kd: round(calculateKD(data.kills, data.deaths), 2),
  }));

  const sortedByWinRate = [...entries].sort((a, b) => b.winRate - a.winRate);
  const best = sortedByWinRate[0] || null;
  const worst = sortedByWinRate[sortedByWinRate.length - 1] || null;

  return { best, worst, all: entries };
}

function biggestCrimes(stats) {
  const crimes = [
    { key: "firstDeaths", label: "First Deaths", value: stats.firstDeaths, severity: stats.firstDeaths },
    { key: "headshotPercentage", label: "Headshots", value: `${stats.headshotPercentage}%`, severity: 30 - stats.headshotPercentage },
    { key: "winRate", label: "Win Rate", value: `${stats.winRate}%`, severity: 60 - stats.winRate },
    { key: "kd", label: "K/D", value: stats.kd, severity: (1.2 - stats.kd) * 40 },
  ];

  return crimes.sort((a, b) => b.severity - a.severity).slice(0, 4);
}

function analyzeMatches(matches) {
  if (!matches || matches.length === 0) {
    throw new Error("INSUFFICIENT_MATCHES");
  }

  const stats = aggregateStats(matches);
  const roastScore = calculateRoastScore(stats);
  const severity = severityFromScore(roastScore);
  const { weaknesses, strengths } = detectWeaknessesAndStrengths(stats);

  return {
    stats,
    analysis: {
      roastScore,
      severity,
      weaknesses,
      strengths,
      categories: {
        fragging: fraggingLabel(stats.kd),
        aim: aimLabel(stats.headshotPercentage),
        winning: winningLabel(stats.winRate),
        entry: entryLabel(stats.firstKills, stats.firstDeaths),
      },
      breakdown: performanceBreakdown(stats, roastScore),
      recentForm: recentForm(matches),
      agentBreakdown: agentBreakdown(matches),
      mapBreakdown: mapBreakdown(matches),
      biggestCrimes: biggestCrimes(stats),
    },
  };
}

module.exports = {
  aggregateStats,
  calculateRoastScore,
  severityFromScore,
  detectWeaknessesAndStrengths,
  analyzeMatches,
};
