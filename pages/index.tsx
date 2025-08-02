import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!image) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      setResult(data.result);
    };
    reader.readAsDataURL(image);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>📸 Forex AI Analyzer</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ width: 300, marginTop: 10 }}
        />
      )}
      <br />
      <button onClick={handleAnalyze} style={{ marginTop: 20 }}>
        🔍 Analiziraj
      </button>
      <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>{result}</pre>
    </div>
  );
}
