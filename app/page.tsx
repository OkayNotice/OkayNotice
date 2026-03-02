"use client";
import { useState } from "react";
import { ArrowRight, LinkIcon, FileText, UploadCloud, Lock, Clock } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<"url" | "file">("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [expiresIn, setExpiresIn] = useState("0");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setResult("");
    
    try {
      if (mode === "url") {
        if (!url) return;
        const res = await fetch("/api/create", {
          method: "POST",
          body: JSON.stringify({ 
            destinationUrl: url, 
            type: "url", 
            password, 
            expiresInDays: Number(expiresIn) 
          }),
        });
        const data = await res.json();
        if (data.success) setResult(data.shortLink);
        else alert("Error: " + data.error);
      } 
      
      else if (mode === "file") {
        if (!file) return;
        
        // 1. Get the upload ticket
        const passRes = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            fileSize: file.size,
          }),
        });
        const passData = await passRes.json();
        
        if (!passData.success) {
          alert("Error: " + passData.error);
          setLoading(false);
          return;
        }

        // 2. Upload to Cloudflare R2
        const uploadRes = await fetch(passData.signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadRes.ok) throw new Error("Cloudflare rejected the upload.");

        // 3. Save to Firestore
        const createRes = await fetch("/api/create", {
          method: "POST",
          body: JSON.stringify({ 
            destinationUrl: `r2://${passData.fileKey}`, 
            type: "file",
            password,
            expiresInDays: Number(expiresIn)
          }),
        });
        
        const createData = await createRes.json();
        if (createData.success) setResult(createData.shortLink);
      }
    } catch (error) {
      alert("Network error. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
        Share links & <span className="text-blue-600">files securely.</span>
      </h1>
      <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10">
        Fast, free, and privacy-focused sharing. Perfect for heavy documents.
      </p>

      {/* The Toggle Switch */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          <button 
            onClick={() => setMode("url")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            <LinkIcon className="w-4 h-4" /> Link
          </button>
          <button 
            onClick={() => setMode("file")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "file" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            <FileText className="w-4 h-4" /> File
          </button>
        </div>
      </div>

      {/* The Input Area */}
      <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-2">
        
        {mode === "url" ? (
          <input 
            type="url" 
            placeholder="Paste your long link here..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow pl-4 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        ) : (
          <label className="flex-grow flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer py-3 px-4 transition-colors">
            <UploadCloud className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-600 text-sm font-medium truncate">
              {file ? file.name : "Tap to browse files (Max 5MB)"}
            </span>
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        )}

        <button 
          onClick={handleCreate}
          disabled={loading || (mode === "url" ? !url : !file)}
          className="flex items-center justify-center px-6 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 font-medium"
        >
          {loading ? "Processing..." : mode === "url" ? "Shorten" : "Upload"}
          {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
        </button>
      </div>

      {/* Optional Settings (Password & Expiration) */}
      <div className="max-w-2xl mx-auto mt-4 text-left px-2 flex flex-col sm:flex-row gap-3">
        {/* Password Input */}
        <div className="inline-flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-blue-500 transition-colors flex-grow">
          <Lock className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Add a password (optional)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent text-sm text-gray-700 outline-none w-full"
          />
        </div>

        {/* Expiration Dropdown */}
        <div className="inline-flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-blue-500 transition-colors">
          <Clock className="w-4 h-4 text-gray-400 mr-2" />
          <select 
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
          >
            <option value="0">Never Expire</option>
            <option value="1">Expire in 24 Hours</option>
            <option value="3">Expire in 3 Days</option>
            <option value="7">Expire in 7 Days</option>
          </select>
        </div>
      </div>

      {/* The Result Area */}
      {result && (
        <div className="mt-8 max-w-2xl mx-auto flex flex-col gap-3 text-left transition-all">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex justify-between items-center gap-4">
            <span className="text-green-800 font-medium truncate">{result}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(result);
                alert("Link Copied!");
              }}
              className="px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg hover:bg-green-100 whitespace-nowrap font-medium"
            >
              Copy Link
            </button>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
            <span className="text-gray-600 text-sm">Track your views instantly:</span>
            <a 
              href={`/stats/${result.split('/').pop()}`} 
              target="_blank"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline"
            >
              View Analytics →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}