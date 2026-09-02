function safeDivide(numerator, denominator, fallback = 0) {
  if (!denominator) return fallback;
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : fallback;
}

function calculateKD(kills, deaths) {
  if (deaths === 0) return kills;
  return kills / deaths;
}

function calculateWinRate(wins, gamesPlayed) {
  return safeDivide(wins, gamesPlayed) * 100;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function calculateHeadshotPercentage(totalHeadshots, totalKills) {
  return safeDivide(totalHeadshots, totalKills) * 100;
}

function calculateFirstKillRate(firstKills, gamesPlayed) {
  return safeDivide(firstKills, gamesPlayed);
}

function calculateFirstDeathRate(firstDeaths, gamesPlayed) {
  return safeDivide(firstDeaths, gamesPlayed);
}

function calculateFirstDeathRatio(firstDeaths, firstKills) {
  return safeDivide(firstDeaths, Math.max(firstKills, 1));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

module.exports = {
  safeDivide,
  calculateKD,
  calculateWinRate,
  average,
  calculateHeadshotPercentage,
  calculateFirstKillRate,
  calculateFirstDeathRate,
  calculateFirstDeathRatio,
  clamp,
  round,
};
