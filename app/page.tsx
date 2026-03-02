"use client";
import { useState } from "react";
import { ArrowRight, LinkIcon } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch("/api/create", {
        method: "POST",
        body: JSON.stringify({ destinationUrl: url, type: "url" }),
      });
      const data = await res.json();
      if (data.success) setResult(data.shortLink);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
        Short links, <span className="text-blue-600">big impact.</span>
      </h1>
      <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10">
        Securely share URLs and documents with ultra-fast short links.
      </p>

      <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-2">
        <input 
          type="url" 
          placeholder="Paste your long link here..." 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow pl-4 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button 
          onClick={handleCreate}
          disabled={loading || !url}
          className="flex items-center justify-center px-6 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? "Shortening..." : "Shorten"}
          {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
        </button>
      </div>

      {result && (
        <div className="mt-6 max-w-2xl mx-auto p-4 bg-green-50 border border-green-200 rounded-xl flex justify-between items-center gap-4">
          <span className="text-green-800 font-medium truncate">{result}</span>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(result);
              alert("Copied!");
            }}
            className="px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg hover:bg-green-100 whitespace-nowrap"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}