"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import type { Adresse, Versandart } from "@/lib/types";
import { VERSANDPREISE } from "@/lib/types";

// ─── Schritte ─────────────────────────────────────────────────────────────────

const SCHRITTE = ["Adresse", "Versand", "Bestellung"] as const;

// ─── Shared Field ─────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-500 transition-colors";

// ─── Schritt 1: Adresse ───────────────────────────────────────────────────────

function AdresseStep({
  adresse,
  onChange,
  onWeiter,
}: {
  adresse: Partial<Adresse>;
  onChange: (a: Partial<Adresse>) => void;
  onWeiter: () => void;
}) {
  const set = (k: keyof Adresse, v: string) => onChange({ ...adresse, [k]: v });

  const valid =
    adresse.vorname &&
    adresse.nachname &&
    adresse.email &&
    adresse.strasse &&
    adresse.hausnummer &&
    adresse.plz &&
    adresse.ort &&
    adresse.land;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Lieferadresse
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Vorname" required>
            <input
              className={inputCls}
              value={adresse.vorname ?? ""}
              onChange={(e) => set("vorname", e.target.value)}
              autoComplete="given-name"
            />
          </Field>
          <Field label="Nachname" required>
            <input
              className={inputCls}
              value={adresse.nachname ?? ""}
              onChange={(e) => set("nachname", e.target.value)}
              autoComplete="family-name"
            />
          </Field>
          <Field label="Firma">
            <input
              className={inputCls}
              value={adresse.firma ?? ""}
              onChange={(e) => set("firma", e.target.value)}
              autoComplete="organization"
              placeholder="Optional"
            />
          </Field>
          <Field label="E-Mail-Adresse" required>
            <input
              type="email"
              className={inputCls}
              value={adresse.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
            />
          </Field>
          <Field label="Telefon">
            <input
              type="tel"
              className={inputCls}
              value={adresse.telefon ?? ""}
              onChange={(e) => set("telefon", e.target.value)}
              autoComplete="tel"
              placeholder="Optional – für Lieferrückfragen"
            />
          </Field>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Anschrift</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Straße" required>
            <input
              className={inputCls}
              value={adresse.strasse ?? ""}
              onChange={(e) => set("strasse", e.target.value)}
              autoComplete="address-line1"
            />
          </Field>
          <Field label="Hausnummer" required>
            <input
              className={inputCls}
              value={adresse.hausnummer ?? ""}
              onChange={(e) => set("hausnummer", e.target.value)}
              autoComplete="address-line2"
            />
          </Field>
          <Field label="Postleitzahl" required>
            <input
              className={inputCls}
              value={adresse.plz ?? ""}
              onChange={(e) => set("plz", e.target.value)}
              autoComplete="postal-code"
              maxLength={10}
            />
          </Field>
          <Field label="Ort" required>
            <input
              className={inputCls}
              value={adresse.ort ?? ""}
              onChange={(e) => set("ort", e.target.value)}
              autoComplete="address-level2"
            />
          </Field>
          <Field label="Land" required>
            <select
              className={inputCls}
              value={adresse.land ?? "DE"}
              onChange={(e) => set("land", e.target.value)}
              autoComplete="country"
            >
              <option value="DE">Deutschland</option>
              <option value="AT">Österreich</option>
              <option value="CH">Schweiz</option>
              <option value="LU">Luxemburg</option>
              <option value="LI">Liechtenstein</option>
            </select>
          </Field>
        </div>
      </div>

      <button
        disabled={!valid}
        onClick={onWeiter}
        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Weiter zur Versandwahl <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Schritt 2: Versand ───────────────────────────────────────────────────────

const VERSANDOPTIONEN: {
  id: Versandart;
  label: string;
  sub: string;
  preis: number;
}[] = [
  {
    id: "palette",
    label: "Standardpalette",
    sub: "Lieferung auf Palette, Bordsteinkante, ca. 5–10 Arbeitstage",
    preis: VERSANDPREISE.palette,
  },
  {
    id: "sondertransport",
    label: "Sondertransport",
    sub: "Für großformatige oder schwere Stücke, inkl. Avisierung",
    preis: VERSANDPREISE.sondertransport,
  },
  {
    id: "abholung",
    label: "Selbstabholung Hamburg",
    sub: "Kostenlos – Abholung nach Terminvereinbarung in Hamburg",
    preis: 0,
  },
];

function VersandStep({
  versandart,
  onChange,
  onWeiter,
  onZurueck,
}: {
  versandart: Versandart;
  onChange: (v: Versandart) => void;
  onWeiter: () => void;
  onZurueck: () => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Versandoption</h2>
      <div className="space-y-3">
        {VERSANDOPTIONEN.map((opt) => (
          <label
            key={opt.id}
            className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
              versandart === opt.id
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="versand"
              value={opt.id}
              checked={versandart === opt.id}
              onChange={() => onChange(opt.id)}
              className="mt-0.5 accent-gray-900"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {opt.label}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {opt.preis === 0
                    ? "Kostenlos"
                    : `${opt.preis.toLocaleString("de-DE")} €`}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{opt.sub}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onZurueck}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Zurück
        </button>
        <button
          onClick={onWeiter}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          Weiter zur Bestellung <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Schritt 3: Überprüfung + Zahlung ────────────────────────────────────────

function BestellungStep({
  adresse,
  versandart,
  onZurueck,
}: {
  adresse: Partial<Adresse>;
  versandart: Versandart;
  onZurueck: () => void;
}) {
  const { items, totalBrutto } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const versandkosten = VERSANDPREISE[versandart];
  const gesamtOhneVersand = totalBrutto();
  const gesamt = gesamtOhneVersand + versandkosten;

  const fmt = (n: number) =>
    n.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleBezahlen = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          adresse,
          versandart,
          versandkosten,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Fehler beim Erstellen der Bestellung");
      }

      const { url } = await res.json();
      if (url) {
        router.push(url);
      } else {
        throw new Error("Keine Weiterleitungs-URL erhalten");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
      setLoading(false);
    }
  };

  const versandLabel =
    VERSANDOPTIONEN_LABEL[versandart] ?? versandart;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Bestellung prüfen
      </h2>

      {/* Adress-Zusammenfassung */}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Lieferadresse
          </h3>
          <button
            onClick={onZurueck}
            className="text-xs text-blue-600 hover:underline"
          >
            Ändern
          </button>
        </div>
        <div className="text-sm text-gray-700 space-y-0.5">
          {adresse.firma && <p>{adresse.firma}</p>}
          <p>
            {adresse.vorname} {adresse.nachname}
          </p>
          <p>
            {adresse.strasse} {adresse.hausnummer}
          </p>
          <p>
            {adresse.plz} {adresse.ort}
          </p>
          <p className="text-gray-500">{adresse.email}</p>
        </div>
      </div>

      {/* Positionen */}
      <div className="border border-gray-200 rounded-xl p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Positionen
        </h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-gray-700">
              <span>
                {item.menge}× {item.bezeichnung}
              </span>
              <span className="shrink-0 pl-4">
                {fmt(item.preis * item.menge)} €
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preisübersicht */}
      <div className="border border-gray-200 rounded-xl p-4 space-y-2.5">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Produkte</span>
          <span>{fmt(gesamtOhneVersand)} €</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{versandLabel}</span>
          <span>
            {versandkosten === 0 ? "Kostenlos" : `${fmt(versandkosten)} €`}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>darin enthaltene MwSt. (19%)</span>
          <span>{fmt(gesamt * 0.19 / 1.19)} €</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
          <span>Gesamt inkl. MwSt.</span>
          <span>{fmt(gesamt)} €</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-400">
        Mit dem Klick auf „Jetzt kostenpflichtig bestellen" akzeptieren Sie
        unsere{" "}
        <Link href="/agb" className="underline hover:text-gray-700">
          AGB
        </Link>
        . Bei Maßanfertigung besteht kein Widerrufsrecht (§ 312g II Nr. 1 BGB).
      </p>

      <div className="flex gap-3">
        <button
          onClick={onZurueck}
          disabled={loading}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" /> Zurück
        </button>
        <button
          onClick={handleBezahlen}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Weiterleitung…
            </>
          ) : (
            <>
              Jetzt kostenpflichtig bestellen{" "}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const VERSANDOPTIONEN_LABEL: Record<Versandart, string> = {
  palette: "Standardpalette (89 €)",
  sondertransport: "Sondertransport (189 €)",
  abholung: "Selbstabholung Hamburg",
};

// ─── Fortschrittsanzeige ──────────────────────────────────────────────────────

function Fortschritt({ schritt }: { schritt: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {SCHRITTE.map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
              i < schritt
                ? "bg-gray-900 text-white"
                : i === schritt
                ? "bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-2"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {i < schritt ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          <span
            className={`ml-2 text-sm font-medium ${
              i <= schritt ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {s}
          </span>
          {i < SCHRITTE.length - 1 && (
            <div
              className={`mx-4 h-px w-12 transition-colors ${
                i < schritt ? "bg-gray-900" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [schritt, setSchritt] = useState(0);
  const [adresse, setAdresse] = useState<Partial<Adresse>>({ land: "DE" });
  const [versandart, setVersandart] = useState<Versandart>("palette");
  const { items } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 mb-6">Dein Warenkorb ist leer.</p>
        <Link
          href="/spiegel/konfigurator"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Zum Konfigurator
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/warenkorb"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Zurück zum Warenkorb
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Kasse</h1>
      </div>

      <Fortschritt schritt={schritt} />

      {schritt === 0 && (
        <AdresseStep
          adresse={adresse}
          onChange={setAdresse}
          onWeiter={() => setSchritt(1)}
        />
      )}
      {schritt === 1 && (
        <VersandStep
          versandart={versandart}
          onChange={setVersandart}
          onWeiter={() => setSchritt(2)}
          onZurueck={() => setSchritt(0)}
        />
      )}
      {schritt === 2 && (
        <BestellungStep
          adresse={adresse}
          versandart={versandart}
          onZurueck={() => setSchritt(1)}
        />
      )}
    </div>
  );
}
