import { describe, it, expect } from 'vitest';
import { recommendStars, formatAzimuth } from '../lib/recommendations';
import { emptyProfile, presetGarden } from '../lib/obstacles';

const MUNICH: { lat: number; lon: number } = { lat: 48.14, lon: 11.58 };
// Summer evening when many stars are up
const SUMMER_NIGHT = new Date('2024-08-01T21:00:00Z');

describe('recommendStars', () => {
  it('returns at most 20 results', () => {
    const results = recommendStars(emptyProfile(), MUNICH, SUMMER_NIGHT);
    expect(results.length).toBeLessThanOrEqual(20);
  });

  it('returns only stars above minimum altitude', () => {
    const results = recommendStars(emptyProfile(), MUNICH, SUMMER_NIGHT);
    results.forEach((s) => expect(s.altitude).toBeGreaterThanOrEqual(10));
  });

  it('returns only stars below maximum altitude', () => {
    const results = recommendStars(emptyProfile(), MUNICH, SUMMER_NIGHT);
    results.forEach((s) => expect(s.altitude).toBeLessThanOrEqual(85));
  });

  it('respects obstacle profile', () => {
    const blocked = presetGarden(); // all sectors blocked at 0–30°
    const resultsBlocked = recommendStars(blocked, MUNICH, SUMMER_NIGHT);
    const resultsFree = recommendStars(emptyProfile(), MUNICH, SUMMER_NIGHT);
    // Blocked profile should return ≤ free results (some low stars filtered)
    expect(resultsBlocked.length).toBeLessThanOrEqual(resultsFree.length);
  });

  it('returns stars sorted by magnitude ascending', () => {
    const results = recommendStars(emptyProfile(), MUNICH, SUMMER_NIGHT);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].mag).toBeGreaterThanOrEqual(results[i - 1].mag);
    }
  });

  it('all returned stars have altitude and azimuth', () => {
    const results = recommendStars(emptyProfile(), MUNICH, SUMMER_NIGHT);
    results.forEach((s) => {
      expect(typeof s.altitude).toBe('number');
      expect(typeof s.azimuth).toBe('number');
    });
  });

  it('returns some stars on a clear night in Munich', () => {
    const results = recommendStars(emptyProfile(), MUNICH, SUMMER_NIGHT);
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('formatAzimuth', () => {
  it('maps 0° to N', () => expect(formatAzimuth(0)).toBe('N'));
  it('maps 45° to NO', () => expect(formatAzimuth(45)).toBe('NO'));
  it('maps 90° to O', () => expect(formatAzimuth(90)).toBe('O'));
  it('maps 180° to S', () => expect(formatAzimuth(180)).toBe('S'));
  it('maps 270° to W', () => expect(formatAzimuth(270)).toBe('W'));
  it('maps 360° to N', () => expect(formatAzimuth(360)).toBe('N'));
  it('handles negative azimuth', () => expect(formatAzimuth(-45)).toBe('NW'));
});
