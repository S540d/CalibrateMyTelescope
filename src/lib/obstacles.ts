const STORAGE_KEY = 'cmt_horizon_profile';

// 8 azimuth sectors × 3 altitude zones = 24 cells
// Altitude zones: 0–30°, 30–60°, 60–90°
// Azimuth sectors: N=0°, NE=45°, E=90°, SE=135°, S=180°, SW=225°, W=270°, NW=315°

export const SECTOR_LABELS = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
export const SECTOR_AZIMUTHS = [0, 45, 90, 135, 180, 225, 270, 315];
export const ALTITUDE_ZONES = [
  { label: '0–30°',  min: 0,  max: 30 },
  { label: '30–60°', min: 30, max: 60 },
  { label: '60–90°', min: 60, max: 90 },
];

// blocked[sectorIndex][zoneIndex] = true means that altitude zone is blocked
export type HorizonProfile = boolean[][];

export function emptyProfile(): HorizonProfile {
  return SECTOR_AZIMUTHS.map(() => [false, false, false]);
}

export function loadProfile(): HorizonProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProfile();
    const parsed = JSON.parse(raw) as boolean[][];
    if (
      Array.isArray(parsed) &&
      parsed.length === 8 &&
      parsed.every((s) => Array.isArray(s) && s.length === 3)
    ) {
      return parsed;
    }
  } catch {
    // corrupted data — reset
  }
  return emptyProfile();
}

export function saveProfile(profile: HorizonProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function isBlocked(profile: HorizonProfile, azimuth: number, altitude: number): boolean {
  // Find which sector this azimuth falls in (nearest 45° step)
  const sectorIndex = Math.round(((azimuth % 360) + 360) % 360 / 45) % 8;
  const zoneIndex = altitude < 30 ? 0 : altitude < 60 ? 1 : 2;
  return profile[sectorIndex][zoneIndex];
}

export function presetBalcony(): HorizonProfile {
  // N, NW, W blocked at low zone (0–30°)
  const p = emptyProfile();
  [0, 7, 6].forEach((i) => { p[i][0] = true; });
  return p;
}

export function presetGarden(): HorizonProfile {
  // All sectors blocked at lowest zone (typical fence/shrubs)
  const p = emptyProfile();
  p.forEach((sector) => { sector[0] = true; });
  return p;
}
