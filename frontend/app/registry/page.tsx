import EndpointList from "@/components/EndpointList";

export default function RegistryPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-black text-white mb-2">Endpoint Registry</h1>
      <p className="text-zinc-500 mb-8 font-medium">Manage and monitor your active mock deployments.</p>
      
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
        <EndpointList />
      </div>
    </div>
  );
}