const POLARIS_SVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:220px">
  <!-- Sucher-Okular Rahmen -->
  <circle cx="100" cy="100" r="94" fill="#050510" stroke="#3d1515" stroke-width="2"/>
  <!-- Fadenkreuz -->
  <line x1="100" y1="10" x2="100" y2="190" stroke="#3d1515" stroke-width="0.8" stroke-dasharray="4,4"/>
  <line x1="10" y1="100" x2="190" y2="100" stroke="#3d1515" stroke-width="0.8" stroke-dasharray="4,4"/>
  <!-- Polarstern (α UMi) – hell, leicht versetzt vom echten Pol -->
  <circle cx="109" cy="87" r="5" fill="#FFE0A0"/>
  <circle cx="109" cy="87" r="8" fill="none" stroke="#FF6666" stroke-width="0.8" opacity="0.5"/>
  <text x="118" y="83" fill="#FF6666" font-size="9" font-family="monospace">Polaris</text>
  <!-- Kochab (β UMi) -->
  <circle cx="68" cy="62" r="3" fill="#AAAAFF"/>
  <text x="55" y="57" fill="#663333" font-size="8" font-family="monospace">Kochab</text>
  <!-- Pherkad (γ UMi) -->
  <circle cx="55" cy="75" r="2.5" fill="#AAAAFF"/>
  <!-- Yildun (δ UMi) -->
  <circle cx="130" cy="70" r="2" fill="#AAAAAA"/>
  <!-- Eta UMi -->
  <circle cx="145" cy="115" r="1.8" fill="#AAAAAA"/>
  <!-- Zeta UMi -->
  <circle cx="130" cy="130" r="2" fill="#AAAAAA"/>
  <!-- Kleiner-Bär-Linie -->
  <polyline points="109,87 130,70 145,115 130,130 109,87" fill="none" stroke="#3d1515" stroke-width="0.8"/>
  <polyline points="109,87 68,62 55,75" fill="none" stroke="#3d1515" stroke-width="0.8"/>
  <!-- Himmels-Nordpol Marker -->
  <circle cx="100" cy="100" r="3" fill="none" stroke="#FF4444" stroke-width="1.2"/>
  <text x="104" y="98" fill="#FF4444" font-size="7.5" font-family="monospace">NP</text>
</svg>`;

export class Step3PolarAlignment {
  constructor(body: HTMLElement, footer: HTMLElement, onNext: () => void) {
    body.innerHTML = `
      <div class="card">
        <h2>Polausrichtung</h2>
        <p>
          Die Polausrichtung ist der wichtigste Schritt für eine EQ-Montierung.
          Ohne sie dreht die Montierung nicht exakt um die Himmelsachse und
          Sterne wandern aus dem Bildfeld.
        </p>
      </div>

      <div class="card">
        <h3>1. Grobe Ausrichtung (tagsüber)</h3>
        <p>
          Stelle den Elevationswinkel der Montierung auf deinen Breitengrad ein
          (z.B. 48° für München). Die Polachse zeigt dann ungefähr Richtung Norden.
          Richte die Montierung mit einem Kompass nach Nord aus.
        </p>
      </div>

      <div class="card">
        <h3>2. Polarstern im Sucher finden</h3>
        <p>
          Polaris (α Ursae Minoris) steht nur ~0,7° vom Himmelsnordpol entfernt
          und dreht sich in etwa 24 h einmal um ihn herum. Er ist der einzige
          hellere Stern in der Nähe des Nordpols und damit gut erkennbar.
        </p>
        <div class="polaris-figure" style="margin-top:12px">
          ${POLARIS_SVG}
          <p class="polaris-caption">
            Blick durch den Polsucher. Polaris (gelblich) kreist um den
            Himmels-Nordpol (rotes Kreuz). Kochab und Pherkad helfen
            bei der Orientierung.
          </p>
        </div>
      </div>

      <div class="card">
        <h3>3. Polaris im Polsucher zentrieren</h3>
        <p>
          Viele Montierungen haben einen eingebauten Polsucher mit einem
          kleinen Kreis, in den Polaris eingestellt werden soll. Drehe
          Azimut- und Höhenschraube der Montierung, bis Polaris in diesem
          Kreis erscheint.
        </p>
        <p style="margin-top:8px">
          Ohne Polsucher: Zentriere Polaris im Fadenkreuz des Suchers.
          Das reicht für visuelle Beobachtung.
        </p>
      </div>

      <div class="card">
        <h3>4. Feinausrichtung (optional)</h3>
        <p>
          Für Astrofotografie empfiehlt sich die <strong>Drift-Alignment-Methode</strong>:
          Einen Stern nahe dem Himmelsäquator zentrieren, nachführen und die
          Drift in Deklination messen. Durch Justage von Azimut (Ost-Drift)
          und Höhe (Süd-Drift) lässt sich der Fehler iterativ minimieren.
        </p>
      </div>

      <div class="card">
        <h3>GoTo-Montierungen</h3>
        <p>
          Bei motorisierten GoTo-Montierungen: Nach der Polausrichtung das
          Alignment-Programm der Steuerung starten. Dafür werden 2–3 bekannte
          Sterne angefahren und im Okular zentriert – die Steuerung berechnet
          daraus die genaue Ausrichtung. Die nächsten Schritte helfen dir,
          geeignete Alignment-Sterne auszuwählen.
        </p>
      </div>
    `;

    footer.innerHTML = `<button class="btn btn-primary" id="btn-next">Weiter →</button>`;
    document.getElementById('btn-next')?.addEventListener('click', onNext);
  }
}
