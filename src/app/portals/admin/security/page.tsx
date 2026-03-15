"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, CheckCircle2, AlertTriangle, AlertOctagon, Info } from "lucide-react";

type FraudAlert = {
    id: string;
    type: string;
    severity: "Low" | "Medium" | "High" | "Critical";
    description: string;
    ai_confidence: number;
    metadata: Record<string, any>;
    status: "Open" | "Investigating" | "Resolved" | "False Positive";
    created_at: string;
};

export default function SecurityDashboard() {
    const [alerts, setAlerts] = useState<FraudAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await fetch("/api/admin/security");
            if (!res.ok) throw new Error("Failed to fetch alerts");
            const data = await res.json();
            setAlerts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: FraudAlert['status']) => {
        try {
            setAlerts(alerts.map(a => a.id === id ? { ...a, status } : a));
            
            const res = await fetch("/api/admin/security", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            });
            
            if (!res.ok) {
                throw new Error("Failed to update status");
            }
        } catch (err: any) {
            alert(err.message);
            fetchAlerts(); // Revert on failure
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "Critical": return "bg-red-100 text-red-800 border-red-200";
            case "High": return "bg-orange-100 text-orange-800 border-orange-200";
            case "Medium": return "bg-amber-100 text-amber-800 border-amber-200";
            case "Low": return "bg-blue-100 text-blue-800 border-blue-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Open": return "bg-red-50 text-red-700 ring-red-600/20";
            case "Investigating": return "bg-amber-50 text-amber-700 ring-amber-600/20";
            case "Resolved": return "bg-green-50 text-green-700 ring-green-600/20";
            case "False Positive": return "bg-gray-50 text-gray-700 ring-gray-600/20";
            default: return "bg-gray-50 text-gray-700 ring-gray-600/20";
        }
    };

    if (loading) return <div className="p-8 pb-0 animate-pulse bg-gray-50 min-h-screen">Loading security feeds...</div>;
    if (error) return <div className="p-8 text-red-600 bg-red-50 rounded-xl border border-red-200 m-8">Error: {error}</div>;

    const openCount = alerts.filter(a => a.status === 'Open').length;
    const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Open').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div>
                    <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-2">
                        <ShieldAlert className="w-7 h-7 text-red-600" />
                        Security & Fraud Detection
                    </h1>
                    <p className="text-slate-500 mt-1">AI-driven anomaly detection and platform integrity monitoring.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-end bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                        <span className="text-2xl font-black text-red-700 leading-none">{criticalCount}</span>
                        <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Critical</span>
                    </div>
                    <div className="flex flex-col items-end bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                        <span className="text-2xl font-black text-orange-700 leading-none">{openCount}</span>
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Open Alerts</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {alerts.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-500">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
                        <h3 className="text-lg font-bold text-slate-900">System Secure</h3>
                        <p>No active fraud alerts detected by the AI Engine.</p>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-5 flex items-start gap-4">
                                <div className={`p-3 rounded-xl flex-shrink-0 ${alert.severity === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {alert.severity === 'Critical' ? <AlertOctagon className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-bold text-slate-900">{alert.type}</h3>
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(alert.status)}`}>
                                            {alert.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${getSeverityColor(alert.severity)}`}>
                                            {alert.severity} Severity
                                        </span>
                                        <span className="text-sm font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                                            AI Confidence: {alert.ai_confidence}%
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {new Date(alert.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{alert.description}</p>
                                    
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 font-mono text-xs text-slate-600 mb-4">
                                        <div className="flex items-center gap-1.5 mb-1.5 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                                            <Info className="w-3 h-3" /> Metadata Snapshot
                                        </div>
                                        {JSON.stringify(alert.metadata)}
                                    </div>

                                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                                        {alert.status !== 'Open' && (
                                            <button onClick={() => updateStatus(alert.id, 'Open')} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                                                Re-open
                                            </button>
                                        )}
                                        {alert.status !== 'Investigating' && (
                                            <button onClick={() => updateStatus(alert.id, 'Investigating')} className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-colors">
                                                Mark Investigating
                                            </button>
                                        )}
                                        {alert.status !== 'Resolved' && (
                                            <button onClick={() => updateStatus(alert.id, 'Resolved')} className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors">
                                                Resolve
                                            </button>
                                        )}
                                        {alert.status !== 'False Positive' && (
                                            <button onClick={() => updateStatus(alert.id, 'False Positive')} className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded hover:bg-slate-200 transition-colors">
                                                Flag as False Positive
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
