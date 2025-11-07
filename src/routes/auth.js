// src/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";   // ✅ use "lowdb/node" (no .js extension)

const router = express.Router();

// initialize DB file
const adapter = new JSONFile("data/users.json");
const db = new Low(adapter, { users: [] });
await db.read();
if (!db.data) db.data = { users: [] };

// --- Register ---
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });

  const exists = db.data.users.find((u) => u.username === username);
  if (exists) return res.status(400).json({ error: "User exists" });

  const hash = await bcrypt.hash(password, 10);
  db.data.users.push({ username, password: hash });
  await db.write();

  res.json({ success: true, message: "User registered" });
});

// --- Login ---
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = db.data.users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "1h" }
  );

  res.json({ success: true, token });
});

export default router;
