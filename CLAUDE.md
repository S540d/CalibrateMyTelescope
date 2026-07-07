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
- **PR #1** (WIP Copilot-Init): ✅ Geschlossen — Inhalt bereits auf `main` umgesetzt
- **PR #4** (Horizon-Strip UX): ✅ Geschlossen — Konzept nicht umgesetzt, stattdessen 8×3-Polar-Grid
- **GoTo Phase 2**: Montierungs-Schnittstelle (offen)
- PWA-Icons: SVG vorhanden, für Play Store TWA werden PNG-Icons (192×192, 512×512) benötigt

<!-- GLOBAL POLICY:START -->

## [GLOBAL POLICY]

> Automatisch synchronisiert aus project-templates (Issue #7). Nicht manuell editieren –
> Änderungen hier werden beim nächsten Sync überschrieben. Quelle anpassen statt lokal.

- PRs immer gegen `testing`, nie direkt gegen `staging` oder `main`
- Merge auf `main` nur mit expliziter schriftlicher Freigabe
- `--delete-branch` nur für Feature-Branches (nie staging/testing)
- **Lokales Branch-Cleanup:** `main` und `testing` NIE löschen — auch nicht beim Bulk-Delete verwaister `[gone]`-Branches. Ein fehlender `origin/main`/`origin/testing` ist ein **wiederherzustellender Defekt** (lokal behalten, nach origin zurückpushen), kein Aufräum-Signal.
- `--no-verify` nur auf explizite Bitte
- **Vor jedem Push: lokale Tests ausführen** (`npm test` bzw. projektspezifischer Test-Befehl) – kein Push ohne grüne lokale Tests
- **Kein Merge bei CI-Fail** – Branch Protection erzwingt das technisch; nie mit `--admin` umgehen außer auf explizite Bitte

## [ANDROID BUILD – PFLICHTREGELN]

- **Git-Tag** nach jedem Play-Store-Upload setzen: `git tag vX.Y.Z && git push origin vX.Y.Z` – der Tag markiert den tatsächlich veröffentlichten Stand und dient als Changelog-Baseline für den nächsten Build
- **EAS Local Build (DrawFromMemory):** Workingdir vor jedem Build leeren: `rm -rf ~/tmp/eas-build && mkdir -p ~/tmp/eas-build` – ein nicht-leeres Verzeichnis bricht den Build sofort ab
- **Disk-Check vor EAS Build:** Skia-Libraries benötigen ~5–8 GB. Bei < 5 GB frei: `npm cache clean --force && rm -rf ~/.npm/_npx` (~13 GB, sicher löschbar)
- **JAVA_HOME** für EAS/Expo-Builds explizit auf Android Studio JBR setzen: `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`
- **Gradle-Lock nach Absturz:** Bei "Cannot lock file hash cache"-Fehler Daemons stoppen: `pkill -f GradleDaemon`, dann Workingdir leeren und neu starten
- **AAB-Archiv:** Gebaute Release-AABs in einem **gitignored** `aab-archive/`-Verzeichnis im Repo-Root ablegen (in `.gitignore` aufnehmen – AABs sind 3–110 MB und gehören nie in die Git-History). Benennung: `<Projekt>-vX.Y.Z-vc<versionCode>-YYYY-MM-DD.aab`. **Retention: max. 2 Dateien** (aktuelles Release + ein Vorgänger für schnelles Rollback); ältere AABs löschen. Der Git-Tag `vX.Y.Z` ist die eigentliche Release-Baseline – ältere AABs lassen sich daraus jederzeit neu bauen.

## [CI – CACHE-CLEANUP]

- **Cache-Cleanup-Workflow** (`.github/workflows/cache-cleanup.yml`) in jedem Repo mit GitHub-Actions-Caches: löscht wöchentlich (So 03:00 UTC) bzw. on-demand alle Action-Caches älter als der jeweils letzte Lauf. GitHub-Limit ist 10 GB pro Repo – ohne Cleanup laufen Build-Caches (node_modules, Gradle, Expo) voll und verdrängen frische Einträge. Vorlage: `cache-cleanup.yml` in project-templates.

<!-- GLOBAL POLICY:END -->
