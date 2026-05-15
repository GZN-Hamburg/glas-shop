import type {
  SpiegelConfig,
  SpiegelForm,
  GlasStaerke,
  Kantenbearbeitung,
  GlasduscheConfig,
  GlastrennwandConfig,
  PriceBreakdown,
} from "./types";

// ─── Konstanten ───────────────────────────────────────────────────────────────

const MIN_FLAECHE_M2 = 0.5;
const RUESTKOSTEN = 25;
const BOHRUNGSPREIS = 8.5; // pro Bohrung

/** Grundpreis pro m² je Glasstärke (Spiegel) */
const MATERIAL_PRO_M2: Record<GlasStaerke, number> = {
  3: 45,
  4: 60,
  5: 72,
  6: 88,
  8: 120,
  10: 158,
  12: 205,
};

/** Kantenmeter-Preis je Bearbeitungsart */
const KANTE_PRO_LM: Record<Kantenbearbeitung, number> = {
  SK: 0,
  KM: 4.5,
  KP: 7.0,
  steilfacette: 9.5,
  facette10: 12.0,
  facette25: 16.0,
};

/** Formaufschlag auf den Materialpreis (Verschnitt + Arbeitsaufwand) */
const FORM_AUFSCHLAG: Record<SpiegelForm, number> = {
  rechteckig: 1.0,
  rundbogen: 1.18,
  oval: 1.22,
  rund: 1.12,
  schraegschnitt: 1.28,
  "eckabschnitt-1": 1.1,
  "eckabschnitt-2": 1.15,
  achteck: 1.22,
  halbrund: 1.15,
};

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────

/** Tatsächliche Fläche in m² (ohne Mindestberechnung) */
function getFlaeche(form: SpiegelForm, breite: number, hoehe: number): number {
  const b = breite / 1000;
  const h = hoehe / 1000;
  switch (form) {
    case "rund":       return Math.PI * Math.pow(b / 2, 2);
    case "oval":       return Math.PI * (b / 2) * (h / 2);
    case "halbrund":   return (Math.PI * Math.pow(b / 2, 2)) / 2;
    case "achteck":    return b * h * 0.828; // Achteck ≈ 82,8 % des Rechtecks
    case "schraegschnitt": return b * h * 0.875;
    case "eckabschnitt-1": return b * h - 0.5 * 0.1 * 0.1;
    case "eckabschnitt-2": return b * h - 2 * 0.5 * 0.1 * 0.1;
    default:           return b * h;
  }
}

/** Umfang in laufenden Metern (für Kantenberechnung) */
function getUmfang(form: SpiegelForm, breite: number, hoehe: number): number {
  const b = breite / 1000;
  const h = hoehe / 1000;
  switch (form) {
    case "rund":       return Math.PI * b; // Kreisumfang (breite = Durchmesser)
    case "oval":       return Math.PI * (3 * (b + h) / 2 - Math.sqrt((3 * b + h) * (b + 3 * h)) / 2);
    case "rundbogen":  return 2 * h + b + Math.PI * (b / 2);
    case "halbrund":   return b + Math.PI * (b / 2);
    case "achteck":    return 2 * (b + h) * 0.921;
    case "schraegschnitt": return b + 2 * h + Math.sqrt(b * b + Math.pow(h * 0.25, 2));
    case "eckabschnitt-1": return 2 * (b + h) - 2 * 0.1 + Math.SQRT2 * 0.1;
    case "eckabschnitt-2": return 2 * (b + h) - 4 * 0.1 + 2 * Math.SQRT2 * 0.1;
    default:           return 2 * (b + h);
  }
}

// ─── Spiegel-Preisberechnung (mit Aufschlüsselung) ───────────────────────────

export function berechneSpiegel(config: SpiegelConfig): PriceBreakdown {
  const flaeche = getFlaeche(config.form, config.breite, config.hoehe);
  const berechneteFlaeche = Math.max(flaeche, MIN_FLAECHE_M2);
  const mindestberechnung = flaeche < MIN_FLAECHE_M2;

  const posMaterial =
    berechneteFlaeche *
    MATERIAL_PRO_M2[config.glasStaerke] *
    FORM_AUFSCHLAG[config.form];

  const umfang = getUmfang(config.form, config.breite, config.hoehe);
  const posKante = umfang * KANTE_PRO_LM[config.kante];

  const posBohrungen = config.bohrungen.length * BOHRUNGSPREIS;

  const veredelungsAufschlag: Record<SpiegelConfig["veredelung"], number> = {
    keine: 0,
    satiniert: posMaterial * 0.15,
    getoent: posMaterial * 0.22,
    sandgestrahlt: posMaterial * 0.38 + 48,
  };
  const posVeredelung = veredelungsAufschlag[config.veredelung];

  const posRuestkosten = RUESTKOSTEN;

  const einzelpreis =
    posMaterial + posKante + posBohrungen + posVeredelung + posRuestkosten;
  const gesamt = einzelpreis * config.menge;

  return {
    flaeche,
    berechneteFlaeche,
    mindestberechnung,
    posMaterial,
    posKante,
    posBohrungen,
    posVeredelung,
    posRuestkosten,
    gesamt,
  };
}

// ─── Kantenmatrix-Validierung ─────────────────────────────────────────────────

/** Gibt die erlaubten Kantenbearbeitungen für eine Glasstärke zurück */
export function erlaubteKanten(staerke: GlasStaerke): Kantenbearbeitung[] {
  if (staerke === 3) return ["SK", "KM", "KP"];
  return ["SK", "KM", "KP", "steilfacette", "facette10", "facette25"];
}

// ─── Glasdusche ───────────────────────────────────────────────────────────────

export function berechneGlasdusche(config: GlasduscheConfig): number {
  const flaecheRoh = (config.breite / 1000) * (config.hoehe / 1000);
  const flaeche = Math.max(flaecheRoh, MIN_FLAECHE_M2);
  let preis = flaeche * 320;

  const typAufschlag: Record<GlasduscheConfig["typ"], number> = {
    nische: 1,
    eckeinstieg: 1.1,
    freistehend: 1.2,
    badewannenaufsatz: 0.9,
  };
  preis *= typAufschlag[config.typ];

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

  return Math.round(preis + RUESTKOSTEN);
}

// ─── Glastrennwand ────────────────────────────────────────────────────────────

export function berechneGlastrennwand(config: GlastrennwandConfig): number {
  const flaecheProEl = Math.max(
    (config.breite / 1000) * (config.hoehe / 1000),
    MIN_FLAECHE_M2
  );
  let preis = flaecheProEl * config.anzahlElemente * 280;

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

  return Math.round(preis + RUESTKOSTEN * config.anzahlElemente);
}
