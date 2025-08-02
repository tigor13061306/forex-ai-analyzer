export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Image is required" });
  }

  // TODO: Ovdje će ići povezivanje sa OpenAI GPT-4o kad se API integracija doda

  // Za sada vraćamo testni odgovor
  return res.status(200).json({
    result: "✅ Slika je uspješno primljena! AI analiza uskoro dolazi...",
  });
}
