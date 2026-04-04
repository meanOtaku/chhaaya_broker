import pool from "../config/db.js";

export const healthCheck = async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "ok",
      dbTime: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ error: "DB connection failed" });
  }
};

export const health = async (req, res) => {
  res.send("active : HTTP + WS + TCP MQTT Broker 🚀");
};

export default { health, healthCheck };
