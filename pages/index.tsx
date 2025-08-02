export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ result: "⚠️ Slika nije poslata." });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `📘 AI MSS ANALIZA – STRATEŠKI PROMT ZA SVAKODNEVNE FOREX ANALIZE ...` // skraceno za preglednost
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ]
      })
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "⚠️ Nema AI odgovora.";
    res.status(200).json({ result: reply });
  } catch (err) {
    console.error("Greška u AI analizi:", err);
    res.status(500).json({ result: "❌ Greška u obradi zahtjeva." });
  }
}
