import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Glastrennwände nach Maß",
  description:
    "Raumteiler, Schiebeanlagen und Festverglasungen für Büro und Wohnen – maßgefertigt.",
};

export default function GlastrennwaendePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Glastrennwände nach Maß
          </h1>
          <p className="mt-2 text-gray-500">
            Für Büro, Wohnen und Gewerbe – vom Raumteiler bis zur Schiebeanlage.
          </p>
        </div>
        <Link
          href="/glastrennwaende/konfigurator"
          className="hidden sm:inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Konfigurator öffnen <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { title: "Festverglasung", desc: "Stabile Glaswand ohne bewegliche Teile.", preis: "ab 520 €" },
          { title: "Schiebeanlage", desc: "Platzsparend verschiebbare Glaselemente.", preis: "ab 780 €" },
          { title: "Falttür", desc: "Zusammenfaltbare Glaselemente für maximale Öffnung.", preis: "ab 720 €" },
          { title: "Raumteiler", desc: "Freistehender Glasraumteiler ohne Wandmontage.", preis: "ab 640 €" },
        ].map((p) => (
          <div key={p.title} className="border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors">
            <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{p.title}</h3>
            <p className="text-xs text-gray-500 mb-3">{p.desc}</p>
            <p className="text-sm font-medium text-gray-900">{p.preis}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Glastrennwand individuell planen</h2>
          <p className="mt-1 text-sm text-gray-500">Typ, Maße, Anzahl Elemente und Extras – Preis sofort.</p>
        </div>
        <Link
          href="/glastrennwaende/konfigurator"
          className="shrink-0 inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Jetzt konfigurieren <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
