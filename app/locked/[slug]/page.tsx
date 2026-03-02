"use client";
import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";

export default function LockedPage({ params }: { params: Promise<{ slug: string }> }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    setLoading(true);
    setError("");
    try {
      const resolvedParams = await params;
      const res = await fetch("/api/unlock", {
        method: "POST",
        body: JSON.stringify({ slug: resolvedParams.slug, password })
      });
      const data = await res.json();
      
      if (data.success) {
        window.location.href = data.target; // Send them to the file/link
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="bg-white p-8 rounded-3xl border shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Protected Link</h1>
        <p className="text-gray-500 mb-8">This link requires a password to access.</p>

        <input 
          type="password" 
          placeholder="Enter password..." 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none mb-4 text-center text-lg"
        />

        {error && <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>}

        <button 
          onClick={handleUnlock}
          disabled={loading || !password}
          className="w-full flex items-center justify-center px-6 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 font-medium"
        >
          {loading ? "Unlocking..." : "Unlock"}
          {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}