export type SpiegelForm =
  | "rechteckig"
  | "rund"
  | "oval"
  | "schraegschnitt";

export type SpiegelBeleuchtung =
  | "keine"
  | "umlaufend"
  | "oben"
  | "links-rechts"
  | "hinterleuchtet";

export type SpiegelRahmen = "rahmenlos" | "chrom" | "schwarz" | "gold";

export interface SpiegelConfig {
  form: SpiegelForm;
  breite: number;
  hoehe: number;
  beleuchtung: SpiegelBeleuchtung;
  rahmen: SpiegelRahmen;
  schraegSchnittWinkel?: number;
  beschlag: boolean;
  steckdose: boolean;
}

export type GlasduscheTyp =
  | "nische"
  | "eckeinstieg"
  | "freistehend"
  | "badewannenaufsatz";

export type GlasArt = "klar" | "satiniert" | "parsol" | "bronze";

export type ProfilFarbe = "silber" | "schwarz" | "weissaluminium" | "profillos";

export interface GlasduscheConfig {
  typ: GlasduscheTyp;
  breite: number;
  hoehe: number;
  glasArt: GlasArt;
  glasStaerke: 6 | 8 | 10;
  profilFarbe: ProfilFarbe;
  tuerBreite?: number;
  nanoBeschichtung: boolean;
}

export type TrennwandTyp =
  | "festverglasung"
  | "schiebeanlage"
  | "falttuer"
  | "raumteiler";

export interface GlastrennwandConfig {
  typ: TrennwandTyp;
  breite: number;
  hoehe: number;
  glasArt: GlasArt;
  glasStaerke: 8 | 10 | 12;
  profilFarbe: ProfilFarbe;
  anzahlElemente: number;
  schallschutz: boolean;
}

export interface CartItem {
  id: string;
  typ: "spiegel" | "glasdusche" | "glastrennwand";
  config: SpiegelConfig | GlasduscheConfig | GlastrennwandConfig;
  preis: number;
  menge: number;
}
