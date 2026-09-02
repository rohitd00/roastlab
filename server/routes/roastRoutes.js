const express = require("express");
const playerService = require("../services/playerService");
const matchService = require("../services/matchService");
const analysisService = require("../services/analysisService");
const roastService = require("../services/roastService");
const {
  isValidRiotId,
  parseRiotId,
  isValidRegion,
  isValidIntensity,
} = require("../utils/validation");

const router = express.Router();

function errorResponse(res, status, code, message) {
  return res.status(status).json({ success: false, error: { code, message } });
}

router.post("/roast", async (req, res) => {
  const { riotId, region, intensity = "brutal" } = req.body || {};

  if (!isValidRiotId(riotId)) {
    return errorResponse(
      res,
      400,
      "INVALID_RIOT_ID",
      "Enter your Riot ID in the format Name#Tag."
    );
  }

  if (region && !isValidRegion(region)) {
    return errorResponse(res, 400, "INVALID_RIOT_ID", "Unsupported region.");
  }

  const roastIntensity = isValidIntensity(intensity) ? intensity : "brutal";
  const { gameName, tagLine } = parseRiotId(riotId);

  try {
    const player = await playerService.getPlayer(gameName, tagLine, region);
    if (!player) {
      return errorResponse(
        res,
        404,
        "PLAYER_NOT_FOUND",
        "We couldn't find that player."
      );
    }

    const matches = await matchService.getRecentMatches(gameName, tagLine);

    let stats;
    let analysis;
    try {
      const result = analysisService.analyzeMatches(matches);
      stats = result.stats;
      analysis = result.analysis;
    } catch (err) {
      if (err.message === "INSUFFICIENT_MATCHES") {
        return errorResponse(
          res,
          422,
          "INSUFFICIENT_MATCHES",
          "Not enough recent matches to generate a roast."
        );
      }
      throw err;
    }

    let roast;
    try {
      roast = await roastService.generateRoast(player, stats, analysis, roastIntensity);
    } catch (err) {
      roast = roastService.buildTemplateRoast(player, stats, analysis, roastIntensity);
    }

    return res.json({
      success: true,
      player: {
        gameName: player.gameName,
        tagLine: player.tagLine,
        rank: player.rank,
        region: player.region,
      },
      stats,
      analysis,
      roast,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);

    if (err.code === "API_UNAVAILABLE") {
      return errorResponse(res, 502, "API_UNAVAILABLE", err.message);
    }

    if (err.code === "RATE_LIMITED") {
      return errorResponse(
        res,
        429,
        "RATE_LIMITED",
        "Too many requests right now. Give the server a moment and try again."
      );
    }

    return errorResponse(
      res,
      500,
      "INTERNAL_ERROR",
      "Something went wrong while preparing your roast."
    );
  }
});

module.exports = router;
