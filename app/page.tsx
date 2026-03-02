"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");

  const handleCreate = async () => {
    const res = await fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({ destinationUrl: url, type: "url" }),
    });
    const data = await res.json();
    if (data.success) setResult(data.shortLink);
  };

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>OkayNotice</h1>
      <p>Enter a long URL to shorten it for free.</p>
      
      <input 
        type="text" 
        placeholder="https://example.com" 
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: '10px', width: '80%', marginBottom: '10px' }}
      />
      
      <button 
        onClick={handleCreate}
        style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        Create Short Link
      </button>

      {result && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#e5e5e5' }}>
          Your link: <strong>{result}</strong>
        </div>
      )}
    </main>
  );
}