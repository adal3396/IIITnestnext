"use client";
import { useEffect, useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, Search, Loader2, XCircle, Eye } from "lucide-react";

interface FraudAlert {
    id: string;
    type: string;
    description: string;
    severity: string;
    entity_type: string;
    entity_ref: string;
    ip_address: string;
    status: string;
    ai_confidence: number;
    admin_note: string;
    created_at: string;
}

interface Stats {
    total: number;
    open: number;
    critical: number;
    investigating: number;
}

const severityStyle: Record<string, string> = {
    Critical: "bg-red-100 text-red-700 border-red-200",
    High: "bg-orange-100 text-orange-700 border-orange-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    Low: "bg-slate-100 text-slate-600 border-slate-200",
};

const statusStyle: Record<string, string> = {
    Open: "bg-red-50 text-red-600 border-red-200",
    Investigating: "bg-amber-50 text-amber-600 border-amber-200",
    Resolved: "bg-emerald-50 text-emerald-600 border-emerald-200",
    "False Positive": "bg-slate-100 text-slate-500 border-slate-200",
};

function timeAgo(d: string) {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function SecurityPage() {
    const [alerts, setAlerts] = useState<FraudAlert[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);
    const [selected, setSelected] = useState<FraudAlert | null>(null);

    const fetchAlerts = () => {
        setLoading(true);
        fetch("/api/admin/security")
            .then((r) => r.json())
            .then((d) => { setAlerts(d.alerts ?? []); setStats(d.stats); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetchAlerts(); }, []);

    const updateStatus = async (id: string, status: string, note?: string) => {
        setUpdating(id);
        await fetch("/api/admin/security", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status, admin_note: note }),
        });
        setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status, admin_note: note ?? a.admin_note } : a));
        setSelected(null);
        setUpdating(null);
    };

    const filtered = alerts.filter((a) =>
        !search || a.description.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase()) || (a.entity_ref ?? "").toLowerCase().includes(search.toLowerCase())
    );

    const statCards = [
        { label: "Total Alerts", value: stats?.total ?? 0, color: "bg-slate-50 text-slate-700", icon: <ShieldAlert className="w-5 h-5" /> },
        { label: "Open Alerts", value: stats?.open ?? 0, color: "bg-red-50 text-red-600", icon: <AlertTriangle className="w-5 h-5" /> },
        { label: "Critical Severity", value: stats?.critical ?? 0, color: "bg-orange-50 text-orange-600", icon: <XCircle className="w-5 h-5" /> },
        { label: "Investigating", value: stats?.investigating ?? 0, color: "bg-amber-50 text-amber-600", icon: <Eye className="w-5 h-5" /> },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-red-500" /> Fraud &amp; Anomaly Detection
                    </h1>
                    <p className="text-slate-500 mt-1">AI-flagged suspicious activities, financial anomalies, and fake profiles.</p>
                </div>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" placeholder="Search alerts…" value={search} onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s) => (
                    <div key={s.label} className={`p-5 rounded-2xl border border-slate-200 bg-white shadow-sm`}>
                        <div className={`inline-flex p-2 rounded-lg mb-3 ${s.color}`}>{s.icon}</div>
                        <p className="text-2xl font-bold text-slate-900">{loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : s.value}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Alert List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">All Fraud Alerts</h2>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-red-400" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center py-16 text-slate-400">
                        <CheckCircle className="w-10 h-10 mb-2 text-emerald-400" />
                        <p>No fraud alerts found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {filtered.map((alert) => (
                            <div key={alert.id} className="p-5 hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${severityStyle[alert.severity] ?? ""}`}>{alert.severity}</span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusStyle[alert.status] ?? ""}`}>{alert.status}</span>
                                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{alert.type}</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-800">{alert.description}</p>
                                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                                            {alert.entity_ref && <span>Entity: <span className="text-slate-600 font-medium">{alert.entity_ref}</span></span>}
                                            {alert.ip_address && <span>IP: <span className="font-mono text-slate-600">{alert.ip_address}</span></span>}
                                            <span>AI Confidence: <span className="text-slate-600 font-medium">{alert.ai_confidence}%</span></span>
                                            <span>{timeAgo(alert.created_at)}</span>
                                        </div>
                                        {alert.admin_note && (
                                            <p className="mt-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-3 py-2">Note: {alert.admin_note}</p>
                                        )}
                                    </div>
                                    {alert.status === "Open" || alert.status === "Investigating" ? (
                                        <div className="flex gap-2 flex-wrap shrink-0">
                                            {alert.status === "Open" && (
                                                <button
                                                    onClick={() => updateStatus(alert.id, "Investigating")}
                                                    disabled={updating === alert.id}
                                                    className="text-xs px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg font-semibold hover:bg-amber-200 transition-colors disabled:opacity-50"
                                                >
                                                    {updating === alert.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Investigate"}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => updateStatus(alert.id, "Resolved", "Reviewed and confirmed as fraudulent. Action taken.")}
                                                disabled={updating === alert.id}
                                                className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors disabled:opacity-50"
                                            >
                                                Confirm & Resolve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(alert.id, "False Positive", "Reviewed and marked as false positive after manual verification.")}
                                                disabled={updating === alert.id}
                                                className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
                                            >
                                                False Positive
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 shrink-0 self-start mt-1">Closed</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
