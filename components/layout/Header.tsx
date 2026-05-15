"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";

const nav = [
  { label: "Spiegel", href: "/spiegel" },
  { label: "Glasduschen", href: "/glasduschen" },
  { label: "Glastrennwände", href: "/glastrennwaende" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-gray-900">
              GZN
            </span>
            <span className="text-xl font-light text-gray-400">Glas-Shop</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/warenkorb"
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
