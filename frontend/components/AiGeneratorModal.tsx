"use client";
import { useState } from "react";
import api from "@/lib/axios";


interface Props {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (content: string) => void;
}

export const AiGeneratorModal = ({ isOpen, onClose, onGenerate }: Props) => {
    const [description, setDescription] = useState("");
    const [inputFormat, setInputFormat] = useState("");
    const [outputFormat, setOutputFormat] = useState("");
    const [urlHint, setUrlHint] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.post("/api/ai/generate", {
                description,
                input_format: inputFormat,
                output_format: outputFormat,
                url: urlHint
            });
            onGenerate(res.data.content);
            onClose();
        } catch (err: any) {
            if (err.response?.status === 429) {
                setError("Weekly AI limit reached.");
            } else {
                setError("Failed to generate content. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <span className="text-indigo-500">✨</span> AI Mock Generator
                </h2>
                <p className="text-zinc-500 text-xs mb-6">Describe your endpoint logic and let AI write the code.</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-24 p-3 mt-1 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                            placeholder="e.g., Validate credit card number using Luhn algorithm..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Input Format</label>
                            <input
                                value={inputFormat}
                                onChange={(e) => setInputFormat(e.target.value)}
                                className="w-full p-2.5 mt-1 rounded-lg bg-zinc-800 border border-zinc-700 text-sm outline-none"
                                placeholder="JSON, Text..."
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Output Format</label>
                            <input
                                value={outputFormat}
                                onChange={(e) => setOutputFormat(e.target.value)}
                                className="w-full p-2.5 mt-1 rounded-lg bg-zinc-800 border border-zinc-700 text-sm outline-none"
                                placeholder="JSON..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">URL Context (Optional)</label>
                        <input
                            value={urlHint}
                            onChange={(e) => setUrlHint(e.target.value)}
                            className="w-full p-2.5 mt-1 rounded-lg bg-zinc-800 border border-zinc-700 text-sm outline-none"
                            placeholder="/api/validate-card"
                        />
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !description}
                    className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="animate-pulse">Generating...</span>
                    ) : (
                        <>Generate Mock Function</>
                    )}
                </button>
            </div>
        </div>
    );
};
