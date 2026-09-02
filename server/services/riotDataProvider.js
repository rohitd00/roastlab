// Placeholder for Phase 5 (Riot API mode).
// Riot's VALORANT API requires RSO (player opt-in OAuth) for player-specific
// data and does not currently support Personal API Keys. This provider should
// be implemented once appropriate Riot access/approval is available, exposing
// the same getPlayer/getRecentMatches shape as mockDataProvider so the rest
// of the app never needs to change.

async function getPlayer() {
  throw new Error("Riot API mode is not configured yet. Set DATA_SOURCE=mock.");
}

async function getRecentMatches() {
  throw new Error("Riot API mode is not configured yet. Set DATA_SOURCE=mock.");
}

module.exports = { getPlayer, getRecentMatches };
