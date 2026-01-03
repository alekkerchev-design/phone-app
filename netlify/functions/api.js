// netlify/functions/api.js

export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const SCRIPT_URL = process.env.APPS_SCRIPT_URL; // must be /exec
    if (!SCRIPT_URL) {
      return new Response(JSON.stringify({ ok: false, error: "Missing APPS_SCRIPT_URL" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();

    const upstream = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();

    // Forward response as JSON
    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
