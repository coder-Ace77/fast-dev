"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

interface BasePathSelectorProps {
    value: string;
    onChange: (value: string) => void;
    onValidityChange: (isValid: boolean) => void;
    publicEndpoints?: boolean; // If true, might show public endpoints too, but for "my endpoints" likely just authenticated ones
}

export function BasePathSelector({ value, onChange, onValidityChange }: BasePathSelectorProps) {
    const [mode, setMode] = useState<"existing" | "new">("existing");
    const [existingPaths, setExistingPaths] = useState<string[]>([]);
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState<boolean | null>(null);
    const [loadingPaths, setLoadingPaths] = useState(false);

    useEffect(() => {
        // Fetch user's existing endpoints
        const fetchEndpoints = async () => {
            setLoadingPaths(true);
            try {
                const res = await api.get("/endpoints");
                // Filter unique endpoint IDs. 
                // Assuming backend returns list of endpoint objects with 'endpoint_id'
                const ids = res.data.map((e: any) => e.endpoint_id);
                const uniqueIds = Array.from(new Set(ids)) as string[];
                setExistingPaths(uniqueIds);

                // If there are existing paths, default to the first one, else switch to new
                if (uniqueIds.length > 0) {
                    if (!value && mode === "existing") {
                        onChange(uniqueIds[0]);
                        onValidityChange(true); // Existing are valid
                    }
                } else {
                    setMode("new");
                    if (!value) onValidityChange(false);
                }
            } catch (err) {
                console.error("Failed to fetch endpoints", err);
            } finally {
                setLoadingPaths(false);
            }
        };
        fetchEndpoints();
    }, []);

    useEffect(() => {
        if (mode === "existing") {
            onValidityChange(true); // Always valid if selecting existing
        } else {
            // If new, reset validity until checked
            if (available === true) {
                onValidityChange(true);
            } else {
                onValidityChange(false);
            }
        }
    }, [mode, value, available]);

    const checkAvailability = async () => {
        if (!value) return;
        setChecking(true);
        try {
            const res = await api.get(`/check-availability?id=${encodeURIComponent(value)}`);
            setAvailable(res.data.available);
        } catch (err) {
            console.error(err);
            setAvailable(false); // Assume unavailable on error
        } finally {
            setChecking(false);
        }
    };

    const generateRandom = () => {
        const randomId = Math.random().toString(36).substring(2, 10);
        onChange(randomId);
        setAvailable(null); // Reset availability check status for new random
    };

    return (
        <div className="space-y-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Base Path (Endpoint ID)</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode("existing")}
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded transition-colors ${mode === "existing" ? "bg-indigo-600 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                        disabled={existingPaths.length === 0}
                    >
                        Existing
                    </button>
                    <button
                        onClick={() => { setMode("new"); onChange(""); setAvailable(null); }}
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded transition-colors ${mode === "new" ? "bg-indigo-600 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        Create New
                    </button>
                </div>
            </div>

            {mode === "existing" ? (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                    {existingPaths.map(id => (
                        <option key={id} value={id}>{id}</option>
                    ))}
                    {existingPaths.length === 0 && <option disabled>No existing endpoints found</option>}
                </select>
            ) : (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => {
                                const clean = e.target.value.replace(/\//g, "").replace(/\s/g, "-");
                                onChange(clean);
                                setAvailable(null);
                            }}
                            className="flex-1 p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                            placeholder="my-custom-id"
                        />
                        <button
                            onClick={generateRandom}
                            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white text-xs font-bold uppercase"
                        >
                            Random
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            onClick={checkAvailability}
                            disabled={checking || !value}
                            className="text-xs bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-50"
                        >
                            {checking ? "Checking..." : "Verify Availability"}
                        </button>

                        {available !== null && (
                            <span className={`text-xs font-bold ${available ? "text-green-400" : "text-red-400"}`}>
                                {available ? "✓ Available" : "✗ Unavailable / Taken"}
                            </span>
                        )}
                    </div>
                </div>
            )}
            <p className="text-[10px] text-zinc-500">
                Your endpoint will be at: <span className="font-mono text-zinc-400">/api/{value || "..."}/...</span>
            </p>
        </div>
    );
}
