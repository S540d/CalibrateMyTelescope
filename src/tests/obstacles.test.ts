import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  emptyProfile,
  presetBalcony,
  presetGarden,
  isBlocked,
  loadProfile,
  saveProfile,
  SECTOR_LABELS,
  ALTITUDE_ZONES,
} from '../lib/obstacles';

describe('emptyProfile', () => {
  it('has 8 sectors', () => {
    expect(emptyProfile()).toHaveLength(8);
  });

  it('each sector has 3 zones', () => {
    emptyProfile().forEach((s) => expect(s).toHaveLength(3));
  });

  it('all cells are false', () => {
    emptyProfile().forEach((s) => s.forEach((z) => expect(z).toBe(false)));
  });
});

describe('SECTOR_LABELS and ALTITUDE_ZONES', () => {
  it('has 8 sector labels', () => {
    expect(SECTOR_LABELS).toHaveLength(8);
  });

  it('has 3 altitude zones', () => {
    expect(ALTITUDE_ZONES).toHaveLength(3);
  });

  it('altitude zones cover 0–90 without gaps', () => {
    expect(ALTITUDE_ZONES[0].min).toBe(0);
    expect(ALTITUDE_ZONES[0].max).toBe(30);
    expect(ALTITUDE_ZONES[1].min).toBe(30);
    expect(ALTITUDE_ZONES[1].max).toBe(60);
    expect(ALTITUDE_ZONES[2].min).toBe(60);
    expect(ALTITUDE_ZONES[2].max).toBe(90);
  });
});

describe('presetBalcony', () => {
  it('blocks N, NW, W at lowest zone', () => {
    const p = presetBalcony();
    expect(p[0][0]).toBe(true);  // N
    expect(p[7][0]).toBe(true);  // NW
    expect(p[6][0]).toBe(true);  // W
    expect(p[3][0]).toBe(false); // SE should be free
  });
});

describe('presetGarden', () => {
  it('blocks all sectors at lowest zone', () => {
    const p = presetGarden();
    p.forEach((sector) => {
      expect(sector[0]).toBe(true);
      expect(sector[1]).toBe(false);
      expect(sector[2]).toBe(false);
    });
  });
});

describe('isBlocked', () => {
  it('returns false on empty profile', () => {
    const p = emptyProfile();
    expect(isBlocked(p, 0, 15)).toBe(false);
  });

  it('detects blocked cell correctly', () => {
    const p = emptyProfile();
    p[0][0] = true; // N, 0–30°
    expect(isBlocked(p, 0, 15)).toBe(true);
    expect(isBlocked(p, 0, 35)).toBe(false); // 30–60° zone, not blocked
  });

  it('maps azimuth to nearest sector', () => {
    const p = emptyProfile();
    p[1][0] = true; // NE=45°, 0–30°
    expect(isBlocked(p, 45, 10)).toBe(true);
    expect(isBlocked(p, 40, 10)).toBe(true);  // rounds to sector 1
    expect(isBlocked(p, 90, 10)).toBe(false); // sector 2 (E), not blocked
  });

  it('handles 360°/0° boundary', () => {
    const p = emptyProfile();
    p[0][0] = true; // N
    expect(isBlocked(p, 360, 10)).toBe(true);
    expect(isBlocked(p, 0, 10)).toBe(true);
  });

  it('uses correct zone for 60–90° altitude', () => {
    const p = emptyProfile();
    p[0][2] = true; // N, 60–90°
    expect(isBlocked(p, 0, 75)).toBe(true);
    expect(isBlocked(p, 0, 45)).toBe(false);
  });
});

describe('loadProfile / saveProfile', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  it('returns empty profile when localStorage is empty', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const p = loadProfile();
    expect(p).toHaveLength(8);
    p.forEach((s) => s.forEach((z) => expect(z).toBe(false)));
  });

  it('restores a saved profile', () => {
    const saved = emptyProfile();
    saved[2][1] = true;
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(saved));
    const p = loadProfile();
    expect(p[2][1]).toBe(true);
  });

  it('returns empty profile on corrupted data', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('{invalid}');
    const p = loadProfile();
    expect(p).toHaveLength(8);
  });

  it('calls setItem on save', () => {
    const p = emptyProfile();
    saveProfile(p);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cmt_horizon_profile',
      JSON.stringify(p)
    );
  });
});
