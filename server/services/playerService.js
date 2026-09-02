const mockDataProvider = require("./mockDataProvider");
const riotDataProvider = require("./riotDataProvider");

function getProvider() {
  return process.env.DATA_SOURCE === "riot" ? riotDataProvider : mockDataProvider;
}

async function getPlayer(gameName, tagLine, region) {
  return getProvider().getPlayer(gameName, tagLine, region);
}

module.exports = { getPlayer };
