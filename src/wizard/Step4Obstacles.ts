import {
  SECTOR_LABELS,
  ALTITUDE_ZONES,
  emptyProfile,
  presetBalcony,
  presetGarden,
  type HorizonProfile,
} from '../lib/obstacles';
import { buildPolarMapSvg } from '../lib/polarMap';
import { renderNextButton } from '../lib/dom';

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
    onNext: (profile: HorizonProfile) => void,
  ) {
    this.body = body;
    this.footer = footer;
    this.profile = initialProfile.map(s => [...s]);
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
      ${this.showMap ? buildPolarMapSvg(this.profile) : ''}
    `;

    renderNextButton(this.footer, 'Weiter →', () => {
      this.onNext(this.profile);
    });

    this.attachEvents();
  }

  private buildGrid(): string {
    // Zones rendered from top (highest) to bottom (lowest)
    const zones = [...ALTITUDE_ZONES].reverse();
    let html = `<div class="obstacle-grid">`;

    // Header row with sector labels
    html += `<div class="grid-row">
      <div></div>
      ${SECTOR_LABELS.map(l => `<div class="grid-sector-label">${l}</div>`).join('')}
    </div>`;

    for (const zone of zones) {
      const zoneIdx = ALTITUDE_ZONES.indexOf(zone);
      html += `<div class="grid-row">
        <div class="grid-zone-label">${zone.label}</div>
        ${SECTOR_LABELS.map((_, si) => {
          const blocked = this.profile[si][zoneIdx];
          return `<div class="grid-cell ${blocked ? 'blocked' : ''}"
            data-sector="${si}" data-zone="${zoneIdx}"></div>`;
        }).join('')}
      </div>`;
    }

    html += `</div>`;
    return html;
  }

  private attachEvents(): void {
    this.body.querySelector('#preset-free')?.addEventListener('click', () => {
      this.profile = emptyProfile();
      this.render();
    });
    this.body.querySelector('#preset-balcony')?.addEventListener('click', () => {
      this.profile = presetBalcony();
      this.render();
    });
    this.body.querySelector('#preset-garden')?.addEventListener('click', () => {
      this.profile = presetGarden();
      this.render();
    });
    this.body.querySelector('#btn-toggle-map')?.addEventListener('click', () => {
      this.showMap = !this.showMap;
      this.render();
    });

    this.body.querySelectorAll('.grid-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const el = cell as HTMLElement;
        const sector = el.dataset['sector'];
        const zone = el.dataset['zone'];
        if (sector === undefined || zone === undefined) return;
        const si = parseInt(sector);
        const zi = parseInt(zone);
        this.profile[si][zi] = !this.profile[si][zi];
        el.classList.toggle('blocked');
        if (this.showMap) this.render();
      });
    });
  }
}
