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
    const current = pasteZoneRef.current;
    if (current) {
      current.addEventListener("paste", handlePaste);
    } else {
      window.addEventListener("paste", handlePaste);
    }
    return () => {
      if (current) {
        current.removeEventListener("paste", handlePaste);
      } else {
        window.removeEventListener("paste", handlePaste);
      }
    };
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

      <label
        htmlFor="imageUpload"
        style={{
          display: "inline-block",
          padding: "0.5rem 1rem",
          background: "#0070f3",
          color: "#fff",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        📁 Odaberi sliku
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />

    <div
  ref={pasteZoneRef}
  style={{
    marginTop: "2rem",
    border: "3px dashed #0070f3",
    borderRadius: "10px",
    padding: "2.5rem",
    background: "#f0f8ff",
    minHeight: "180px",
    color: "#003366",
    fontWeight: 600,
    fontSize: "1.2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 0 10px rgba(0, 112, 243, 0.2)"
  }}
>
  📋 <span style={{ marginLeft: "0.5rem" }}>Ovde zalijepite grafikon (Ctrl+V)</span>
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

      <button
        onClick={handleAnalyze}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        🔍 Analiziraj
      </button>

      {result && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            marginTop: "2rem",
            background: "#f9f9f9",
            padding: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}
