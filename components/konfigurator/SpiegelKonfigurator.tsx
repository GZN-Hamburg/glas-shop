"use client";

import { useState } from "react";
import { berechneSpiegel } from "@/lib/pricing";
import type { SpiegelConfig } from "@/lib/types";

const FORMEN = [
  { id: "rechteckig", label: "Rechteckig" },
  { id: "rund", label: "Rund" },
  { id: "oval", label: "Oval" },
  { id: "schraegschnitt", label: "Schrägschnitt" },
] as const;

const BELEUCHTUNGEN = [
  { id: "keine", label: "Keine" },
  { id: "oben", label: "Oben" },
  { id: "links-rechts", label: "Links & Rechts" },
  { id: "umlaufend", label: "Umlaufend" },
  { id: "hinterleuchtet", label: "Hinterleuchtet" },
] as const;

const RAHMEN = [
  { id: "rahmenlos", label: "Rahmenlos" },
  { id: "chrom", label: "Chrom" },
  { id: "schwarz", label: "Schwarz" },
  { id: "gold", label: "Gold" },
] as const;

const DEFAULT: SpiegelConfig = {
  form: "rechteckig",
  breite: 80,
  hoehe: 60,
  beleuchtung: "keine",
  rahmen: "rahmenlos",
  beschlag: false,
  steckdose: false,
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
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
        <button
          className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
          onClick={() => onChange(Math.max(min, value - 5))}
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
          onClick={() => onChange(Math.min(max, value + 5))}
        >
          +
        </button>
        <span className="px-3 text-xs text-gray-400">{unit}</span>
      </div>
    </div>
  );
}

function SpiegelPreview({ config }: { config: SpiegelConfig }) {
  const maxW = 260;
  const maxH = 220;
  const ratio = Math.min(maxW / config.breite, maxH / config.hoehe);
  const w = config.breite * ratio;
  const h = config.form === "rund" ? w : config.hoehe * ratio;

  const glowColor =
    config.beleuchtung !== "keine" ? "rgba(255,240,150,0.8)" : "transparent";

  return (
    <div className="flex items-center justify-center" style={{ minHeight: 260 }}>
      <div className="relative flex items-center justify-center">
        {config.beleuchtung !== "keine" && (
          <div
            className="absolute rounded-sm"
            style={{
              width: w + 24,
              height: h + 24,
              boxShadow: `0 0 24px 8px ${glowColor}`,
              borderRadius: config.form === "rund" ? "50%" : 4,
            }}
          />
        )}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: w,
            height: h,
            background:
              "linear-gradient(135deg, #e8f0fe 0%, #c8d8f8 40%, #dde8ff 100%)",
            borderRadius:
              config.form === "rund"
                ? "50%"
                : config.form === "oval"
                ? "50% / 40%"
                : config.form === "schraegschnitt"
                ? "4px 4px 4px 20px"
                : 4,
            border:
              config.rahmen !== "rahmenlos"
                ? `3px solid ${
                    config.rahmen === "chrom"
                      ? "#b0b8c8"
                      : config.rahmen === "schwarz"
                      ? "#1a1a1a"
                      : "#c8a44a"
                  }`
                : "1px solid rgba(180,200,240,0.5)",
            boxShadow:
              "inset 0 2px 12px rgba(255,255,255,0.6), 0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <span className="text-xs text-blue-300 opacity-60 select-none">
            {config.breite} × {config.hoehe} cm
          </span>

          {config.beleuchtung === "oben" && (
            <div
              className="absolute top-0 left-4 right-4 h-1 rounded-full"
              style={{ background: "rgba(255,240,150,0.9)" }}
            />
          )}
          {config.beleuchtung === "links-rechts" && (
            <>
              <div
                className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
                style={{ background: "rgba(255,240,150,0.9)" }}
              />
              <div
                className="absolute right-0 top-4 bottom-4 w-1 rounded-full"
                style={{ background: "rgba(255,240,150,0.9)" }}
              />
            </>
          )}
          {config.beleuchtung === "umlaufend" && (
            <div
              className="absolute inset-1 rounded-sm"
              style={{
                borderRadius:
                  config.form === "rund"
                    ? "50%"
                    : config.form === "oval"
                    ? "50% / 40%"
                    : 2,
                boxShadow: "inset 0 0 0 2px rgba(255,240,150,0.9)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SpiegelKonfigurator() {
  const [config, setConfig] = useState<SpiegelConfig>(DEFAULT);
  const [added, setAdded] = useState(false);

  const set = <K extends keyof SpiegelConfig>(k: K, v: SpiegelConfig[K]) =>
    setConfig((c) => ({ ...c, [k]: v }));

  const preis = berechneSpiegel(config);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Optionen */}
      <div className="space-y-7">
        <div>
          <SectionTitle>Form</SectionTitle>
          <OptionGrid
            options={FORMEN}
            value={config.form}
            onChange={(v) => set("form", v)}
          />
        </div>

        <div>
          <SectionTitle>Maße</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Breite"
              unit="cm"
              value={config.breite}
              min={30}
              max={300}
              onChange={(v) => set("breite", v)}
            />
            {config.form !== "rund" && (
              <NumberInput
                label="Höhe"
                unit="cm"
                value={config.hoehe}
                min={30}
                max={250}
                onChange={(v) => set("hoehe", v)}
              />
            )}
          </div>

          {config.form === "schraegschnitt" && (
            <div className="mt-3">
              <NumberInput
                label="Schrägschnitt-Winkel"
                unit="°"
                value={config.schraegSchnittWinkel ?? 45}
                min={15}
                max={75}
                onChange={(v) => set("schraegSchnittWinkel", v)}
              />
            </div>
          )}
        </div>

        <div>
          <SectionTitle>Beleuchtung</SectionTitle>
          <OptionGrid
            options={BELEUCHTUNGEN}
            value={config.beleuchtung}
            onChange={(v) => set("beleuchtung", v)}
          />
        </div>

        <div>
          <SectionTitle>Rahmen</SectionTitle>
          <OptionGrid
            options={RAHMEN}
            value={config.rahmen}
            onChange={(v) => set("rahmen", v)}
          />
        </div>

        <div>
          <SectionTitle>Extras</SectionTitle>
          <div className="space-y-2">
            {[
              {
                key: "beschlag" as const,
                label: "Beschlag-Set",
                sub: "Wandhalterung inklusive",
              },
              {
                key: "steckdose" as const,
                label: "Integrierte Steckdose",
                sub: "USB + Schuko",
              },
            ].map((ex) => (
              <label
                key={ex.key}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={config[ex.key]}
                  onChange={(e) => set(ex.key, e.target.checked)}
                  className="w-4 h-4 accent-gray-900"
                />
                <span className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {ex.label}
                  </span>
                  <span className="text-xs text-gray-400 block">{ex.sub}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Preview + Preis */}
      <div className="lg:sticky lg:top-24 self-start">
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 p-8">
            <SpiegelPreview config={config} />
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
                {config.breite} × {config.form === "rund" ? config.breite : config.hoehe} cm
                <br />
                {config.form === "schraegschnitt"
                  ? `Schrägschnitt ${config.schraegSchnittWinkel ?? 45}°`
                  : FORMEN.find((f) => f.id === config.form)?.label}
              </p>
            </div>

            <button
              onClick={handleAdd}
              className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-700"
              }`}
            >
              {added ? "✓ In den Warenkorb gelegt" : "In den Warenkorb"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Unverbindliches Angebot · Lieferzeit ca. 3–4 Wochen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
