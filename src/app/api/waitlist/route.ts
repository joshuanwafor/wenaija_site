import { NextResponse } from "next/server";
import { STATE_CODES } from "@/lib/geo";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  state?: string;
  town?: string;
  website?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Accepts either "addr@host" or "Name <addr@host>" and returns the address. */
function parseAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match ? match[1] : value).trim();
}

export async function POST(request: Request) {
  let data: Payload;

  try {
    data = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Silently accept bot submissions so they get no signal.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const state = data.state?.trim() ?? "";
  const town = data.town?.trim() ?? "";

  if (!name || !email || !state) {
    return NextResponse.json(
      { error: "Please provide your name, email and state." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (state !== "DIASPORA" && !STATE_CODES.has(state)) {
    return NextResponse.json(
      { error: "Please select a state from the list." },
      { status: 400 },
    );
  }

  if (name.length > 120 || town.length > 120) {
    return NextResponse.json({ error: "That's too long." }, { status: 400 });
  }

  const signup = {
    name,
    email,
    state,
    town: town || "—",
    receivedAt: new Date().toISOString(),
  };

  const token = process.env.ZEPTOMAIL_TOKEN;
  const to = process.env.WAITLIST_TO_EMAIL ?? site.email;
  const from = process.env.ZEPTOMAIL_FROM_ADDRESS;

  // No mail provider configured yet — the backend is still being built, so the
  // signup is logged server-side rather than dropped. Set ZEPTOMAIL_TOKEN and
  // ZEPTOMAIL_FROM_ADDRESS to deliver by email. See README.
  if (!token || !from) {
    console.info("[waitlist] signup received (no mail provider configured)", signup);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    // ZeptoMail's send token is used verbatim as the Authorization header —
    // it already carries its own "Zoho-enczapikey " prefix, so don't add one.
    const res = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from: { address: parseAddress(from), name: "WeNaija" },
        to: [{ email_address: { address: to } }],
        reply_to: [{ address: email, name }],
        subject: `WeNaija waitlist — ${name} (${state})`,
        textbody: [
          `Name:  ${signup.name}`,
          `Email: ${signup.email}`,
          `State: ${signup.state}`,
          `Town:  ${signup.town}`,
          "",
          `Received: ${signup.receivedAt}`,
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      console.error("[waitlist] mail provider error", res.status, await res.text());
      return NextResponse.json(
        { error: "We couldn't add you just now. Please try again shortly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[waitlist] mail provider request failed", err);
    return NextResponse.json(
      { error: "We couldn't add you just now. Please try again shortly." },
      { status: 502 },
    );
  }
}
