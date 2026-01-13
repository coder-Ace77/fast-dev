"use client";

import { useState } from "react";
import api from "@/lib/axois";
import { CodeEditor } from "./CodeEditor";

interface Props {
  activeTab: string;
  onSuccess: (url: string) => void;
}

export const MockForm = ({ activeTab, onSuccess }: Props) => {
  const [path, setPath] = useState("/");
  const [jsonInput, setJsonInput] = useState('{\n  "status": "success"\n}');
  const [funcCode, setFuncCode] = useState(
`def handler(url, headers, body, data):
    # url: current mock url
    # headers: dict of request headers
    # body: parsed json or raw string
    # data: your persistent data object
    
    return {
        "message": "Hello from FastDev",
        "stored_data": data
    }`
  );
  const [funcData, setFuncData] = useState('{\n  "admin": "adil",\n  "version": 1.0\n}');

  const handleSubmit = async () => {
    let config = {};

    try {
      if (activeTab === "static") {
        config = { path, value: JSON.parse(jsonInput) };
      } else if (activeTab === "mapping") {
        const routes = JSON.parse(jsonInput);
        if (!Array.isArray(routes)) throw new Error("Mapping must be an array of objects");
        config = { routes };
      } else if (activeTab === "functional") {
        config = { 
          path, 
          code: funcCode, 
          data: JSON.parse(funcData) 
        };
      }

      const res = await api.post("http://localhost:8000/url", {
        type: activeTab,
        config: config
      });
      onSuccess(res.data.base_url);
    } catch (e: any) {
      alert(e.message || "Execution error: Check syntax and JSON formats");
    }
  };

  return (
    <div className="space-y-6">
      {/* Shared Path Input */}
      {(activeTab === "static" || activeTab === "functional") && (
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Route Path</label>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="/api/v1/resource"
          />
        </div>
      )}

      {/* Conditional Editor Layout */}
      {activeTab !== "functional" ? (
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {activeTab === "mapping" ? "Route Mapping (JSON Array)" : "Response JSON"}
          </label>
          <CodeEditor 
            language="json" 
            value={jsonInput} 
            onChange={(val) => setJsonInput(val || "")} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex justify-between">
              Python Handler Logic
              <span className="text-indigo-400 normal-case">handler(url, headers, body, data)</span>
            </label>
            <CodeEditor 
              language="python" 
              value={funcCode} 
              onChange={(val) => setFuncCode(val || "")} 
              height="350px"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Persistent Data Object (JSON)</label>
            <CodeEditor 
              language="json" 
              value={funcData} 
              onChange={(val) => setFuncData(val || "")} 
              height="150px"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]"
      >
        Compile & Deploy Mock
      </button>
    </div>
  );
};