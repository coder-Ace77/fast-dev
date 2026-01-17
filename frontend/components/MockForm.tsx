"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { CodeEditor } from "./CodeEditor";
import form from "@/constants/form";

interface Props {
  activeTab: string;
  method: string;
  onSuccess: (url: string) => void;
}

export const MockForm = ({ activeTab, method, onSuccess }: Props) => {
  const [path, setPath] = useState("/");
  const [jsonInput, setJsonInput] = useState('{\n  "status": "success"\n}');
  const [funcCode, setFuncCode] = useState(form.getCode);

  const [postCode, setPostCode] = useState(form.postCode);
  const [funcData, setFuncData] = useState(form.funcData);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please provide a name for this mock.");
      return;
    }

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
      } else if (activeTab === "post_mock") {
        config = {
          path,
          method: method,
          code: postCode,
          data: JSON.parse(funcData)
        };
      }

      const res = await api.post("/url", {
        type: activeTab,
        config: config,
        name: name,
        description: description,
        is_public: isPublic
      });

      onSuccess(res.data.base_url);
    } catch (e: any) {
      const errorMsg = e.response?.data?.detail?.[0]?.msg || e.message;
      alert(`Submission Error: ${errorMsg}`);
      console.error("Full Error Context:", e.response?.data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-inner">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Mock Identity *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            placeholder="e.g., Payment Gateway Mock"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visibility</label>
          <select
            value={isPublic ? "public" : "private"}
            onChange={(e) => setIsPublic(e.target.value === "public")}
            className="w-full p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            <option value="public">🌍 Public</option>
            <option value="private">🔒 Private</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Project Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Describe the purpose of this mock..."
          />
        </div>
      </div>

      <div className="h-px bg-zinc-800 w-full" />

      {(activeTab === "static" || activeTab === "functional") && (
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Route Path</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-sm">/</span>
            <input
              type="text"
              value={path.startsWith('/') ? path.slice(1) : path}
              onChange={(e) => setPath('/' + e.target.value)}
              className="w-full pl-6 p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="api/v1/resource"
            />
          </div>
        </div>
      )}

      {activeTab !== "functional" && activeTab !== "post_mock" ? (
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {activeTab === "mapping" ? "Route Mapping Configuration (JSON Array)" : "Response JSON Payload"}
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
              <span className="text-indigo-400 normal-case font-mono">handler(url, headers, body, data)</span>
            </label>
            <CodeEditor
              language="python"
              value={activeTab === "post_mock" ? postCode : funcCode}
              onChange={(val) => activeTab === "post_mock" ? setPostCode(val || "") : setFuncCode(val || "")}
              height="350px"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Initial Data State (JSON)</label>
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
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-[0.98] border border-indigo-400/20"
      >
        Build & Deploy Endpoint
      </button>
    </div>
  );
};