"use client";

import { useEffect, useState } from "react";
import { HandCoins, TrendingUp, History, Download, Loader2 } from "lucide-react";

type LedgerTransaction = {
    id: string;
    transaction_ref: string;
    donor_name: string;
    orphanage_name: string;
    amount_total: number;
    amount_orphanage: number;
    fee_platform: number;
    tip_amount: number;
    status: string;
    created_at: string;
    // Phase 2 Schema additions
    gross_amount?: number;
    net_amount?: number;
    maintenance_fee?: number;
    donor_tip?: number;
};

type FinanceData = {
    transactions: LedgerTransaction[];
    summary: {
        total_volume: number;
        platform_fees: number;
        donor_tips: number;
        net_revenue: number;
    };
};

export default function FinanceDashboard() {
    const [data, setData] = useState<FinanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFinance = async () => {
            try {
                const res = await fetch("/api/admin/finance");
                if (!res.ok) throw new Error("Failed to load financial data");
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFinance();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
    );
    if (error || !data) return <div className="p-8 text-red-600 bg-red-50 rounded-xl border border-red-200">Error: {error}</div>;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div>
                    <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-2">
                        <HandCoins className="w-7 h-7 text-emerald-600" />
                        Global Financial Ledger
                    </h1>
                    <p className="text-slate-500 mt-1">Platform revenue tracking and transaction history.</p>
                </div>
                <button
                    onClick={() => {
                        if (!data?.transactions?.length) {
                            alert("No transactions to export.");
                            return;
                        }
                        const headers = ["Reference", "Date", "Donor", "Orphanage", "Total (INR)", "Orphanage Payout", "Platform Fee", "Tip", "Status"];
                        const rows = data.transactions.map((t: LedgerTransaction) => [
                            t.transaction_ref ?? t.id,
                            new Date(t.created_at).toLocaleDateString("en-IN"),
                            t.donor_name ?? "",
                            t.orphanage_name ?? "",
                            t.amount_total ?? t.gross_amount ?? 0,
                            t.amount_orphanage ?? t.net_amount ?? 0,
                            t.fee_platform ?? t.maintenance_fee ?? 0,
                            t.tip_amount ?? t.donor_tip ?? 0,
                            t.status ?? "",
                        ]);
                        const csv = [headers.join(","), ...rows.map((r: (string | number)[]) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
                        const blob = new Blob([csv], { type: "text/csv" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `nextnest-financial-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Total Volume</div>
                    <div className="text-3xl font-black text-slate-900">{formatCurrency(data.summary.total_volume)}</div>
                </div>
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                    <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Orphanage Payouts</div>
                    <div className="text-3xl font-black text-emerald-900">{formatCurrency(data.summary.total_volume - data.summary.platform_fees - data.summary.donor_tips)}</div>
                </div>
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                    <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-1">Platform Fees (2.5%)</div>
                    <div className="text-3xl font-black text-blue-900">{formatCurrency(data.summary.platform_fees)}</div>
                </div>
                <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
                    <div className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-1">Donor Tips</div>
                    <div className="text-3xl font-black text-purple-900">{formatCurrency(data.summary.donor_tips)}</div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <History className="w-5 h-5 text-slate-500" /> Recent Transactions
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold border-b border-slate-200">Reference</th>
                                <th className="p-4 font-semibold border-b border-slate-200">Date</th>
                                <th className="p-4 font-semibold border-b border-slate-200">Donor</th>
                                <th className="p-4 font-semibold border-b border-slate-200">Orphanage</th>
                                <th className="p-4 font-semibold border-b border-slate-200 text-right">Total</th>
                                <th className="p-4 font-semibold border-b border-slate-200 text-right">Fee Split</th>
                                <th className="p-4 font-semibold border-b border-slate-200 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {data.transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-mono text-xs text-slate-500">{txn.transaction_ref}</td>
                                    <td className="p-4 text-slate-600">{new Date(txn.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 font-medium text-slate-900">{txn.donor_name}</td>
                                    <td className="p-4 text-slate-600">{txn.orphanage_name}</td>
                                    <td className="p-4 text-right font-bold text-slate-900">{formatCurrency(txn.amount_total ?? txn.gross_amount ?? 0)}</td>
                                    <td className="p-4 text-right">
                                        <div className="text-xs text-slate-500">Org: <span className="font-medium text-emerald-600">{formatCurrency(txn.amount_orphanage ?? txn.net_amount ?? 0)}</span></div>
                                        <div className="text-xs text-slate-500">Fee: <span className="font-medium text-blue-600">{formatCurrency(txn.fee_platform ?? txn.maintenance_fee ?? 0)}</span></div>
                                        {(Number(txn.tip_amount ?? txn.donor_tip) > 0) && (
                                            <div className="text-xs text-slate-500">Tip: <span className="font-medium text-purple-600">{formatCurrency(txn.tip_amount ?? txn.donor_tip ?? 0)}</span></div>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${txn.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {data.transactions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500 italic">No transactions found matching criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
