import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const pasteZoneRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          setImage(blob);
          setPreview(URL.createObjectURL(blob));
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleAnalyze = async () => {
    if (!image) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString();
      if (!base64) return;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: base64 })
      });

      const data = await res.json();
      setResult(data.result);
    };
    reader.readAsDataURL(image);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📸 Forex AI Analyzer</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <div
        ref={pasteZoneRef}
        style={{
          marginTop: "1rem",
          border: "2px dashed #aaa",
          padding: "2rem",
          textAlign: "center",
          background: "#f3f3f3"
        }}
      >
        📋 Zalijepi sliku ovdje (Ctrl+V)
      </div>

      {preview && (
        <div>
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: "100%", marginTop: "1rem" }}
          />
        </div>
      )}

      <button onClick={handleAnalyze} style={{ marginTop: "1rem" }}>
        🔍 Analiziraj
      </button>

      {result && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            marginTop: "2rem",
            background: "#f9f9f9",
            padding: "1rem"
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}
