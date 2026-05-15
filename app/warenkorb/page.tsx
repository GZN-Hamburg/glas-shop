import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Warenkorb",
};

export default function WarenkorbPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Warenkorb ist leer</h1>
      <p className="text-gray-500 mb-8">Konfiguriere dein erstes Produkt und füge es hier hinzu.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/spiegel/konfigurator"
          className="inline-flex justify-center items-center bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
          Spiegel konfigurieren
        </Link>
        <Link href="/glasduschen/konfigurator"
          className="inline-flex justify-center items-center border border-gray-200 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors">
          Glasdusche konfigurieren
        </Link>
      </div>
    </div>
  );
}
