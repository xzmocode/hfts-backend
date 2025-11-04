// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db/store.js";

// ✅ Import routers using ES modules
import simulationsRouter from "./routes/simulations.js";
import interactionsRouter from "./routes/interactions.js";
import analyticsRouter from "./routes/analytics.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize database
initDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/simulations", simulationsRouter);
app.use("/api/interactions", interactionsRouter);
app.use("/api/analytics", analyticsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ HFTS backend running on http://localhost:${PORT}`);
});
