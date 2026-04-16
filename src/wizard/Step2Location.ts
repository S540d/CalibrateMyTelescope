import { type Location } from '../lib/astronomy';

const LOC_KEY = 'cmt_location';

function loadSaved(): Location | null {
  try {
    const raw = localStorage.getItem(LOC_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Location;
  } catch {
    return null;
  }
}

export class Step2Location {
  private body: HTMLElement;
  private footer: HTMLElement;
  private onNext: (loc: Location) => void;
  private current: Location | null;

  constructor(body: HTMLElement, footer: HTMLElement, onNext: (loc: Location) => void) {
    this.body = body;
    this.footer = footer;
    this.onNext = onNext;
    this.current = loadSaved();
    this.render();
  }

  private render(): void {
    const saved = this.current;
    const statusHtml = saved
      ? `<div class="location-status ok">
           ✓ Gespeichert: ${saved.lat.toFixed(4)}°N / ${saved.lon.toFixed(4)}°O
         </div>`
      : `<div class="location-status err">Noch kein Standort gespeichert</div>`;

    this.body.innerHTML = `
      <div class="card">
        <h2>Standort</h2>
        <p>Dein Standort bestimmt, welche Sterne gerade über dem Horizont stehen.</p>
      </div>
      ${statusHtml}
      <div class="card">
        <h3>GPS automatisch</h3>
        <p>Erfordert Standortfreigabe im Browser.</p>
        <div style="margin-top:10px">
          <button class="btn" id="btn-gps">GPS verwenden</button>
        </div>
        <div id="gps-status" style="margin-top:8px;font-size:0.8rem;color:var(--text-dim)"></div>
      </div>
      <div class="card">
        <h3>Manuelle Eingabe</h3>
        <div class="field">
          <label>Breitengrad (z.B. 48.1374)</label>
          <input id="inp-lat" type="number" step="0.0001" min="-90" max="90"
            placeholder="48.1374" value="${saved ? saved.lat : ''}">
        </div>
        <div class="field" style="margin-top:10px">
          <label>Längengrad (z.B. 11.5755)</label>
          <input id="inp-lon" type="number" step="0.0001" min="-180" max="180"
            placeholder="11.5755" value="${saved ? saved.lon : ''}">
        </div>
        <div style="margin-top:10px">
          <button class="btn" id="btn-manual">Manuell speichern</button>
        </div>
      </div>
    `;

    this.footer.innerHTML = `
      <button class="btn btn-primary" id="btn-next" ${saved ? '' : 'disabled'}>
        Weiter →
      </button>
    `;

    document.getElementById('btn-gps')?.addEventListener('click', () => this.getGps());
    document.getElementById('btn-manual')?.addEventListener('click', () => this.saveManual());
    document.getElementById('btn-next')?.addEventListener('click', () => {
      if (this.current) this.onNext(this.current);
    });
  }

  private getGps(): void {
    const status = document.getElementById('gps-status')!;
    status.textContent = 'Standort wird ermittelt…';

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: Location = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        this.saveLocation(loc);
        status.textContent = '';
        this.render();
      },
      (err) => {
        status.textContent = `Fehler: ${err.message}`;
      },
      { timeout: 10000 }
    );
  }

  private saveManual(): void {
    const lat = parseFloat((document.getElementById('inp-lat') as HTMLInputElement).value);
    const lon = parseFloat((document.getElementById('inp-lon') as HTMLInputElement).value);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert('Ungültige Koordinaten');
      return;
    }
    this.saveLocation({ lat, lon });
    this.render();
  }

  private saveLocation(loc: Location): void {
    this.current = loc;
    localStorage.setItem(LOC_KEY, JSON.stringify(loc));
  }
}
