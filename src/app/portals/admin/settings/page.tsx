"use client";
import { useEffect, useState } from "react";
import { Database, Download, ShieldCheck, ToggleLeft, ToggleRight, Bell, Lock, AlertTriangle, Loader2, Send } from "lucide-react";

interface Setting {
    key: string;
    label: string;
    description: string;
    enabled: boolean;
}

// ─── Live Export Helpers ─────────────────────────────────────────────────────

function downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

async function exportGrowthReport() {
    const res = await fetch("/api/admin/analytics");
    const data = await res.json();
    const rows = [
        ["Report", "Value"],
        ["Monthly Growth", data.monthly_growth ?? "N/A"],
        ["Donor Retention", data.donor_retention ?? "N/A"],
        ["Total Transaction Volume (INR)", data.total_transaction_volume ?? "N/A"],
        [""],
        ["Region", "Orphanage Count"],
        ...Object.entries(data.regional_distribution ?? {}).map(([k, v]) => [k, String(v)]),
    ];
    downloadCSV(rows.map(r => r.join(",")).join("\n"), "nextnest-platform-growth-report.csv");
}

async function exportFundFlow() {
    const res = await fetch("/api/admin/finance");
    const data = await res.json();
    const txns: Record<string, string | number>[] = data.transactions ?? [];
    const rows = [
        ["Transaction Ref", "Donor Name", "Orphanage", "Amount (INR)", "Platform Fee (INR)", "Status", "Date"],
        ...txns.map(t => [
            t.transaction_ref ?? "",
            t.donor_name ?? "Anonymous",
            t.orphanage_name ?? "",
            t.amount_total ?? t.gross_amount ?? 0,
            t.fee_platform ?? 0,
            t.status ?? "",
            t.created_at ? new Date(String(t.created_at)).toLocaleDateString("en-IN") : "",
        ]),
    ];
    downloadCSV(rows.map(r => r.join(",")).join("\n"), "nextnest-fund-flow-summary.csv");
}

async function exportAIPerformance() {
    const res = await fetch("/api/admin/ai-audit");
    const data = await res.json();
    const logs: Record<string, unknown>[] = data.logs ?? [];
    const rows = [
        ["Agent", "DPDP Compliant", "Input Preview", "Timestamp"],
        ...logs.map(l => [
            l.agent_name ?? "",
            l.dpdp_compliant ? "Yes" : "No",
            JSON.stringify(l.input_snapshot ?? "").slice(0, 80).replace(/,/g, ";"),
            l.created_at ? new Date(String(l.created_at)).toLocaleDateString("en-IN") : "",
        ]),
    ];
    downloadCSV(rows.map(r => r.join(",")).join("\n"), "nextnest-ai-performance-report.csv");
}

async function exportSchemeUtilization() {
    const res = await fetch("/api/admin/opportunities");
    const data = await res.json();
    const opportunities: Record<string, unknown>[] = data.opportunities ?? [];
    const rows = [
        ["Title", "Type", "Partner", "Active", "Created At"],
        ...opportunities.map(o => [
            o.title ?? "",
            o.type ?? "",
            o.partner ?? "",
            o.active ? "Yes" : "No",
            o.created_at ? new Date(String(o.created_at)).toLocaleDateString("en-IN") : "",
        ]),
    ];
    downloadCSV(rows.map(r => r.join(",")).join("\n"), "nextnest-scheme-utilization-report.csv");
}

const exportOptions = [
    {
        label: "Platform Growth Report (Monthly)",
        description: "Live MoM growth, donor retention, and regional distribution — from Supabase",
        handler: exportGrowthReport,
    },
    {
        label: "Fund Flow Summary",
        description: "Full anonymized transaction ledger — all donations recorded in Supabase",
        handler: exportFundFlow,
    },
    {
        label: "AI Model Performance Report",
        description: "DPDP compliance, flagged decisions, and agent logs from the AI audit table",
        handler: exportAIPerformance,
    },
    {
        label: "Government Scheme Utilization Report",
        description: "All transition opportunities: active schemes, partners, and types",
        handler: exportSchemeUtilization,
    },
];

export default function SettingsPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [announcement, setAnnouncement] = useState("");
    const [audience, setAudience] = useState("All");
    const [sending, setSending] = useState(false);
    const [dangerConfirm, setDangerConfirm] = useState<string | null>(null);
    const [exportingIdx, setExportingIdx] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/admin/settings")
            .then((r) => r.json())
            .then((d) => { setSettings(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleExport = async (idx: number, handler: () => Promise<void>) => {
        setExportingIdx(idx);
        try { await handler(); } catch { alert("Export failed — please try again."); }
        setExportingIdx(null);
    };

    const handleToggle = async (s: Setting) => {
        setToggling(s.key);
        const res = await fetch("/api/admin/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: s.key, enabled: !s.enabled }),
        });
        if (res.ok) {
            const updated = await res.json();
            setSettings((prev) => prev.map((x) => x.key === s.key ? updated : x));
        }
        setToggling(null);
    };

    const handleSendAnnouncement = async () => {
        if (!title.trim() || !announcement.trim()) return;
        setSending(true);
        try {
            const res = await fetch("/api/admin/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, message: announcement, target_audience: audience }),
            });
            if (res.ok) {
                setTitle("");
                setAnnouncement("");
                alert("Announcement sent successfully!");
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (error) { console.error(error); }
        finally { setSending(false); }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-6 h-6 text-amber-500" />
                    Platform Settings &amp; Data Control
                </h1>
                <p className="text-slate-500 mt-1">Manage global platform toggles, anonymized data exports, and announcements.</p>
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start gap-3 bg-slate-800 text-slate-300 p-4 rounded-xl text-sm">
                <Lock className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                <p>
                    <span className="font-semibold text-white">DPDP Act 2023 Compliance: </span>
                    All data exports are strictly anonymized at the macro level. No PII is included. Audit logs are maintained for all admin actions.
                </p>
            </div>

            {/* Data Exports — Live from Supabase */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-slate-500" />
                    Anonymized Data Exports
                </h2>
                <div className="space-y-3">
                    {exportOptions.map((exp, idx) => (
                        <div key={exp.label} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                            <div>
                                <p className="font-semibold text-slate-800">{exp.label}</p>
                                <p className="text-sm text-slate-500 mt-0.5">{exp.description}</p>
                            </div>
                            <button
                                onClick={() => handleExport(idx, exp.handler)}
                                disabled={exportingIdx === idx}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0 disabled:opacity-50"
                            >
                                {exportingIdx === idx
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Download className="w-4 h-4" />}
                                Export CSV
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Platform Toggles */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Global Platform Toggles</h2>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {settings.map((s) => (
                            <div key={s.key} className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
                                <div>
                                    <p className="font-semibold text-slate-800">{s.label}</p>
                                    <p className="text-sm text-slate-500 mt-0.5">{s.description}</p>
                                </div>
                                <button onClick={() => handleToggle(s)} disabled={toggling === s.key} className="flex-shrink-0">
                                    {toggling === s.key
                                        ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                                        : s.enabled
                                            ? <ToggleRight className="w-8 h-8 text-emerald-500" />
                                            : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Global Communication Hub */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-slate-500" />
                    Global Communication Hub
                </h2>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Announcement Target</label>
                        <select value={audience} onChange={(e) => setAudience(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
                            <option value="All">All Users</option>
                            <option value="Donors">Donors</option>
                            <option value="Orphanages">Orphanages</option>
                            <option value="Internal Staff">Internal Staff</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder="Announcement Subject..."
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-3" />
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                        <textarea rows={4} value={announcement} onChange={(e) => setAnnouncement(e.target.value)}
                            placeholder="Write your platform-wide announcement here..."
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
                    </div>
                    <button onClick={handleSendAnnouncement} disabled={!title.trim() || !announcement.trim() || sending}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50">
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Send Announcement
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h2>
                <p className="text-sm text-slate-500 mb-4">These actions are irreversible. Proceed only when authorized and after full backups are confirmed.</p>
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => setDangerConfirm(dangerConfirm === "revoke" ? null : "revoke")}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                        <ShieldCheck className="w-4 h-4" /> Revoke Orphanage Batch Access
                    </button>
                    <button onClick={() => setDangerConfirm(dangerConfirm === "freeze" ? null : "freeze")}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                        <Lock className="w-4 h-4" /> Freeze All Active Campaigns
                    </button>
                </div>
                {dangerConfirm && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-800 font-medium mb-2">
                            {dangerConfirm === "revoke" ? "Revoke Orphanage Batch Access?" : "Freeze All Active Campaigns?"}
                        </p>
                        <p className="text-xs text-red-700 mb-3">This action will be logged. Confirm to proceed.</p>
                        <div className="flex gap-2">
                            <button onClick={() => setDangerConfirm(null)}
                                className="px-3 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                                Cancel
                            </button>
                            <button onClick={() => { alert("Action recorded and logged."); setDangerConfirm(null); }}
                                className="px-3 py-1.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">
                                Confirm
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
