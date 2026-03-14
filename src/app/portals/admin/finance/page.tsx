"use client";
import { useEffect, useState } from "react";
import { IndianRupee, TrendingUp, TrendingDown, Loader2, BarChart3, AlertTriangle, Building2 } from "lucide-react";

interface Transaction {
    id: string;
    transaction_type: string;
    orphanage_name: string;
    donor_alias: string;
    gross_amount: number;
    maintenance_fee: number;
    donor_tip: number;
    net_amount: number;
    status: string;
    created_at: string;
}

interface Summary {
    totalGross: number;
    totalFees: number;
    totalTips: number;
    totalNet: number;
    platformRevenue: number;
    transactionCount: number;
    pendingCount: number;
}

const statusStyle: Record<string, string> = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Failed: "bg-red-50 text-red-700 border-red-200",
    Refunded: "bg-slate-100 text-slate-600 border-slate-200",
};

const typeColor: Record<string, string> = {
    Donation: "bg-blue-50 text-blue-700",
    "Medical Fund": "bg-rose-50 text-rose-700",
    Sponsorship: "bg-purple-50 text-purple-700",
    Withdrawal: "bg-slate-100 text-slate-600",
};

function formatINR(n: number) {
    return "₹" + n.toLocaleString("en-IN");
}

export default function FinancePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        fetch("/api/admin/finance")
            .then((r) => r.json())
            .then((d) => { setTransactions(d.transactions ?? []); setSummary(d.summary); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const types = ["All", "Donation", "Medical Fund", "Sponsorship", "Withdrawal"];
    const filtered = transactions.filter((t) => filter === "All" || t.transaction_type === filter);

    const summaryCards = [
        { label: "Total Gross Volume", value: formatINR(summary?.totalGross ?? 0), icon: <IndianRupee className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
        { label: "Net to Orphanages", value: formatINR(summary?.totalNet ?? 0), icon: <Building2 className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600" },
        { label: "Platform Revenue", value: formatINR(summary?.platformRevenue ?? 0), icon: <TrendingUp className="w-5 h-5" />, color: "bg-purple-50 text-purple-600" },
        { label: "Pending Transactions", value: summary?.pendingCount ?? 0, icon: <AlertTriangle className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <IndianRupee className="w-6 h-6 text-emerald-500" /> Global Financial Ledger
                </h1>
                <p className="text-slate-500 mt-1">All platform transactions — donations, medical funds, and platform fee breakdown.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((s) => (
                    <div key={s.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div className={`inline-flex p-2 rounded-lg mb-3 ${s.color}`}>{s.icon}</div>
                        <p className="text-2xl font-bold text-slate-900">{loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : s.value}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Breakdown */}
            {!loading && summary && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-500" /> Platform Revenue Breakdown
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm text-slate-500">Maintenance Fees (2.5%)</p>
                            <p className="text-xl font-bold text-slate-800 mt-1">{formatINR(summary.totalFees)}</p>
                            <p className="text-xs text-slate-400 mt-1">{summary.transactionCount} completed transactions</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm text-slate-500">Donor Tips (up to 5%)</p>
                            <p className="text-xl font-bold text-slate-800 mt-1">{formatINR(summary.totalTips)}</p>
                            <p className="text-xs text-slate-400 mt-1">Optional donor contributions</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                            <p className="text-sm text-purple-600 font-semibold">Total Platform Revenue</p>
                            <p className="text-xl font-bold text-purple-800 mt-1">{formatINR(summary.platformRevenue)}</p>
                            <p className="text-xs text-purple-400 mt-1">Fees + Tips</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <h2 className="font-bold text-slate-900">Transaction History</h2>
                    <div className="flex gap-2 flex-wrap">
                        {types.map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${filter === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                            >{t}</button>
                        ))}
                    </div>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-400 border-b border-slate-100">
                                    <th className="px-5 py-3 font-semibold">Type</th>
                                    <th className="px-5 py-3 font-semibold">Orphanage</th>
                                    <th className="px-5 py-3 font-semibold">Donor</th>
                                    <th className="px-5 py-3 font-semibold text-right">Gross</th>
                                    <th className="px-5 py-3 font-semibold text-right">Fee</th>
                                    <th className="px-5 py-3 font-semibold text-right">Tip</th>
                                    <th className="px-5 py-3 font-semibold text-right">Net</th>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColor[t.transaction_type] ?? "bg-slate-100 text-slate-600"}`}>{t.transaction_type}</span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-700 font-medium max-w-[180px] truncate">{t.orphanage_name}</td>
                                        <td className="px-5 py-3 text-slate-500">{t.donor_alias ?? "—"}</td>
                                        <td className="px-5 py-3 text-right font-semibold text-slate-800">{formatINR(t.gross_amount)}</td>
                                        <td className="px-5 py-3 text-right text-rose-600">-{formatINR(t.maintenance_fee)}</td>
                                        <td className="px-5 py-3 text-right text-purple-600">{t.donor_tip ? `+${formatINR(t.donor_tip)}` : "—"}</td>
                                        <td className="px-5 py-3 text-right font-bold text-emerald-700">{formatINR(t.net_amount)}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusStyle[t.status] ?? ""}`}>{t.status}</span>
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
