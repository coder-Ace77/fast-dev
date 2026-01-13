import Link from 'next/link';

export default function Landing() {
  return (
    <div className="relative isolate">
      <section className="pt-24 pb-16 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
          Mock APIs in <span className="text-indigo-500">Seconds.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl mb-10">
          Don't let backend delays slow you down. Create static, mapped, or 
          fully programmable functional mocks with a single click.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/create" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all">
            Get Started Free
          </Link>
          <Link href="/registry" className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all">
            View Registry
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        <FeatureCard 
          title="Static Response" 
          desc="Quick JSON returns for simple UI testing. Paste your JSON and go."
          icon="⚡"
        />
        <FeatureCard 
          title="Dynamic Mapping" 
          desc="Define multiple routes under one endpoint. Perfect for complex CRUD simulations."
          icon="🗺️"
        />
        <FeatureCard 
          title="Programmable Logic" 
          desc="Write Python handlers to process headers, bodies, and maintain stateful data."
          icon="🐍"
        />
      </section>

      <section className="bg-zinc-900/50 border-y border-zinc-800 py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Functional Mocks</h2>
            <p className="text-zinc-400 mb-6">Write actual logic to simulate real-world API behavior including authentication, validation, and data manipulation.</p>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li className="flex items-center gap-2">✅ Full access to Request Headers</li>
              <li className="flex items-center gap-2">✅ Persistent Database Variables</li>
              <li className="flex items-center gap-2">✅ Instant Deployment</li>
            </ul>
          </div>
          <div className="flex-1 w-full bg-black rounded-2xl p-6 border border-zinc-800 font-mono text-sm text-emerald-500 shadow-2xl">
            <pre><code>{`def handler(url, headers, body, data):
    if not headers.get("Auth"):
        return {"error": "No token"}, 401
        
    return {
        "user": data["admin"],
        "status": "Verified"
    }`}</code></pre>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}