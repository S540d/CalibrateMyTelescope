import { describe, it, expect } from 'vitest';
import { buildPolarMapSvg } from '../lib/polarMap';
import { emptyProfile } from '../lib/obstacles';

describe('buildPolarMapSvg', () => {
  it('renders an svg with no wedge paths for an empty profile', () => {
    const svg = buildPolarMapSvg(emptyProfile());
    expect(svg).toContain('<svg');
    expect(svg).not.toContain('<path');
  });

  it('renders exactly one wedge path per blocked cell', () => {
    const profile = emptyProfile();
    profile[0][0] = true; // N, 0–30°
    profile[4][2] = true; // S, 60–90°
    const svg = buildPolarMapSvg(profile);
    expect(svg.match(/<path/g)).toHaveLength(2);
  });

  it('renders all 8 direction labels', () => {
    const svg = buildPolarMapSvg(emptyProfile());
    ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'].forEach(label => {
      expect(svg).toContain(`>${label}<`);
    });
  });

  it('scales with the given size', () => {
    const svg = buildPolarMapSvg(emptyProfile(), 100);
    expect(svg).toContain('viewBox="0 0 100 100"');
  });
});
