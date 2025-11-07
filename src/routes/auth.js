// src/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const router = express.Router();
const db = new Low(new JSONFile("db.json"), { users: [] });

// Load existing users
await db.read();

// Register endpoint
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  const existing = db.data.users.find(u => u.username === username);
  if (existing) return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  db.data.users.push({ username, password: hashed });
  await db.write();

  res.json({ success: true, message: "User registered" });
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = db.data.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "1h" });
  res.json({ success: true, token });
});

export default router;
