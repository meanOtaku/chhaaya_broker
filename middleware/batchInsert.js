import pool from "../config/db.js";

/* ===================== CONFIG ===================== */

const batch = [];
const BATCH_SIZE = 50;
const FLUSH_INTERVAL = 100;

setInterval(flushBatch, FLUSH_INTERVAL);

/* ===================== PUBLIC ===================== */

export function queueInsert(row) {
  batch.push(row);

  if (batch.length >= BATCH_SIZE) {
    flushBatch();
  }
}

/* ===================== CORE ===================== */

async function flushBatch() {
  if (batch.length === 0) return;

  const rows = batch.splice(0, batch.length);

  // 🔥 DEDUPLICATE BY TS (CRITICAL)
  const uniqueMap = new Map();

  for (const r of rows) {
    uniqueMap.set(r.ts, {
      ...(uniqueMap.get(r.ts) || {}),
      ...r,
    });
  }

  const uniqueRows = Array.from(uniqueMap.values());

  const values = [];
  const placeholders = [];

  let i = 1;

  for (const r of uniqueRows) {
    placeholders.push(
      `(${Array.from({ length: 46 }, () => `$${i++}`).join(",")})`,
    );

    values.push(
      r.ts,

      // LEFT LEG
      r.left_leg_ax,
      r.left_leg_ay,
      r.left_leg_az,
      r.left_leg_gx,
      r.left_leg_gy,
      r.left_leg_gz,
      r.left_leg_mx,
      r.left_leg_my,
      r.left_leg_mz,

      // RIGHT LEG
      r.right_leg_ax,
      r.right_leg_ay,
      r.right_leg_az,
      r.right_leg_gx,
      r.right_leg_gy,
      r.right_leg_gz,
      r.right_leg_mx,
      r.right_leg_my,
      r.right_leg_mz,

      // WAIST
      r.waist_ax,
      r.waist_ay,
      r.waist_az,
      r.waist_gx,
      r.waist_gy,
      r.waist_gz,
      r.waist_mx,
      r.waist_my,
      r.waist_mz,

      // LEFT HAND
      r.left_hand_ax,
      r.left_hand_ay,
      r.left_hand_az,
      r.left_hand_gx,
      r.left_hand_gy,
      r.left_hand_gz,
      r.left_hand_mx,
      r.left_hand_my,
      r.left_hand_mz,

      // RIGHT HAND
      r.right_hand_ax,
      r.right_hand_ay,
      r.right_hand_az,
      r.right_hand_gx,
      r.right_hand_gy,
      r.right_hand_gz,
      r.right_hand_mx,
      r.right_hand_my,
      r.right_hand_mz,
    );
  }

  try {
    await pool.query(
      `
      INSERT INTO imu_data (
        ts,

        left_leg_ax,left_leg_ay,left_leg_az,left_leg_gx,left_leg_gy,left_leg_gz,left_leg_mx,left_leg_my,left_leg_mz,
        right_leg_ax,right_leg_ay,right_leg_az,right_leg_gx,right_leg_gy,right_leg_gz,right_leg_mx,right_leg_my,right_leg_mz,
        waist_ax,waist_ay,waist_az,waist_gx,waist_gy,waist_gz,waist_mx,waist_my,waist_mz,
        left_hand_ax,left_hand_ay,left_hand_az,left_hand_gx,left_hand_gy,left_hand_gz,left_hand_mx,left_hand_my,left_hand_mz,
        right_hand_ax,right_hand_ay,right_hand_az,right_hand_gx,right_hand_gy,right_hand_gz,right_hand_mx,right_hand_my,right_hand_mz
      )
      VALUES ${placeholders.join(",")}
      ON CONFLICT (ts) DO UPDATE SET

        -- LEFT LEG
        left_leg_ax = COALESCE(EXCLUDED.left_leg_ax, imu_data.left_leg_ax),
        left_leg_ay = COALESCE(EXCLUDED.left_leg_ay, imu_data.left_leg_ay),
        left_leg_az = COALESCE(EXCLUDED.left_leg_az, imu_data.left_leg_az),
        left_leg_gx = COALESCE(EXCLUDED.left_leg_gx, imu_data.left_leg_gx),
        left_leg_gy = COALESCE(EXCLUDED.left_leg_gy, imu_data.left_leg_gy),
        left_leg_gz = COALESCE(EXCLUDED.left_leg_gz, imu_data.left_leg_gz),
        left_leg_mx = COALESCE(EXCLUDED.left_leg_mx, imu_data.left_leg_mx),
        left_leg_my = COALESCE(EXCLUDED.left_leg_my, imu_data.left_leg_my),
        left_leg_mz = COALESCE(EXCLUDED.left_leg_mz, imu_data.left_leg_mz),

        -- RIGHT LEG
        right_leg_ax = COALESCE(EXCLUDED.right_leg_ax, imu_data.right_leg_ax),
        right_leg_ay = COALESCE(EXCLUDED.right_leg_ay, imu_data.right_leg_ay),
        right_leg_az = COALESCE(EXCLUDED.right_leg_az, imu_data.right_leg_az),
        right_leg_gx = COALESCE(EXCLUDED.right_leg_gx, imu_data.right_leg_gx),
        right_leg_gy = COALESCE(EXCLUDED.right_leg_gy, imu_data.right_leg_gy),
        right_leg_gz = COALESCE(EXCLUDED.right_leg_gz, imu_data.right_leg_gz),
        right_leg_mx = COALESCE(EXCLUDED.right_leg_mx, imu_data.right_leg_mx),
        right_leg_my = COALESCE(EXCLUDED.right_leg_my, imu_data.right_leg_my),
        right_leg_mz = COALESCE(EXCLUDED.right_leg_mz, imu_data.right_leg_mz),

        -- WAIST
        waist_ax = COALESCE(EXCLUDED.waist_ax, imu_data.waist_ax),
        waist_ay = COALESCE(EXCLUDED.waist_ay, imu_data.waist_ay),
        waist_az = COALESCE(EXCLUDED.waist_az, imu_data.waist_az),
        waist_gx = COALESCE(EXCLUDED.waist_gx, imu_data.waist_gx),
        waist_gy = COALESCE(EXCLUDED.waist_gy, imu_data.waist_gy),
        waist_gz = COALESCE(EXCLUDED.waist_gz, imu_data.waist_gz),
        waist_mx = COALESCE(EXCLUDED.waist_mx, imu_data.waist_mx),
        waist_my = COALESCE(EXCLUDED.waist_my, imu_data.waist_my),
        waist_mz = COALESCE(EXCLUDED.waist_mz, imu_data.waist_mz),

        -- LEFT HAND
        left_hand_ax = COALESCE(EXCLUDED.left_hand_ax, imu_data.left_hand_ax),
        left_hand_ay = COALESCE(EXCLUDED.left_hand_ay, imu_data.left_hand_ay),
        left_hand_az = COALESCE(EXCLUDED.left_hand_az, imu_data.left_hand_az),
        left_hand_gx = COALESCE(EXCLUDED.left_hand_gx, imu_data.left_hand_gx),
        left_hand_gy = COALESCE(EXCLUDED.left_hand_gy, imu_data.left_hand_gy),
        left_hand_gz = COALESCE(EXCLUDED.left_hand_gz, imu_data.left_hand_gz),
        left_hand_mx = COALESCE(EXCLUDED.left_hand_mx, imu_data.left_hand_mx),
        left_hand_my = COALESCE(EXCLUDED.left_hand_my, imu_data.left_hand_my),
        left_hand_mz = COALESCE(EXCLUDED.left_hand_mz, imu_data.left_hand_mz),

        -- RIGHT HAND
        right_hand_ax = COALESCE(EXCLUDED.right_hand_ax, imu_data.right_hand_ax),
        right_hand_ay = COALESCE(EXCLUDED.right_hand_ay, imu_data.right_hand_ay),
        right_hand_az = COALESCE(EXCLUDED.right_hand_az, imu_data.right_hand_az),
        right_hand_gx = COALESCE(EXCLUDED.right_hand_gx, imu_data.right_hand_gx),
        right_hand_gy = COALESCE(EXCLUDED.right_hand_gy, imu_data.right_hand_gy),
        right_hand_gz = COALESCE(EXCLUDED.right_hand_gz, imu_data.right_hand_gz),
        right_hand_mx = COALESCE(EXCLUDED.right_hand_mx, imu_data.right_hand_mx),
        right_hand_my = COALESCE(EXCLUDED.right_hand_my, imu_data.right_hand_my),
        right_hand_mz = COALESCE(EXCLUDED.right_hand_mz, imu_data.right_hand_mz)
    `,
      values,
    );

    console.log(`✅ Batch inserted ${uniqueRows.length}`);
  } catch (err) {
    console.error("❌ Batch insert failed:", err.message);
  }
}
