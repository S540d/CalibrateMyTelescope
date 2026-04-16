import { describe, it, expect } from 'vitest';
import { julianDay, greenwichMeanSiderealTime, raDecToAltAz } from '../lib/astronomy';

describe('julianDay', () => {
  it('returns correct JD for J2000.0 epoch', () => {
    const j2000 = new Date('2000-01-01T12:00:00Z');
    expect(julianDay(j2000)).toBeCloseTo(2451545.0, 3);
  });

  it('handles January and February (M≤2 month adjustment)', () => {
    const jan = new Date('2023-01-15T00:00:00Z');
    const feb = new Date('2023-02-01T00:00:00Z');
    expect(julianDay(jan)).toBeGreaterThan(2459900);
    expect(julianDay(feb)).toBeGreaterThan(julianDay(jan));
  });

  it('returns increasing values for later dates', () => {
    const d1 = new Date('2024-03-01T00:00:00Z');
    const d2 = new Date('2024-03-02T00:00:00Z');
    expect(julianDay(d2) - julianDay(d1)).toBeCloseTo(1.0, 5);
  });
});

describe('greenwichMeanSiderealTime', () => {
  it('returns value in range 0–360', () => {
    const jd = julianDay(new Date('2024-06-15T22:00:00Z'));
    const gmst = greenwichMeanSiderealTime(jd);
    expect(gmst).toBeGreaterThanOrEqual(0);
    expect(gmst).toBeLessThan(360);
  });
});

describe('raDecToAltAz', () => {
  const location = { lat: 51.5, lon: 0.0 }; // London
  // Vega: RA=18.6157h, Dec=38.783° — circumpolar from London in summer
  const date = new Date('2024-08-01T22:00:00Z');

  it('returns altitude in range -90 to 90', () => {
    const { altitude } = raDecToAltAz(18.6157, 38.783, location, date);
    expect(altitude).toBeGreaterThan(-90);
    expect(altitude).toBeLessThan(90);
  });

  it('returns azimuth in range 0 to 360', () => {
    const { azimuth } = raDecToAltAz(18.6157, 38.783, location, date);
    expect(azimuth).toBeGreaterThanOrEqual(0);
    expect(azimuth).toBeLessThan(360);
  });

  it('Polaris has very high altitude when observed from far north', () => {
    const arctic = { lat: 89.0, lon: 0.0 };
    const { altitude } = raDecToAltAz(2.5302, 89.264, arctic, date);
    expect(altitude).toBeGreaterThan(80);
  });

  it('Polaris is near 51.5° altitude from London', () => {
    const { altitude } = raDecToAltAz(2.5302, 89.264, location, date);
    expect(altitude).toBeGreaterThan(45);
    expect(altitude).toBeLessThan(60);
  });

  it('a star on the southern hemisphere is low from northern latitudes', () => {
    const canopus = { ra: 6.3992, dec: -52.696 };
    const { altitude } = raDecToAltAz(canopus.ra, canopus.dec, location, date);
    // Canopus is never visible from London (lat 51.5°)
    expect(altitude).toBeLessThan(0);
  });
});
