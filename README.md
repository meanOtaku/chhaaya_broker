CREATE TABLE imu_data (
  ts BIGINT PRIMARY KEY,

  left_leg_ax FLOAT, left_leg_ay FLOAT, left_leg_az FLOAT,
  left_leg_gx FLOAT, left_leg_gy FLOAT, left_leg_gz FLOAT,
  left_leg_mx FLOAT, left_leg_my FLOAT, left_leg_mz FLOAT,

  right_leg_ax FLOAT, right_leg_ay FLOAT, right_leg_az FLOAT,
  right_leg_gx FLOAT, right_leg_gy FLOAT, right_leg_gz FLOAT,
  right_leg_mx FLOAT, right_leg_my FLOAT, right_leg_mz FLOAT,

  waist_ax FLOAT, waist_ay FLOAT, waist_az FLOAT,
  waist_gx FLOAT, waist_gy FLOAT, waist_gz FLOAT,
  waist_mx FLOAT, waist_my FLOAT, waist_mz FLOAT,

  left_hand_ax FLOAT, left_hand_ay FLOAT, left_hand_az FLOAT,
  left_hand_gx FLOAT, left_hand_gy FLOAT, left_hand_gz FLOAT,
  left_hand_mx FLOAT, left_hand_my FLOAT, left_hand_mz FLOAT,

  right_hand_ax FLOAT, right_hand_ay FLOAT, right_hand_az FLOAT,
  right_hand_gx FLOAT, right_hand_gy FLOAT, right_hand_gz FLOAT,
  right_hand_mx FLOAT, right_hand_my FLOAT, right_hand_mz FLOAT
);

CREATE INDEX idx_imu_ts ON imu_data (ts DESC);

TRUNCATE TABLE imu_data;

select * from imu_data;
