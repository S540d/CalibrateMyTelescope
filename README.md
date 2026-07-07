# Telescope Align

> Play-Store-Name: **Telescope Align** · Repo/URL-Slug: `CalibrateMyTelescope` (historisch)

PWA, die schrittweise durch die Teleskop-Ausrichtung führt — inklusive Standort, Polausrichtung, Horizont-Hindernissen und Sternempfehlung.

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

## Android

Als Trusted Web Activity (TWA) für den Play Store verfügbar. Build-Anleitung:
[docs/README_ANDROID.md](docs/README_ANDROID.md).

## Datenschutz

[Datenschutzerklärung](https://s540d.github.io/CalibrateMyTelescope/privacy-policy.html) —
die App erhebt keine Daten, es gibt kein Backend und kein Tracking.

## License

See [LICENSE](LICENSE).
