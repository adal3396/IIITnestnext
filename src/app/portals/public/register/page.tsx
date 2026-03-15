"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ROLES = [
    {
        value: "donor",
        label: "Donor / CSR Partner",
        icon: <Heart className="w-8 h-8" />,
        href: "/portals/donor",
        color: "border-orange-400 bg-orange-50 text-orange-800",
        desc: "Donate, track impact, sponsor children",
    },
    {
        value: "orphanage",
        label: "Orphanage / NGO",
        icon: <Building2 className="w-8 h-8" />,
        href: "/portals/orphanage",
        color: "border-blue-400 bg-blue-50 text-blue-900",
        desc: "Manage children, documents & AI insights",
    },
];

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const defaultRole = searchParams.get("role") === "orphanage" ? "orphanage" : "donor";
    const [role, setRole] = useState(defaultRole);
    const [form, setForm] = useState({ name: "", email: "", password: "", orgName: "", consent: false });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const selectedRole = ROLES.find((r) => r.value === role) ?? ROLES[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        full_name: form.name,
                        role: role,
                        organization_name: form.orgName, // Will be empty for donors
                        consent_given: form.consent
                    }
                }
            });

            if (signUpError) {
                throw signUpError;
            }

            // Immediately redirect to the correct portal after successful signup
            router.push(selectedRole.href);
        } catch (err: any) {
            setError(err.message || "An error occurred during registration. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-4 bg-gray-50">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-md shadow-sm border border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-blue-900">Create your account</h1>
                        <p className="text-gray-500 text-sm mt-1">Join NextNest — privacy-first, consent-based</p>
                    </div>

                    {/* Role Selector */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {ROLES.map((r) => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => setRole(r.value)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-md border-2 text-sm font-semibold transition-all ${role === r.value
                                        ? r.color + " ring-1 ring-offset-1 ring-blue-900"
                                        : "border-gray-200 text-gray-500 hover:border-gray-400 bg-white"
                                    }`}
                            >
                                <span className="mb-1">{r.icon}</span>
                                <span>{r.label}</span>
                                <span className="font-normal text-xs text-center leading-tight opacity-70">{r.desc}</span>
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="reg-name" className="block text-sm font-semibold text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                id="reg-name"
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Priya Sharma"
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                            />
                        </div>

                        {role === "orphanage" && (
                            <div>
                                <label htmlFor="reg-org" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Orphanage / Organisation Name
                                </label>
                                <input
                                    id="reg-org"
                                    type="text"
                                    required
                                    value={form.orgName}
                                    onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                                    placeholder="Sunshine Orphanage, Mumbai"
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="reg-email" className="block text-sm font-semibold text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="reg-email"
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="you@example.com"
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="reg-password" className="block text-sm font-semibold text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="reg-password"
                                type="password"
                                required
                                minLength={8}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Min. 8 characters"
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                            />
                        </div>

                        {/* DPDP Consent */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                id="reg-consent"
                                type="checkbox"
                                required
                                checked={form.consent}
                                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-600 leading-relaxed">
                                I consent to the collection and processing of my data as described in the{" "}
                                <span className="text-blue-900 font-semibold">Privacy Policy</span>, in accordance with{" "}
                                <span className="font-semibold">DPDP Act 2023</span>. I understand I can withdraw consent at any time.
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={loading || !form.consent}
                            className="w-full bg-blue-900 text-white font-bold py-3 rounded-md hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {loading ? "Creating account…" : `Register as ${selectedRole.label}`}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link href={`/portals/public/login?role=${role}`} className="text-blue-900 font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                    🔒 DPDP Act 2023 compliant · Consent-based · JWT sessions
                </p>
            </div>
        </div>
    );
}
