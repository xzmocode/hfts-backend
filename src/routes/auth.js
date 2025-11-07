// src/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDB } from "../db/store.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecret";

// ✅ Register new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const db = getDB();

  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  const existing = db.data.users?.find(u => u.username === username);
  if (existing) return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), username, password: hashed };
  db.data.users.push(user);
  db.write();

  res.status(201).json({ message: "User registered" });
});

// ✅ Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = getDB();

  const user = db.data.users?.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "2h",
  });

  res.json({ token });
});

export default router;
