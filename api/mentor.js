// Backend del Mentor creativo — proxy a la API de Anthropic.
// La API key vive SOLO acá (variable de entorno del server), nunca en el navegador.
// Deploy: Vercel (carpeta /api = funciones serverless).

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Usá POST." });
    return;
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: "Falta configurar ANTHROPIC_API_KEY en el servidor." });
    return;
  }

  // (Opcional) candado simple: si definís MENTOR_TOKEN en el server, el front debe mandarlo.
  const gate = process.env.MENTOR_TOKEN;
  if (gate && req.headers["x-mentor-token"] !== gate) {
    res.status(401).json({ error: "No autorizado." });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { system, messages, model, max_tokens } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Faltan mensajes." });
      return;
    }

    const mt = Math.min(Math.max(parseInt(max_tokens, 10) || 3000, 256), 4000);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-5",
        max_tokens: mt,
        system: system || "",
        messages,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: (data && data.error && data.error.message) || "Error de Anthropic." });
      return;
    }

    const text = (data.content || [])
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n");

    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
