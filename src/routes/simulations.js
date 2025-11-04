// src/routes/simulations.js
import express from "express";
import { getDB } from "../db/store.js";
import { nanoid } from "nanoid";
import { templates } from "../utils/templates.js";

const router = express.Router();

// POST /api/simulations/email
router.post("/email", (req, res) => {
  const db = getDB();
  const { targetName, targetRole, attackType } = req.body;

  const id = nanoid();
  const subject = templates.email.subject(targetName, attackType);
  const bodyHtml = templates.email.body(targetName, targetRole, attackType);

  const sim = {
    id,
    channel: "email",
    attackType,
    target: { name: targetName, role: targetRole },
    subject,
    bodyHtml,
    createdAt: new Date().toISOString(),
    riskWeight: Math.floor(Math.random() * 5) + 1,
  };

  db.data.simulations.push(sim);
  db.write();

  res.json(sim);
});

// GET /api/simulations
router.get("/", (req, res) => {
  const db = getDB();
  res.json(db.data.simulations);
});

export default router;
