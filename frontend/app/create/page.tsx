"use client";

import { useState, useEffect } from "react";
import { MockForm } from "@/components/MockForm";
import { DeploymentStatus } from "@/components/Deployment";

export default function Home() {
  const [method, setMethod] = useState("GET");
  const [activeTab, setActiveTab] = useState("static");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (method === "GET") {
      setActiveTab("static");
    } else {
      setActiveTab("post_mock");
    }
  }, [method]);

  const handleSuccess = (url: string) => {
    setGeneratedUrl(url);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-950 p-6 md:p-12 font-sans text-zinc-300 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">

        <header className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter">FastDev Engine</h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Instantly deploy programmable API endpoints</p>
        </header>

        <main className="bg-zinc-900 rounded-3xl p-1 border border-zinc-800 shadow-2xl overflow-hidden">
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
            <MockForm activeTab={activeTab} method={method} onSuccess={handleSuccess} />
            {generatedUrl && <DeploymentStatus url={generatedUrl} />}
          </div>
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