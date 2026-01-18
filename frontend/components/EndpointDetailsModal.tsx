"use client";

import { CodeEditor } from "./CodeEditor";

interface EndpointDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    endpoint: any;
    fullUrl: string;
}

export const EndpointDetailsModal = ({ isOpen, onClose, endpoint, fullUrl }: EndpointDetailsModalProps) => {
    if (!isOpen || !endpoint) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 w-full max-w-3xl rounded-2xl border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">{endpoint.name || "Untitled Endpoint"}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="font-mono text-indigo-400 text-xs bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                                {endpoint.endpoint_id}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${endpoint.is_public
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : "bg-zinc-700 text-zinc-400 border-zinc-600"
                                }`}>
                                {endpoint.is_public ? "Public" : "Private"}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                {endpoint.type}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white transition-colors p-2"
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">

                    {/* Main URL Section */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Endpoint URL</label>
                        <div className="flex items-center gap-2 bg-black p-3 rounded-lg border border-zinc-800">
                            <code className="text-sm text-indigo-300 font-mono break-all">{fullUrl}</code>
                            <button
                                onClick={() => navigator.clipboard.writeText(fullUrl)}
                                className="ml-auto text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    {endpoint.description && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                            <p className="text-sm text-zinc-400 bg-zinc-800/50 p-3 rounded-lg border border-zinc-800/50">
                                {endpoint.description}
                            </p>
                        </div>
                    )}

                    {/* Configuration / Code */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            {endpoint.type === 'functional' || endpoint.type === 'post_mock' ? "Handler Logic" : "Response Configuration"}
                        </label>

                        {endpoint.type === 'functional' || endpoint.type === 'post_mock' ? (
                            <div className="h-64 border border-zinc-800 rounded-lg overflow-hidden">
                                <CodeEditor
                                    language="python"
                                    value={endpoint.config?.code || "# No code found"}
                                    onChange={() => { }}
                                />
                            </div>
                        ) : (
                            <div className="h-64 border border-zinc-800 rounded-lg overflow-hidden">
                                <CodeEditor
                                    language="json"
                                    value={JSON.stringify(endpoint.config?.value || endpoint.config, null, 2)}
                                    onChange={() => { }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Initial Data if present */}
                    {endpoint.config?.data && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Initial Data State</label>
                            <div className="h-40 border border-zinc-800 rounded-lg overflow-hidden">
                                <CodeEditor
                                    language="json"
                                    value={JSON.stringify(endpoint.config.data, null, 2)}
                                    onChange={() => { }}
                                />
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 rounded-b-2xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
