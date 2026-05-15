"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, Info } from "lucide-react";
import { berechneSpiegel, erlaubteKanten } from "@/lib/pricing";
import { useCartStore } from "@/lib/store";
import type {
  SpiegelConfig,
  SpiegelForm,
  GlasStaerke,
  Kantenbearbeitung,
  Eckentyp,
  Befestigung,
  Veredelung,
  Bohrung,
  PriceBreakdown,
} from "@/lib/types";

// ─── Konfigurationsdaten ──────────────────────────────────────────────────────

const FORMEN: { id: SpiegelForm; label: string; hint: string }[] = [
  { id: "rechteckig",    label: "Rechteckig",     hint: "Standard-Rechteck" },
  { id: "rundbogen",     label: "Rundbogen",       hint: "Oben halbrund" },
  { id: "oval",          label: "Oval",            hint: "Elliptische Form" },
  { id: "rund",          label: "Rund",            hint: "Vollkreis" },
  { id: "schraegschnitt",label: "Schrägschnitt",   hint: "Eine Ecke diagonal" },
  { id: "eckabschnitt-1",label: "Eckabschnitt 1×", hint: "Eine Ecke abgeschnitten" },
  { id: "eckabschnitt-2",label: "Eckabschnitt 2×", hint: "Zwei Ecken abgeschnitten" },
  { id: "achteck",       label: "Achteck",         hint: "Oktoganale Form" },
  { id: "halbrund",      label: "Halbrund",        hint: "Halbkreis (Breite = Ø)" },
];

const STAERKEN: GlasStaerke[] = [3, 4, 5, 6, 8, 10, 12];

const KANTEN: { id: Kantenbearbeitung; label: string; sub: string }[] = [
  { id: "SK",          label: "SK",          sub: "Schnittkante (roh)" },
  { id: "KM",          label: "KM",          sub: "Matt geschliffen" },
  { id: "KP",          label: "KP",          sub: "Poliert" },
  { id: "steilfacette",label: "Steilfacette",sub: "Steiler Schliff" },
  { id: "facette10",   label: "Facette 10",  sub: "10 mm Facette" },
  { id: "facette25",   label: "Facette 25",  sub: "25 mm Facette" },
];

const ECKEN: { id: Eckentyp; label: string }[] = [
  { id: "scharf",      label: "Scharf" },
  { id: "R5",          label: "R 5" },
  { id: "R10",         label: "R 10" },
  { id: "R20",         label: "R 20" },
  { id: "abgeschraegt",label: "Abgeschrägt" },
];

const VEREDELUNGEN: { id: Veredelung; label: string; sub: string }[] = [
  { id: "keine",        label: "Keine",         sub: "Klarer Spiegel" },
  { id: "satiniert",    label: "Satiniert",      sub: "Mattes Finish" },
  { id: "getoent",      label: "Getönt",         sub: "Bronzeton o. ä." },
  { id: "sandgestrahlt",label: "Sandgestrahlt",  sub: "Muster auf Anfrage" },
];

const BEFESTIGUNGEN: { id: Befestigung; label: string; sub: string }[] = [
  { id: "klebung",       label: "Klebung",        sub: "Unsichtbar an Wand" },
  { id: "spiegelhalter", label: "Spiegelhalter",   sub: "Edelstahl-Halter" },
  { id: "profil",        label: "Aufhänge-Profil", sub: "Für Spiegelwände" },
  { id: "stockschrauben",label: "Stockschrauben",  sub: "Mit Hülse & Abstand" },
];

const DEFAULT: SpiegelConfig = {
  form: "rechteckig",
  breite: 800,
  hoehe: 600,
  glasStaerke: 6,
  kante: "KM",
  ecken: "scharf",
  veredelung: "keine",
  befestigung: "spiegelhalter",
  bohrungen: [],
  menge: 1,
};

const MIN_MM = 300;
const MAX_MM = 2200;

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SectionTitle({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {children}
      </h3>
      {tooltip && (
        <span title={tooltip} className="text-gray-300 cursor-help">
          <Info className="w-3 h-3" />
        </span>
      )}
    </div>
  );
}

function Chip<T extends string>({
  options,
  value,
  onChange,
  disabled,
  cols = 2,
}: {
  options: readonly { id: T; label: string; sub?: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: T[];
  cols?: 2 | 3;
}) {
  return (
    <div className={`grid gap-2 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {options.map((o) => {
        const isDisabled = disabled?.includes(o.id);
        const isActive = value === o.id;
        return (
          <button
            key={o.id}
            disabled={isDisabled}
            onClick={() => onChange(o.id)}
            className={`text-left px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors
              ${isActive ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-700 hover:border-gray-400"}
              ${isDisabled ? "opacity-30 cursor-not-allowed pointer-events-none" : ""}`}
          >
            <span className="block leading-tight">{o.label}</span>
            {o.sub && (
              <span className={`block text-xs mt-0.5 ${isActive ? "text-gray-300" : "text-gray-400"}`}>
                {o.sub}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function MmInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const [raw, setRaw] = useState(String(value));
  const [error, setError] = useState<string | null>(null);

  const commit = (v: string) => {
    const n = parseInt(v, 10);
    if (isNaN(n)) {
      setError("Ungültige Eingabe");
      return;
    }
    if (n < MIN_MM) {
      setError(`Mindestmaß: ${MIN_MM} mm`);
      setRaw(String(MIN_MM));
      onChange(MIN_MM);
      return;
    }
    if (n > MAX_MM) {
      setError(`Maximalmaß: ${MAX_MM} mm`);
      setRaw(String(MAX_MM));
      onChange(MAX_MM);
      return;
    }
    setError(null);
    onChange(n);
  };

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex items-center gap-1">
        <button
          disabled={disabled}
          className="w-8 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
          onClick={() => { const v = Math.max(MIN_MM, value - 10); setRaw(String(v)); onChange(v); setError(null); }}
        >
          −
        </button>
        <div className="relative flex-1">
          <input
            type="number"
            disabled={disabled}
            className={`w-full text-center text-sm font-medium py-2 border rounded-lg focus:outline-none focus:border-gray-500 pr-8
              ${error ? "border-red-400 bg-red-50" : "border-gray-200"} ${disabled ? "opacity-40" : ""}`}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") commit((e.target as HTMLInputElement).value); }}
            min={MIN_MM}
            max={MAX_MM}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            mm
          </span>
        </div>
        <button
          disabled={disabled}
          className="w-8 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
          onClick={() => { const v = Math.min(MAX_MM, value + 10); setRaw(String(v)); onChange(v); setError(null); }}
        >
          +
        </button>
      </div>
      {error ? (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      ) : (
        <p className="text-xs text-gray-400 mt-1">
          {MIN_MM}–{MAX_MM} mm · ±1 mm Fertigungstoleranz
        </p>
      )}
    </div>
  );
}

// ─── SVG-Vorschau ─────────────────────────────────────────────────────────────

function getMirrorPath(
  form: SpiegelForm,
  x: number, y: number,
  w: number, h: number,
  cornerR: number
): string {
  const r = Math.min(cornerR, w / 4, h / 4);
  switch (form) {
    case "rund": {
      const cx = x + w / 2, cy = y + h / 2, rx = w / 2;
      return `M ${cx + rx} ${cy} A ${rx} ${rx} 0 1 1 ${cx + rx - 0.01} ${cy} Z`;
    }
    case "oval": {
      const cx = x + w / 2, cy = y + h / 2;
      return `M ${cx + w / 2} ${cy} A ${w / 2} ${h / 2} 0 1 1 ${cx + w / 2 - 0.01} ${cy} Z`;
    }
    case "rundbogen": {
      const arc = w / 2;
      return `M ${x} ${y + h} L ${x} ${y + arc} A ${arc} ${arc} 0 0 1 ${x + w} ${y + arc} L ${x + w} ${y + h} Z`;
    }
    case "halbrund": {
      const arc = w / 2;
      return `M ${x} ${y + h} L ${x} ${y + arc} A ${arc} ${arc} 0 0 1 ${x + w} ${y + arc} L ${x + w} ${y + h} Z`;
    }
    case "schraegschnitt": {
      const cut = Math.min(w * 0.25, h * 0.28);
      return `M ${x} ${y} L ${x + w - cut} ${y} L ${x + w} ${y + cut} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
    }
    case "eckabschnitt-1": {
      const cut = Math.min(w * 0.18, h * 0.18);
      return `M ${x} ${y} L ${x + w - cut} ${y} L ${x + w} ${y + cut} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
    }
    case "eckabschnitt-2": {
      const cut = Math.min(w * 0.18, h * 0.18);
      return `M ${x + cut} ${y} L ${x + w - cut} ${y} L ${x + w} ${y + cut} L ${x + w} ${y + h - cut} L ${x + w - cut} ${y + h} L ${x + cut} ${y + h} L ${x} ${y + h - cut} L ${x} ${y + cut} Z`;
    }
    case "achteck": {
      const cut = Math.min(w * 0.2, h * 0.2);
      return `M ${x + cut} ${y} L ${x + w - cut} ${y} L ${x + w} ${y + cut} L ${x + w} ${y + h - cut} L ${x + w - cut} ${y + h} L ${x + cut} ${y + h} L ${x} ${y + h - cut} L ${x} ${y + cut} Z`;
    }
    default: { // rechteckig
      if (r === 0) return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
      return `M ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r}
              L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h}
              L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r}
              L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
    }
  }
}

function SpiegelSVG({ config }: { config: SpiegelConfig }) {
  const SVG_W = 320, SVG_H = 264;
  const PAD_LEFT = 16, PAD_TOP = 16, PAD_RIGHT = 36, PAD_BOT = 36;

  const usableW = SVG_W - PAD_LEFT - PAD_RIGHT;
  const usableH = SVG_H - PAD_TOP - PAD_BOT;

  const drawH_raw = config.form === "rund" || config.form === "halbrund"
    ? config.breite : config.hoehe;

  const scale = Math.min(usableW / config.breite, usableH / drawH_raw);
  const drawW = config.breite * scale;
  const drawH = drawH_raw * scale;

  const mx = PAD_LEFT + (usableW - drawW) / 2;
  const my = PAD_TOP + (usableH - drawH) / 2;

  const cornerR = config.ecken === "scharf" ? 0
    : config.ecken === "R5" ? 5 * scale
    : config.ecken === "R10" ? 10 * scale
    : config.ecken === "R20" ? 20 * scale
    : 0;

  const mirrorPath = getMirrorPath(config.form, mx, my, drawW, drawH, cornerR);

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" aria-label="Spiegel-Vorschau">
      <defs>
        <linearGradient id="mirGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="50%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#c7d2fe" />
        </linearGradient>
        <linearGradient id="mirShine" x1="0%" y1="0%" x2="40%" y2="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="mirClip">
          <path d={mirrorPath} />
        </clipPath>
      </defs>

      {/* Spiegelfläche */}
      <path d={mirrorPath} fill="url(#mirGrad)" stroke="#475569" strokeWidth="1.5" />
      <path d={mirrorPath} fill="url(#mirShine)" clipPath="url(#mirClip)" />

      {/* Bohrungen */}
      {config.bohrungen.map((b, i) => {
        const bx = mx + (b.x / config.breite) * drawW;
        const by = my + (b.y / drawH_raw) * drawH;
        const br = Math.max((b.durchmesser / 2) * scale, 4);
        return (
          <g key={i}>
            <circle cx={bx} cy={by} r={br} fill="#94a3b8" fillOpacity="0.25"
              stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
            <text x={bx} y={by + 1} textAnchor="middle" dominantBaseline="middle"
              fontSize="6" fill="#64748b">Ø{b.durchmesser}</text>
          </g>
        );
      })}

      {/* Bemaßung – Breite */}
      {(() => {
        const ly = my + drawH + 14;
        return (
          <g fill="none" stroke="#94a3b8" strokeWidth="1">
            <line x1={mx} y1={my + drawH} x2={mx} y2={ly + 4} />
            <line x1={mx + drawW} y1={my + drawH} x2={mx + drawW} y2={ly + 4} />
            <line x1={mx} y1={ly} x2={mx + drawW} y2={ly}
              markerStart="url(#arr)" markerEnd="url(#arr)" />
            <text x={mx + drawW / 2} y={ly + 11} textAnchor="middle"
              fontSize="9" fill="#64748b" stroke="none" fontWeight="500">
              {config.breite} mm
            </text>
          </g>
        );
      })()}

      {/* Bemaßung – Höhe (nur wenn nicht rund) */}
      {config.form !== "rund" && (() => {
        const lx = mx + drawW + 14;
        return (
          <g fill="none" stroke="#94a3b8" strokeWidth="1">
            <line x1={mx + drawW} y1={my} x2={lx + 4} y2={my} />
            <line x1={mx + drawW} y1={my + drawH} x2={lx + 4} y2={my + drawH} />
            <line x1={lx} y1={my} x2={lx} y2={my + drawH} />
            <text
              x={lx + 10} y={my + drawH / 2}
              textAnchor="middle" fontSize="9" fill="#64748b"
              stroke="none" fontWeight="500"
              transform={`rotate(90, ${lx + 10}, ${my + drawH / 2})`}
            >
              {config.form === "halbrund" ? `${Math.round(config.breite / 2)} mm` : `${config.hoehe} mm`}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

// ─── Preisaufschlüsselung ─────────────────────────────────────────────────────

function PricePanel({
  bd,
  onAddToCart,
  added,
}: {
  bd: PriceBreakdown;
  onAddToCart: () => void;
  added: boolean;
}) {
  const fmt = (n: number) =>
    n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rows = [
    { label: "Material", val: bd.posMaterial },
    { label: "Kantenbearbeitung", val: bd.posKante },
    ...(bd.posBohrungen > 0 ? [{ label: "Bohrungen", val: bd.posBohrungen }] : []),
    ...(bd.posVeredelung > 0 ? [{ label: "Veredelung", val: bd.posVeredelung }] : []),
    { label: "Rüstkosten", val: bd.posRuestkosten },
  ];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-5 space-y-4">
        {/* Flächen-Info */}
        <div className="text-xs text-gray-500 space-y-0.5">
          <div className="flex justify-between">
            <span>Tatsächliche Fläche</span>
            <span>{bd.flaeche.toFixed(4)} m²</span>
          </div>
          <div className={`flex justify-between font-medium ${bd.mindestberechnung ? "text-amber-600" : "text-gray-700"}`}>
            <span>Berechnete Fläche{bd.mindestberechnung ? " (Mindestberechnung)" : ""}</span>
            <span>{bd.berechneteFlaeche.toFixed(2)} m²</span>
          </div>
          {bd.mindestberechnung && (
            <p className="text-amber-600 text-xs mt-1">
              Mindestberechnung 0,5 m² – kleinere Maße werden zum Mindestpreis gefertigt.
            </p>
          )}
        </div>

        {/* Preiszeilen */}
        <div className="space-y-1.5 border-t border-gray-100 pt-3">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between text-sm text-gray-600">
              <span>{r.label}</span>
              <span>{fmt(r.val)} €</span>
            </div>
          ))}
        </div>

        {/* Gesamt */}
        <div className="flex items-end justify-between border-t border-gray-200 pt-3">
          <div>
            <p className="text-xs text-gray-400">Gesamt inkl. 19% MwSt.</p>
            <p className="text-2xl font-semibold text-gray-900">
              {fmt(bd.gesamt)} €
            </p>
          </div>
          <p className="text-xs text-gray-400 text-right">
            Lieferzeit ca.<br />8–12 Arbeitstage
          </p>
        </div>

        <button
          onClick={onAddToCart}
          className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
            added
              ? "bg-green-600 text-white"
              : "bg-gray-900 text-white hover:bg-gray-700"
          }`}
        >
          {added ? "✓ In den Warenkorb gelegt" : "In den Warenkorb"}
        </button>
        <p className="text-xs text-gray-400 text-center">
          Unverbindliches Angebot · ±1 mm Fertigungstoleranz
        </p>
      </div>
    </div>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

export default function SpiegelKonfigurator() {
  const [config, setConfig] = useState<SpiegelConfig>(DEFAULT);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);

  const set = useCallback(
    <K extends keyof SpiegelConfig>(k: K, v: SpiegelConfig[K]) =>
      setConfig((c) => {
        const next = { ...c, [k]: v };
        // Kantenmatrix: wenn neue Stärke die aktuelle Kante nicht erlaubt → reset
        if (k === "glasStaerke") {
          const allowed = erlaubteKanten(v as GlasStaerke);
          if (!allowed.includes(next.kante)) {
            next.kante = allowed[1] ?? "SK"; // KM als Standard
          }
        }
        // Runde/Halbrunde Form → Ecken egal, kein Höhen-Input
        if (k === "form" && (v === "rund" || v === "halbrund")) {
          next.ecken = "scharf";
        }
        return next;
      }),
    []
  );

  const addBohrung = () => {
    if (config.bohrungen.length >= 8) return;
    const newB: Bohrung = {
      durchmesser: 8,
      x: Math.round(config.breite / 2),
      y: Math.round((config.form === "rund" ? config.breite : config.hoehe) / 2),
    };
    set("bohrungen", [...config.bohrungen, newB]);
  };

  const removeBohrung = (i: number) =>
    set("bohrungen", config.bohrungen.filter((_, idx) => idx !== i));

  const updateBohrung = (i: number, field: keyof Bohrung, v: number) =>
    set(
      "bohrungen",
      config.bohrungen.map((b, idx) => (idx === i ? { ...b, [field]: v } : b))
    );

  const breakdown = berechneSpiegel(config);

  const isRound = config.form === "rund" || config.form === "halbrund";
  const displayH = isRound ? config.breite : config.hoehe;
  const erlaubt = erlaubteKanten(config.glasStaerke);
  const disabledKanten = (["SK", "KM", "KP", "steilfacette", "facette10", "facette25"] as Kantenbearbeitung[])
    .filter((k) => !erlaubt.includes(k));

  const handleAddToCart = () => {
    addToCart({
      typ: "spiegel",
      bezeichnung: `Spiegel ${config.form} ${config.breite}×${displayH} mm`,
      config,
      preis: breakdown.gesamt,
      menge: config.menge,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 max-w-5xl mx-auto">
      {/* ── Linke Spalte: Optionen ── */}
      <div className="space-y-8">

        {/* Form */}
        <div>
          <SectionTitle tooltip="Form beeinflusst Bearbeitung und Preis">Form</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {FORMEN.map((f) => (
              <button
                key={f.id}
                onClick={() => set("form", f.id)}
                title={f.hint}
                className={`text-left px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors
                  ${config.form === f.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-400"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Maße */}
        <div>
          <SectionTitle tooltip="Mindestmaß 300 mm · Maximalmaß 2.200 mm">Maße</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <MmInput
              label={isRound ? "Durchmesser" : "Breite"}
              value={config.breite}
              onChange={(v) => set("breite", v)}
            />
            <MmInput
              label="Höhe"
              value={config.hoehe}
              onChange={(v) => set("hoehe", v)}
              disabled={isRound}
            />
          </div>
          {/* Menge */}
          <div className="mt-3 flex items-center gap-3">
            <label className="text-xs text-gray-500">Menge</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 text-sm"
                onClick={() => set("menge", Math.max(1, config.menge - 1))}
              >−</button>
              <span className="px-4 text-sm font-medium border-x border-gray-200">
                {config.menge}
              </span>
              <button
                className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 text-sm"
                onClick={() => set("menge", Math.min(50, config.menge + 1))}
              >+</button>
            </div>
            {config.menge > 1 && (
              <span className="text-xs text-blue-600 font-medium">
                Staffelpreis auf Anfrage ab 5 Stück
              </span>
            )}
          </div>
        </div>

        {/* Glasstärke */}
        <div>
          <SectionTitle>Glasstärke</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {STAERKEN.map((s) => (
              <button
                key={s}
                onClick={() => set("glasStaerke", s)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                  ${config.glasStaerke === s
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-400"}`}
              >
                {s} mm
              </button>
            ))}
          </div>
          {config.glasStaerke === 3 && (
            <p className="text-xs text-amber-600 mt-2">
              3 mm: nur Schnittkante, KM und KP verfügbar.
            </p>
          )}
        </div>

        {/* Kantenbearbeitung */}
        <div>
          <SectionTitle tooltip="Matrix: 3 mm erlaubt nur SK/KM/KP">Kantenbearbeitung</SectionTitle>
          <Chip
            options={KANTEN}
            value={config.kante}
            onChange={(v) => set("kante", v)}
            disabled={disabledKanten}
          />
        </div>

        {/* Ecken */}
        {!isRound && (
          <div>
            <SectionTitle>Ecken</SectionTitle>
            <Chip options={ECKEN} value={config.ecken} onChange={(v) => set("ecken", v as Eckentyp)} cols={3} />
          </div>
        )}

        {/* Veredelung */}
        <div>
          <SectionTitle>Veredelung</SectionTitle>
          <Chip options={VEREDELUNGEN} value={config.veredelung} onChange={(v) => set("veredelung", v as Veredelung)} />
        </div>

        {/* Befestigung */}
        <div>
          <SectionTitle tooltip="Pflichtauswahl – für korrekte Lieferung">
            Befestigung <span className="text-red-400 font-bold">*</span>
          </SectionTitle>
          <Chip options={BEFESTIGUNGEN} value={config.befestigung} onChange={(v) => set("befestigung", v as Befestigung)} />
        </div>

        {/* Bohrungen */}
        <div>
          <SectionTitle tooltip="Bohrungen: mind. 2× Glasstärke Abstand zur Kante">
            Bohrungen ({config.bohrungen.length}/8)
          </SectionTitle>
          <div className="space-y-2">
            {config.bohrungen.map((b, i) => {
              const minAbstand = config.glasStaerke * 2;
              const tooClose =
                b.x < minAbstand ||
                b.y < minAbstand ||
                (config.breite - b.x) < minAbstand ||
                ((isRound ? config.breite : config.hoehe) - b.y) < minAbstand;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-3 border rounded-lg text-sm ${
                    tooClose ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <span className="text-xs text-gray-400 w-5">#{i + 1}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Ø</span>
                    <input
                      type="number"
                      className="w-14 border border-gray-200 rounded px-1.5 py-1 text-xs text-center"
                      value={b.durchmesser}
                      min={6}
                      max={50}
                      onChange={(e) => updateBohrung(i, "durchmesser", Math.max(6, +e.target.value))}
                    />
                    <span className="text-xs text-gray-400">mm</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">X</span>
                    <input
                      type="number"
                      className="w-16 border border-gray-200 rounded px-1.5 py-1 text-xs text-center"
                      value={b.x}
                      min={minAbstand}
                      max={config.breite - minAbstand}
                      onChange={(e) => updateBohrung(i, "x", +e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Y</span>
                    <input
                      type="number"
                      className="w-16 border border-gray-200 rounded px-1.5 py-1 text-xs text-center"
                      value={b.y}
                      min={minAbstand}
                      max={(isRound ? config.breite : config.hoehe) - minAbstand}
                      onChange={(e) => updateBohrung(i, "y", +e.target.value)}
                    />
                  </div>
                  <button
                    className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                    onClick={() => removeBohrung(i)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {tooClose && (
                    <p className="w-full text-xs text-red-500 col-span-full mt-1">
                      Mindestabstand zur Kante: {minAbstand} mm (= 2× Glasstärke)
                    </p>
                  )}
                </div>
              );
            })}
            <button
              onClick={addBohrung}
              disabled={config.bohrungen.length >= 8}
              className="flex items-center gap-2 text-sm text-gray-600 border border-dashed border-gray-300 rounded-lg px-4 py-2.5 hover:border-gray-500 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-full"
            >
              <Plus className="w-4 h-4" /> Bohrung hinzufügen
            </button>
          </div>
        </div>
      </div>

      {/* ── Rechte Spalte: Vorschau + Preis ── */}
      <div className="lg:sticky lg:top-20 self-start">
        {/* Live SVG Preview */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
          <div className="bg-gray-50 p-6">
            <SpiegelSVG config={config} />
          </div>
        </div>

        {/* Preis-Panel */}
        <PricePanel
          bd={breakdown}
          onAddToCart={handleAddToCart}
          added={added}
        />
      </div>
    </div>
  );
}
