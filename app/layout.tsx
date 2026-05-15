import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: {
    template: "%s | GZN Glas-Shop",
    default: "GZN Glas-Shop – Spiegel, Glasduschen & Glastrennwände",
  },
  description:
    "Hochwertige Glasprodukte nach Maß: Beleuchtete Spiegel, Glasduschen und Glastrennwände – direkt online konfigurieren und bestellen.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
