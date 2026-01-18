import Link from 'next/link';
import NavbarUser from '@/components/NavbarUser';

export default function Landing() {
  return (
    <div className="relative isolate">
      <section className="pt-24 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Now with AI Generation
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
          Mock APIs in <span className="text-indigo-500">Seconds.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl mb-10">
          Eliminate backend delays. Describe your implementation and let AI build the mock, or create static endpoints with a single click.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/create" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/10">
            Create Endpoint
          </Link>
          <Link href="/registry" className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all">
            View Registry
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-8">
        <FeatureCard
          title="AI Generator"
          desc="Describe your logic in plain English and get a fully functional functional mock handler instantly."
          icon="✨"
        />
        <FeatureCard
          title="Custom Domains"
          desc="Group your endpoints under custom base paths (e.g., /api/v1) for cleaner organizations."
          icon="🌐"
        />
        <FeatureCard
          title="Secure Auth"
          desc="30-day persistent login sessions and private/public endpoint visibility controls."
          icon="🔒"
        />
        <FeatureCard
          title="Programmable"
          desc="Write Python handlers to process headers, bodies, and maintain persistent state."
          icon="🐍"
        />
      </section>

      <section className="bg-zinc-900/50 border-y border-zinc-800 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Intelligent Mock Generation</h2>
              <p className="text-zinc-400">Why write boilerplate? Just tell FastDev what you need.</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-black rounded-xl border border-zinc-800">
                <p className="text-xs text-zinc-500 font-bold uppercase mb-2">You Type</p>
                <p className="text-indigo-300">"Create a login endpoint that validates email and returns a JWT token."</p>
              </div>
              <div className="flex justify-center text-zinc-600">↓</div>
              <div className="p-4 bg-black rounded-xl border border-zinc-800">
                <p className="text-xs text-zinc-500 font-bold uppercase mb-2">We Generate</p>
                <pre className="font-mono text-xs text-emerald-500 overflow-x-auto">
                  {`def handler(url, headers, body, data):
    import jwt, time
    if not body.get("email"):
        return {"error": "Missing email"}, 400
    
    token = jwt.encode({"sub": body["email"]}, "secret")
    return {"token": token, "exp": time.time() + 3600}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-6">Complete Feature Set</h3>
            <ul className="space-y-4">
              <ListItem title="Static Responses" desc="Simple JSON returns for rapid UI testing." />
              <ListItem title="Route Mapping" desc="Define multiple sub-routes (/users, /posts) in one go." />
              <ListItem title="Validation" desc="Strict input validation prevents errors before deployment." />
              <ListItem title="Registry" desc="Centralized dashboard to manage and monitor your active mocks." />
              <ListItem title="State Persistence" desc="Data survives across requests (ideal for counters, carts)." />
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 transition-colors hover:bg-zinc-900 group">
      <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function ListItem({ title, desc }: { title: string, desc: string }) {
  return (
    <li className="flex gap-4">
      <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
        <div className="w-2 h-2 rounded-full bg-indigo-500" />
      </div>
      <div>
        <span className="block text-white font-bold text-sm">{title}</span>
        <span className="text-zinc-500 text-sm">{desc}</span>
      </div>
    </li>
  )
}