"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/store";

export default function CheckoutErfolgPage() {
  const clear = useCartStore((s) => s.clear);

  // Warenkorb nach erfolgter Zahlung leeren
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-9 h-9 text-green-600" />
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-3">
        Vielen Dank für Ihre Bestellung!
      </h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Ihre Bestellung ist bei uns eingegangen. Sie erhalten in Kürze eine
        Bestätigungs-E-Mail mit allen Details. Wir fertigen Ihre Produkte
        anschließend maßgenau an.
      </p>

      {/* Nächste Schritte */}
      <div className="bg-gray-50 rounded-xl p-6 text-left mb-10 max-w-md mx-auto">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Was passiert als nächstes?
        </h2>
        <ol className="space-y-3">
          {[
            "Bestätigungs-E-Mail mit Auftragsnummer",
            "Auftragsbestätigung & Produktion (8–12 Arbeitstage)",
            "Versandbenachrichtigung mit Tracking",
            "Lieferung mit eigenem GZN-Fahrzeug",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="flex-shrink-0 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex justify-center items-center bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Zurück zur Startseite
        </Link>
        <Link
          href="/spiegel/konfigurator"
          className="inline-flex justify-center items-center border border-gray-200 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
        >
          Weitere Produkte konfigurieren
        </Link>
      </div>
    </div>
  );
}
