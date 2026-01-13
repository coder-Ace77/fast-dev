"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios'; 
interface Endpoint {
  endpoint_id: string;
  type: string;
  config: any;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


const EndpointList = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);

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
              <div key={ep.endpoint_id} className="p-4 hover:bg-gray-700/30 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-blue-400 font-bold">{ep.endpoint_id}</span>
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                    ep.type === 'static' ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-500/10 text-purple-500'
                  }`}>
                    {ep.type}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs text-gray-400 truncate">
                    <span className="text-gray-600 mr-2">BASE:</span>
                    {BASE_URL}{ep.endpoint_id}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-600 mr-2">PATH:</span>
                    {ep.config.path || (ep.config.routes ? `${ep.config.routes.length} routes` : '/')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EndpointList;