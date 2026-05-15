import Link from "next/link";
import type { Metadata } from "next";
import { XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Zahlung abgebrochen" };

export default function CheckoutAbbruchPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-9 h-9 text-red-400" />
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-3">
        Zahlung abgebrochen
      </h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Ihre Bestellung wurde nicht abgeschlossen. Ihr Warenkorb ist noch
        vorhanden – Sie können es jederzeit erneut versuchen.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/warenkorb"
          className="inline-flex justify-center items-center bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Zurück zum Warenkorb
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex justify-center items-center border border-gray-200 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
        >
          Hilfe & Kontakt
        </Link>
      </div>
    </div>
  );
}
