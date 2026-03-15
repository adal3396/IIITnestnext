"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, HeartHandshake, Search, BadgeIndianRupee, Loader2, ArrowUpRight } from "lucide-react";

type Donor = {
  donor_name: string;
  donor_id: string | null;
  total_donated: number;
  transaction_count: number;
  last_donation: string;
  orphanages_supported: number;
  is_active: boolean;
};

type Summary = {
  total_donors: number;
  active_donors: number;
  total_volume: number;
  avg_donation: number;
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function AdminDonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    fetch("/api/admin/donors")
      .then((r) => r.json())
      .then((d) => { setDonors(d.donors ?? []); setSummary(d.summary); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = donors.filter((d) => {
    const matchSearch = d.donor_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "active" ? d.is_active : !d.is_active);
    return matchSearch && matchFilter;
  });

  const tierLabel = (total: number) => {
    if (total >= 100000) return { label: "Platinum", cls: "bg-purple-100 text-purple-700" };
    if (total >= 25000) return { label: "Gold", cls: "bg-amber-100 text-amber-700" };
    if (total >= 5000) return { label: "Silver", cls: "bg-slate-100 text-slate-700" };
    return { label: "Bronze", cls: "bg-orange-100 text-orange-700" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-teal-500" />
          Donors &amp; Funds Management
        </h1>
        <p className="text-slate-500 mt-1">Track all platform donors, donation volumes, and engagement metrics.</p>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl w-fit mb-3"><Users className="w-5 h-5" /></div>
              <p className="text-sm text-slate-500">Total Donors</p>
              <p className="text-3xl font-bold text-slate-900">{summary?.total_donors ?? 0}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="p-2.5 bg-green-50 text-green-600 rounded-xl w-fit mb-3"><TrendingUp className="w-5 h-5" /></div>
              <p className="text-sm text-slate-500">Active Donors</p>
              <p className="text-3xl font-bold text-slate-900">{summary?.active_donors ?? 0}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit mb-3"><BadgeIndianRupee className="w-5 h-5" /></div>
              <p className="text-sm text-slate-500">Total Volume</p>
              <p className="text-2xl font-bold text-slate-900">{fmt(summary?.total_volume ?? 0)}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-fit mb-3"><ArrowUpRight className="w-5 h-5" /></div>
              <p className="text-sm text-slate-500">Avg. Donation</p>
              <p className="text-2xl font-bold text-slate-900">{fmt(summary?.avg_donation ?? 0)}</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by donor name..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "inactive"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl capitalize transition-colors ${filter === f ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Donors Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-sm text-slate-500 font-medium">{filtered.length} donor{filtered.length !== 1 ? "s" : ""} found</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Donor Name</th>
                    <th className="px-6 py-3 text-left">Tier</th>
                    <th className="px-6 py-3 text-right">Total Donated</th>
                    <th className="px-6 py-3 text-right">Transactions</th>
                    <th className="px-6 py-3 text-right">Orphanages</th>
                    <th className="px-6 py-3 text-left">Last Donation</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-10 text-slate-400">No donors found.</td></tr>
                  ) : filtered.map((d, i) => {
                    const tier = tierLabel(d.total_donated);
                    return (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{d.donor_name}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tier.cls}`}>{tier.label}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-emerald-700">{fmt(d.total_donated)}</td>
                        <td className="px-6 py-4 text-right text-slate-600">{d.transaction_count}</td>
                        <td className="px-6 py-4 text-right text-slate-600">{d.orphanages_supported}</td>
                        <td className="px-6 py-4 text-slate-500">{new Date(d.last_donation).toLocaleDateString("en-IN")}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${d.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                            {d.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
