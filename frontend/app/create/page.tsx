"use client";

import { useState } from "react";
import { MockForm } from "@/components/MockForm";
import { DeploymentStatus } from "@/components/Deployment";

export default function Home() {
  const [activeTab, setActiveTab] = useState("static");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = (url: string) => {
    setGeneratedUrl(url);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    // justify-center and items-center (optional) centers the content vertically/horizontally
    <div className="min-h-[calc(100vh-64px)] bg-zinc-950 p-6 md:p-12 font-sans text-zinc-300 flex flex-col items-center">
      
      {/* Container restricted to a readable width and centered */}
      <div className="w-full max-w-4xl space-y-8">
        
        <header className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter">FastDev Engine</h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Instantly deploy programmable API endpoints</p>
        </header>

        <main className="bg-zinc-900 rounded-3xl p-1 border border-zinc-800 shadow-2xl overflow-hidden">
          <nav className="flex p-1.5 bg-zinc-900 rounded-t-3xl border-b border-zinc-800/50">
            {["static", "mapping", "functional"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setGeneratedUrl(null);
                }}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-2xl ${
                  activeTab === tab
                    ? "bg-zinc-800 text-white shadow-lg ring-1 ring-zinc-700"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="p-8 md:p-10">
            <MockForm activeTab={activeTab} onSuccess={handleSuccess} />
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