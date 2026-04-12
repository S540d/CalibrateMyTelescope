# UX-Konzept: Hinderniseingabe am Himmel

> **Feature:** Wizard-Schritt „Hindernisse" in der CalibrateMyTelescope PWA  
> **Status:** Design-Konzept (vor Implementierung)  
> **Kontext:** Mobiler Nutzer, nachts, im Freien, mit Teleskop

---

## Ausgangssituation & Problemanalyse

### Ursprüngliche Idee
„Canvas, drag to draw" in einer Polarkoordinaten-Draufsicht (wie eine Himmelskarte von oben).

### Warum das allein nicht ergonomisch ist

| Problem | Auswirkung |
|---|---|
| **Kognitiver Mismatch** | Der Nutzer steht draußen und schaut radial nach außen — die Draufsicht erfordert eine mentale 90°-Rotation des eigenen Blickfelds |
| **Freies Zeichnen bei Nacht** | Kalte Finger, Handschuhe, rot-gedimmter Screen → ungenaue Strokes, unstrukturiertes Ergebnis |
| **Keine Quantisierung** | Freie Striche sind schwer reproduzierbar und produzieren Datenmüll |
| **Schwacher Undo** | Ein Fehler macht die ganze Eingabe kaputt |
| **Kleiner Bildschirm** | Mobiles Canvas-Zeichnen im Dunkeln ist frustrierend |

---

## Konzept: Horizont-Panorama + Sektor-Tap

Das Kernprinzip: **Eingabe in der natürlichen Perspektive** (Blick zum Horizont), Verifizierung in der Polarperspektive.

### Mentales Modell des Nutzers

```
Was der Nutzer sieht (steht im Garten, schaut rund um sich):

       N
    NW   NE
  W    ?    E      ← Nutzer steht hier und schaut nach außen
    SW   SE
       S

Typische Beschreibung: "Im Norden ist ein 2-stöckiges Haus,
im Osten stehen hohe Bäume, Süden und Westen sind frei."
```

### Horizont-Strip (Panoramaansicht)

Die Kugeloberfläche wird zu einem horizontalen Streifen "aufgerollt":

```
  Höhe
  90° ┤
      │
  60° ┤
      │             ████
  30° ┤   ██████   ██████          ████
      │  ████████ ████████        ██████
   0° ┼──────────────────────────────────── Azimut
      N   NE    E   SE    S   SW    W   NW   N
      0°  45°  90° 135° 180° 225° 270° 315° 360°
```

- **X-Achse:** Azimut 0°–360° (N links und rechts, E=90°, S=180°, W=270°)
- **Y-Achse:** Höhe 0° (Horizont) bis 60° (unterer Zenitbereich)
- **Gefüllte Fläche:** blockierter Bereich (rot/orange im Night-Mode)
- **Geste:** Finger nach oben ziehen = Hindernis höher setzen

**Warum das intuitiver ist:** Der Nutzer dreht sich mental einmal um 360° und malt dabei seine Silhouette — genau das, was er draußen wahrnimmt.

---

## Interaktionsdesign

### Primäre Geste: Sektor-Tap + Vertikaler Drag

Der Himmel wird in **12 Sektoren à 30°** eingeteilt (oder 8 × 45° für noch größere Touch-Targets):

```
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│    │    │    │    │    │    │    │    │    │    │    │    │
│    │    │    │ ▓▓ │ ▓▓ │    │    │    │    │ ▓▓ │    │    │
│    │ ▓▓ │ ▓▓ │ ▓▓ │ ▓▓ │    │    │    │ ▓▓ │ ▓▓ │ ▓▓ │    │
├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
│ N  │NNE │ NE │ENE │ E  │ESE │ SE │SSE │ S  │SSW │ SW │WSW │
└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
  (Sektoren die nach oben gefüllt = Hindernis vorhanden)
```

**Interaktionsflow pro Sektor:**

1. **Tap** auf Sektor → Sektor wird ausgewählt (Highlight)
2. **Vertikal ziehen** im Sektor → Hindernishöhe wird live angepasst
3. **Lass los** → Wert wird gespeichert, Sektor bleibt sichtbar gefärbt
4. **Nochmal tippen** auf gefüllten Sektor → Höhe zurücksetzen (auf 0°)

```
       Tap & drag ↑↓
           │
     ┌─────▼─────┐
     │   ▓▓ 25°  │  ← Höhen-Anzeige beim Ziehen
     │   ▓▓      │
     │   ▓▓      │
     └───────────┘
          NE
```

### Alternative: Popup-Slider bei Tap

Für Nutzer die lieber präzise einstellen als zeichnen:

```
    ┌─────────────────────┐
    │  Nordost (30°–60°)  │
    │                     │
    │  Hindernishöhe:     │
    │  ──●──────────  18° │
    │  0°             60° │
    │                     │
    │  [Löschen]  [OK]    │
    └─────────────────────┘
```

---

## Zweite Ansicht: Polar-Verifizierung

Nach der Eingabe wird dieselbe Information in der bekannten Polarkartenansicht gezeigt — der Nutzer kann seinen Standort "von oben" überprüfen:

```
             N
         ____╱╲____
        /  ██████  \
      NW  ██    ██  NE
      /  ██      ██  \
    W ──██  Frei  ██── E
      \  ██      ██  /
      SW  ██    ██  SE
        \__██████__/
             S

  ▓ = blockierter Bereich (Hindernis)
  Ringe = Höhenlinien (10°, 20°, 30°...)
```

Dieser View ist **schreibgeschützt** in diesem Schritt — dient nur zur Bestätigung. Tap auf "Bearbeiten" → zurück zum Panorama-Strip.

---

## Schnell-Presets

Für den häufigsten Anwendungsfall: Der Nutzer weiß grob, wo Hindernisse sind, will aber nicht jeden Sektor einzeln einstellen.

```
┌─────────────────────────────────────────┐
│  Schnelleingabe                         │
│                                         │
│  [Alles frei]  [Balkon]  [Garten]       │
│                                         │
│  Oder manuell:  ──────────────────────  │
└─────────────────────────────────────────┘
```

| Preset | Beschreibung |
|---|---|
| **Alles frei** | Keine Hindernisse (0° überall) |
| **Balkon** | N/S/W blockiert bis 30° (typische Balkonbrüstung + Wände) |
| **Garten** | Alle Sektoren ~20° (typische Büsche/Zäune rundum) |

Presets sind **Startpunkte** — der Nutzer kann danach manuell anpassen.

---

## Night-Mode UX

Da die App primär nachts genutzt wird, gelten besondere Anforderungen:

### Farbpalette Nacht-Modus

| Element | Farbe | Begründung |
|---|---|---|
| Hintergrund | `#0A0A0A` | Kein Blendeffekt |
| Freier Himmel | `#1a1a2e` (dunkelblau) | Himmel-Assoziation |
| Hindernis-Füllung | `#8B0000` → `#FF4444` | Rot = kein Blenden, Höhe erkennbar |
| Aktiver Sektor | `#CC3300` (heller Rot) | Sichtbar ohne Blenden |
| Text / Labels | `#FF6666` (gedimmtes Rot) | Nachtvisionserhaltend |
| Buttons | `#2d1b1b` mit rotem Border | Gut erkennbar, nicht blendend |

### Touch-Target-Größen

```
Minimum Touch-Target:  44 × 44px  (Apple HIG / Material)
Empfohlen für Nacht:   56 × 56px  (größere Fehlertoleranz)
Sektor-Breite:         ~320px / 12 Sektoren = ~27px  → zu schmal!

Lösung: 8 Sektoren à 45° (je ~40px breit auf 320px-Screen)
oder: 2 Reihen scrollbar (je Reihe 4 Sektoren)
```

**Empfehlung: 8 Hauptsektoren** (N, NE, E, SE, S, SW, W, NW) mit je 45° — gut greifbar, reicht für die meisten Standorte.

---

## Datenmodell

```typescript
interface ObstacleSector {
  azimuthCenter: number;   // Mittelpunkt des Sektors in Grad (0-360)
  azimuthWidth: number;    // Breite des Sektors (z.B. 45°)
  altitudeBlocked: number; // Blockierte Höhe in Grad (0-90)
}

type HorizonProfile = ObstacleSector[];

// Beispiel: 8-Sektor-Profil
const example: HorizonProfile = [
  { azimuthCenter: 0,   azimuthWidth: 45, altitudeBlocked: 30 }, // N: Haus
  { azimuthCenter: 45,  azimuthWidth: 45, altitudeBlocked: 15 }, // NE: Bäume
  { azimuthCenter: 90,  azimuthWidth: 45, altitudeBlocked: 0  }, // E: frei
  { azimuthCenter: 135, azimuthWidth: 45, altitudeBlocked: 0  }, // SE: frei
  { azimuthCenter: 180, azimuthWidth: 45, altitudeBlocked: 5  }, // S: niedriger Zaun
  { azimuthCenter: 225, azimuthWidth: 45, altitudeBlocked: 0  }, // SW: frei
  { azimuthCenter: 270, azimuthWidth: 45, altitudeBlocked: 20 }, // W: Garage
  { azimuthCenter: 315, azimuthWidth: 45, altitudeBlocked: 12 }, // NW: Hecke
];
```

### Persistenz
- Gespeichert in `localStorage` als `JSON.stringify(horizonProfile)`
- Geladen beim App-Start, angezeigt im Wizard-Schritt
- Reset-Button im Schritt verfügbar

---

## Vollständiger Wizard-Flow (Schritt 3: Hindernisse)

```
┌──────────────────────────────────────┐
│ ← Schritt 3 von 5            Überspr │  ← Header
│   Hindernisse am Himmel              │
├──────────────────────────────────────┤
│                                      │
│  Zeige an, was deinen Blick auf den  │  ← Kurze Erklärung
│  Himmel blockiert (Häuser, Bäume...) │
│                                      │
│  [Alles frei] [Balkon] [Garten]      │  ← Presets
│                                      │
├──────────────────────────────────────┤
│                                      │
│   Höhe                               │
│   60°┤   ██                          │
│   30°┤██ ████                        │  ← Panorama-Strip
│    0°┼──────────────────────         │
│      N  NE  E  SE  S  SW  W  NW      │
│                                      │
│  Tippe auf einen Bereich und ziehe   │  ← Hint
│  nach oben um die Höhe einzustellen  │
│                                      │
├──────────────────────────────────────┤
│        [Vorschau auf Karte]          │  ← Toggle zur Polaransicht
├──────────────────────────────────────┤
│             [Weiter →]               │  ← Navigation
└──────────────────────────────────────┘
```

### Zustandsübergänge

```
[Leerer Schritt] 
    → Preset wählen → [Vorausgefüllte Sektoren, anpassbar]
    → Manuell tippen → [Sektor aktiv, Drag möglich]
        → Drag nach oben → [Höhe steigt, Live-Feedback]
        → Loslassen → [Sektor gespeichert]
    → "Vorschau" → [Polaransicht, read-only]
        → "Bearbeiten" → [Zurück zum Panorama-Strip]
    → "Weiter" → [Sterne-Empfehlung mit Hindernissen berücksichtigt]
```

---

## Vergleich: Alt vs. Neu

| Aspekt | Alt (drag-to-draw Polar-Canvas) | Neu (Panorama-Strip + Sektoren) |
|---|---|---|
| Mentales Modell | Vogelperspektive (abstrakt) | Eigene Perspektive (intuitiv) |
| Präzision | Hängt von Finger-Koordination ab | Quantisiert (8 Sektoren × Höhe) |
| Night-Mode | Schwierig (freies Zeichnen) | Einfach (große Touch-Targets) |
| Fehlerkorrekt. | Komplett neu zeichnen | Einzel-Sektor antippen + reset |
| Einstiegshürde | Hoch (wie zeichne ich das richtig?) | Niedrig (Preset als Startpunkt) |
| Datenqualität | Pixelgenaue Vektoren (Overkill) | 8 Winkel × 1 Höhenwert (reicht) |
| Verifikation | Einzige Ansicht | Zusätzlich: Polar-Overlay |

---

## Offene Fragen zur Entscheidung

1. **Granularität:** 8 Sektoren (45°) oder 12 (30°)? → 8 empfohlen für mobile Touch
2. **Maximale erfassbare Höhe:** 60° oder 90°? → 60° reicht, da Sterne nahe am Zenit kaum empfohlen werden
3. **Drag-Geste vs. Slider-Popup:** Direktes Ziehen ist schneller, Popup ist präziser → Direktes Ziehen als Default, Long-Press öffnet Slider
4. **Pol-Ansicht:** Als separater Tab im selben Schritt oder eigener Wizard-Schritt?
