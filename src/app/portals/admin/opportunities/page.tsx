"use client";
import { useEffect, useState } from "react";
import { Briefcase, Plus, GraduationCap, Home, Edit2, Trash2, ToggleLeft, ToggleRight, Bot, Loader2, X, Check } from "lucide-react";

interface Opportunity {
    id: string;
    type: "Job" | "Vocational Training" | "Housing";
    title: string;
    partner: string;
    location: string;
    eligibility: string;
    ai_matches: number;
    active: boolean;
}

const typeIcon = (type: string) => {
    if (type === "Job") return <Briefcase className="w-5 h-5" />;
    if (type === "Vocational Training") return <GraduationCap className="w-5 h-5" />;
    return <Home className="w-5 h-5" />;
};
const typeColor = (type: string) => {
    if (type === "Job") return "bg-blue-50 text-blue-600";
    if (type === "Vocational Training") return "bg-purple-50 text-purple-600";
    return "bg-teal-50 text-teal-600";
};

const emptyForm = { type: "Job", title: "", partner: "", location: "", eligibility: "" };

export default function OpportunitiesPage() {
    const [items, setItems] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [toggling, setToggling] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/opportunities")
            .then((r) => r.json())
            .then((d) => { setItems(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleAdd = async () => {
        if (!form.title || !form.partner || !form.location || !form.eligibility) return;
        setSaving(true);
        const res = await fetch("/api/admin/opportunities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            const created = await res.json();
            setItems((prev) => [created, ...prev]);
            setForm(emptyForm);
            setShowForm(false);
        }
        setSaving(false);
    };

    const handleToggle = async (opp: Opportunity) => {
        setToggling(opp.id);
        const res = await fetch("/api/admin/opportunities", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: opp.id, active: !opp.active }),
        });
        if (res.ok) {
            const updated = await res.json();
            setItems((prev) => prev.map((o) => o.id === opp.id ? updated : o));
        }
        setToggling(null);
    };

    const handleDelete = async (id: string) => {
        setDeleting(id);
        const res = await fetch(`/api/admin/opportunities?id=${id}`, { method: "DELETE" });
        if (res.ok) setItems((prev) => prev.filter((o) => o.id !== id));
        setDeleting(null);
    };

    const activeCount = items.filter((o) => o.active).length;
    const totalMatches = items.reduce((s, o) => s + o.ai_matches, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-amber-500" />
                        Transition Opportunities CMS
                    </h1>
                    <p className="text-slate-500 mt-1">Manage external opportunities for careleavers.</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-700 transition-colors">
                    <Plus className="w-4 h-4" /> Add Opportunity
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Active Listings", value: loading ? "..." : activeCount, icon: <Briefcase className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
                    { label: "Total AI Matches", value: loading ? "..." : totalMatches, icon: <Bot className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" },
                    { label: "Total Listings", value: loading ? "..." : items.length, icon: <GraduationCap className="w-5 h-5" />, color: "bg-purple-50 text-purple-600" },
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

            {/* Add Form */}
            {showForm && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">Add New Opportunity</h2>
                        <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Title", key: "title", type: "text" },
                            { label: "Partner", key: "partner", type: "text" },
                            { label: "Location", key: "location", type: "text" },
                            { label: "Eligibility", key: "eligibility", type: "text" },
                        ].map((f) => (
                            <div key={f.key}>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">{f.label}</label>
                                <input
                                    type={f.type}
                                    value={(form as Record<string, string>)[f.key]}
                                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                            >
                                <option>Job</option>
                                <option>Vocational Training</option>
                                <option>Housing</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Save Opportunity
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                </div>
            )}

            {/* Opportunity Cards */}
            {!loading && items.map((opp) => (
                <div key={opp.id} className={`bg-white border rounded-2xl shadow-sm p-6 ${opp.active ? "border-slate-200" : "border-slate-100 opacity-60"}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${typeColor(opp.type)}`}>{typeIcon(opp.type)}</div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h2 className="text-lg font-bold text-slate-900">{opp.title}</h2>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColor(opp.type)}`}>{opp.type}</span>
                                    {!opp.active && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Inactive</span>}
                                </div>
                                <p className="text-sm text-slate-600"><strong>Partner:</strong> {opp.partner} · <strong>Location:</strong> {opp.location}</p>
                                <p className="text-sm text-slate-500 mt-0.5"><strong>Eligibility:</strong> {opp.eligibility}</p>
                                <div className="mt-2 flex items-center gap-1.5 text-sm text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg w-fit">
                                    <Bot className="w-3.5 h-3.5" />
                                    <span>{opp.ai_matches} AI-matched careleavers</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <button
                                onClick={() => handleToggle(opp)}
                                disabled={toggling === opp.id}
                                className="p-2 text-slate-500 bg-slate-100 rounded-lg hover:bg-amber-100 transition-colors"
                            >
                                {toggling === opp.id
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : opp.active
                                        ? <ToggleRight className="w-4 h-4 text-emerald-500" />
                                        : <ToggleLeft className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => handleDelete(opp.id)}
                                disabled={deleting === opp.id}
                                className="p-2 text-red-400 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                {deleting === opp.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
