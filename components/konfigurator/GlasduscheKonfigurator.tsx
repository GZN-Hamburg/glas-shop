"use client";

import { useState } from "react";
import { berechneGlasdusche } from "@/lib/pricing";
import type { GlasduscheConfig } from "@/lib/types";

const TYPEN = [
  { id: "nische", label: "Nische" },
  { id: "eckeinstieg", label: "Eckeinstieg" },
  { id: "freistehend", label: "Freistehend" },
  { id: "badewannenaufsatz", label: "Badewanne" },
] as const;

const GLASARTEN = [
  { id: "klar", label: "Klarglas" },
  { id: "satiniert", label: "Satinato" },
  { id: "parsol", label: "Parsol Grau" },
  { id: "bronze", label: "Bronze" },
] as const;

const PROFILE = [
  { id: "silber", label: "Silber" },
  { id: "schwarz", label: "Schwarz" },
  { id: "weissaluminium", label: "Weiß" },
  { id: "profillos", label: "Profillos" },
] as const;

const STAERKEN = [6, 8, 10] as const;

const DEFAULT: GlasduscheConfig = {
  typ: "nische",
  breite: 90,
  hoehe: 200,
  glasArt: "klar",
  glasStaerke: 8,
  profilFarbe: "silber",
  nanoBeschichtung: false,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
      {children}
    </h3>
  );
}

function OptionGrid<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`text-sm px-3 py-2 rounded-lg border font-medium transition-colors text-left ${
            value === o.id
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 text-gray-700 hover:border-gray-400"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NumberInput({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  const s = step ?? 5;
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
        <button
          className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
          onClick={() => onChange(Math.max(min, value - s))}
        >
          −
        </button>
        <input
          type="number"
          className="flex-1 text-center text-sm font-medium py-2 border-x border-gray-200 focus:outline-none"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
        />
        <button
          className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
          onClick={() => onChange(Math.min(max, value + s))}
        >
          +
        </button>
        <span className="px-3 text-xs text-gray-400">{unit}</span>
      </div>
    </div>
  );
}

function DuschePreview({ config }: { config: GlasduscheConfig }) {
  const glassColor =
    config.glasArt === "satiniert"
      ? "rgba(220,230,245,0.85)"
      : config.glasArt === "parsol"
      ? "rgba(140,160,140,0.6)"
      : config.glasArt === "bronze"
      ? "rgba(160,120,80,0.5)"
      : "rgba(200,220,250,0.5)";

  const profileColor =
    config.profilFarbe === "schwarz"
      ? "#1a1a1a"
      : config.profilFarbe === "weissaluminium"
      ? "#e8e8e8"
      : config.profilFarbe === "profillos"
      ? "transparent"
      : "#b0b8c8";

  const borderStyle =
    config.profilFarbe === "profillos" ? "none" : `3px solid ${profileColor}`;

  return (
    <div className="flex items-end justify-center gap-2" style={{ minHeight: 220 }}>
      {config.typ === "eckeinstieg" && (
        <div
          style={{
            width: 40,
            height: 160,
            background: glassColor,
            border: borderStyle,
            borderRadius: 4,
          }}
        />
      )}
      <div
        style={{
          width: 80,
          height: 180,
          background: glassColor,
          border: borderStyle,
          borderRadius: 4,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="text-xs text-blue-400 opacity-70">
          {config.breite}×{config.hoehe}
        </span>
        {config.nanoBeschichtung && (
          <div className="absolute inset-0 rounded pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
        )}
      </div>
      {config.typ === "nische" && (
        <div
          style={{
            width: 40,
            height: 180,
            background: glassColor,
            border: borderStyle,
            borderRadius: 4,
          }}
        />
      )}
    </div>
  );
}

export default function GlasduscheKonfigurator() {
  const [config, setConfig] = useState<GlasduscheConfig>(DEFAULT);
  const [added, setAdded] = useState(false);

  const set = <K extends keyof GlasduscheConfig>(k: K, v: GlasduscheConfig[K]) =>
    setConfig((c) => ({ ...c, [k]: v }));

  const preis = berechneGlasdusche(config);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <div className="space-y-7">
        <div>
          <SectionTitle>Typ</SectionTitle>
          <OptionGrid options={TYPEN} value={config.typ} onChange={(v) => set("typ", v)} />
        </div>

        <div>
          <SectionTitle>Maße</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Breite" unit="cm" value={config.breite} min={60} max={300} onChange={(v) => set("breite", v)} />
            <NumberInput label="Höhe" unit="cm" value={config.hoehe} min={150} max={250} onChange={(v) => set("hoehe", v)} />
          </div>
        </div>

        <div>
          <SectionTitle>Glasart</SectionTitle>
          <OptionGrid options={GLASARTEN} value={config.glasArt} onChange={(v) => set("glasArt", v)} />
        </div>

        <div>
          <SectionTitle>Glasstärke</SectionTitle>
          <div className="flex gap-2">
            {STAERKEN.map((s) => (
              <button
                key={s}
                onClick={() => set("glasStaerke", s)}
                className={`flex-1 text-sm py-2 rounded-lg border font-medium transition-colors ${
                  config.glasStaerke === s
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {s} mm
              </button>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle>Profil</SectionTitle>
          <OptionGrid options={PROFILE} value={config.profilFarbe} onChange={(v) => set("profilFarbe", v)} />
        </div>

        <div>
          <SectionTitle>Extras</SectionTitle>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <input
              type="checkbox"
              checked={config.nanoBeschichtung}
              onChange={(e) => set("nanoBeschichtung", e.target.checked)}
              className="w-4 h-4 accent-gray-900"
            />
            <span>
              <span className="text-sm font-medium text-gray-900">Nano-Beschichtung</span>
              <span className="text-xs text-gray-400 block">Schmutz- und Kalkschutz</span>
            </span>
          </label>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 self-start">
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 p-8">
            <DuschePreview config={config} />
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400">Gesamtpreis (inkl. MwSt.)</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {preis.toLocaleString("de-DE")} €
                </p>
              </div>
              <p className="text-xs text-gray-400 text-right">
                {config.breite} × {config.hoehe} cm<br />
                {config.glasStaerke} mm · {GLASARTEN.find((g) => g.id === config.glasArt)?.label}
              </p>
            </div>
            <button
              onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000); }}
              className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                added ? "bg-green-600 text-white" : "bg-gray-900 text-white hover:bg-gray-700"
              }`}
            >
              {added ? "✓ In den Warenkorb gelegt" : "In den Warenkorb"}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Unverbindliches Angebot · Lieferzeit ca. 4–6 Wochen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
