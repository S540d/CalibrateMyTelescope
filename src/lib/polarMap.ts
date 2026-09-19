import { SECTOR_LABELS, ALTITUDE_ZONES, type HorizonProfile } from './obstacles';

/**
 * Renders the horizon profile as an SVG polar map (N at top, clockwise),
 * with blocked sectors/zones drawn as filled wedges.
 */
export function buildPolarMapSvg(profile: HorizonProfile, size = 300): string {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 10;

  let paths = '';

  for (let si = 0; si < 8; si++) {
    const azCenter = si * 45;
    const azStart = azCenter - 22.5;
    const azEnd = azCenter + 22.5;

    for (let zi = 0; zi < 3; zi++) {
      if (!profile[si][zi]) continue;

      // Altitude zones: 0-30°, 30-60°, 60-90° → radii
      // altitude 90° = center, 0° = edge
      const altMin = ALTITUDE_ZONES[zi].min;
      const altMax = ALTITUDE_ZONES[zi].max;
      const rOuter = maxR * (1 - altMin / 90);
      const rInner = maxR * (1 - altMax / 90);

      // Convert azimuth to SVG angle (N=top, clockwise)
      const a1 = ((azStart - 90) * Math.PI) / 180;
      const a2 = ((azEnd - 90) * Math.PI) / 180;

      const x1o = cx + rOuter * Math.cos(a1);
      const y1o = cy + rOuter * Math.sin(a1);
      const x2o = cx + rOuter * Math.cos(a2);
      const y2o = cy + rOuter * Math.sin(a2);
      const x1i = cx + rInner * Math.cos(a1);
      const y1i = cy + rInner * Math.sin(a1);
      const x2i = cx + rInner * Math.cos(a2);
      const y2i = cy + rInner * Math.sin(a2);

      paths += `<path d="M ${x1o} ${y1o} A ${rOuter} ${rOuter} 0 0 1 ${x2o} ${y2o}
        L ${x2i} ${y2i} A ${rInner} ${rInner} 0 0 0 ${x1i} ${y1i} Z"
        fill="#8B0000" opacity="0.85"/>`;
    }
  }

  // Altitude rings
  const rings = [30, 60, 90].map(alt => {
    const r = maxR * (1 - alt / 90);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#3d1515" stroke-width="0.8"/>`;
  });

  // Ring labels
  const ringLabels = [0, 30, 60].map(alt => {
    const r = maxR * (1 - alt / 90) - 4;
    return `<text x="${cx + 4}" y="${cy - r}" fill="#663333" font-size="8" font-family="monospace">${alt}°</text>`;
  });

  // Direction labels
  const dirLabels = SECTOR_LABELS.map((label, i) => {
    const az = i * 45;
    const angle = ((az - 90) * Math.PI) / 180;
    const r = maxR + 10;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `<text x="${x}" y="${y}" fill="#993333" font-size="9" font-family="monospace"
      text-anchor="middle" dominant-baseline="middle">${label}</text>`;
  });

  return `
    <div class="starmap-wrap">
      <svg class="starmap-canvas" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${cx}" cy="${cy}" r="${maxR}" fill="#0d1021" stroke="#3d1515" stroke-width="1"/>
        ${paths}
        ${rings.join('')}
        ${ringLabels.join('')}
        ${dirLabels.join('')}
      </svg>
    </div>
  `;
}
