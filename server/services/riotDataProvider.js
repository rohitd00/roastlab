const riotClient = require("./riotClient");

const STATIC_TIER_NAMES = {
  0: "Unranked",
  3: "Iron 1",
  4: "Iron 2",
  5: "Iron 3",
  6: "Bronze 1",
  7: "Bronze 2",
  8: "Bronze 3",
  9: "Silver 1",
  10: "Silver 2",
  11: "Silver 3",
  12: "Gold 1",
  13: "Gold 2",
  14: "Gold 3",
  15: "Platinum 1",
  16: "Platinum 2",
  17: "Platinum 3",
  18: "Diamond 1",
  19: "Diamond 2",
  20: "Diamond 3",
  21: "Ascendant 1",
  22: "Ascendant 2",
  23: "Ascendant 3",
  24: "Immortal 1",
  25: "Immortal 2",
  26: "Immortal 3",
  27: "Radiant",
};

async function resolveRankName(shard, tier) {
  if (tier === undefined || tier === null) return "Unranked";

  try {
    const content = await riotClient.getContent(shard);
    const match = content?.competitiveTiers
      ?.flatMap((group) => group.tiers || [])
      .find((t) => t.tier === tier);
    if (match?.tierName) return match.tierName;
  } catch {
    // fall through to static table
  }

  return STATIC_TIER_NAMES[tier] || "Unranked";
}

async function resolveMapName(shard, mapId) {
  try {
    const content = await riotClient.getContent(shard);
    const match = content?.maps?.find((m) => m.id === mapId);
    if (match?.name) return match.name;
  } catch {
    // fall through
  }
  return mapId || "Unknown Map";
}

async function resolveAgentName(shard, agentId) {
  try {
    const content = await riotClient.getContent(shard);
    const match = content?.characters?.find((c) => c.id === agentId);
    if (match?.name) return match.name;
  } catch {
    // fall through
  }
  return agentId || "Unknown Agent";
}

// Aggregates one match's roundResults into the shape analysisService expects.
// Headshot count (rather than a true headshot%) matches the mock data model,
// since analysisService derives headshot% as headshots/kills for both sources.
function computeMatchStats(matchDetail, puuid) {
  const { matchInfo, players = [], teams = [], roundResults = [] } = matchDetail;
  const me = players.find((p) => p.puuid === puuid);
  if (!me) return null;

  const myTeam = teams.find((t) => t.teamId === me.teamId);
  const rounds = me.stats?.roundsPlayed || roundResults.length || 1;

  let totalDamage = 0;
  let headshots = 0;
  let firstKills = 0;
  let firstDeaths = 0;

  for (const round of roundResults) {
    const roundKills = [];

    for (const playerStats of round.playerStats || []) {
      if (playerStats.puuid === puuid) {
        for (const dmg of playerStats.damage || []) {
          totalDamage += dmg.damage || 0;
          headshots += dmg.headshots || 0;
        }
      }
      for (const kill of playerStats.kills || []) {
        roundKills.push(kill);
      }
    }

    if (roundKills.length) {
      roundKills.sort((a, b) => a.timeSinceRoundStartMillis - b.timeSinceRoundStartMillis);
      const first = roundKills[0];
      if (first.killer === puuid) firstKills += 1;
      if (first.victim === puuid) firstDeaths += 1;
    }
  }

  return {
    matchId: matchInfo.matchId,
    mapId: matchInfo.mapId,
    agentId: me.characterId,
    result: myTeam?.won ? "win" : "loss",
    kills: me.stats?.kills || 0,
    deaths: me.stats?.deaths || 0,
    assists: me.stats?.assists || 0,
    acs: Math.round((me.stats?.score || 0) / rounds),
    adr: Math.round(totalDamage / rounds),
    headshots,
    firstKills,
    firstDeaths,
    rounds,
    playedAt: new Date(matchInfo.gameStartMillis).toISOString(),
    competitiveTier: me.competitiveTier,
  };
}

async function getPlayer(gameName, tagLine) {
  const account = await riotClient.getAccountByRiotId(gameName, tagLine);
  if (!account) return null;

  let rank = "Unranked";
  let region = null;

  const found = await riotClient.findMatchShard(account.puuid);
  if (found) {
    region = found.shard;
    const matchIds = found.matchlist.history || [];
    if (matchIds.length) {
      const detail = await riotClient.getMatchDetail(found.shard, matchIds[0].matchId);
      const me = detail?.players?.find((p) => p.puuid === account.puuid);
      if (me) rank = await resolveRankName(found.shard, me.competitiveTier);
    }
  }

  return {
    puuid: account.puuid,
    gameName: account.gameName,
    tagLine: account.tagLine,
    region,
    rank,
  };
}

async function getRecentMatches(gameName, tagLine, limit = 20) {
  const account = await riotClient.getAccountByRiotId(gameName, tagLine);
  if (!account) return [];

  const found = await riotClient.findMatchShard(account.puuid);
  if (!found) return [];

  const matchIds = (found.matchlist.history || []).slice(0, limit).map((m) => m.matchId);
  const matches = [];

  for (const matchId of matchIds) {
    const detail = await riotClient.getMatchDetail(found.shard, matchId);
    if (!detail) continue;

    const stats = computeMatchStats(detail, account.puuid);
    if (!stats) continue;

    const [map, agent] = await Promise.all([
      resolveMapName(found.shard, stats.mapId),
      resolveAgentName(found.shard, stats.agentId),
    ]);

    const { mapId, agentId, competitiveTier, ...rest } = stats;
    matches.push({ ...rest, map, agent });
  }

  return matches;
}

module.exports = { getPlayer, getRecentMatches };
