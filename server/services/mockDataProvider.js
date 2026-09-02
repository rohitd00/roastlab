const fs = require("fs");
const path = require("path");

const playersPath = path.join(__dirname, "..", "data", "mock-players.json");
const matchesPath = path.join(__dirname, "..", "data", "mock-matches.json");

const mockPlayers = JSON.parse(fs.readFileSync(playersPath, "utf-8"));
const mockMatches = JSON.parse(fs.readFileSync(matchesPath, "utf-8"));

function findRiotIdKey(gameName, tagLine) {
  const target = `${gameName}#${tagLine}`.toLowerCase();
  return Object.keys(mockPlayers).find((key) => key.toLowerCase() === target);
}

async function getPlayer(gameName, tagLine, region) {
  const key = findRiotIdKey(gameName, tagLine);
  if (!key) return null;
  return { ...mockPlayers[key], region: region || mockPlayers[key].region };
}

async function getRecentMatches(gameName, tagLine, limit = 20) {
  const key = findRiotIdKey(gameName, tagLine);
  if (!key) return [];
  return mockMatches[key].slice(0, limit);
}

module.exports = { getPlayer, getRecentMatches };
