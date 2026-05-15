import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Produkte</p>
            <ul className="space-y-2">
              {[
                ["Spiegel", "/spiegel"],
                ["Spiegel-Konfigurator", "/spiegel/konfigurator"],
                ["Glasduschen", "/glasduschen"],
                ["Glastrennwände", "/glastrennwaende"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Unternehmen
            </p>
            <ul className="space-y-2">
              {[
                ["Über uns", "/ueber-uns"],
                ["Kontakt", "/kontakt"],
                ["Impressum", "/impressum"],
                ["Datenschutz", "/datenschutz"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Kontakt</p>
            <address className="not-italic text-sm text-gray-500 space-y-1">
              <p>GZN Glas & Zubehoer Nord GmbH</p>
              <p>Hamburg, Deutschland</p>
              <a
                href="mailto:info@gzn-hamburg.de"
                className="hover:text-gray-900 transition-colors"
              >
                info@gzn-hamburg.de
              </a>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} GZN Glas & Zubehör Nord GmbH · Alle
            Rechte vorbehalten
          </p>
        </div>
      </div>
    </footer>
  );
}
