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
                <li><a href="#authentication" className="text-indigo-400">Authentication & Security</a></li>
                <li><a href="#registry" className="hover:text-white transition-colors">Registry & Monitoring</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Core Features</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#ai-generator" className="text-indigo-400">✨ AI Generator</a></li>
                <li><a href="#base-paths" className="hover:text-white transition-colors">Custom Base Paths</a></li>
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

            {/* AI GENERATOR SECTION */}
            <section id="ai-generator" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-white">✨ AI Generator</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase">New</span>
              </div>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Describe your API logic in plain English, and FastDev will instantly generate a fully functional Python handler with persistence and validation.
              </p>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">How it works</h3>
                <ol className="space-y-4 text-sm text-zinc-400 list-decimal list-inside">
                  <li><strong>Prompt:</strong> Explain what the endpoint should do (e.g., "Create a user with email validation and return a JWT").</li>
                  <li><strong>Formats:</strong> Specify Input (e.g., JSON) and Output (e.g., JSON) expectations.</li>
                  <li><strong>Initial State:</strong> Optionally provide seed data (e.g., <code>{`{"users": []}`}</code>) for the mock to start with.</li>
                  <li><strong>Deploy:</strong> Click "Generate & Deploy" to get your live endpoint instantly.</li>
                </ol>
              </div>
            </section>

            {/* BASE PATHS SECTION */}
            <section id="base-paths" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-4">Custom Base Paths</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Organize your mocks under custom namespaces (Base Paths) or group them under existing ones.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Existing IDs</p>
                  <p className="text-sm text-zinc-400 italic">Select from your previously created Base Paths to add new routes (e.g., `/api/v1` &rarr; add `/users`, `/posts`).</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Create New</p>
                  <p className="text-sm text-zinc-400 italic">Define a unique ID (e.g., `my-project-api`). We verify availability instantly to ensure no collisions.</p>
                </div>
              </div>
            </section>

            {/* AUTH SECTION */}
            <section id="authentication" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-4">Authentication & Security</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                FastDev provides secure access to your mocks while allowing for public sharing.
              </p>

              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-1">●</span>
                  <span><strong>Extended Sessions:</strong> Login sessions now last for <strong>30 days</strong>, so you don't receive interruptions during development.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-1">●</span>
                  <span><strong>Visibility Control:</strong> Mark endpoints as <strong>Public</strong> (accessible by anyone) or <strong>Private</strong> (only visible to you).</span>
                </li>
              </ul>
            </section>

            {/* REGISTRY SECTION */}
            <section id="registry" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-4">Registry & Monitoring</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                The Registry is your central hub for managing all deployed endpoints.
              </p>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Key Features</h3>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li><strong>Detailed View:</strong> Click "View Details" to see the full configuration, code, and initial data of any endpoint.</li>
                  <li><strong>Filtering:</strong> Automatically shows your private endpoints and all public endpoints.</li>
                  <li><strong>Live Updates:</strong> Endpoints are active immediately upon creation.</li>
                </ul>
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
                  onChange={() => { }}
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