"use client";
import { useEffect, useState } from "react";
import { MessageSquare, AlertCircle, CheckCircle, Clock, Send, Loader2 } from "lucide-react";

interface Ticket {
    id: string;
    type: string;
    subject: string;
    raised_by: string;
    against: string;
    status: string;
    priority: string;
    reply: string | null;
    created_at: string;
}

const statusStyle = (status: string) => {
    if (status === "Open") return "bg-red-50 text-red-700 border-red-200";
    if (status === "In Progress") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
};
const statusIcon = (status: string) => {
    if (status === "Open") return <AlertCircle className="w-4 h-4" />;
    if (status === "In Progress") return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
};

export default function DisputesPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [replies, setReplies] = useState<Record<string, string>>({});
    const [actioning, setActioning] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/disputes")
            .then((r) => r.json())
            .then((d) => { setTickets(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleResolve = async (id: string) => {
        setActioning(id + "resolve");
        const res = await fetch("/api/admin/disputes", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: "Resolved" }),
        });
        if (res.ok) {
            const updated = await res.json();
            setTickets((prev) => prev.map((t) => t.id === id ? updated : t));
        }
        setActioning(null);
    };

    const handleReply = async (id: string) => {
        const reply = replies[id];
        if (!reply?.trim()) return;
        setActioning(id + "reply");
        const res = await fetch("/api/admin/disputes", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, reply, status: "In Progress" }),
        });
        if (res.ok) {
            const updated = await res.json();
            setTickets((prev) => prev.map((t) => t.id === id ? updated : t));
            setReplies((prev) => ({ ...prev, [id]: "" }));
        }
        setActioning(null);
    };

    const openCount = tickets.filter((t) => t.status === "Open").length;
    const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
    const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-amber-500" />
                        Dispute &amp; Support Resolution
                    </h1>
                    <p className="text-slate-500 mt-1">Manage donor-orphanage disputes and technical issues.</p>
                </div>
                {!loading && openCount > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold border border-red-200">
                        <AlertCircle className="w-4 h-4" />{openCount} Open Ticket{openCount > 1 ? "s" : ""}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Open", value: loading ? "..." : openCount, color: "bg-red-50 text-red-600", icon: <AlertCircle className="w-5 h-5" /> },
                    { label: "In Progress", value: loading ? "..." : inProgressCount, color: "bg-amber-50 text-amber-600", icon: <Clock className="w-5 h-5" /> },
                    { label: "Resolved", value: loading ? "..." : resolvedCount, color: "bg-emerald-50 text-emerald-600", icon: <CheckCircle className="w-5 h-5" /> },
                ].map((s) => (
                    <div key={s.label} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
                        <div>
                            <p className="text-sm text-slate-500">{s.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                </div>
            )}

            {/* Ticket Cards */}
            {!loading && tickets.map((t) => (
                <div key={t.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h2 className="text-base font-bold text-slate-900">{t.subject}</h2>
                                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusStyle(t.status)}`}>
                                    {statusIcon(t.status)} {t.status}
                                </span>
                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                                    {t.priority} Priority
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">
                                <strong>Type:</strong> {t.type} · <strong>By:</strong> {t.raised_by} · <strong>Against:</strong> {t.against}
                            </p>
                        </div>
                        {t.status !== "Resolved" && (
                            <button
                                onClick={() => handleResolve(t.id)}
                                disabled={actioning === t.id + "resolve"}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60 flex-shrink-0"
                            >
                                {actioning === t.id + "resolve" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Mark Resolved
                            </button>
                        )}
                    </div>

                    {/* Existing reply */}
                    {t.reply && (
                        <div className="mb-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">
                            <span className="font-semibold text-slate-500 text-xs uppercase block mb-1">Admin Reply</span>
                            {t.reply}
                        </div>
                    )}

                    {/* Reply Box */}
                    {t.status !== "Resolved" && (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={replies[t.id] ?? ""}
                                onChange={(e) => setReplies((prev) => ({ ...prev, [t.id]: e.target.value }))}
                                placeholder="Type your response..."
                                className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <button
                                onClick={() => handleReply(t.id)}
                                disabled={actioning === t.id + "reply"}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-60"
                            >
                                {actioning === t.id + "reply" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Send
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
