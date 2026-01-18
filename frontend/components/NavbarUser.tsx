"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/lib/axios";

export default function NavbarUser() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check token on mount
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    await api.get("/auth/me");
                    setIsLoggedIn(true);
                } catch (e) {
                    // Token invalid
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        };
        checkAuth();

        // Listen for storage events (cross-tab and manual dispatch)
        window.addEventListener('storage', checkAuth);

        // Also listen for custom auth events if needed, but storage event dispatch covers it
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
    };

    if (isLoggedIn) {
        return (
            <button
                onClick={handleLogout}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
                Logout
            </button>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Login
            </Link>
            <Link href="/register" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Register
            </Link>
        </div>
    );
}
