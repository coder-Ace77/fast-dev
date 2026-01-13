"use client";

interface Props {
  url: string;
}

export const DeploymentStatus = ({ url }: Props) => (
  <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-md shadow-inner">
    <p className="text-indigo-400 font-bold mb-2 text-xs uppercase tracking-widest">Endpoint Active</p>
    <div className="flex items-center justify-between bg-black p-3 rounded border border-zinc-800">
      <code className="text-xs text-indigo-300 break-all font-mono">{url}</code>
      <button 
        onClick={() => navigator.clipboard.writeText(url)}
        className="ml-4 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded border border-zinc-700 transition-all active:scale-95"
      >
        Copy
      </button>
    </div>
  </div>
);