require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const playerRoutes = require("./server/routes/playerRoutes");
const roastRoutes = require("./server/routes/roastRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", playerRoutes);
app.use("/api", roastRoutes);

const clientDist = path.join(__dirname, "client", "dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found." },
  });
});

app.listen(PORT, () => {
  console.log(`Valorant Roast Lab server running on http://localhost:${PORT}`);
  console.log(`Data source: ${process.env.DATA_SOURCE || "mock"}`);
});
