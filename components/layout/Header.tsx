"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/store";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string; konfHref?: string }[];
}

const NAV: NavItem[] = [
  {
    label: "Spiegel",
    children: [
      { label: "Rahmenloser Spiegel", href: "/spiegel", konfHref: "/spiegel/konfigurator" },
      { label: "Badspiegel mit LED", href: "/spiegel" },
      { label: "Holzrahmen-Spiegel", href: "/spiegel" },
      { label: "Alu-Rahmen-Spiegel", href: "/spiegel" },
      { label: "Designspiegel", href: "/spiegel" },
      { label: "Standspiegel", href: "/spiegel" },
      { label: "Spezialspiegel (VSG)", href: "/spiegel" },
    ],
  },
  {
    label: "Glas",
    children: [
      { label: "Normalglas klar", href: "/glasduschen" },
      { label: "ESG-Sicherheitsglas", href: "/glasduschen" },
      { label: "VSG-Verbundglas", href: "/glasduschen" },
      { label: "Lackiertes Glas (RAL)", href: "/glasduschen" },
      { label: "Küchenrückwand", href: "/glasduschen" },
      { label: "Glasplatten (Tisch, Kamin)", href: "/glasduschen" },
    ],
  },
  {
    label: "Duschen & Trennwände",
    children: [
      { label: "Glasduschen", href: "/glasduschen", konfHref: "/glasduschen/konfigurator" },
      { label: "Glastrennwände", href: "/glastrennwaende", konfHref: "/glastrennwaende/konfigurator" },
      { label: "Schiebeanlagen", href: "/glastrennwaende" },
      { label: "Geländer & Brüstungen", href: "/glastrennwaende" },
    ],
  },
  {
    label: "Zubehör",
    href: "/zubehoer",
  },
];

function MegaMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  if (!item.children) return null;
  return (
    <div className="absolute top-full left-0 mt-0 w-64 bg-white border border-gray-100 shadow-lg rounded-b-xl overflow-hidden z-40">
      <div className="py-2">
        {item.children.map((child) => (
          <div key={child.label}>
            <Link
              href={child.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={onClose}
            >
              {child.label}
            </Link>
            {child.konfHref && (
              <Link
                href={child.konfHref}
                className="block px-4 py-1.5 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                onClick={onClose}
              >
                → Konfigurator öffnen
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const itemCount = useCartStore((s) => s.itemCount());

  const closeMenu = () => setActiveMenu(null);

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm"
      onMouseLeave={closeMenu}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeMenu}>
            <span className="text-xl font-semibold tracking-tight text-gray-900">GZN</span>
            <span className="text-xl font-light text-gray-400 hidden sm:inline">Glas-Shop</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center">
            {NAV.map((item) => (
              <div key={item.label} className="relative">
                {item.href && !item.children ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-4 h-16 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className={`flex items-center gap-1 px-4 h-16 text-sm font-medium transition-colors ${
                      activeMenu === item.label ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                    }`}
                    onMouseEnter={() => setActiveMenu(item.label)}
                    onClick={() => setActiveMenu(activeMenu === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${activeMenu === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
                {activeMenu === item.label && (
                  <MegaMenu item={item} onClose={closeMenu} />
                )}
              </div>
            ))}
          </nav>

          {/* Right: Cart + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/warenkorb"
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={closeMenu}
              aria-label={`Warenkorb (${itemCount} Artikel)`}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold rounded-full leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white max-h-[70vh] overflow-y-auto">
          {NAV.map((item) => (
            <div key={item.label}>
              <div className="px-6 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                {item.label}
              </div>
              {item.href && !item.children ? (
                <Link
                  href={item.href}
                  className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                item.children?.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                    {child.konfHref && (
                      <span className="ml-2 text-xs text-blue-500">Konfigurator</span>
                    )}
                  </Link>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
