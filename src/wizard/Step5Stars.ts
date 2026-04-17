import { type HorizonProfile } from '../lib/obstacles';
import { type Location } from '../lib/astronomy';
import { recommendStars, formatAzimuth } from '../lib/recommendations';

export class Step5Stars {
  constructor(
    body: HTMLElement,
    footer: HTMLElement,
    profile: HorizonProfile,
    location: Location | null,
    onNext: () => void
  ) {
    const now = new Date();
    const loc = location ?? { lat: 48.0, lon: 11.0 };
    const stars = recommendStars(profile, loc, now);

    const listHtml =
      stars.length === 0
        ? `<p style="color:var(--text-dim)">Keine geeigneten Sterne gefunden.
            Überprüfe deine Hindernisse oder die Uhrzeit.</p>`
        : stars
            .map(
              (s) => `
              <div class="star-item">
                <div>
                  <div class="star-name">${s.name}</div>
                  <div class="star-bayer">${s.bayer} · ${s.constellation}</div>
                  ${s.note ? `<div class="star-note">${s.note}</div>` : ''}
                </div>
                <div>
                  <div class="star-mag">mag ${s.mag.toFixed(2)}</div>
                  <div class="star-pos">${formatAzimuth(s.azimuth)} ${s.altitude.toFixed(0)}°</div>
                </div>
                <div>
                  <div class="star-coords">RA ${s.ra.toFixed(2)}h</div>
                  <div class="star-coords">Dec ${s.dec.toFixed(1)}°</div>
                </div>
              </div>`
            )
            .join('');

    body.innerHTML = `
      <div class="card">
        <h2>Kalibrierungssterne</h2>
        <p>
          ${stars.length} geeignete Sterne gefunden – sortiert nach Helligkeit.
          ${!location ? '<br><span style="color:var(--text-dim);font-size:0.8rem">Kein Standort angegeben – Sterne für ca. 48°N berechnet.</span>' : ''}
        </p>
      </div>
      <div class="star-list">${listHtml}</div>
    `;

    footer.innerHTML = `<button class="btn btn-primary" id="btn-next">Zur Anleitung →</button>`;
    document.getElementById('btn-next')?.addEventListener('click', onNext);
  }
}
