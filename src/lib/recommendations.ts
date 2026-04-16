import { STARS, type Star } from '../data/stars';
import { raDecToAltAz, type Location } from './astronomy';
import { isBlocked, type HorizonProfile } from './obstacles';

export interface StarResult extends Star {
  altitude: number;
  azimuth: number;
}

const MAX_RESULTS = 20;
const MIN_ALTITUDE = 10;     // degrees — avoid atmospheric distortion near horizon
const MAX_ALTITUDE = 85;     // degrees — near-zenith causes mount tracking issues
const MAX_MAG = 3.1;

export function recommendStars(
  profile: HorizonProfile,
  location: Location,
  date: Date
): StarResult[] {
  const results: StarResult[] = [];

  for (const star of STARS) {
    if (star.mag > MAX_MAG) continue;

    const { altitude, azimuth } = raDecToAltAz(star.ra, star.dec, location, date);

    if (altitude < MIN_ALTITUDE || altitude > MAX_ALTITUDE) continue;
    if (isBlocked(profile, azimuth, altitude)) continue;

    results.push({ ...star, altitude, azimuth });
  }

  // Sort by magnitude (brightest first), then limit
  results.sort((a, b) => a.mag - b.mag);

  // Spread across sky directions to avoid clumping
  return spreadResults(results);
}

function spreadResults(stars: StarResult[]): StarResult[] {
  if (stars.length <= MAX_RESULTS) return stars;

  // Divide sky into 8 sectors and pick best from each
  const buckets: StarResult[][] = Array.from({ length: 8 }, () => []);
  for (const star of stars) {
    const sector = Math.round(((star.azimuth % 360) + 360) % 360 / 45) % 8;
    buckets[sector].push(star);
  }

  const spread: StarResult[] = [];
  let round = 0;
  while (spread.length < MAX_RESULTS) {
    let added = false;
    for (const bucket of buckets) {
      if (bucket[round]) {
        spread.push(bucket[round]);
        added = true;
        if (spread.length >= MAX_RESULTS) break;
      }
    }
    if (!added) break;
    round++;
  }

  return spread.sort((a, b) => a.mag - b.mag);
}

export function formatAzimuth(deg: number): string {
  const dirs = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}
