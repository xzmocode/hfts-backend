// src/routes/analytics.js
import express from "express";
import { getDB } from "../db/store.js";

const router = express.Router();

/**
 * GET /api/analytics/summary
 * Returns totals, action breakdown, and risk score
 * Also stores risk trend history in DB (persistent)
 */
router.get("/summary", (req, res) => {
  const db = getDB();
  const sims = db.data.simulations || [];
  const interactions = db.data.interactions || [];

  // Group interactions by action
  const byAction = interactions.reduce((acc, i) => {
    acc[i.action] = (acc[i.action] || 0) + 1;
    return acc;
  }, {});

  // Compute a simple risk score (0–100)
  const riskScore =
    sims.length === 0 ? 0 : Math.min(100, 50 + (byAction.clicked || 0) * 17);

  // --- Trend Persistence ---
  db.data.trend = db.data.trend || [];
  db.data.trend.push({
    timestamp: new Date().toISOString(),
    riskScore,
  });

  // Keep only last 50 data points
  if (db.data.trend.length > 50) db.data.trend.shift();

  db.write();

  res.json({
    totals: {
      simulations: sims.length,
      interactions: interactions.length,
    },
    byAction,
    riskScore,
  });
});

/**
 * GET /api/analytics/trend
 * Returns the persistent risk trend data
 */
router.get("/trend", (req, res) => {
  const db = getDB();
  res.json(db.data.trend || []);
});

/**
 * DELETE /api/analytics/trend
 * Optional: clear the trend history
 */
router.delete("/trend", (req, res) => {
  const db = getDB();
  db.data.trend = [];
  db.write();
  res.json({ message: "Trend data cleared." });
});

export default router;
