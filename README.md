# CalibrateMyTelescope

PWA, die schrittweise durch die Teleskop-Kalibrierung führt — inklusive Standort, Polausrichtung, Horizont-Hindernissen und Sternempfehlung.

## Live

[https://s540d.github.io/CalibrateMyTelescope](https://s540d.github.io/CalibrateMyTelescope)

## Tech Stack

| Technology      | Version |
| --------------- | ------- |
| Vite            | ^5.2    |
| TypeScript      | ^5.4    |
| vite-plugin-pwa | ^0.20   |
| Vitest          | ^1.6    |

## Features

- **6-Schritte-Wizard** — Standort, Polausrichtung, Hindernisse, Sternempfehlung, Kalibrierungsanleitung
- **GPS oder manuelle Standorteingabe**
- **Hindernismodell** — 8×3-Polar-Grid mit Presets (Alles frei / Balkon / Garten), persistiert lokal
- **Sternempfehlung** — bis zu 20 Kalibrierungssterne, gefiltert nach Sichtbarkeit und über den Himmel verteilt
- **Offline-fähig** — PWA mit Service Worker, kein Backend nötig
