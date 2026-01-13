"use client";

import { CodeEditor } from "@/components/CodeEditor";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Architecture</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#introduction" className="hover:text-white transition-colors">Introduction</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Mock Types</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#static" className="text-indigo-400">Static Responses</a></li>
                <li><a href="#mapping" className="hover:text-white transition-colors">Route Mapping</a></li>
                <li><a href="#functional" className="hover:text-white transition-colors">Programmable Logic</a></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 max-w-3xl">
          <header className="mb-16">
            <h1 className="text-5xl font-black text-white mb-6 tracking-tighter" id="introduction">Documentation</h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              FastDev is a high-performance mocking engine designed to eliminate backend dependencies. 
              Deploy programmable endpoints with persistent state in under 30 seconds.
            </p>
          </header>

          <div className="space-y-24">
            
            {/* STATIC SECTION */}
            <section id="static" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-white">Static Responses</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-bold uppercase">v1.0</span>
              </div>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                The simplest way to mock an API. Provide a path and a JSON payload. Every request to that path returns the same data.
              </p>
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Technical Spec</h3>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-500 mt-1">●</span>
                    <span><strong>Default Path:</strong> If no path is provided, the mock resolves at the root <code>/</code>.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-400 mt-1">●</span>
                    <span><strong>Content-Type:</strong> Automatically set to <code>application/json</code>.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-4">
                <span className="text-amber-500 font-bold text-sm">PRO TIP</span>
                <p className="text-sm text-amber-200/70">Use Static mocks for 404/500 error simulation by pasting the specific error schema your frontend expects.</p>
              </div>
            </section>

            {/* MAPPING SECTION */}
            <section id="mapping" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-4">Route Mapping</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Define an array of sub-routes within a single deployment. This mimics a full REST resource.
              </p>

              

              <div className="rounded-xl overflow-hidden mb-6">
                <CodeEditor 
                  language="json"
                  height="220px"
                  value={JSON.stringify([
                    { "path": "/users", "value": { "count": 2, "data": [] } },
                    { "path": "/settings", "value": { "theme": "dark" } }
                  ], null, 2)}
                  onChange={() => {}}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Matching Logic</p>
                  <p className="text-sm text-zinc-400 italic">Suffix-based routing. The engine checks the end of the URL against your defined paths.</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Max Routes</p>
                  <p className="text-sm text-zinc-400 italic">Up to 50 individual mappings per endpoint ID are supported in the free tier.</p>
                </div>
              </div>
            </section>

            {/* FUNCTIONAL SECTION */}
            <section id="functional" className="scroll-mt-24 pb-20">
              <h2 className="text-2xl font-bold text-white mb-4 font-mono">def handler(url, headers, body, data):</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Functional mocks inject your request into a restricted Python environment. 
                This allows for dynamic logic, header-based auth, and persistent state.
              </p>

              

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">The Parameters</h4>
                  <table className="w-full text-sm text-left">
                    <thead className="text-zinc-500 border-b border-zinc-800">
                      <tr>
                        <th className="pb-2">Param</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-3 font-mono text-indigo-400">url</td>
                        <td className="py-3 font-mono text-xs">string</td>
                        <td className="py-3">The full request URL.</td>
                      </tr>
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-3 font-mono text-indigo-400">headers</td>
                        <td className="py-3 font-mono text-xs">dict</td>
                        <td className="py-3">Incoming HTTP headers.</td>
                      </tr>
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-3 font-mono text-indigo-400">body</td>
                        <td className="py-3 font-mono text-xs">any</td>
                        <td className="py-3">Parsed JSON or raw body string.</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-mono text-indigo-400">data</td>
                        <td className="py-3 font-mono text-xs">dict</td>
                        <td className="py-3 text-emerald-500 font-medium">Persistent state (Read/Write).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <h4 className="text-sm font-bold text-white italic">Example: Stateful Counter</h4>
                <CodeEditor 
                  language="python"
                  height="250px"
                  value={`def handler(url, headers, body, data):
    # Initialize state if missing
    if "count" not in data:
        data["count"] = 0
    
    # Increment global counter
    data["count"] += 1
    
    return {
        "msg": "Request processed",
        "total_requests": data["count"]
    }`}
                  onChange={() => {}}
                />
              </div>

              <div className="mt-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-white mb-2">Important Constraints</h3>
                <p className="text-sm text-zinc-400 mb-4 italic leading-relaxed">
                  To ensure system stability, functional mocks have a 2.0s execution timeout and cannot access 
                  the Python standard libraries (os, sys, etc.).
                </p>
                <div className="flex gap-2">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
                   <p className="text-sm text-zinc-300">Persistent variables in <code>data</code> are saved automatically after execution.</p>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}