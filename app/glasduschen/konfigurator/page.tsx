import type { Metadata } from "next";
import GlasduscheKonfigurator from "@/components/konfigurator/GlasduscheKonfigurator";

export const metadata: Metadata = {
  title: "Glasdusche Konfigurator",
  description:
    "Glasdusche nach Maß konfigurieren: Nische, Eckeinstieg, Glasstärke, Profil – Preis sofort berechnet.",
};

export default function GlasduscheKonfiguratorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-sm text-gray-400 mb-1">Glasduschen</p>
        <h1 className="text-3xl font-semibold text-gray-900">
          Glasdusche Konfigurator
        </h1>
        <p className="mt-2 text-gray-500">
          Typ, Maße, Glasart und Profil – Preis wird live berechnet.
        </p>
      </div>
      <GlasduscheKonfigurator />
    </div>
  );
}
