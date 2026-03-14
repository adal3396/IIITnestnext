"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Building2, ShieldCheck } from "lucide-react";

const ROLES = [
    { value: "donor", label: "Donor / CSR Partner", icon: <Heart className="w-6 h-6" />, href: "/donor", color: "border-orange-400 bg-orange-50 text-orange-800" },
    { value: "orphanage", label: "Orphanage Staff", icon: <Building2 className="w-6 h-6" />, href: "/orphanage", color: "border-blue-400 bg-blue-50 text-blue-900" },
    { value: "admin", label: "Super Admin", icon: <ShieldCheck className="w-6 h-6" />, href: "/admin", color: "border-green-400 bg-green-50 text-green-800" },
];

export default function LoginPage() {
    const searchParams = useSearchParams();
    const defaultRole = searchParams.get("role") ?? "donor";
    const [role, setRole] = useState(defaultRole);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const selectedRole = ROLES.find((r) => r.value === role) ?? ROLES[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate auth delay — wire to Supabase Auth here
        await new Promise((res) => setTimeout(res, 800));
        router.push(selectedRole.href);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-4 bg-gray-50">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-md shadow-sm border border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-blue-900">Welcome back</h1>
                        <p className="text-gray-500 text-sm mt-1">Sign in to your NextNest portal</p>
                    </div>

                    {/* Role Selector */}
                    <div className="flex gap-2 mb-6">
                        {ROLES.map((r) => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => setRole(r.value)}
                                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-md border-2 text-xs font-semibold transition-all ${
                                    role === r.value
                                        ? r.color + " border-opacity-100"
                                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                                }`}
                            >
                                <span className="mb-1">{r.icon}</span>
                                <span className="leading-tight text-center">{r.label}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                            />
                        </div>
                        <div>
                            <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-900 text-white font-bold py-3 rounded-md hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-60"
                        >
                            {loading ? "Signing in…" : `Sign in as ${selectedRole.label}`}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href={`/portals/public/register?role=${role}`} className="text-blue-900 font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                    🔒 Secured per DPDP Act 2023 · JWT-based session
                </p>
            </div>
        </div>
    );
}
