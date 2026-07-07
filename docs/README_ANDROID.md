# Android (TWA) — Telescope Align

Die App heißt im Play Store **Telescope Align** (Package `com.sven4321.telescopealign`); das
Repo und die GitHub-Pages-URL behalten aus historischen Gründen den Slug `CalibrateMyTelescope`.

Es ist eine reine PWA (kein Backend). Für den Play Store wird sie über eine
**Trusted Web Activity (TWA)** verpackt — ein dünner Android-Wrapper, der die Live-PWA unter
`https://s540d.github.io/CalibrateMyTelescope/` in einer Chrome-Custom-Tab-losen Ansicht öffnet.
Kein WebView, keine Duplizierung von App-Logik: die PWA bleibt die einzige Quelle der Wahrheit.

Erzeugt mit **Bubblewrap** (`@bubblewrap/cli`), dem offiziellen Google-Tool für TWA-Projekte —
gleicher Ansatz wie bei Eisenhauer und EnergyPriceGermany.

## Voraussetzungen

- **JDK 21** — `brew install openjdk@21`
- **Android SDK** — unter `~/Library/Android/sdk` (z. B. via Android Studio installiert)
- **Node.js ≥ 18** (für `npx @bubblewrap/cli`)

```bash
export JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
```

## Projektstruktur

```
Android/
├── app/                    # Gradle-Modul (generiert von Bubblewrap)
├── keystore/
│   ├── telescopealign-release.keystore   # Signing-Key (gitignored)
│   └── .keystore-credentials                    # Passwörter (gitignored, lokal only!)
├── aab-archive/            # Gebaute Release-AABs (gitignored, max. 2 Dateien)
├── twa-manifest.json       # Bubblewrap-Konfiguration (Package-ID, Icons, Farben, …)
├── build.gradle / app/build.gradle
└── gradlew
```

`twa-manifest.json` ist die einzige Stelle, an der App-Metadaten (Name, Package-ID, Icons,
Farben, Version) gepflegt werden. Änderungen dort per `bubblewrap update` ins Gradle-Projekt
übernehmen (siehe unten).

## Keystore

**Package Name:** `com.sven4321.telescopealign`
**Keystore-Format:** PKCS12 — Keystore- und Key-Passwort müssen identisch sein (Java-Limitierung
bei PKCS12; unterschiedliche Passwörter werden von `apksigner` beim Signieren stillschweigend
falsch interpretiert und brechen mit `BadPaddingException` ab).

**Der Keystore existiert bereits lokal.** Falls er fehlt oder neu aufgesetzt werden muss:

```bash
cd Android
KEYSTORE_PASS=$(openssl rand -base64 24 | tr -d '=+/' | cut -c1-20)
echo "KEYSTORE_PASSWORD=$KEYSTORE_PASS" > keystore/.keystore-credentials
echo "KEY_PASSWORD=$KEYSTORE_PASS" >> keystore/.keystore-credentials
chmod 600 keystore/.keystore-credentials

"$JAVA_HOME/bin/keytool" -genkeypair \
  -alias telescopealign \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -keystore keystore/telescopealign-release.keystore \
  -storepass "$KEYSTORE_PASS" -keypass "$KEYSTORE_PASS" \
  -dname "CN=Sven-Uwe Strohkark, OU=, O=, L=, ST=, C=DE"
```

⚠️ **Ohne diesen Keystore können keine Updates im Play Store veröffentlicht werden** — Google
akzeptiert nur Uploads, die mit demselben Key signiert sind wie der ursprüngliche Store-Eintrag.
**Backup ist Pflicht:**

```bash
cp keystore/telescopealign-release.keystore ~/Backups/telescopealign-keystore-$(date +%F).keystore
```

Auch `keystore/.keystore-credentials` sicher hinterlegen (Passwort-Manager) — beide Dateien sind
gitignored und existieren nur lokal.

## SHA-256-Fingerprint (Digital Asset Links)

Nach jedem Keystore-Wechsel den Fingerprint neu auslesen und in
[public/.well-known/assetlinks.json](../public/.well-known/assetlinks.json) eintragen:

```bash
"$JAVA_HOME/bin/keytool" -list -v \
  -keystore keystore/telescopealign-release.keystore \
  -storepass "$KEYSTORE_PASSWORD" \
  -alias telescopealign | grep "SHA256:"
```

`assetlinks.json` muss unter `https://s540d.github.io/CalibrateMyTelescope/.well-known/assetlinks.json`
live sein (wird durch den normalen `main`-Deploy von GitHub Pages mit ausgeliefert — kein
separater Schritt nötig). Ohne korrekten Fingerprint öffnet die App die Website in einer
Adressleiste statt als eigenständige App (TWA-Verifizierung schlägt fehl).

## Lokaler Build

```bash
cd Android
export JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"

source <(cat keystore/.keystore-credentials | sed 's/^/export /')
export BUBBLEWRAP_KEYSTORE_PASSWORD="$KEYSTORE_PASSWORD"
export BUBBLEWRAP_KEY_PASSWORD="$KEY_PASSWORD"

npx @bubblewrap/cli build
```

Das erzeugt:

- `app-release-signed.apk` — signierte APK (z. B. für Sideloading/Tests)
- `app-release-bundle.aab` — signiertes App Bundle (**für Play-Store-Upload**)

Beide Dateien landen im `Android/`-Root und sind gitignored. Nach dem Build das AAB archivieren:

```bash
mkdir -p aab-archive
mv app-release-bundle.aab "aab-archive/TelescopeAlign-vX.Y.Z-vc<versionCode>-$(date +%F).aab"
rm -f app-release-signed.apk*
```

**Retention:** max. 2 AABs in `aab-archive/` (aktuelles Release + ein Vorgänger). Ältere löschen —
der Git-Tag `vX.Y.Z` ist die eigentliche Baseline, ältere Stände lassen sich daraus jederzeit neu
bauen.

### Nur Debug-APK (schneller Test ohne Signing)

```bash
./gradlew assembleDebug
# Output: app/build/outputs/apk/debug/app-debug.apk
```

## Version erhöhen

`twa-manifest.json` → `appVersionCode` (Integer, muss bei jedem Play-Store-Upload steigen) und
`appVersionName` (sichtbare Versionsnummer) anpassen, dann das Gradle-Projekt aus dem Manifest neu
generieren lassen:

```bash
npx @bubblewrap/cli update
```

Das aktualisiert `app/build.gradle` und `AndroidManifest.xml` konsistent aus `twa-manifest.json` —
nicht die Gradle-Dateien von Hand editieren, sonst laufen sie beim nächsten `update` wieder
auseinander.

## Play-Store-Upload

1. Build wie oben, AAB aus `aab-archive/` nehmen
2. [Play Console](https://play.google.com/console/) → Release → Production/Internal Testing →
   neues Release erstellen → AAB hochladen
3. Nach erfolgreichem Rollout: Git-Tag setzen

```bash
git tag v1.0.0
git push origin v1.0.0
```

Store-Listing-Texte, Datenschutz-Angaben und Data-Safety-Formular:
[docs/private/PLAY_STORE_METADATA.md](private/PLAY_STORE_METADATA.md) (lokal, nicht in Git —
enthält Kontaktdaten).

## Troubleshooting

**`BadPaddingException` / "Wrong password?" beim Signieren**
→ Keystore- und Key-Passwort sind unterschiedlich. PKCS12 unterstützt das nicht zuverlässig; neuen
Keystore mit identischem Passwort für beide Werte erzeugen (siehe oben).

**App öffnet mit sichtbarer Browser-Adressleiste statt als "echte" App**
→ Digital Asset Links nicht verifiziert. Prüfen: Fingerprint in `assetlinks.json` korrekt? Datei
unter `/.well-known/assetlinks.json` live erreichbar? Package-Name identisch in `assetlinks.json`
und `twa-manifest.json`?

**Gradle-Daemon-Lock nach Absturz**
→ `pkill -f GradleDaemon`, dann `./gradlew --stop` und Build erneut starten.
