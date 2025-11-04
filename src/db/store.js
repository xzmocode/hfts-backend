// src/db/store.js
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

let db;

export function initDB() {
  const dataDir = join(process.cwd(), "data");
  if (!existsSync(dataDir)) mkdirSync(dataDir);

  const file = join(dataDir, "db.json");

  const adapter = new JSONFileSync(file);
  db = new LowSync(adapter, { simulations: [], interactions: [], trend: [] });

  db.read();
  if (!db.data) db.data = { simulations: [], interactions: [], trend: [] };
  db.write();
}

export function getDB() {
  if (!db) throw new Error("Database not initialized");
  return db;
}
