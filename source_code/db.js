const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://user:password@db:5432/exports_db";

const pool = new Pool({ connectionString });

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.on("error", err => {
  console.error("❌ DB error", err);
});

module.exports = pool;