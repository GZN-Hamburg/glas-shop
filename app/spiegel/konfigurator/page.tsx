import type { Metadata } from "next";
import SpiegelKonfigurator from "@/components/konfigurator/SpiegelKonfigurator";

export const metadata: Metadata = {
  title: "Spiegel-Konfigurator",
  description:
    "Badspiegel nach Maß konfigurieren: Form, Beleuchtung, Schrägschnitt, Rahmen – Preis sofort berechnet.",
};

export default function SpiegelKonfiguratorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-sm text-gray-400 mb-1">Spiegel</p>
        <h1 className="text-3xl font-semibold text-gray-900">
          Spiegel-Konfigurator
        </h1>
        <p className="mt-2 text-gray-500">
          Wähle Form, Maße, Beleuchtung und Extras – der Preis wird live
          berechnet.
        </p>
      </div>
      <SpiegelKonfigurator />
    </div>
  );
}
