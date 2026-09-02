const test = require("node:test");
const assert = require("node:assert/strict");

const { analyzeMatches } = require("./analysisService");

function makeMatch(overrides = {}) {
  return {
    matchId: "m",
    map: "Ascent",
    agent: "Jett",
    result: "loss",
    kills: 10,
    deaths: 15,
    assists: 3,
    acs: 150,
    adr: 110,
    headshots: 1,
    firstKills: 0,
    firstDeaths: 3,
    rounds: 20,
    ...overrides,
  };
}

test("analyzeMatches throws on empty match list", () => {
  assert.throws(() => analyzeMatches([]), /INSUFFICIENT_MATCHES/);
});

test("analyzeMatches flags a roastable player's weaknesses", () => {
  const matches = Array.from({ length: 10 }, () => makeMatch());
  const { stats, analysis } = analyzeMatches(matches);

  assert.equal(stats.games, 10);
  assert.ok(analysis.weaknesses.includes("lowKD"));
  assert.ok(analysis.weaknesses.includes("highFirstDeaths"));
  assert.ok(analysis.roastScore >= 0 && analysis.roastScore <= 100);
});

test("analyzeMatches identifies strengths for a strong player", () => {
  const matches = Array.from({ length: 10 }, () =>
    makeMatch({
      result: "win",
      kills: 24,
      deaths: 12,
      acs: 260,
      adr: 165,
      headshots: 9,
      firstKills: 3,
      firstDeaths: 1,
    })
  );

  const { analysis } = analyzeMatches(matches);

  assert.ok(analysis.strengths.includes("highKD"));
  assert.ok(analysis.strengths.includes("highWinRate"));
  assert.ok(analysis.roastScore < 40);
});
