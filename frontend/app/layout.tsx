import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FastDev | Instant Mock Engine",
  description: "Deploy programmable API mocks in seconds",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-300`}>
        {/* Shared Navigation Bar */}
        <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                <span className="text-white font-black text-xl italic">F</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tighter">FastDev</span>
            </Link>

            <div className="flex items-center gap-8">
              <Link href="/docs" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/registry" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Registry
              </Link>
              <Link href="/test" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Test
              </Link>
              <Link
                href="/create"
                className="bg-zinc-100 hover:bg-white text-black text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-lg"
              >
                Create Mock
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main>{children}</main>

        <footer className="border-t border-zinc-900 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center text-zinc-600 text-xs tracking-widest uppercase">
            &copy; 2026 FastDev Engine &bull; Built by Mohd Adil
          </div>
        </footer>
      </body>
    </html>
  );
}