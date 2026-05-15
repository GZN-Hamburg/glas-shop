import type { Metadata } from "next";
import GlastrennwandKonfigurator from "@/components/konfigurator/GlastrennwandKonfigurator";

export const metadata: Metadata = {
  title: "Glastrennwand Konfigurator",
  description:
    "Glastrennwände nach Maß konfigurieren: Festverglasung, Schiebeanlage, Falttür – Preis sofort berechnet.",
};

export default function GlastrennwandKonfiguratorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-sm text-gray-400 mb-1">Glastrennwände</p>
        <h1 className="text-3xl font-semibold text-gray-900">
          Glastrennwand Konfigurator
        </h1>
        <p className="mt-2 text-gray-500">
          Typ, Maße, Anzahl Elemente und Glasart – Preis wird live berechnet.
        </p>
      </div>
      <GlastrennwandKonfigurator />
    </div>
  );
}
