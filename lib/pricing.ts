import type {
  SpiegelConfig,
  GlasduscheConfig,
  GlastrennwandConfig,
} from "./types";

export function berechneSpiegel(config: SpiegelConfig): number {
  const flaeche = (config.breite * config.hoehe) / 10000; // m²
  let preis = flaeche * 180; // 180 €/m² Basis

  if (config.form === "rund" || config.form === "oval") preis *= 1.15;
  if (config.form === "schraegschnitt") preis *= 1.25;

  const beleuchtungsPreise: Record<SpiegelConfig["beleuchtung"], number> = {
    keine: 0,
    oben: 89,
    "links-rechts": 149,
    umlaufend: 229,
    hinterleuchtet: 349,
  };
  preis += beleuchtungsPreise[config.beleuchtung];

  const rahmenPreise: Record<SpiegelConfig["rahmen"], number> = {
    rahmenlos: 0,
    chrom: 79,
    schwarz: 79,
    gold: 119,
  };
  preis += rahmenPreise[config.rahmen];

  if (config.beschlag) preis += 49;
  if (config.steckdose) preis += 69;

  return Math.round(preis);
}

export function berechneGlasdusche(config: GlasduscheConfig): number {
  const flaeche = (config.breite * config.hoehe) / 10000;
  let preis = flaeche * 320;

  const typAufschlag: Record<GlasduscheConfig["typ"], number> = {
    nische: 0,
    eckeinstieg: 1.1,
    freistehend: 1.2,
    badewannenaufsatz: 0.9,
  };
  preis *= typAufschlag[config.typ] || 1;

  const glasPreise: Record<GlasduscheConfig["glasArt"], number> = {
    klar: 0,
    satiniert: 60,
    parsol: 80,
    bronze: 100,
  };
  preis += glasPreise[config.glasArt];

  if (config.glasStaerke === 8) preis += 80;
  if (config.glasStaerke === 10) preis += 180;

  if (config.nanoBeschichtung) preis += 120;

  return Math.round(preis);
}

export function berechneGlastrennwand(
  config: GlastrennwandConfig
): number {
  const flaeche =
    ((config.breite * config.hoehe) / 10000) * config.anzahlElemente;
  let preis = flaeche * 280;

  const typAufschlag: Record<GlastrennwandConfig["typ"], number> = {
    festverglasung: 1,
    schiebeanlage: 1.3,
    falttuer: 1.25,
    raumteiler: 1.1,
  };
  preis *= typAufschlag[config.typ];

  const glasPreise: Record<GlastrennwandConfig["glasArt"], number> = {
    klar: 0,
    satiniert: 80,
    parsol: 100,
    bronze: 120,
  };
  preis += glasPreise[config.glasArt];

  if (config.glasStaerke === 10) preis += 120;
  if (config.glasStaerke === 12) preis += 280;

  if (config.schallschutz) preis += 350;

  return Math.round(preis);
}
