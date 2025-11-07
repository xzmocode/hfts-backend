// src/routes/simulations.js
import express from "express";
import { getDB } from "../db/store.js";
import { templates } from "../utils/templates.js";
import { nanoid } from "nanoid";

const router = express.Router();

// ✅ Create new email simulation
router.post("/email", (req, res) => {
  const { targetName, targetRole, attackType } = req.body;

  if (!targetName || !targetRole || !attackType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = getDB();
  const template = templates.email[attackType];

  if (!template) {
    return res.status(400).json({ error: "Unknown attack type" });
  }

  const sim = {
    id: nanoid(),
    channel: "email",
    attackType,
    target: { name: targetName, role: targetRole },
    subject: template.subject(),
    bodyHtml: template.body(targetName),
    createdAt: new Date().toISOString(),
    riskWeight: template.riskWeight,
  };

  db.data.simulations.push(sim);
  db.write();

  res.json(sim);
});

// ✅ Get all simulations
router.get("/", (req, res) => {
  const db = getDB();
  res.json(db.data.simulations || []);
});

export default router;
