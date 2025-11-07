import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import simulationsRouter from "./routes/simulations.js";
import interactionsRouter from "./routes/interactions.js";
import analyticsRouter from "./routes/analytics.js";

dotenv.config();
const app = express();

app.use(express.json());

// ✅ Allow both local and Render front-end origins
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://hfts-frontend.onrender.com",
    ],
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use("/api/simulations", simulationsRouter);
app.use("/api/interactions", interactionsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/auth", authRouter);

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
