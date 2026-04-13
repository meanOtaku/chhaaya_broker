const REQUIRED_ROLES = [
  "left_leg",
  "right_leg",
  "waist",
  "left_hand",
  "right_hand",
];

const buffer = new Map();

const TIME_WINDOW = 100;
const TIMEOUT = 200;

export function handleAggregation(data, insertFn) {
  const { ts, role } = data;

  const bucketTs = Math.floor(ts / TIME_WINDOW) * TIME_WINDOW;

  if (!buffer.has(bucketTs)) {
    buffer.set(bucketTs, {
      data: {},
      flushed: false,
      timer: setTimeout(() => flush(bucketTs, insertFn), TIMEOUT),
    });
  }

  const entry = buffer.get(bucketTs);

  if (entry.flushed) return;

  entry.data[role] = data;

  // DEBUG
  // console.log("Roles:", Object.keys(entry.data))

  if (REQUIRED_ROLES.every((r) => entry.data[r])) {
    flush(bucketTs, insertFn);
  }
}

function flush(ts, insertFn) {
  const entry = buffer.get(ts);
  if (!entry) return;

  if (entry.flushed) return;
  entry.flushed = true;

  clearTimeout(entry.timer);

  const row = buildRow(entry.data, ts);

  insertFn(row);

  buffer.delete(ts);
}

function buildRow(data, ts) {
  const row = { ts };

  for (const role of REQUIRED_ROLES) {
    const d = data[role] || {};

    row[`${role}_ax`] = d.ax ?? null;
    row[`${role}_ay`] = d.ay ?? null;
    row[`${role}_az`] = d.az ?? null;

    row[`${role}_gx`] = d.gx ?? null;
    row[`${role}_gy`] = d.gy ?? null;
    row[`${role}_gz`] = d.gz ?? null;

    row[`${role}_mx`] = d.mx ?? null;
    row[`${role}_my`] = d.my ?? null;
    row[`${role}_mz`] = d.mz ?? null;
  }

  return row;
}
