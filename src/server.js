// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import simulationsRouter from "./routes/simulations.js";
import interactionsRouter from "./routes/interactions.js";
import analyticsRouter from "./routes/analytics.js";
import authRouter from "./routes/auth.js"; // ✅ add this line

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ attach routes
app.use("/api/simulations", simulationsRouter);
app.use("/api/interactions", interactionsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/auth", authRouter); // ✅ ensure this line exists

// health check
app.get("/health", (req, res) => res.json({ ok: true }));

// fallback
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ HFTS backend running on http://localhost:${PORT}`));
