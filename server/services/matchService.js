const mockDataProvider = require("./mockDataProvider");
const riotDataProvider = require("./riotDataProvider");

const DEFAULT_MATCH_LIMIT = 20;

function getProvider() {
  return process.env.DATA_SOURCE === "riot" ? riotDataProvider : mockDataProvider;
}

async function getRecentMatches(gameName, tagLine, limit = DEFAULT_MATCH_LIMIT) {
  return getProvider().getRecentMatches(gameName, tagLine, limit);
}

module.exports = { getRecentMatches, DEFAULT_MATCH_LIMIT };
