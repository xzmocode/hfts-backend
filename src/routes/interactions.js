// src/routes/interactions.js
import express from "express";
import { getDB } from "../db/store.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// POST /api/interactions
router.post("/", (req, res) => {
  const db = getDB();
  const { simulationId, action, latencyMs } = req.body;

  const interaction = {
    id: uuidv4(),
    simulationId,
    action,
    latencyMs,
    createdAt: new Date().toISOString(),
  };

  db.data.interactions.push(interaction);
  db.write();

  res.json(interaction);
});

// GET /api/interactions
router.get("/", (req, res) => {
  const db = getDB();
  res.json(db.data.interactions);
});

export default router;
