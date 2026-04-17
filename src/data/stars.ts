export interface Star {
  name: string;
  bayer: string;
  ra: number;   // Right Ascension in decimal hours (0–24)
  dec: number;  // Declination in decimal degrees (-90–+90)
  mag: number;  // Apparent magnitude
  constellation: string;
  note?: string;
}

export const STARS: Star[] = [
  // mag < 1.0
  { name: 'Sirius',      bayer: 'α CMa', ra:  6.7525, dec: -16.716, mag: -1.46, constellation: 'Großer Hund',    note: 'Hellster Stern am Nachthimmel' },
  { name: 'Canopus',     bayer: 'α Car', ra:  6.3992, dec: -52.696, mag: -0.74, constellation: 'Kiel',           note: 'Sehr hell, südlicher Himmel' },
  { name: 'Arcturus',    bayer: 'α Boo', ra: 14.2610, dec:  19.182, mag: -0.05, constellation: 'Bärenhüter',     note: 'Gut sichtbar Frühjahr/Sommer' },
  { name: 'Vega',        bayer: 'α Lyr', ra: 18.6157, dec:  38.783, mag:  0.03, constellation: 'Leier',          note: 'Teil des Sommerdreieck' },
  { name: 'Capella',     bayer: 'α Aur', ra:  5.2782, dec:  45.998, mag:  0.08, constellation: 'Fuhrmann',       note: 'Zirkumpolar in Mitteleuropa' },
  { name: 'Rigel',       bayer: 'β Ori', ra:  5.2423, dec:  -8.202, mag:  0.13, constellation: 'Orion',          note: 'Blauer Überriese' },
  { name: 'Procyon',     bayer: 'α CMi', ra:  7.6553, dec:   5.225, mag:  0.34, constellation: 'Kleiner Hund',   note: 'Winterhimmel' },
  { name: 'Achernar',    bayer: 'α Eri', ra:  1.6286, dec: -57.237, mag:  0.46, constellation: 'Eridanus',       note: 'Südlicher Himmel' },
  { name: 'Betelgeuse',  bayer: 'α Ori', ra:  5.9195, dec:   7.407, mag:  0.50, constellation: 'Orion',          note: 'Roter Überriese, variabel' },
  { name: 'Hadar',       bayer: 'β Cen', ra: 14.0637, dec: -60.373, mag:  0.61, constellation: 'Kentaur',        note: 'Südlicher Himmel' },
  { name: 'Altair',      bayer: 'α Aql', ra: 19.8464, dec:   8.868, mag:  0.77, constellation: 'Adler',          note: 'Teil des Sommerdreieck' },
  { name: 'Aldebaran',   bayer: 'α Tau', ra:  4.5987, dec:  16.509, mag:  0.85, constellation: 'Stier',          note: 'Roter Riese, Wintersternbild' },
  { name: 'Spica',       bayer: 'α Vir', ra: 13.4199, dec: -11.161, mag:  0.97, constellation: 'Jungfrau',       note: 'Frühlingssternbild' },
  // mag 1.0–1.5
  { name: 'Antares',     bayer: 'α Sco', ra: 16.4901, dec: -26.432, mag:  1.06, constellation: 'Skorpion',       note: 'Roter Überriese, Sommerhimmel' },
  { name: 'Pollux',      bayer: 'β Gem', ra:  7.7553, dec:  28.026, mag:  1.14, constellation: 'Zwillinge',      note: 'Gut für Kalibrierung' },
  { name: 'Fomalhaut',   bayer: 'α PsA', ra: 22.9608, dec: -29.622, mag:  1.16, constellation: 'Südl. Fisch',    note: 'Herbsthimmel' },
  { name: 'Deneb',       bayer: 'α Cyg', ra: 20.6905, dec:  45.280, mag:  1.25, constellation: 'Schwan',         note: 'Teil des Sommerdreieck' },
  { name: 'Regulus',     bayer: 'α Leo', ra: 10.1395, dec:  11.967, mag:  1.35, constellation: 'Löwe',           note: 'Frühlingssternbild' },
  // mag 1.5–2.0
  { name: 'Adhara',      bayer: 'ε CMa', ra:  6.9771, dec: -28.972, mag:  1.50, constellation: 'Großer Hund',    note: 'Winterhimmel' },
  { name: 'Castor',      bayer: 'α Gem', ra:  7.5767, dec:  31.889, mag:  1.57, constellation: 'Zwillinge',      note: 'Visueller Doppelstern, ideal zum Einstellen' },
  { name: 'Shaula',      bayer: 'λ Sco', ra: 17.5601, dec: -37.103, mag:  1.63, constellation: 'Skorpion',       note: 'Sommerhimmel' },
  { name: 'Bellatrix',   bayer: 'γ Ori', ra:  5.4186, dec:   6.350, mag:  1.64, constellation: 'Orion',          note: 'Wintersternbild' },
  { name: 'Alnath',      bayer: 'β Tau', ra:  5.4382, dec:  28.608, mag:  1.65, constellation: 'Stier',          note: 'Nahe der Milchstraße' },
  { name: 'Alnilam',     bayer: 'ε Ori', ra:  5.6036, dec:  -1.202, mag:  1.70, constellation: 'Orion',          note: 'Mittlerer Gürtelstern' },
  { name: 'Alioth',      bayer: 'ε UMa', ra: 12.9004, dec:  55.960, mag:  1.77, constellation: 'Großer Bär',     note: 'Zirkumpolar, Deichsel' },
  { name: 'Kaus Australis', bayer: 'ε Sgr', ra: 18.4029, dec: -34.385, mag: 1.79, constellation: 'Schütze',     note: 'Sommerhimmel' },
  { name: 'Mirfak',      bayer: 'α Per', ra:  3.4053, dec:  49.861, mag:  1.79, constellation: 'Perseus',        note: 'Herbst/Winterhimmel' },
  { name: 'Dubhe',       bayer: 'α UMa', ra: 11.0621, dec:  61.751, mag:  1.79, constellation: 'Großer Bär',     note: 'Zeigerstern zum Polarstern' },
  { name: 'Alkaid',      bayer: 'η UMa', ra: 13.7923, dec:  49.313, mag:  1.86, constellation: 'Großer Bär',     note: 'Ende der Deichsel' },
  { name: 'Menkalinan',  bayer: 'β Aur', ra:  5.9921, dec:  44.947, mag:  1.90, constellation: 'Fuhrmann',       note: 'Nahe Capella' },
  { name: 'Alhena',      bayer: 'γ Gem', ra:  6.6285, dec:  16.399, mag:  1.93, constellation: 'Zwillinge',      note: 'Winterhimmel' },
  { name: 'Peacock',     bayer: 'α Pav', ra: 20.4274, dec: -56.735, mag:  1.94, constellation: 'Pfau',           note: 'Südlicher Himmel' },
  { name: 'Mirzam',      bayer: 'β CMa', ra:  6.3783, dec: -17.956, mag:  1.98, constellation: 'Großer Hund',    note: 'Winterhimmel' },
  { name: 'Alphard',     bayer: 'α Hya', ra:  9.4597, dec:  -8.659, mag:  1.98, constellation: 'Wasserschlange', note: 'Frühlingshimmel' },
  // mag 2.0–2.5
  { name: 'Hamal',       bayer: 'α Ari', ra:  2.1196, dec:  23.462, mag:  2.01, constellation: 'Widder',         note: 'Herbsthimmel' },
  { name: 'Polaris',     bayer: 'α UMi', ra:  2.5302, dec:  89.264, mag:  1.97, constellation: 'Kleiner Bär',    note: 'Polarstern – Nordpol des Himmels' },
  { name: 'Nunki',       bayer: 'σ Sgr', ra: 18.9211, dec: -26.297, mag:  2.05, constellation: 'Schütze',        note: 'Sommerhimmel' },
  { name: 'Denebola',    bayer: 'β Leo', ra: 11.8177, dec:  14.572, mag:  2.14, constellation: 'Löwe',           note: 'Frühlingshimmel' },
  { name: 'Schedar',     bayer: 'α Cas', ra:  0.6751, dec:  56.537, mag:  2.24, constellation: 'Kassiopeia',     note: 'Zirkumpolar, gut für Polausrichtung' },
  { name: 'Alphecca',    bayer: 'α CrB', ra: 15.5782, dec:  26.715, mag:  2.22, constellation: 'Nördl. Krone',   note: 'Frühlings-/Sommerhimmel' },
  { name: 'Almach',      bayer: 'γ And', ra:  2.0650, dec:  42.330, mag:  2.26, constellation: 'Andromeda',      note: 'Enger Farbdoppelstern – ideal zum Einstellen' },
  { name: 'Caph',        bayer: 'β Cas', ra:  0.1531, dec:  59.150, mag:  2.28, constellation: 'Kassiopeia',     note: 'Zirkumpolar' },
  { name: 'Mizar',       bayer: 'ζ UMa', ra: 13.3988, dec:  54.926, mag:  2.23, constellation: 'Großer Bär',     note: 'Bekannter Doppelstern mit Alkor' },
  { name: 'Muphrid',     bayer: 'η Boo', ra: 13.9115, dec:  18.398, mag:  2.68, constellation: 'Bärenhüter',     note: 'Nah bei Arcturus' },
  { name: 'Rasalhague',  bayer: 'α Oph', ra: 17.5822, dec:  12.560, mag:  2.07, constellation: 'Schlangenträger', note: 'Sommerhimmel' },
  { name: 'Eltanin',     bayer: 'γ Dra', ra: 17.9434, dec:  51.489, mag:  2.24, constellation: 'Drache',         note: 'Zirkumpolar in Mitteleuropa' },
  { name: 'Kochab',      bayer: 'β UMi', ra: 14.8449, dec:  74.156, mag:  2.08, constellation: 'Kleiner Bär',    note: 'Zirkumpolar, Teil des Kleinen Bären' },
  { name: 'Zubenelgenubi', bayer: 'α Lib', ra: 14.8480, dec: -16.042, mag: 2.75, constellation: 'Waage',         note: 'Optischer Doppelstern' },
  { name: 'Alderamin',   bayer: 'α Cep', ra: 21.3096, dec:  62.586, mag:  2.45, constellation: 'Kepheus',        note: 'Zirkumpolar' },
  { name: 'Sadalsuud',   bayer: 'β Aqr', ra: 21.5260, dec:  -5.571, mag:  2.90, constellation: 'Wassermann',     note: 'Herbsthimmel' },
  { name: 'Enif',        bayer: 'ε Peg', ra: 21.7364, dec:   9.875, mag:  2.38, constellation: 'Pegasus',        note: 'Herbsthimmel' },
  { name: 'Albireo',     bayer: 'β Cyg', ra: 19.5122, dec:  27.960, mag:  3.08, constellation: 'Schwan',         note: 'Prachtvoll gold-blauer Doppelstern' },
];
