"use client";

import { useEffect, useState } from "react";
import { Building2, CheckCircle, Clock, XCircle, Search, Loader2, BadgeIndianRupee, Users, Baby, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

type Orphanage = {
  id: string;
  name: string;
  state: string;
  registration_no: string;
  contact_person: string;
  submitted_date: string;
  status: "pending" | "approved" | "rejected";
  ai_status: string;
  ai_confidence: number;
  documents: string[];
  admin_note: string | null;
  created_at: string;
  total_received: number;
  donation_count: number;
  child_count: number;
};

type Summary = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  total_funds_disbursed: number;
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const statusConfig = {
  approved: { label: "Approved", cls: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-700", icon: <Clock className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-600", icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function AdminOrphanagesPage() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orphanages-list")
      .then((r) => r.json())
      .then((d) => { setOrphanages(d.orphanages ?? []); setSummary(d.summary); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = orphanages.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.state.toLowerCase().includes(search.toLowerCase()) ||
      o.contact_person.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-500" />
            Orphanages Management
          </h1>
          <p className="text-slate-500 mt-1">View all registered orphanages, their verification status, funds received, and children count.</p>
        </div>
        <Link
          href="/portals/admin/verification"
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors"
        >
          <Clock className="w-4 h-4" />
          Review Queue
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit mb-3"><Building2 className="w-5 h-5" /></div>
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-3xl font-bold text-slate-900">{summary?.total ?? 0}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
              <div className="p-2.5 bg-green-50 text-green-600 rounded-xl w-fit mb-3"><CheckCircle className="w-5 h-5" /></div>
              <p className="text-xs text-slate-500">Approved</p>
              <p className="text-3xl font-bold text-green-700">{summary?.approved ?? 0}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit mb-3"><Clock className="w-5 h-5" /></div>
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-3xl font-bold text-amber-700">{summary?.pending ?? 0}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
              <div className="p-2.5 bg-red-50 text-red-500 rounded-xl w-fit mb-3"><XCircle className="w-5 h-5" /></div>
              <p className="text-xs text-slate-500">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{summary?.rejected ?? 0}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-3"><BadgeIndianRupee className="w-5 h-5" /></div>
              <p className="text-xs text-slate-500">Total Disbursed</p>
              <p className="text-xl font-bold text-emerald-700">{fmt(summary?.total_funds_disbursed ?? 0)}</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, state, or contact person..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "approved", "pending", "rejected"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl capitalize transition-colors ${statusFilter === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Orphanages Cards */}
          <div className="space-y-3">
            <p className="text-sm text-slate-500 px-1">{filtered.length} orphanage{filtered.length !== 1 ? "s" : ""} found</p>
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">No orphanages found.</div>
            ) : filtered.map((o) => {
              const st = statusConfig[o.status] ?? statusConfig.pending;
              const isExpanded = expanded === o.id;
              return (
                <div key={o.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Row Header */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : o.id)}
                    className="w-full text-left p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <p className="font-bold text-slate-900 text-base">{o.name}</p>
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${st.cls}`}>
                          {st.icon}{st.label}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${o.ai_status === "Pre-verified" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                          {o.ai_status} ({o.ai_confidence}%)
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{o.state} · {o.registration_no} · {o.contact_person}</p>
                    </div>
                    <div className="flex items-center gap-6 md:gap-8 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-xs text-slate-400">Funds Received</p>
                        <p className="font-bold text-emerald-700">{fmt(o.total_received)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400">Donations</p>
                        <p className="font-bold text-slate-800">{o.donation_count}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400">Children</p>
                        <p className="font-bold text-slate-800">{o.child_count}</p>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {/* Expandable Detail */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 px-5 py-4 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Documents Submitted</p>
                        <ul className="space-y-0.5">
                          {(Array.isArray(o.documents) ? o.documents : []).map((doc, i) => (
                            <li key={i} className="flex items-center gap-1.5 text-slate-700">
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />{doc}
                            </li>
                          ))}
                          {(!o.documents || o.documents.length === 0) && <li className="text-slate-400">No documents</li>}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Timeline</p>
                        <p className="text-slate-700">Submitted: {o.submitted_date ? new Date(o.submitted_date).toLocaleDateString("en-IN") : "—"}</p>
                        <p className="text-slate-700">Registered: {new Date(o.created_at).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Admin Note</p>
                        <p className="text-slate-700">{o.admin_note ?? "No note added."}</p>
                        {o.status === "pending" && (
                          <Link
                            href="/portals/admin/verification"
                            className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-amber-600 hover:text-amber-800 underline"
                          >
                            Review in Verification Queue →
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
