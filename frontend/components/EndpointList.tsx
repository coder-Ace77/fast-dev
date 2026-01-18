"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { EndpointDetailsModal } from './EndpointDetailsModal';

interface Endpoint {
  endpoint_id: string;
  type: string;
  config: any;
  name?: string;
  description?: string;
  is_public?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const EndpointList = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);

  const fetchEndpoints = async () => {
    try {
      const res = await api.get("/endpoints");
      setEndpoints(res.data);
    } catch (err) {
      console.error("Failed to fetch endpoints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const getFullUrl = (ep: Endpoint) => {
    let path = ep.config.path || "/";
    if (ep.type === 'mapping') path = ""; // Mapping has multiple routes
    if (path && !path.startsWith('/')) path = '/' + path;
    return `${BASE_URL}/${ep.endpoint_id}${path}`;
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
        <h3 className="font-bold text-white">Active Mock Endpoints</h3>
        <button
          onClick={fetchEndpoints}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded transition"
        >
          Refresh
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500 italic">Scanning database...</div>
        ) : endpoints.length === 0 ? (
          <div className="p-8 text-center text-gray-500 italic">No endpoints created yet</div>
        ) : (
          <div className="divide-y divide-gray-700">
            {endpoints.map((ep) => (
              <div key={ep.endpoint_id} className="p-4 hover:bg-gray-700/30 transition group">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-400 font-bold text-lg">{ep.endpoint_id}</span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${ep.type === 'static' ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-500/10 text-purple-500'
                        }`}>
                        {ep.type}
                      </span>
                    </div>
                    <div className="text-zinc-400 text-xs mt-1 font-medium">{ep.name || "Untitled Endpoint"}</div>
                  </div>
                  <button
                    onClick={() => setSelectedEndpoint(ep)}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    View Details
                  </button>
                </div>

                <div className="space-y-1 mt-3 bg-black/20 p-2 rounded border border-gray-700/50">
                  <div className="text-xs text-gray-400 truncate font-mono">
                    <span className="text-gray-600 mr-2 uppercase tracking-wider font-bold">URL:</span>
                    <span className="text-indigo-300">{getFullUrl(ep)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EndpointDetailsModal
        isOpen={!!selectedEndpoint}
        onClose={() => setSelectedEndpoint(null)}
        endpoint={selectedEndpoint}
        fullUrl={selectedEndpoint ? getFullUrl(selectedEndpoint) : ""}
      />
    </div>
  );
};

export default EndpointList;