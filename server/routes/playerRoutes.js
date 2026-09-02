const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Dev convenience endpoint: lists the Riot IDs available in mock mode so the
// frontend can suggest them. Only meaningful when DATA_SOURCE=mock.
router.get("/players/mock", (_req, res) => {
  try {
    const playersPath = path.join(__dirname, "..", "data", "mock-players.json");
    const players = JSON.parse(fs.readFileSync(playersPath, "utf-8"));
    const riotIds = Object.keys(players);
    res.json({ success: true, riotIds });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR", message: "Could not load mock players." } });
  }
});

module.exports = router;
