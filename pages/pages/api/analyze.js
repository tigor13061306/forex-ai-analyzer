export default async function handler(req, res) {
  const { image } = req.body;

  // Ovdje će kasnije ići poziv ka OpenAI GPT-4o API-ju
  res.status(200).json({
    result: "📊 Ovo je testni odgovor. AI analiza će biti ovdje kada povežemo OpenAI API. ✅"
  });
}
