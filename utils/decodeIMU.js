export function decodeIMU(buffer) {
  const view = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );

  let offset = 0;

  const roleId = view.getUint8(offset);
  offset += 1;

  const ts = Number(view.getBigUint64(offset));
  offset += 8;

  const values = [];

  for (let i = 0; i < 9; i++) {
    values.push(view.getFloat32(offset));
    offset += 4;
  }

  const [ax, ay, az, gx, gy, gz, mx, my, mz] = values;

  const ROLE_MAP = {
    1: "left_leg",
    2: "right_leg",
    3: "waist",
    4: "left_hand",
    5: "right_hand",
  };

  return {
    role: ROLE_MAP[roleId],
    ts,
    ax,
    ay,
    az,
    gx,
    gy,
    gz,
    mx,
    my,
    mz,
  };
}
