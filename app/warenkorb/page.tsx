"use client";

import Link from "next/link";
import { Trash2, ShoppingCart, ArrowRight, Package } from "lucide-react";
import { useCartStore } from "@/lib/store";

function fmt(n: number) {
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function KonfigDetails({ config }: { config: Record<string, unknown> }) {
  const interessant = Object.entries(config).filter(
    ([k, v]) =>
      v !== null &&
      v !== undefined &&
      v !== "" &&
      k !== "bohrungen" &&
      !(Array.isArray(v) && (v as unknown[]).length === 0)
  );

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
      {interessant.slice(0, 8).map(([k, v]) => {
        let anzeige = String(v);
        if (k === "breite" || k === "hoehe") anzeige = `${v} mm`;
        if (k === "glasStaerke") anzeige = `${v} mm`;
        if (k === "menge") return null;
        return (
          <span key={k} className="text-xs text-gray-400">
            {anzeige}
          </span>
        );
      })}
      {(config.bohrungen as unknown[] | undefined)?.length ? (
        <span className="text-xs text-gray-400">
          {(config.bohrungen as unknown[]).length} Bohrung(en)
        </span>
      ) : null}
    </div>
  );
}

export default function WarenkorbPage() {
  const { items, removeItem, updateMenge, totalBrutto, itemCount } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Warenkorb ist leer
        </h1>
        <p className="text-gray-500 mb-8">
          Konfiguriere dein erstes Produkt und füge es hier hinzu.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/spiegel/konfigurator"
            className="inline-flex justify-center items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Spiegel konfigurieren
          </Link>
          <Link
            href="/glasduschen/konfigurator"
            className="inline-flex justify-center items-center border border-gray-200 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
          >
            Glasdusche konfigurieren
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Warenkorb
        <span className="ml-3 text-base font-normal text-gray-400">
          ({itemCount()} {itemCount() === 1 ? "Position" : "Positionen"})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Positionen */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {item.bezeichnung}
                    </p>
                    <KonfigDetails
                      config={item.config as unknown as Record<string, unknown>}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Menge */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 text-sm transition-colors"
                      onClick={() =>
                        item.menge > 1
                          ? updateMenge(item.id, item.menge - 1)
                          : removeItem(item.id)
                      }
                    >
                      −
                    </button>
                    <span className="px-3 text-sm font-medium border-x border-gray-200 py-1.5">
                      {item.menge}
                    </span>
                    <button
                      className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 text-sm transition-colors"
                      onClick={() => updateMenge(item.id, item.menge + 1)}
                    >
                      +
                    </button>
                  </div>

                  {/* Preis */}
                  <div className="text-right min-w-[72px]">
                    <p className="text-sm font-semibold text-gray-900">
                      {fmt(item.preis * item.menge)} €
                    </p>
                    {item.menge > 1 && (
                      <p className="text-xs text-gray-400">
                        à {fmt(item.preis)} €
                      </p>
                    )}
                  </div>

                  {/* Löschen */}
                  <button
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    onClick={() => removeItem(item.id)}
                    aria-label="Position entfernen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Weiter einkaufen */}
          <div className="flex gap-3 pt-2">
            <Link
              href="/spiegel/konfigurator"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              + Spiegel hinzufügen
            </Link>
            <span className="text-gray-200">·</span>
            <Link
              href="/glasduschen/konfigurator"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              + Glasdusche hinzufügen
            </Link>
          </div>
        </div>

        {/* Zusammenfassung */}
        <div className="lg:sticky lg:top-20 self-start">
          <div className="border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Bestellübersicht
            </h2>

            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span className="truncate pr-2 max-w-[160px]">
                    {item.menge}× {item.bezeichnung.split(" ").slice(0, 3).join(" ")}
                  </span>
                  <span className="shrink-0">{fmt(item.preis * item.menge)} €</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Zwischensumme</span>
                <span>{fmt(totalBrutto())} €</span>
              </div>
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Versand</span>
                <span>wird im Checkout berechnet</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-400">Gesamt inkl. 19% MwSt.</p>
                <p className="text-xl font-semibold text-gray-900">
                  {fmt(totalBrutto())} €
                </p>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              Zur Kasse <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-gray-400 text-center">
              Maßanfertigung · kein Widerrufsrecht nach § 312g II Nr. 1 BGB
            </p>
          </div>

          {/* Vertrauenssignale */}
          <div className="mt-4 space-y-2">
            {[
              "Zahlung per Karte, SEPA oder Klarna",
              "Fertigung in Deutschland",
              "Lieferung mit eigenen Fahrzeugen",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-green-500 font-bold">✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
