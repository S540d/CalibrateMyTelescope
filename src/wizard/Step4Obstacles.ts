import {
  SECTOR_LABELS,
  ALTITUDE_ZONES,
  emptyProfile,
  presetBalcony,
  presetGarden,
  type HorizonProfile,
} from '../lib/obstacles';

export class Step4Obstacles {
  private body: HTMLElement;
  private footer: HTMLElement;
  private profile: HorizonProfile;
  private onNext: (profile: HorizonProfile) => void;
  private showMap: boolean = false;

  constructor(
    body: HTMLElement,
    footer: HTMLElement,
    initialProfile: HorizonProfile,
    onNext: (profile: HorizonProfile) => void
  ) {
    this.body = body;
    this.footer = footer;
    this.profile = initialProfile.map((s) => [...s]);
    this.onNext = onNext;
    this.render();
  }

  private render(): void {
    this.body.innerHTML = `
      <div class="card">
        <h2>Hindernisse</h2>
        <p>
          Markiere, welche Himmelsrichtungen durch Gebäude, Bäume oder andere
          Hindernisse blockiert sind. Jede Zelle steht für einen 45°-Sektor
          in einer Höhenzone.
        </p>
      </div>

      <div class="card">
        <h3>Schnellauswahl</h3>
        <div class="btn-group">
          <button class="btn btn-sm" id="preset-free">Alles frei</button>
          <button class="btn btn-sm" id="preset-balcony">Balkon</button>
          <button class="btn btn-sm" id="preset-garden">Garten</button>
        </div>
      </div>

      <div class="card">
        <h3>Manuelle Eingabe</h3>
        <p style="font-size:0.75rem;margin-bottom:10px">
          Tippe eine Zelle an, um sie zu blockieren / freizugeben.
          Rot = blockiert, Dunkelblau = frei.
        </p>
        ${this.buildGrid()}
      </div>

      <div>
        <button class="btn btn-sm" id="btn-toggle-map">
          ${this.showMap ? 'Tabelle anzeigen' : '↗ Polarkarte anzeigen'}
        </button>
      </div>
      ${this.showMap ? this.buildPolarMap() : ''}
    `;

    this.footer.innerHTML = `
      <button class="btn btn-primary" id="btn-next">Weiter →</button>
    `;

    this.attachEvents();
  }

  private buildGrid(): string {
    // Zones rendered from top (highest) to bottom (lowest)
    const zones = [...ALTITUDE_ZONES].reverse();
    let html = `<div class="obstacle-grid">`;

    // Header row with sector labels
    html += `<div class="grid-row">
      <div></div>
      ${SECTOR_LABELS.map((l) => `<div class="grid-sector-label">${l}</div>`).join('')}
    </div>`;

    for (const [zi, zone] of zones.entries()) {
      const zoneIdx = ALTITUDE_ZONES.indexOf(zone);
      html += `<div class="grid-row">
        <div class="grid-zone-label">${zone.label}</div>
        ${SECTOR_LABELS.map((_, si) => {
          const blocked = this.profile[si][zoneIdx];
          return `<div class="grid-cell ${blocked ? 'blocked' : ''}"
            data-sector="${si}" data-zone="${zoneIdx}"></div>`;
        }).join('')}
      </div>`;
      // suppress unused variable warning
      void zi;
    }

    html += `</div>`;
    return html;
  }

  private buildPolarMap(): string {
    const size = 300;
    const cx = size / 2;
    const cy = size / 2;
    const maxR = size / 2 - 10;

    let paths = '';

    for (let si = 0; si < 8; si++) {
      const azCenter = si * 45;
      const azStart = azCenter - 22.5;
      const azEnd = azCenter + 22.5;

      for (let zi = 0; zi < 3; zi++) {
        if (!this.profile[si][zi]) continue;

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
    const rings = [30, 60, 90].map((alt) => {
      const r = maxR * (1 - alt / 90);
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#3d1515" stroke-width="0.8"/>`;
    });

    // Ring labels
    const ringLabels = [0, 30, 60].map((alt) => {
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

  private attachEvents(): void {
    document.getElementById('preset-free')?.addEventListener('click', () => {
      this.profile = emptyProfile();
      this.render();
    });
    document.getElementById('preset-balcony')?.addEventListener('click', () => {
      this.profile = presetBalcony();
      this.render();
    });
    document.getElementById('preset-garden')?.addEventListener('click', () => {
      this.profile = presetGarden();
      this.render();
    });
    document.getElementById('btn-toggle-map')?.addEventListener('click', () => {
      this.showMap = !this.showMap;
      this.render();
    });
    document.getElementById('btn-next')?.addEventListener('click', () => {
      this.onNext(this.profile);
    });

    document.querySelectorAll('.grid-cell').forEach((cell) => {
      cell.addEventListener('click', () => {
        const el = cell as HTMLElement;
        const si = parseInt(el.dataset['sector']!);
        const zi = parseInt(el.dataset['zone']!);
        this.profile[si][zi] = !this.profile[si][zi];
        el.classList.toggle('blocked');
      });
    });
  }
}
