import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { CartItem, Adresse, Versandart } from "@/lib/types";
import { VERSANDPREISE } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe nicht konfiguriert (STRIPE_SECRET_KEY fehlt)" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });

  let body: {
    items: CartItem[];
    adresse: Partial<Adresse>;
    versandart: Versandart;
    versandkosten: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Request-Body" }, { status: 400 });
  }

  const { items, adresse, versandart, versandkosten } = body;

  if (!items?.length) {
    return NextResponse.json({ error: "Keine Positionen im Warenkorb" }, { status: 400 });
  }

  type LineItem = { price_data: { currency: string; unit_amount: number; product_data: { name: string; description?: string; metadata?: Record<string, string> } }; quantity: number };

  // Stripe Line Items aus Warenkorb-Positionen
  const line_items: LineItem[] = items.map((item) => ({
    price_data: {
      currency: "eur",
      unit_amount: Math.round(item.preis * 100),
      product_data: {
        name: item.bezeichnung,
        description: buildDescription(item),
        metadata: {
          typ: item.typ,
          config: JSON.stringify(item.config).slice(0, 500),
        },
      },
    },
    quantity: item.menge,
  }));

  // Versandkosten als eigene Position
  if (versandkosten > 0) {
    const versandLabel: Record<Versandart, string> = {
      palette: "Standardpalette",
      sondertransport: "Sondertransport",
      abholung: "Selbstabholung Hamburg",
    };
    line_items.push({
      price_data: {
        currency: "eur",
        unit_amount: Math.round(versandkosten * 100),
        product_data: { name: `Versand – ${versandLabel[versandart]}` },
      },
      quantity: 1,
    });
  }

  // Adress-Metadaten für Bestellübersicht im Stripe Dashboard
  const metadata: Record<string, string> = {
    vorname: adresse.vorname ?? "",
    nachname: adresse.nachname ?? "",
    email: adresse.email ?? "",
    strasse: `${adresse.strasse ?? ""} ${adresse.hausnummer ?? ""}`.trim(),
    ort: `${adresse.plz ?? ""} ${adresse.ort ?? ""}`.trim(),
    land: adresse.land ?? "DE",
    versandart,
    ...(adresse.firma ? { firma: adresse.firma } : {}),
    ...(adresse.telefon ? { telefon: adresse.telefon } : {}),
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: adresse.email,
      billing_address_collection: "auto",
      locale: "de",
      payment_method_types: ["card", "sepa_debit", "klarna"],
      success_url: `${BASE_URL}/checkout/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/checkout/abbruch`,
      metadata,
      custom_text: {
        submit: {
          message:
            "Maßanfertigungen sind vom Widerrufsrecht ausgeschlossen (§ 312g Abs. 2 Nr. 1 BGB).",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Stripe.errors.StripeError
        ? err.message
        : "Stripe-Fehler";
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildDescription(item: CartItem): string {
  const c = item.config as unknown as Record<string, unknown>;
  const parts: string[] = [];

  if (c.breite && c.hoehe) parts.push(`${c.breite}×${c.hoehe} mm`);
  else if (c.breite) parts.push(`Ø ${c.breite} mm`);

  if (c.glasStaerke) parts.push(`${c.glasStaerke} mm Glas`);
  if (c.kante && c.kante !== "SK") parts.push(`Kante: ${c.kante}`);
  if (c.veredelung && c.veredelung !== "keine") parts.push(String(c.veredelung));
  if (c.glasArt && c.glasArt !== "klar") parts.push(String(c.glasArt));
  if (
    c.bohrungen &&
    Array.isArray(c.bohrungen) &&
    (c.bohrungen as unknown[]).length > 0
  ) {
    parts.push(`${(c.bohrungen as unknown[]).length} Bohrung(en)`);
  }

  return parts.join(" · ") || item.typ;
}
