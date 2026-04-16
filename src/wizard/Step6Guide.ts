const STEPS = [
  {
    title: 'Polausrichtung prüfen',
    text: 'Stelle sicher, dass Polaris korrekt im Polsucher steht (Schritt 3). ' +
          'Ohne saubere Polausrichtung werden alle weiteren Schritte ungenau.',
  },
  {
    title: 'Montierung einschalten & initialisieren',
    text: 'Schalte die Montierung ein. Bringe sie in die Home-Position ' +
          '(Gegengewicht unten, Teleskop zeigt nach Norden/oben).',
  },
  {
    title: 'Ersten Kalibrierungsstern anfahren',
    text: 'Wähle den hellsten Stern aus der Sternliste (vorheriger Schritt). ' +
          'Fahre ihn mit der GoTo-Steuerung an oder setze die Montierung manuell.',
  },
  {
    title: 'Stern im Okular zentrieren',
    text: 'Verwende das Sucherfernrohr zum Grob-Zentrieren, dann das Hauptokular ' +
          'mit mittlerer Vergrößerung (z.B. 25 mm). Zentriere den Stern mit den ' +
          'Richtungstasten der Steuerung exakt im Fadenkreuz.',
  },
  {
    title: 'Alignment bestätigen',
    text: 'Bestätige in der Steuerung, dass der Stern zentriert ist. ' +
          'Die Steuerung speichert die Abweichung und korrigiert zukünftige GoTo-Fahrten.',
  },
  {
    title: 'Zweiten Stern anfahren (2-Stern-Alignment)',
    text: 'Fahre einen zweiten Stern an, der möglichst weit vom ersten entfernt ' +
          'steht (anderer Sektor des Himmels). Zentriere und bestätige.',
  },
  {
    title: 'Optionales 3-Stern-Alignment',
    text: 'Für bessere Genauigkeit: Einen dritten Stern in einem weiteren Sektor ' +
          'anfahren und bestätigen. Die Steuerung interpoliert nun ein vollständiges ' +
          'Ausrichtungsmodell.',
  },
  {
    title: 'Kalibrierung prüfen',
    text: 'Fahre einen bekannten Stern an und prüfe, ob er im Okular erscheint. ' +
          'Abweichungen > 1° deuten auf eine unpräzise Polausrichtung hin → ' +
          'Polausrichtung verbessern und Alignment wiederholen.',
  },
];

export class Step6Guide {
  constructor(body: HTMLElement, footer: HTMLElement) {
    const stepsHtml = STEPS.map(
      (s, i) => `
        <div class="guide-step">
          <div class="guide-num">${i + 1}</div>
          <div>
            <div class="guide-text" style="color:var(--text-bright);margin-bottom:4px">
              ${s.title}
            </div>
            <div class="guide-text">${s.text}</div>
          </div>
        </div>`
    ).join('');

    body.innerHTML = `
      <div class="card">
        <h2>Kalibrierungsanleitung</h2>
        <p>Folge diesen Schritten, um die Montierung zu kalibrieren.</p>
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:16px">
        ${stepsHtml}
      </div>
      <div class="card">
        <h3>Hinweise zur Genauigkeit</h3>
        <p>
          Für <strong>visuelle Beobachtung</strong> reicht ein 2-Stern-Alignment
          mit grober Polausrichtung.<br><br>
          Für <strong>Astrofotografie</strong> ist eine präzise Polausrichtung
          (Drift-Alignment oder Polmaster) und ein 3-Stern-Alignment empfehlenswert.
          Belichtungszeiten > 30 s erfordern Nachführfehler &lt; 1 Bogensekunde.
        </p>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn btn-primary" id="btn-restart">Von vorne beginnen</button>
    `;

    document.getElementById('btn-restart')?.addEventListener('click', () => {
      window.location.reload();
    });
  }
}
