"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    Search,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    Filter,
    Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type ChildRow = { id: string; alias: string; age: number | null; gender: string | null; risk_level: string };

function riskLevelToScore(level: string): number {
    if (level === "critical") return 75;
    if (level === "high") return 60;
    if (level === "medium") return 40;
    return 20;
}

function getRiskColor(level: string) {
    if (level === "critical" || level === "high") return "text-red-600 bg-red-50";
    if (level === "medium") return "text-amber-600 bg-amber-50";
    return "text-emerald-600 bg-emerald-50";
}

function getRiskIcon(level: string) {
    if (level === "critical" || level === "high") return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (level === "medium") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <CheckCircle className="w-4 h-4 text-emerald-500" />;
}

function getStatusLabel(level: string): string {
    if (level === "critical" || level === "high") return "High Risk";
    if (level === "medium") return "Moderate Risk";
    return "Stable";
}

export default function ChildrenRosterPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [children, setChildren] = useState<ChildRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: HeadersInit = {};
            if (session?.access_token) (headers as Record<string, string>)["Authorization"] = `Bearer ${session.access_token}`;
            const res = await fetch("/api/orphanage/children", { headers });
            const data = await res.json();
            setChildren(Array.isArray(data.children) ? data.children : []);
            setLoading(false);
        };
        run();
    }, []);

    const filtered = children.filter((c) => {
        const matchSearch = c.alias.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search);
        const matchFilter =
            filter === "All" ||
            (filter === "High Risk" && (c.risk_level === "high" || c.risk_level === "critical")) ||
            (filter === "Moderate Risk" && c.risk_level === "medium") ||
            (filter === "Stable" && c.risk_level === "low");
        return matchSearch && matchFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-800 font-bold flex items-center gap-2">
                        <Users className="w-6 h-6 text-purple-600" /> Child Roster
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {loading ? "Loading…" : `${children.length} children registered at your facility.`}
                    </p>
                </div>
                <Link
                    href="/portals/orphanage"
                    className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                    <Users className="w-5 h-5" /> Register Child
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    {["All", "High Risk", "Moderate Risk", "Stable"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                filter === f
                                    ? "bg-purple-600 text-white"
                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Children Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Child</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Risk Score</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Matched Scheme</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-2" />
                                    <p className="text-gray-500">Loading your roster…</p>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((child) => (
                                <tr key={child.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                                                {child.alias.slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{child.alias}</p>
                                                <p className="text-xs text-gray-400">{child.gender ?? "—"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">#{child.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4 text-gray-700">{child.age != null ? `${child.age} yrs` : "—"}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getRiskIcon(child.risk_level)}
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getRiskColor(child.risk_level)}`}>
                                                {riskLevelToScore(child.risk_level)}% — {getStatusLabel(child.risk_level)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                                            —
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/portals/orphanage/children/${child.id}`}
                                            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-semibold text-sm justify-end"
                                        >
                                            View <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p>{children.length === 0 ? "No children registered yet. Register from the dashboard." : "No children found matching your search."}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
