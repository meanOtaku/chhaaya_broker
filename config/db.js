import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "mqtt_db",
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ✅ retry with counter
export async function connectWithRetry({ retries = 5, delay = 3000 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();

      console.log(`🟢 PostgreSQL connected (attempt ${attempt})`);

      const res = await client.query("SELECT NOW()");
      console.log("🕒 DB time:", res.rows[0].now);

      client.release();
      return; // success → exit function
    } catch (err) {
      console.error(`❌ DB connection failed (attempt ${attempt}/${retries})`);

      if (attempt === retries) {
        console.error("💥 Max retries reached. Exiting...");
        process.exit(1);
      }

      console.log(`⏳ Retrying in ${delay / 1000}s...\n`);
      await sleep(delay);
    }
  }
}

export default pool;
