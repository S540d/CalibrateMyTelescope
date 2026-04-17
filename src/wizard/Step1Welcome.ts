export class Step1Welcome {
  constructor(body: HTMLElement, footer: HTMLElement, onNext: () => void) {
    body.innerHTML = `
      <div class="welcome-icon">🔭</div>
      <div class="card">
        <h2>Willkommen</h2>
        <p>
          Diese App führt dich Schritt für Schritt durch die Kalibrierung
          deines Teleskops – von der Polausrichtung bis zur Sternauswahl.
        </p>
      </div>
      <div class="card">
        <h3>Was dich erwartet</h3>
        <p>
          1. Standort bestimmen<br>
          2. Polarstern ausrichten<br>
          3. Hindernisse am Himmel markieren<br>
          4. Passende Kalibrierungssterne auswählen<br>
          5. Teleskop kalibrieren
        </p>
      </div>
      <div class="card">
        <h3>Hinweis</h3>
        <p>
          Die App funktioniert vollständig offline. Deine Hindernisdaten
          werden lokal auf dem Gerät gespeichert.
        </p>
      </div>
    `;

    footer.innerHTML = `<button class="btn btn-primary" id="btn-start">Los geht's →</button>`;
    document.getElementById('btn-start')?.addEventListener('click', onNext);
  }
}
