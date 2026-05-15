import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Spiegel nach Maß",
  description:
    "Hochwertige Spiegel nach Maß – mit Beleuchtung, Schrägschnitt und verschiedenen Rahmenvarianten.",
};

const produkte = [
  {
    title: "Badspiegel mit LED-Beleuchtung",
    desc: "Umlaufende oder einseitige Beleuchtung, dimmbar.",
    preis: "ab 189 €",
  },
  {
    title: "Designspiegel mit Schrägschnitt",
    desc: "Individuelle Winkel von 15° bis 75°.",
    preis: "ab 249 €",
  },
  {
    title: "Runder Spiegel",
    desc: "Rahmenlos oder mit Rahmen in Chrom, Schwarz oder Gold.",
    preis: "ab 149 €",
  },
  {
    title: "Hinterleuchteter Spiegel",
    desc: "Sanftes Licht durch das Glas – ideal für Bäder und Flure.",
    preis: "ab 329 €",
  },
];

export default function SpiegelPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Spiegel nach Maß
          </h1>
          <p className="mt-2 text-gray-500">
            Millimetergenau gefertigt – direkt im Konfigurator planen.
          </p>
        </div>
        <Link
          href="/spiegel/konfigurator"
          className="hidden sm:inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Konfigurator öffnen <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {produkte.map((p) => (
          <div
            key={p.title}
            className="border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors"
          >
            <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-4" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {p.title}
            </h3>
            <p className="text-xs text-gray-500 mb-3">{p.desc}</p>
            <p className="text-sm font-medium text-gray-900">{p.preis}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Deinen Spiegel individuell konfigurieren
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Maße, Beleuchtung, Rahmen und Extras – alles in einem Schritt.
          </p>
        </div>
        <Link
          href="/spiegel/konfigurator"
          className="shrink-0 inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Jetzt konfigurieren <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
