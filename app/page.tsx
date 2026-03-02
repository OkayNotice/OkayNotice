"use client";
import { useState } from "react";
import { ArrowRight, LinkIcon, FileText, UploadCloud, Lock, Clock } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<"url" | "file">("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  // Defaulting to 7 days to save your storage budget!
  const [expiresIn, setExpiresIn] = useState("7"); 
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

        const uploadRes = await fetch(passData.signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadRes.ok) throw new Error("Cloudflare rejected the upload.");

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

      {/* Main Creation Card */}
      <div className="max-w-2xl mx-auto bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col gap-5 text-left">
        
        {/* 1. Input Area */}
        {mode === "url" ? (
          <input 
            type="url" 
            placeholder="Paste your long link here..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-4 pr-3 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        ) : (
          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer py-10 px-4 transition-colors">
            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-700 font-medium text-center truncate w-full px-4">
              {file ? file.name : "Tap to browse files (Max 5MB)"}
            </span>
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        )}

        {/* 2. Optional Settings (Side-by-side on desktop, stacked on mobile) */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Password Input */}
          <div className="flex-1 inline-flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
            <Lock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Password (optional)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-sm text-gray-700 outline-none w-full"
            />
          </div>

          {/* Expiration Dropdown */}
          <div className="flex-1 inline-flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
            <Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <select 
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full"
            >
              <option value="7">Expire in 7 Days</option>
              <option value="14">Expire in 14 Days</option>
              <option value="1">Expire in 24 Hours</option>
              <option value="0">Never Expire</option>
            </select>
          </div>
        </div>

        {/* 3. Submit Button */}
        <button 
          onClick={handleCreate}
          disabled={loading || (mode === "url" ? !url : !file)}
          className="w-full flex items-center justify-center px-6 py-4 mt-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 font-bold text-lg transition-colors shadow-sm"
        >
          {loading ? "Processing..." : mode === "url" ? "Shorten Link" : "Upload & Share"}
          {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
        </button>
      </div>

      {/* The Result Area */}
      {result && (
        <div className="mt-8 max-w-2xl mx-auto flex flex-col gap-3 text-left transition-all">
          <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-green-800 font-medium truncate w-full sm:w-auto">{result}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(result);
                alert("Link Copied!");
              }}
              className="w-full sm:w-auto px-6 py-2 bg-white text-green-700 border border-green-300 rounded-xl hover:bg-green-100 whitespace-nowrap font-bold shadow-sm"
            >
              Copy Link
            </button>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 rounded-2xl flex justify-between items-center shadow-sm">
            <span className="text-gray-600 text-sm">Track your views instantly:</span>
            <a 
              href={`/stats/${result.split('/').pop()}`} 
              target="_blank"
              className="text-sm font-bold text-blue-600 hover:text-blue-800 underline"
            >
              View Analytics →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}