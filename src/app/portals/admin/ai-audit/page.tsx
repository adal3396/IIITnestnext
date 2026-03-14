"use client";
import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle, BarChart3, RefreshCw, Eye, Loader2 } from "lucide-react";

interface AuditLog {
    id: string;
    model: string;
    action: string;
    demographic: string;
    confidence: number;
    status: string;
    created_at: string;
}

interface AuditMetrics {
    fairScore: number;
    flaggedCount: number;
    totalLogs: number;
    avgConfidence: number;
}

const statusStyle = (status: string) =>
    status === "Flagged"
        ? "bg-red-50 text-red-700 border border-red-200"
        : "bg-emerald-50 text-emerald-700 border border-emerald-200";

function timeAgo(dateStr: string) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function AIAuditPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [metrics, setMetrics] = useState<AuditMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        setLoading(true);
        fetch("/api/admin/ai-audit")
            .then((r) => r.json())
            .then((d) => { setLogs(d.logs ?? []); setMetrics(d.metrics); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const summaryCards = [
        { label: "Overall Fairness Score", value: metrics ? `${metrics.fairScore}%` : "—", good: (metrics?.fairScore ?? 0) >= 90, icon: <CheckCircle className="w-5 h-5" /> },
        { label: "Avg AI Confidence", value: metrics ? `${metrics.avgConfidence}%` : "—", good: (metrics?.avgConfidence ?? 0) >= 80, icon: <CheckCircle className="w-5 h-5" /> },
        { label: "Total Decisions", value: metrics?.totalLogs ?? "—", good: true, icon: <BarChart3 className="w-5 h-5" /> },
        { label: "Flagged Decisions", value: metrics?.flaggedCount ?? "—", good: (metrics?.flaggedCount ?? 1) === 0, icon: <AlertTriangle className="w-5 h-5" /> },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-amber-500" />
                        AI Bias Audit Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">Monitor AI Engine decisions for fairness and demographic equity (read-only — written by AI Engine dev).</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((m) => (
                    <div key={m.label} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${m.good ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                                {m.icon}
                            </div>
                        </div>
                        <p className="text-sm text-slate-500">{m.label}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : m.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* AI Decision Log Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Recent AI Decision Logs</h2>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
                    </div>
                ) : logs.length === 0 ? (
                    <p className="text-center text-slate-400 py-10">No audit logs yet. The AI Engine dev will populate these.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-400 border-b border-slate-100">
                                    <th className="pb-3 font-semibold">Model</th>
                                    <th className="pb-3 font-semibold">Action</th>
                                    <th className="pb-3 font-semibold">Demographic</th>
                                    <th className="pb-3 font-semibold">Confidence</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 font-semibold">Time</th>
                                    <th className="pb-3 font-semibold"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {logs.map((d) => (
                                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 font-medium text-slate-700">{d.model}</td>
                                        <td className="py-3 text-slate-600 max-w-[200px] truncate">{d.action}</td>
                                        <td className="py-3 text-slate-500">{d.demographic}</td>
                                        <td className="py-3 font-semibold text-slate-800">{d.confidence}%</td>
                                        <td className="py-3">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusStyle(d.status)}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-slate-400 text-xs">{timeAgo(d.created_at)}</td>
                                        <td className="py-3">
                                            <button className="text-slate-400 hover:text-slate-700"><Eye className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
