"use client";

import React, { useState, ChangeEvent } from 'react';

interface ApiResponse {
  status: number;
  statusText: string;
  body: string;
  isJson: boolean;
  time: number;
  headers: Record<string, string>;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const MetricCard = ({ label, value, colorClass = "text-zinc-100" }: { label: string, value: string | number, colorClass?: string }) => (
  <div className="bg-zinc-800/50 border border-zinc-700 p-3 rounded-lg flex flex-col gap-1">
    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{label}</span>
    <span className={`font-mono text-sm ${colorClass}`}>{value}</span>
  </div>
);

const ApiTester: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [requestBody, setRequestBody] = useState<string>('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const startTime = performance.now();

    try {
      const options: RequestInit = { 
        method,
        headers: method !== 'GET' ? { 'Content-Type': 'application/json' } : {}
      };

      if (method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const endTime = performance.now();
      const rawText = await res.text();
      
      const headersObj: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headersObj[key] = value;
      });

      let isJson = false;
      let formattedBody = rawText;

      try {
        const json = JSON.parse(rawText);
        formattedBody = JSON.stringify(json, null, 2);
        isJson = true;
      } catch {
        isJson = false;
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        body: formattedBody,
        isJson: isJson,
        time: Math.round(endTime - startTime),
        headers: headersObj
      });

    } catch (err: any) {
      setError(err.message || "Failed to fetch. Check CORS or URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-zinc-950 min-h-screen text-zinc-200 font-sans">
      <div className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden">
        
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white">API Systems Architect</h2>
          <p className="text-zinc-500 text-sm">Design, test, and measure endpoint performance</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-2">
            <select 
              value={method} 
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className="border border-zinc-700 p-3 rounded-md bg-zinc-800 text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {['GET', 'POST', 'PUT', 'DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border border-zinc-700 p-3 rounded-md bg-zinc-800 text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="https://api.example.com/v1/resource"
            />

            <button
              onClick={handleTest}
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-3 rounded-md font-bold hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all active:scale-95"
            >
              {loading ? 'EXECUTING...' : 'SEND'}
            </button>
          </div>

          {method !== 'GET' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Request Body (JSON)</label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full h-32 p-4 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-sm text-indigo-300 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}

          {response && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard 
                label="Status" 
                value={`${response.status} ${response.statusText}`} 
                colorClass={response.status < 300 ? "text-emerald-400" : "text-rose-400"} 
              />
              <MetricCard label="Time" value={`${response.time}ms`} colorClass="text-amber-400" />
              <MetricCard label="Format" value={response.isJson ? "JSON" : "TEXT"} colorClass="text-blue-400" />
              <MetricCard label="Size" value={`${new Blob([response.body]).size} bytes`} />
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-500/10 text-rose-400 rounded-md border border-rose-500/20 text-sm font-mono">
              <span className="font-bold mr-2">NETWORK_ERROR:</span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Response Body</label>
              <div className="relative group">
                <pre className="w-full h-[500px] p-4 bg-black text-emerald-500 rounded-lg overflow-auto font-mono text-xs leading-relaxed border border-zinc-800 scrollbar-thin">
                  {response ? response.body : <span className="text-zinc-800">// Idle - Awaiting Trigger</span>}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Response Headers</label>
              <div className="h-[500px] p-4 bg-zinc-950 border border-zinc-800 rounded-lg overflow-auto font-mono text-[11px]">
                {response ? (
                  Object.entries(response.headers).map(([key, val]) => (
                    <div key={key} className="mb-2 pb-2 border-b border-zinc-900 last:border-0">
                      <div className="text-zinc-500 mb-0.5">{key}</div>
                      <div className="text-zinc-300 break-all">{val}</div>
                    </div>
                  ))
                ) : (
                  <span className="text-zinc-800 italic">No headers recorded</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;