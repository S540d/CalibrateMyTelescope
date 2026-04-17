# CalibrateMyTelescope

PWA die den Nutzer schrittweise durch die Teleskop-Kalibrierung führt.
Primär für den eigenen Gebrauch — Play Store via TWA als Nice-to-have.

## Stack

- **Vite + TypeScript** (kein Framework, Vanilla TS)
- **vite-plugin-pwa** — Service Worker, Offline, Manifest
- **Vitest** — Unit Tests
- **jsdom** — Test-Environment

## Entwicklung

```bash
npm install
npm run dev        # Dev-Server
npm test           # Tests (40 Tests, müssen grün sein)
npm run build      # Produktionsbuild → dist/
npm run validate   # test + build
```

## Architektur

```
src/
├── data/stars.ts          # 50 Kalibrierungssterne (RA/Dec, mag, Notizen)
├── lib/
│   ├── astronomy.ts       # Julian Day, GMST, RA/Dec → Alt/Az
│   ├── obstacles.ts       # Hindernismodell + localStorage
│   └── recommendations.ts # Sternfilter + Sky-Spreading
├── wizard/
│   ├── Wizard.ts          # Shell, Navigation, State
│   ├── Step1Welcome.ts
│   ├── Step2Location.ts   # GPS + manuelle Eingabe
│   ├── Step3PolarAlignment.ts  # Text-Anleitung + Polaris-SVG
│   ├── Step4Obstacles.ts  # 8×3-Grid + Polarkarte (read-only)
│   ├── Step5Stars.ts      # Sternliste (≤20, nach mag sortiert)
│   └── Step6Guide.ts      # Kalibrierungsschritte
├── styles/main.css        # Night-Mode, rote Palette
└── tests/                 # Vitest-Tests
```

## Hindernismodell

- **8 Azimut-Sektoren** (N, NO, O, SO, S, SW, W, NW = je 45°)
- **3 Höhenzonen** (0–30°, 30–60°, 60–90°) → 24 Zellen
- Persistenz: `localStorage` key `cmt_horizon_profile`
- Presets: Alles frei / Balkon / Garten

## Sternempfehlung

- Katalog: 50 Sterne, mag ≤ 3.1
- Filter: Höhe 10–85°, nicht durch Hindernisse verdeckt
- Ausgabe: max. 20 Sterne, über 8 Himmelsrichtungen verteilt, nach Helligkeit sortiert
- Standort-Fallback: 48°N / 11°O (München)

## Scope-Entscheidungen (aus Issue #3)

- **Kein EAS / OTA** — lokaler Build + optionales TWA (bubblewrap)
- **Kein Multi-Profil** — ein Teleskop-Profil pro Gerät
- **Keine Mehrsprachigkeit**
- **Keine Hinderniskarte exportieren**
- **GoTo Phase 1**: Sterne mit Namen + Koordinaten anzeigen, manuelle Eingabe in Steuerung
- **GoTo Phase 2** (offen): Montierungs-Schnittstelle

## CI/CD

- **Security scan** → `scripts/security-check.sh` (Pre-Commit + CI)
  Prüft: API-Keys, Signing-Fingerabdrücke, persönliche Package-Namen, interne Docs
- **Test & Build** → `npm test && npm run build`
- **Deploy** → GitHub Pages (`dist/`) nur auf `main`

## Offene Issues

- **Issue #2** (Security-Scan): ✅ Pre-Commit-Hook + CI-Job implementiert
- **Issue #3** (Feature Scope): ✅ Implementiert
- **PR #4** (Horizon-Strip UX): Nicht umgesetzt — stattdessen Polar-Grid gewählt
- **GoTo Phase 2**: Montierungs-Schnittstelle (offen)
- PWA-Icons: SVG vorhanden, für Play Store TWA werden PNG-Icons (192×192, 512×512) benötigt
