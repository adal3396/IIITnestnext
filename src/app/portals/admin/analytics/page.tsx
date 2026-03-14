"use client";
import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Loader2, ShieldAlert, Building2, AlertCircle, CheckCircle2, Minus } from "lucide-react";

interface ReallocationInsight {
    name: string;
    totalFunded: number;
    txCount: number;
    fundingRatio: number;
    status: "Over-funded" | "Balanced" | "Under-funded";
}

interface MonthlyTrend {
    month: string;
    amount: number;
}

interface KPIs {
    totalOrphanages: number;
    pendingVerifications: number;
    openFraudAlerts: number;
    openTickets: number;
}

const statusMeta: Record<string, { icon: React.ReactNode; color: string; barColor: string }> = {
    "Over-funded": { icon: <TrendingUp className="w-4 h-4" />, color: "text-amber-600 bg-amber-50 border-amber-200", barColor: "bg-amber-400" },
    Balanced: { icon: <Minus className="w-4 h-4" />, color: "text-emerald-600 bg-emerald-50 border-emerald-200", barColor: "bg-emerald-400" },
    "Under-funded": { icon: <TrendingDown className="w-4 h-4" />, color: "text-red-600 bg-red-50 border-red-200", barColor: "bg-red-400" },
};

function formatINR(n: number) {
    if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
    if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
    return "₹" + n;
}

function formatMonth(m: string) {
    const [year, mon] = m.split("-");
    return new Date(+year, +mon - 1).toLocaleString("en-IN", { month: "short", year: "2-digit" });
}

export default function AnalyticsPage() {
    const [insights, setInsights] = useState<ReallocationInsight[]>([]);
    const [trend, setTrend] = useState<MonthlyTrend[]>([]);
    const [kpis, setKpis] = useState<KPIs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/analytics")
            .then((r) => r.json())
            .then((d) => {
                setInsights(d.reallocationInsights ?? []);
                setTrend(d.monthlyTrend ?? []);
                setKpis(d.kpis);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const maxTrend = Math.max(...trend.map((t) => t.amount), 1);
    const kpiCards = kpis ? [
        { label: "Approved Orphanages", value: kpis.totalOrphanages, icon: <Building2 className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
        { label: "Pending Verifications", value: kpis.pendingVerifications, icon: <AlertCircle className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" },
        { label: "Open Fraud Alerts", value: kpis.openFraudAlerts, icon: <ShieldAlert className="w-5 h-5" />, color: "bg-red-50 text-red-600" },
        { label: "Open Support Tickets", value: kpis.openTickets, icon: <CheckCircle2 className="w-5 h-5" />, color: "bg-slate-50 text-slate-600" },
    ] : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-500" /> Platform Health Analytics
                </h1>
                <p className="text-slate-500 mt-1">Donation trends, AI-driven funding reallocation recommendations, and platform KPIs.</p>
            </div>

            {/* KPI Cards */}
            {loading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiCards.map((k) => (
                        <div key={k.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className={`inline-flex p-2 rounded-lg mb-3 ${k.color}`}>{k.icon}</div>
                            <p className="text-2xl font-bold text-slate-900">{k.value}</p>
                            <p className="text-sm text-slate-500 mt-0.5">{k.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Donation Trend */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" /> Monthly Donation Volume
                    </h2>
                    {loading ? <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-200" /></div> :
                        trend.length === 0 ? <p className="text-slate-400 text-center py-8">No trend data yet.</p> : (
                            <div className="flex items-end gap-3 h-48">
                                {trend.map((t) => (
                                    <div key={t.month} className="flex-1 flex flex-col items-center gap-1 group">
                                        <div className="relative w-full bg-blue-100 rounded-t-md transition-all hover:bg-blue-200"
                                            style={{ height: `${(t.amount / maxTrend) * 100}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs rounded px-2 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                {formatINR(t.amount)}
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-400">{formatMonth(t.month)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>

                {/* Resource Reallocation */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-500" /> AI Resource Reallocation
                    </h2>
                    <p className="text-xs text-slate-400 mb-5">Compares funding received by each orphanage to recommend donor traffic redistribution.</p>
                    {loading ? <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-200" /></div> :
                        insights.length === 0 ? <p className="text-slate-400 text-center py-8">No funding data available yet.</p> : (
                            <div className="space-y-4">
                                {insights.map((o) => {
                                    const meta = statusMeta[o.status];
                                    return (
                                        <div key={o.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]">{o.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-slate-800">{formatINR(o.totalFunded)}</span>
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${meta.color}`}>
                                                        {meta.icon} {o.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div className={`h-2 rounded-full transition-all ${meta.barColor}`} style={{ width: `${o.fundingRatio}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="mt-4 p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-700">
                                    <strong>AI Recommendation:</strong> Redirect donor traffic from Over-funded orphanages to Under-funded ones to balance platform support equity.
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
