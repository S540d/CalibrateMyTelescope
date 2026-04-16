export interface AltAz {
  altitude: number;  // degrees above horizon
  azimuth: number;   // degrees from North, clockwise
}

export interface Location {
  lat: number;  // degrees
  lon: number;  // degrees
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function julianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400;

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const my = m <= 2 ? y - 1 : y;
  const mm = m <= 2 ? m + 12 : m;

  return Math.floor(365.25 * (my + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + B - 1524.5;
}

export function greenwichMeanSiderealTime(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545) +
    T * T * 0.000387933 -
    (T * T * T) / 38710000;
  gmst = ((gmst % 360) + 360) % 360;
  return gmst;
}

export function raDecToAltAz(
  raHours: number,
  decDeg: number,
  location: Location,
  date: Date
): AltAz {
  const jd = julianDay(date);
  const gmst = greenwichMeanSiderealTime(jd);
  const lst = ((gmst + location.lon + 360) % 360) / 15; // local sidereal time in hours

  const hourAngle = ((lst - raHours) * 15 + 360) % 360; // in degrees

  const ha = toRad(hourAngle);
  const dec = toRad(decDeg);
  const lat = toRad(location.lat);

  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha);
  const altitude = toDeg(Math.asin(sinAlt));

  const cosAz =
    (Math.sin(dec) - Math.sin(toRad(altitude)) * Math.sin(lat)) /
    (Math.cos(toRad(altitude)) * Math.cos(lat));

  const clampedCosAz = Math.max(-1, Math.min(1, cosAz));
  let azimuth = toDeg(Math.acos(clampedCosAz));

  if (Math.sin(ha) > 0) {
    azimuth = 360 - azimuth;
  }

  return { altitude, azimuth };
}
