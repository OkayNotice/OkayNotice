"use client";
import { useState } from "react";
import { ArrowRight, Link as LinkIcon, Shield, Zap } from "lucide-react";

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
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
        Short links, <span className="text-blue-600">big impact.</span>
      </h1>
      <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10">
        Securely share URLs, documents, and files with ultra-fast short links. Built for modern teams.
      </p>

      {/* Input Section */}
      <div className="max-w-2xl mx-auto bg-white p-2 sm:p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="url" 
            placeholder="Paste your long link here..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 outline-none"
          />
        </div>
        <button 
          onClick={handleCreate}
          disabled={loading || !url}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 transition-colors"
        >
          {loading ? "Shortening..." : "Shorten"}
          {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
        </button>
      </div>

      {/* Result Area */}
      {result && (
        <div className="mt-6 max-w-2xl mx-auto p-4 bg-green-50 border border-green-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
          <span className="text-green-800 font-medium truncate w-full sm:w-auto text-left">{result}</span>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(result);
              alert("Link copied!");
            }}
            className="text-sm px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg hover:bg-green-100 w-full sm:w-auto transition-colors"
          >
            Copy Link
          </button>
        </div>
      )}

      {/* Features Grid */}
      <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left" id="features">
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Zap className="h-8 w-8 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
          <p className="text-gray-500">Built on Edge infrastructure to redirect your users instantly, anywhere in the world.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Shield className="h-8 w-8 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
          <p className="text-gray-500">Password protection, expiration dates, and secure file hosting built right in.</p>
        </div>
      </div>
    </div>
  );
}