"use client";
import { useEffect, useState } from "react";
import { Activity, Building2, Users, Database, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface OverviewData {
    totalOrphanages: number;
    pendingVerifications: number;
    pendingMedical: number;
    totalOpportunities: number;
    openTickets: number;
    aiAuditScore: number;
    flaggedDecisions: number;
}

export default function SuperAdminDashboard() {
    const [data, setData] = useState<OverviewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/overview")
            .then((r) => r.json())
            .then((d) => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const metrics = [
        { label: "Registered Orphanages", value: data?.totalOrphanages ?? 0, icon: <Building2 className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" },
        { label: "Pending Verifications", value: data?.pendingVerifications ?? 0, icon: <Users className="w-6 h-6" />, color: "bg-amber-50 text-amber-600" },
        { label: "Funds Processed (Monthly)", value: "₹ 2.4M", icon: <Database className="w-6 h-6" />, color: "bg-emerald-50 text-emerald-600" },
        {
            label: "AI Bias Audit Score", value: loading ? "—" : `${data?.aiAuditScore ?? 0}%`,
            badge: data?.flaggedDecisions ? `${data.flaggedDecisions} Alerts` : null,
            icon: <Activity className="w-6 h-6" />, color: "bg-purple-50 text-purple-600"
        },
    ];
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div>
                    <h1 className="text-2xl text-slate-900 font-bold">Global Oversight Dashboard</h1>
                    <p className="text-slate-500 mt-1">System-wide metrics and pending verifications.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    System Operational
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m) => (
                    <div key={m.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${m.color}`}>{m.icon}</div>
                            {m.badge && (
                                <span className="text-amber-600 bg-amber-50 text-xs font-semibold px-2 py-1 rounded-full">{m.badge}</span>
                            )}
                        </div>
                        <h3 className="text-sm font-medium text-slate-500">{m.label}</h3>
                        <div className="text-3xl font-bold text-slate-900 mt-1">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : m.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Actions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" /> Pending Actions
                    </h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <div>
                                    <p className="font-medium text-slate-800">Orphanage Verifications</p>
                                    <p className="text-sm text-slate-500">{data?.pendingVerifications ?? 0} registrations awaiting review</p>
                                </div>
                                <Link href="/portals/admin/verification" className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold hover:bg-amber-200 transition-colors">
                                    Review
                                </Link>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <div>
                                    <p className="font-medium text-slate-800">Medical Crowdfund Cases</p>
                                    <p className="text-sm text-slate-500">{data?.pendingMedical ?? 0} cases awaiting moderation</p>
                                </div>
                                <Link href="/portals/admin/medical-cases" className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold hover:bg-amber-200 transition-colors">
                                    Review
                                </Link>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <p className="font-medium text-slate-800">Open Support Tickets</p>
                                    <p className="text-sm text-slate-500">{data?.openTickets ?? 0} tickets need resolution</p>
                                </div>
                                <Link href="/portals/admin/disputes" className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold hover:bg-amber-200 transition-colors">
                                    View
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Platform Administration</h3>
                        <p className="text-slate-400 text-sm mb-6">Manage global CMS, adjust AI confidence thresholds, or export anonymized tracking data for regulatory compliance.</p>
                        <div className="space-y-3">
                            <Link href="/portals/admin/ai-audit" className="flex items-center justify-between bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                                <span className="font-medium">Review AI Bias Logs</span>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                            </Link>
                            <Link href="/portals/admin/opportunities" className="flex items-center justify-between bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                                <span className="font-medium">Manage Transition CMS</span>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                            </Link>
                            <Link href="/portals/admin/settings" className="flex items-center justify-between bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                                <span className="font-medium">Platform Settings & Exports</span>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
