// ─── Spiegel ─────────────────────────────────────────────────────────────────

export type SpiegelForm =
  | "rechteckig"
  | "rundbogen"
  | "oval"
  | "rund"
  | "schraegschnitt"
  | "eckabschnitt-1"
  | "eckabschnitt-2"
  | "achteck"
  | "halbrund";

export type GlasStaerke = 3 | 4 | 5 | 6 | 8 | 10 | 12;

export type Kantenbearbeitung =
  | "SK"           // Schnittkante (roh)
  | "KM"           // Kante matt geschliffen
  | "KP"           // Kante poliert
  | "steilfacette" // Steilfacette
  | "facette10"    // Facette 10 mm
  | "facette25";   // Facette 25 mm

export type Eckentyp = "scharf" | "R5" | "R10" | "R20" | "abgeschraegt";

export type Befestigung =
  | "klebung"        // unsichtbare Klebung
  | "spiegelhalter"  // Spiegelhalter (Edelstahl)
  | "profil"         // Aufhänge-Profil
  | "stockschrauben"; // Stockschrauben

export type Veredelung = "keine" | "satiniert" | "getoent" | "sandgestrahlt";

export interface Bohrung {
  durchmesser: number; // mm (typisch 8–30)
  x: number;           // mm Abstand von linker Kante
  y: number;           // mm Abstand von oberer Kante
}

export interface SpiegelConfig {
  form: SpiegelForm;
  breite: number;        // mm, 300–2200
  hoehe: number;         // mm, 300–2200
  glasStaerke: GlasStaerke;
  kante: Kantenbearbeitung;
  ecken: Eckentyp;
  veredelung: Veredelung;
  befestigung: Befestigung;
  bohrungen: Bohrung[];
  menge: number;
}

export interface PriceBreakdown {
  flaeche: number;            // tatsächliche Fläche m²
  berechneteFlaeche: number;  // berechnete Fläche (min. 0,5 m²)
  mindestberechnung: boolean; // true wenn Mindestfläche greift
  posMaterial: number;        // Grundmaterial
  posKante: number;           // Kantenmeter
  posBohrungen: number;       // Bohrungen
  posVeredelung: number;      // Veredelung
  posRuestkosten: number;     // Rüstkosten
  gesamt: number;             // Gesamtpreis (inkl. Menge)
}

// ─── Glasdusche ──────────────────────────────────────────────────────────────

export type GlasduscheTyp =
  | "nische"
  | "eckeinstieg"
  | "freistehend"
  | "badewannenaufsatz";

export type GlasArt = "klar" | "satiniert" | "parsol" | "bronze";

export type ProfilFarbe = "silber" | "schwarz" | "weissaluminium" | "profillos";

export interface GlasduscheConfig {
  typ: GlasduscheTyp;
  breite: number;        // mm
  hoehe: number;         // mm
  glasArt: GlasArt;
  glasStaerke: 6 | 8 | 10;
  profilFarbe: ProfilFarbe;
  nanoBeschichtung: boolean;
}

// ─── Glastrennwand ───────────────────────────────────────────────────────────

export type TrennwandTyp =
  | "festverglasung"
  | "schiebeanlage"
  | "falttuer"
  | "raumteiler";

export interface GlastrennwandConfig {
  typ: TrennwandTyp;
  breite: number;        // mm pro Element
  hoehe: number;         // mm
  glasArt: GlasArt;
  glasStaerke: 8 | 10 | 12;
  profilFarbe: ProfilFarbe;
  anzahlElemente: number;
  schallschutz: boolean;
}

// ─── Warenkorb ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  typ: "spiegel" | "glasdusche" | "glastrennwand";
  bezeichnung: string;
  config: SpiegelConfig | GlasduscheConfig | GlastrennwandConfig;
  preis: number;
  menge: number;
}

// ─── Checkout / Adresse ──────────────────────────────────────────────────────

export type Versandart =
  | "palette"       // Standardpalette (€ 89)
  | "sondertransport" // Sperrgut / Sondertransport (€ 189)
  | "abholung";     // Selbstabholung Hamburg (kostenlos)

export const VERSANDPREISE: Record<Versandart, number> = {
  palette: 89,
  sondertransport: 189,
  abholung: 0,
};

export interface Adresse {
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
  firma?: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  land: string;
}

// ─── Bestellung (für spätere DB-Anbindung) ───────────────────────────────────

export type BestellStatus =
  | "neu"
  | "in_produktion"
  | "versandbereit"
  | "versandt"
  | "geliefert"
  | "storniert";

export interface Bestellung {
  id: string;
  auftragsnummer: string;
  status: BestellStatus;
  createdAt: string;
  lieferadresse: Adresse;
  versandart: Versandart;
  positionen: CartItem[];
  versandkosten: number;
  gesamtBrutto: number;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
}
