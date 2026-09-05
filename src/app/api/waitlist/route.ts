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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.WAITLIST_TO_EMAIL ?? site.email;
  const from = process.env.WAITLIST_FROM_EMAIL;

  // No mail provider configured yet — the backend is still being built, so the
  // signup is logged server-side rather than dropped. Set RESEND_API_KEY and
  // WAITLIST_FROM_EMAIL to deliver by email. See README.
  if (!apiKey || !from) {
    console.info("[waitlist] signup received (no mail provider configured)", signup);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `WeNaija waitlist — ${name} (${state})`,
        text: [
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
