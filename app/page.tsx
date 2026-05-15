import Link from "next/link";
import { ArrowRight } from "lucide-react";

const kategorien = [
  {
    title: "Spiegel nach Maß",
    description:
      "Beleuchtete Badspiegel, Designspiegel mit Schrägschnitt – individuell konfiguriert.",
    href: "/spiegel",
    konfHref: "/spiegel/konfigurator",
  },
  {
    title: "Glasduschen",
    description:
      "Nischen-, Eck- und freistehende Duschen in Klarglas, Satinato oder Bronze.",
    href: "/glasduschen",
    konfHref: "/glasduschen/konfigurator",
  },
  {
    title: "Glastrennwände",
    description:
      "Raumteiler, Schiebeanlagen und Festverglasungen für Büro und Wohnen.",
    href: "/glastrennwaende",
    konfHref: "/glastrennwaende/konfigurator",
  },
];

export default function Home() {
  return (
    <>
      <section className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
            GZN Glas-Shop
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-2xl leading-tight">
            Glas nach Maß –{" "}
            <span className="text-gray-400">online konfiguriert.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-xl leading-relaxed">
            Spiegel mit Beleuchtung, Glasduschen und Trennwände – individuell
            geplant, transparent berechnet, direkt bestellt.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/spiegel/konfigurator"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Spiegel konfigurieren <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/glasduschen/konfigurator"
              className="inline-flex items-center gap-2 border border-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium hover:border-gray-500 transition-colors"
            >
              Glasdusche planen
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-semibold text-gray-900 mb-10">
          Produktbereiche
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kategorien.map((k) => (
            <div
              key={k.href}
              className="border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors"
            >
              <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-4">
                Konfigurator
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {k.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                {k.description}
              </p>
              <div className="flex gap-3">
                <Link
                  href={k.konfHref}
                  className="flex-1 text-center text-sm font-medium bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Jetzt konfigurieren
                </Link>
                <Link
                  href={k.href}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Mehr
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                label: "Maßgenau",
                text: "Millimetergenaue Fertigung in Deutschland",
              },
              {
                label: "Direktpreis",
                text: "Kein Handel – Preis sofort im Konfigurator",
              },
              {
                label: "Montageservice",
                text: "Lieferung & Montage in Hamburg und Umgebung",
              },
            ].map((usp) => (
              <div key={usp.label}>
                <p className="text-sm font-semibold text-gray-900">
                  {usp.label}
                </p>
                <p className="mt-1 text-sm text-gray-500">{usp.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
