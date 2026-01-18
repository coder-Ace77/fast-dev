"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/auth/register", { email, password });
            localStorage.setItem("token", res.data.access_token);
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Create an Account</h1>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-zinc-400 text-xs uppercase font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-xs uppercase font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-6 text-center text-zinc-500 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
