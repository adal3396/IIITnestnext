"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, AlertTriangle, ArrowRight, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AnnouncementsStrip from "./AnnouncementsStrip";

type ChildItem = { id: string; alias: string; age: number | null; gender: string | null; risk_level: string };

export default function OrphanageDashboard() {
    const [orgName, setOrgName] = useState<string | null>(null);
    const [children, setChildren] = useState<ChildItem[]>([]);
    const [childrenLoading, setChildrenLoading] = useState(true);

    const fetchChildren = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: HeadersInit = {};
        if (session?.access_token) (headers as Record<string, string>)["Authorization"] = `Bearer ${session.access_token}`;
        const res = await fetch("/api/orphanage/children", { headers });
        const data = await res.json();
        setChildren(Array.isArray(data.children) ? data.children : []);
        setChildrenLoading(false);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user;
            const n = (u?.user_metadata?.organization_name as string) || (u?.user_metadata?.full_name as string) || "Orphanage";
            setOrgName(n);
        });
    }, []);

    useEffect(() => { fetchChildren(); }, [fetchChildren]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [lastRegistered, setLastRegistered] = useState<{ name: string; dob: string; gender: string; admissionDate: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const fullName = (formData.get("fullName") as string) || "";
        const dob = (formData.get("dob") as string) || "";
        const gender = (formData.get("gender") as string) || "";
        const admissionDate = (formData.get("admissionDate") as string) || "";
        const firstInitial = fullName.trim().split(/\s+/)[0]?.slice(0, 1)?.toUpperCase() || "X";
        const alias = `Child ${firstInitial}.`;

        setIsSubmitting(true);
        const { data: { session } } = await supabase.auth.getSession();
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (session?.access_token) (headers as Record<string, string>)["Authorization"] = `Bearer ${session.access_token}`;

        try {
            const res = await fetch("/api/orphanage/children", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    alias,
                    age: dob ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
                    gender: gender || null,
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to register");
            }
            setLastRegistered({ name: fullName, dob, gender, admissionDate });
            setIsModalOpen(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            fetchChildren();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrintRegistration = () => {
        if (!lastRegistered) return;
        const w = window.open("", "_blank");
        if (!w) return;
        w.document.write(`
            <!DOCTYPE html><html><head><title>Child Registration Summary</title></head><body class="p-8">
            <h1 style="font-size:1.5rem;font-weight:bold;margin-bottom:1rem;">NextNest — Child Registration Summary</h1>
            <p style="font-size:0.875rem;color:#666;margin-bottom:0.5rem;">Generated on ${new Date().toLocaleString("en-IN")}</p>
            <table style="width:100%;border-collapse:collapse;font-size:0.875rem;">
            <tr><td style="border:1px solid #ddd;padding:0.5rem 0.75rem;font-weight:600;">Full Name</td><td style="border:1px solid #ddd;padding:0.5rem 0.75rem;">${lastRegistered.name}</td></tr>
            <tr><td style="border:1px solid #ddd;padding:0.5rem 0.75rem;font-weight:600;">Date of Birth</td><td style="border:1px solid #ddd;padding:0.5rem 0.75rem;">${lastRegistered.dob}</td></tr>
            <tr><td style="border:1px solid #ddd;padding:0.5rem 0.75rem;font-weight:600;">Gender</td><td style="border:1px solid #ddd;padding:0.5rem 0.75rem;">${lastRegistered.gender}</td></tr>
            <tr><td style="border:1px solid #ddd;padding:0.5rem 0.75rem;font-weight:600;">Admission Date</td><td style="border:1px solid #ddd;padding:0.5rem 0.75rem;">${lastRegistered.admissionDate}</td></tr>
            </table>
            <p style="font-size:0.75rem;color:#888;margin-top:1rem;">DPDP Act 2023 compliant. For internal use only.</p>
            </body></html>
        `);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); w.close(); }, 250);
    };

    return (
        <div className="space-y-6 relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-6 right-6 z-50 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <div className="bg-green-500 text-white p-1 rounded-full">
                        <Users className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="font-medium">Child registered successfully!</p>
                        {lastRegistered && (
                            <button
                                type="button"
                                onClick={handlePrintRegistration}
                                className="text-sm font-semibold text-green-700 underline hover:no-underline"
                            >
                                Print summary
                            </button>
                        )}
                    </div>
                </div>
            )}


            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-800 font-bold">{orgName ?? "Orphanage"} Dashboard</h1>
                    <p className="text-gray-500 mt-1">Here is the daily overview for your facility.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium cursor-pointer"
                >
                    <Users className="w-5 h-5" />
                    Register Child
                </button>
            </div>

            <AnnouncementsStrip />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Total Children</h3>
                    <div className="text-3xl font-bold text-gray-800 mt-1">
                        {childrenLoading ? "—" : children.length}
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        {(() => {
                            const riskCount = children.filter((c) => c.risk_level === "high" || c.risk_level === "critical").length;
                            return riskCount > 0 ? (
                                <span className="text-amber-600 bg-amber-50 text-xs font-semibold px-2 py-1 rounded-full">Requires Attention</span>
                            ) : null;
                        })()}
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">AI Risk Alerts</h3>
                    <div className="text-3xl font-bold text-gray-800 mt-1">
                        {childrenLoading ? "—" : children.filter((c) => c.risk_level === "high" || c.risk_level === "critical").length}
                    </div>
                </div>

                {/* Action Card */}
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Scheme Matcher</h3>
                        <p className="text-purple-50 text-sm">Review 5 new confidence-scored matches for government subsidies (e.g., PM CARES).</p>
                    </div>
                    <Link href="/portals/orphanage/schemes" className="mt-4 flex items-center gap-2 text-sm font-semibold hover:text-purple-100 transition-colors">
                        Review Matches <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Alert Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 border-l-4 border-l-amber-500">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Action Items
                </h2>
                <div className="space-y-4">
                    {childrenLoading ? (
                        <p className="text-gray-500 text-sm">Loading…</p>
                    ) : (
                        <>
                            {children.filter((c) => c.risk_level === "high" || c.risk_level === "critical").slice(0, 3).map((c) => (
                                <div key={c.id} className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0 border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-800">{c.alias} — Predictive Risk Alert</p>
                                        <p className="text-sm text-gray-500">AI has flagged {c.risk_level} risk. Review profile for details.</p>
                                    </div>
                                    <Link href={`/portals/orphanage/children/${c.id}`} className="text-sm text-purple-600 font-semibold hover:underline">View Profile</Link>
                                </div>
                            ))}
                            {children.filter((c) => c.risk_level === "high" || c.risk_level === "critical").length === 0 && (
                                <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0 border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-800">Review Pending Transitions</p>
                                        <p className="text-sm text-gray-500">Careleavers awaiting vocational skill matching.</p>
                                    </div>
                                    <Link href="/portals/orphanage/transition" className="text-sm text-purple-600 font-semibold hover:underline">Review Now</Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">Register New Child</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    required
                                    name="fullName"
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-hidden"
                                    placeholder="e.g. Rahul Sharma"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input 
                                        required
                                        name="dob"
                                        type="date" 
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select 
                                        required
                                        name="gender"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-hidden"
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                                <input 
                                    required
                                    name="admissionDate"
                                    type="date" 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-hidden"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="flex-1 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        'Submit Registration'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
