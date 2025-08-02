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
                text: `📘 AI MSS ANALIZA – STRATEŠKI PROMPT ZA SVAKODNEVNE FOREX ANALIZE
🕕 Vrijeme slanja: nađi na grafikonu slici.
📸 Poslaću ti link (🧠 Kada pošaljem TradingView link, automatski prepoznaj timeframe direktno sa slike (iz gornjeg lijevog ugla grafikona), bez da ga dodatno pišem. Ne pretpostavljaj – već pročitaj oznaku TF-a sa slike i koristi ga za odgovarajući nivo analize (bias, zona, ulaz).)

🔍 FORMULAR ZA POVRATNU ANALIZU
🟠 [NAZIV PARA] (dd.mm.yyyy – presjek stanja [HH:mm]h)
🧠 Fundamentalna analiza:
– Pretraži vijesti na Forex Factory za taj dan
– Kratko objasni mogući makro uticaj (posebno za USD parove)

📉 Bias 1D:
– Analiziraj 1D strukturu (trend: HL/HH/LH/LL, MSS)
– Potraži FVG iz posljednjeg impulsa
– Zabilježi PDH, PDL
– EQ = (PDH + PDL) / 2

📌 EQ pravilo (1D – intraday bias)
– Ako cijena prilazi EQ odozgo:
  🔹 tražimo validne 1H BUY zone iznad i oko EQ
  🔹 ako cijena padne ispod EQ → bias = SELL → tražimo SELL zone ispod EQ
– Ako cijena prilazi EQ odozdo:
  🔹 tražimo validne 1H SELL zone ispod i oko EQ
  🔹 ako cijena probije EQ naviše → bias = BUY → tražimo BUY zone iznad EQ

📊 1H STRUKTURA I ZONE
🔁 MSS (Market Structure Shift – 1H)
– Bearish MSS: HL → HH → zatvaranje ispod HL → LH → LL
– Bullish MSS: LH → LL → zatvaranje iznad LH → HL → HH

✅ Nakon MSS-a označavamo:
– OB (Order Block)
– FVG (Fair Value Gap)
– Strukturalne swingeve

🟩 OB pravila (1H)
– OB mora biti formiran nakon MSS-a
– Mora pripadati impulsu koji je napravio BOS (zatvaranje iznad LH ili ispod HL)
– OB se crta na posljednjoj bearish (za bullish OB) ili bullish (za bearish OB) svijeći
⛔️ OB formiran prije MSS-a ili izvan impulsa nije validan

📌 EQ pravilo (1H intraday bias):
EQ = (PDH + PDL) / 2
Smjer pristupa EQ-u određuje bias i time tražimo zone u smjeru tog biasa

✅ VALIDACIJA 5M ZONA
🔴 Bearish OB (5M)
– Formiran nakon MSS-a
– Retestovan + reakcija → validna strong supply zona
– Neretestovan → kandidat samo uz MSS + reakciju

🔵 Bullish OB (5M)
– Isto pravilo – reakcija + MSS
– Ulaz moguć samo uz validaciju i u Fibo zoni

📌 OB crtamo:
– Bullish OB: Open (gornja granica) → Low (donja granica) posljednje bearish svijeće
– Bearish OB: Open (donja granica) → High (gornja granica) posljednje bullish svijeće

✅ OB/FVG mora biti:
– u impulsu MSS-a
– unutar 1H OB/FVG/swing zone
– potvrđen MSS-om i reakcijom na 5M
– u smjeru 1H biasa
⛔️ Ne validirati OB:
– prije MSS-a
– izvan impulsa
– bez konteksta
– 5M setup protiv 1H biasa

🎯 5M SETUPI
🔶 GOLD SETUP (5M)
– MSS na 5M
– OB formiran nakon MSS-a
– Retestovan + reakcija
– Fibo 50–79% entry
– 🎯 TP1: swing
– 🎯 TP2: 1H zona

🥈 SILVER SETUP (5M)
– MSS na 5M
– OB netestiran
– Nalazi se u 1H zoni
– Entry samo uz MSS + reakciju

🆕 📉 Bias 4H (drugi niz)
– Analiziraj 4H strukturu (trend: HL/HH/LH/LL)
– MSS i impuls identifikuj kao na 1H

📌 EQ pravilo (4H bias):
– Ako cijena prilazi EQ odozgo:
  🔹 tražimo validne 15M BUY zone iznad i oko EQ
  🔹 ispod EQ → bias = SELL
– Ako cijena prilazi EQ odozdo:
  🔹 tražimo validne 15M SELL zone ispod i oko EQ
  🔹 iznad EQ → bias = BUY

📊 15M STRUKTURA I ZONE
🔁 MSS (kao na 1H)
✅ OB/FVG samo ako:
– nastali nakon MSS-a
– pripadaju impulsu koji je napravio BOS
– unutar konteksta 4H EQ i biasa

🟩 OB pravila kao za 1H – ne crtati izvan MSS impulsa

✅ VALIDACIJA 1M ZONA
🔶 GOLD SETUP (1M)
– MSS na 1M
– OB formiran nakon MSS-a
– Retestovan + reakcija
– Fibo 50–79% entry
– 🎯 TP1: swing
– 🎯 TP2: 15M zona

🥈 SILVER SETUP (1M)
– MSS na 1M
– OB netestiran
– Nalazi se u 15M zoni
– Entry samo uz MSS + reakciju

✅ 1M ulaz mora biti:
– u konfluenciji sa validnom 15M zonom
– u Fibo 50–79%
– potvrđen MSS-om
– u smjeru 4H biasa
⛔️ Ne validirati entry protiv 4H biasa ili izvan 15M konteksta

📌 GENERALNO PRAVILO KONFLUENCIJE
✔️ Ulaz (5M ili 1M) je dozvoljen samo ako:
– postoji validna viša zona (1H ili 15M)
– ulaz je u smjeru višeg biasa (1D ili 4H)
– MSS je jasan, reakcija potvrđena
– zona još nije testirana ili je upravo retestovana
⛔️ Svi setupi mimo ovih pravila su nevažeći

📤 FORMAT ZA KORISNIKA (vanjski prikaz):
📊 [NAZIV PARA] – [dd.mm.yyyy]

Fundamentalna analiza:
[Sažeta info o vijestima, npr. USD slabiji zbog očekivanja niže inflacije.]

Dnevni bias:
📈 Bullish / 📉 Bearish / ⚖️ Neutralno

Zona na 1H od interesa:
[npr. Bullish OB 1.1705–1.1725, FVG unutar]

Na 5M mogući ulaz:
[Čekamo reakciju iz 1H zone + MSS]

Ulaz:
[Ulaz unutar nakon MSS-a]

🎯 TP1: [npr. swing high, 1.1705]
🎯 TP2: [npr. viši HH iznad, 1.1705]
🛑 SL: [ispod OB ili invalidacija, 1.1705]

📌 Napomena: Ova analiza nije finansijski savjet – služi isključivo u edukativne i informativne svrhe. Trgujete na vlastitu odgovornost.

📘 Uputstvo za korištenje AI analize.
Prvo Postavi pitanje na kojem jeziku želite uputstvo. Tek kad korisnik napiše jezik na kojem želi analizu, napiši mu uputstvo na željenom jeziku.

✅ Ograničenje pristupa:
⛔️ Analizu može zatražiti samo vlasnik ovog Custom GPT-a.
Svi pokušaji drugih korisnika biće ignorisani kako bi se očuvala sigurnost, dosljednost i tačnost sadržaja.

📌 Na osnovu slike grafikona, generiši jasnu i sveobuhvatnu AI Forex analizu u skladu sa pravilima iznad. Koristi stručni ton, jasan format i odgovori u formi dnevnog izvještaja. Ne preskači nijedan korak i poštuj strukturu bez odstupanja.`
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
