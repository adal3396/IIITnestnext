"use client";
import { useEffect, useState } from "react";
import { HeartPulse, CheckCircle, XCircle, AlertCircle, Eye, Lock, Clock, Loader2 } from "lucide-react";

interface MedicalCase {
    id: string;
    child_alias: string;
    orphanage_name: string;
    condition: string;
    target_amount: number;
    urgency: string;
    ai_flag: string;
    submitted_date: string;
}

const urgencyStyle = (urgency: string) =>
    urgency === "Critical"
        ? "bg-red-50 text-red-700 border border-red-200"
        : "bg-amber-50 text-amber-700 border border-amber-200";

export default function MedicalCasesPage() {
    const [cases, setCases] = useState<MedicalCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/medical-cases")
            .then((r) => r.json())
            .then((d) => { setCases(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleAction = async (id: string, action: "approve" | "reject") => {
        setActioning(id + action);
        const res = await fetch("/api/admin/medical-cases", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, action }),
        });
        if (res.ok) setCases((prev) => prev.filter((c) => c.id !== id));
        setActioning(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <HeartPulse className="w-6 h-6 text-red-500" />
                        Medical Crowdfunding Moderation
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Review critical illness cases before they go live. All child identities are encrypted and anonymized.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold border border-red-200">
                    <Clock className="w-4 h-4" />
                    {loading ? "..." : cases.length} Awaiting Approval
                </div>
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start gap-3 bg-slate-800 text-slate-300 p-4 rounded-xl text-sm">
                <Lock className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                <p>
                    <span className="font-semibold text-white">Privacy Notice (DPDP Act 2023): </span>
                    All child identity fields are encrypted. You are viewing anonymized case codes only. Medical progress updates to donors are also encrypted end-to-end.
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-red-400" />
                </div>
            )}

            {/* Empty */}
            {!loading && cases.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
                    <p className="font-semibold text-lg">No pending cases</p>
                    <p className="text-sm mt-1">All medical crowdfunding cases have been reviewed.</p>
                </div>
            )}

            {/* Case Cards */}
            {!loading && cases.map((c) => (
                <div key={c.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h2 className="text-lg font-bold text-slate-900">{c.child_alias}</h2>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urgencyStyle(c.urgency)}`}>{c.urgency}</span>
                                <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                                    <Lock className="w-3 h-3" /> Encrypted Identity
                                </span>
                            </div>
                            <p className="text-slate-700 font-medium">{c.condition}</p>
                            <p className="text-sm text-slate-500 mt-1">
                                {c.orphanage_name} · Target: ₹{c.target_amount.toLocaleString("en-IN")} · Submitted: {c.submitted_date}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-sm">
                                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <span className="text-slate-600">AI Assessment: <strong>{c.ai_flag}</strong></span>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                                <Eye className="w-4 h-4" /> Review
                            </button>
                            <button
                                onClick={() => handleAction(c.id, "approve")}
                                disabled={!!actioning}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
                            >
                                {actioning === c.id + "approve" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Approve to Go Live
                            </button>
                            <button
                                onClick={() => handleAction(c.id, "reject")}
                                disabled={!!actioning}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
                            >
                                {actioning === c.id + "reject" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
