import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env");
}

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// ✅ 여기부터 임시 체크 (원인 잡고 나면 지워도 됨)
pool
  .query(
    `
    SELECT
      current_database() AS db,
      inet_server_addr() AS addr,
      inet_server_port() AS port,
      (SELECT COUNT(*)::int FROM posts) AS posts_count
    `
  )
  .then(({ rows }) => console.log("DB CHECK:", rows[0], "URL=", env.DATABASE_URL))
  .catch((e) => console.error("DB CHECK FAILED:", e.message));