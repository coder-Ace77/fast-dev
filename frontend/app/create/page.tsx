"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { MockForm } from "@/components/MockForm";
import { DeploymentStatus } from "@/components/Deployment";
import { useRouter } from "next/navigation";
import { BasePathSelector } from "@/components/BasePathSelector";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"ai" | "manual">("ai");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/create");
    }
  }, [router]);

  // Manual Mode State
  const [method, setMethod] = useState("GET");
  const [activeTab, setActiveTab] = useState("static");

  // AI Mode State
  const [aiName, setAiName] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [aiInputFormat, setAiInputFormat] = useState("");
  const [aiOutputFormat, setAiOutputFormat] = useState("");
  const [aiPath, setAiPath] = useState("");
  const [aiInitialData, setAiInitialData] = useState("");
  const [aiIsPublic, setAiIsPublic] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [progress, setProgress] = useState(0);

  // Base Path State
  const [customId, setCustomId] = useState("");
  const [isBasePathValid, setIsBasePathValid] = useState(false);

  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (method === "GET") {
      setActiveTab("static");
    } else {
      setActiveTab("post_mock");
    }
  }, [method]);

  // Fake Progress Bar Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (aiLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          // Slow down as we get closer to 90%
          const increment = prev > 80 ? 2 : Math.random() * 15;
          return Math.min(prev + increment, 90);
        });
      }, 800);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [aiLoading]);


  const handleSuccess = (url: string) => {
    setGeneratedUrl(url);
    setRefreshKey((prev) => prev + 1);
  };

  const handleAiSubmit = async () => {
    if (!aiName || !aiDescription || !aiPath) {
      alert("Please fill in Name, Description and Path.");
      return;
    }
    if (!isBasePathValid || !customId) {
      alert("Please select a valid Base Path.");
      return;
    }

    setAiLoading(true);
    setAiError("");
    setGeneratedUrl(null);
    setProgress(0);

    try {
      // 1. Generate code via AI
      // Append initial data context if present
      const fullDescription = aiInitialData
        ? `${aiDescription}\n\n[Context/Initial Data]: ${aiInitialData}`
        : aiDescription;

      const genRes = await api.post("/ai/generate", {
        description: fullDescription,
        input_format: aiInputFormat,
        output_format: aiOutputFormat,
        url: aiPath
      });

      // Force progress to 100% on success (visual completion)
      setProgress(100);

      const generatedCode = genRes.data.content;

      // 2. Register the mock via the standard endpoint
      // We assume AI generates a Python handler
      const config = {
        path: aiPath.startsWith('/') ? aiPath : '/' + aiPath,
        code: generatedCode,
        data: genRes.data.data || {} // Use data returned from AI (likely parsed JSON)
      };

      const regRes = await api.post("/url", {
        type: "functional", // AI mocks are functional python handlers
        config: config,
        name: aiName,
        description: aiDescription,
        is_public: aiIsPublic,
        custom_id: customId
      });

      handleSuccess(regRes.data.base_url);

    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 429) {
        setAiError("Weekly AI limit reached.");
      } else {
        setAiError(err.response?.data?.detail?.[0]?.msg || err.message || "Failed to generate/register mock.");
      }
    } finally {
      // Delay turning off loading slightly to let progress bar finish
      setTimeout(() => setAiLoading(false), 500);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-950 p-6 md:p-12 font-sans text-zinc-300 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">

        <header className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter">FastDev Engine</h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Instantly deploy programmable API endpoints</p>
        </header>

        <main className="bg-zinc-900 rounded-3xl p-1 border border-zinc-800 shadow-2xl overflow-hidden">

          {/* Top Level Mode Tabs */}
          <nav className="grid grid-cols-2 p-1.5 bg-zinc-900/50 border-b border-zinc-800/50 gap-2">
            <button
              onClick={() => { setMode("ai"); setGeneratedUrl(null); }}
              className={`py-4 text-xs font-black uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 ${mode === "ai"
                ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                }`}
            >
              <span>✨</span> AI Generator
            </button>
            <button
              onClick={() => { setMode("manual"); setGeneratedUrl(null); }}
              className={`py-4 text-xs font-black uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 ${mode === "manual"
                ? "bg-zinc-800 text-white shadow-lg ring-1 ring-zinc-700"
                : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                }`}
            >
              <span>🛠️</span> Manual Builder
            </button>
          </nav>

          {mode === "manual" ? (
            <>
              <div className="p-4 border-b border-zinc-800/50 flex space-x-4 items-center bg-zinc-900/50">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">HTTP Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 border border-zinc-700 outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <nav className="flex p-1.5 bg-zinc-900 border-b border-zinc-800/50">
                {(method === "GET" ? ["static", "mapping", "functional"] : ["functional"]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      if (method === "GET") {
                        setActiveTab(tab);
                      }
                      setGeneratedUrl(null);
                    }}
                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-2xl ${(activeTab === tab || (method !== "GET" && tab === "functional"))
                      ? "bg-zinc-800 text-white shadow-lg ring-1 ring-zinc-700"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>

              <div className="p-8 md:p-10">
                <MockForm
                  activeTab={activeTab}
                  method={method}
                  onSuccess={handleSuccess}
                  onInteract={() => setGeneratedUrl(null)}
                />
                {generatedUrl && <DeploymentStatus url={generatedUrl} />}
              </div>
            </>
          ) : (
            <div className="p-8 md:p-10 space-y-6">
              {/* AI FORM */}
              <BasePathSelector
                value={customId}
                onChange={setCustomId}
                onValidityChange={setIsBasePathValid}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-inner">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Mock Identity *</label>
                  <input
                    type="text"
                    value={aiName}
                    onChange={(e) => { setAiName(e.target.value); setGeneratedUrl(null); }}
                    className="w-full p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="e.g., User Profile Service"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visibility</label>
                  <select
                    value={aiIsPublic ? "public" : "private"}
                    onChange={(e) => { setAiIsPublic(e.target.value === "public"); setGeneratedUrl(null); }}
                    className="w-full p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                  >
                    <option value="public">🌍 Public</option>
                    <option value="private">🔒 Private</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Route Path *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-sm">/</span>
                  <input
                    type="text"
                    value={aiPath.startsWith('/') ? aiPath.slice(1) : aiPath}
                    onChange={(e) => { setAiPath('/' + e.target.value); setGeneratedUrl(null); }}
                    className="w-full pl-6 p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="api/v1/users/generate"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Prompt Description *</label>
                <textarea
                  value={aiDescription}
                  onChange={(e) => { setAiDescription(e.target.value); setGeneratedUrl(null); }}
                  className="w-full h-32 p-4 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Describe exactly what this endpoint should do. E.g., 'Accept a JSON body with 'username' and 'password', validate them, and return a JWT token if valid, otherwise return 401.'"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Initial Data (Optional)</label>
                <textarea
                  value={aiInitialData}
                  onChange={(e) => { setAiInitialData(e.target.value); setGeneratedUrl(null); }}
                  className="w-full h-20 p-4 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono"
                  placeholder='{"counter": 100, "users": []} - Initial state for the mock'
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Input Format</label>
                  <input
                    value={aiInputFormat}
                    onChange={(e) => { setAiInputFormat(e.target.value); setGeneratedUrl(null); }}
                    className="w-full p-2.5 mt-1 rounded-lg bg-zinc-800 border border-zinc-700 text-sm outline-none"
                    placeholder="JSON, Text..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Output Format</label>
                  <input
                    value={aiOutputFormat}
                    onChange={(e) => { setAiOutputFormat(e.target.value); setGeneratedUrl(null); }}
                    className="w-full p-2.5 mt-1 rounded-lg bg-zinc-800 border border-zinc-700 text-sm outline-none"
                    placeholder="JSON..."
                  />
                </div>
              </div>

              {aiError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                  {aiError}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleAiSubmit}
                  disabled={aiLoading || !aiName || !aiDescription || !aiPath || !customId || !isBasePathValid}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-[0.98] border border-indigo-400/20 flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {aiLoading ? "Generating..." : "🚀 Generate & Deploy API"}
                  </span>
                  {aiLoading && (
                    <div className="absolute inset-0 bg-indigo-500/20 animate-pulse" />
                  )}
                </button>

                {/* Visual Progress Bar */}
                {aiLoading && (
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                {/* Helper text during loading */}
                {aiLoading && progress < 100 && (
                  <p className="text-center text-[10px] text-zinc-500 animate-pulse uppercase tracking-widest">
                    AI is constructing your endpoint...
                  </p>
                )}
              </div>

              {generatedUrl && <DeploymentStatus url={generatedUrl} />}
            </div>
          )}

        </main>

        <footer className="text-center">
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
            Precision Tooling for Backend Virtualization
          </p>
        </footer>
      </div>
    </div>
  );
}