import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Glasduschen nach Maß",
  description:
    "Maßgefertigte Glasduschen: Nische, Eckeinstieg, freistehend oder als Badewannenaufsatz.",
};

export default function GlasduschenPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Glasduschen nach Maß
          </h1>
          <p className="mt-2 text-gray-500">
            Individuelle Duschlösungen – direkt konfiguriert und berechnet.
          </p>
        </div>
        <Link
          href="/glasduschen/konfigurator"
          className="hidden sm:inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Konfigurator öffnen <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { title: "Nischendusche", desc: "Zwei Glaswände, eine Tür – perfekt für Baunischen.", preis: "ab 429 €" },
          { title: "Eckeinstieg", desc: "Zwei Glaswände mit Eckeinstieg, maximale Raumnutzung.", preis: "ab 549 €" },
          { title: "Freistehend", desc: "Ohne Wandanbindung – flexibel im Badezimmer positionierbar.", preis: "ab 689 €" },
          { title: "Badewannenaufsatz", desc: "Glaswand auf der Badewannenoberkante.", preis: "ab 379 €" },
        ].map((p) => (
          <div key={p.title} className="border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors">
            <div className="h-32 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-lg mb-4" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{p.title}</h3>
            <p className="text-xs text-gray-500 mb-3">{p.desc}</p>
            <p className="text-sm font-medium text-gray-900">{p.preis}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Deine Glasdusche konfigurieren</h2>
          <p className="mt-1 text-sm text-gray-500">Maße, Glasart, Profil und Extras – Preis sofort.</p>
        </div>
        <Link
          href="/glasduschen/konfigurator"
          className="shrink-0 inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Jetzt konfigurieren <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
