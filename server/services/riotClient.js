const ACCOUNT_CONTINENT = "americas";
const MATCH_SHARDS = ["na", "eu", "ap", "kr", "latam", "br"];

function apiKey() {
  const key = process.env.RIOT_API_KEY;
  if (!key) {
    const err = new Error("RIOT_API_KEY is not set.");
    err.code = "API_UNAVAILABLE";
    throw err;
  }
  return key;
}

async function riotFetch(url) {
  const response = await fetch(url, { headers: { "X-Riot-Token": apiKey() } });

  if (response.status === 404) return null;

  if (response.status === 403) {
    const err = new Error(
      "Riot returned 403 Forbidden. This usually means the API key does not have access to this endpoint " +
        "(VALORANT match/ranked/content data requires an approved production key with RSO, which personal " +
        "developer keys do not have)."
    );
    err.code = "API_UNAVAILABLE";
    throw err;
  }

  if (response.status === 401) {
    const err = new Error("Riot rejected the API key (401). Check that RIOT_API_KEY is valid and not expired.");
    err.code = "API_UNAVAILABLE";
    throw err;
  }

  if (response.status === 429) {
    const err = new Error("Riot API rate limit hit. Try again in a moment.");
    err.code = "RATE_LIMITED";
    throw err;
  }

  if (!response.ok) {
    const err = new Error(`Riot API request failed with status ${response.status}.`);
    err.code = "API_UNAVAILABLE";
    throw err;
  }

  return response.json();
}

async function getAccountByRiotId(gameName, tagLine) {
  const url = `https://${ACCOUNT_CONTINENT}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName
  )}/${encodeURIComponent(tagLine)}`;
  return riotFetch(url);
}

// VALORANT match data is sharded by platform region (na/eu/ap/kr/latam/br) and
// there is no public lookup for "which shard is this puuid on" — so we probe
// shards in order and use the first one that returns a matchlist.
async function findMatchShard(puuid) {
  for (const shard of MATCH_SHARDS) {
    const url = `https://${shard}.api.riotgames.com/val/match/v1/matchlists/by-puuid/${puuid}`;
    const data = await riotFetch(url);
    if (data) return { shard, matchlist: data };
  }
  return null;
}

async function getMatchDetail(shard, matchId) {
  const url = `https://${shard}.api.riotgames.com/val/match/v1/matches/${matchId}`;
  return riotFetch(url);
}

let contentCache = null;

async function getContent(shard) {
  if (contentCache) return contentCache;
  const url = `https://${shard}.api.riotgames.com/val/content/v1/contents`;
  const data = await riotFetch(url);
  contentCache = data;
  return data;
}

module.exports = {
  getAccountByRiotId,
  findMatchShard,
  getMatchDetail,
  getContent,
  MATCH_SHARDS,
};
