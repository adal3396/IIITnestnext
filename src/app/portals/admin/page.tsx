"use client";

import { useEffect, useState } from "react";
import { Activity, Building2, Users, Database, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

type Overview = {
  totalOrphanages: number;
  pendingVerifications: number;
  pendingMedical: number;
  totalOpportunities: number;
  openTickets: number;
  aiAuditScore: number;
  flaggedDecisions: number;
  totalFundsProcessed?: number;
};

type PendingItem = {
  id: string;
  name: string;
  state: string;
  status: string;
};

export default function SuperAdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/overview").then((r) => r.json()).catch(() => null),
      fetch("/api/admin/verification").then((r) => r.json()).catch(() => ({ registrations: [] })),
      fetch("/api/admin/finance").then((r) => r.json()).catch(() => ({ summary: { totalVolume: 0 } })),
    ]).then(([ov, ver, fin]) => {
      setOverview({
        ...(ov ?? {}),
        totalFundsProcessed: fin?.summary?.totalVolume ?? 0,
      });
      setPending((ver?.registrations ?? []).slice(0, 3));
      setLoadingData(false);
    });
  }, []);

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `₹ ${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
      ? `₹ ${(n / 1_000).toFixed(1)}K`
      : `₹ ${n}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl text-slate-900 font-bold">Global Oversight Dashboard</h1>
          <p className="text-slate-500 mt-1">System-wide metrics and pending verifications.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Operational
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            {overview?.pendingVerifications ? (
              <span className="text-amber-600 bg-amber-50 text-xs font-semibold px-2 py-1 rounded-full">
                {overview.pendingVerifications} Pending
              </span>
            ) : null}
          </div>
          <h3 className="text-sm font-medium text-slate-500">Registered Orphanages</h3>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {loadingData ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : overview?.totalOrphanages ?? "—"}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-500">Open Support Tickets</h3>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {loadingData ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : overview?.openTickets ?? "—"}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-500">Funds Processed (Total)</h3>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {loadingData ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : fmt(overview?.totalFundsProcessed ?? 0)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            {overview?.flaggedDecisions ? (
              <span className="text-amber-600 bg-amber-50 text-xs font-semibold px-2 py-1 rounded-full">
                {overview.flaggedDecisions} Flagged
              </span>
            ) : null}
          </div>
          <h3 className="text-sm font-medium text-slate-500">AI Bias Audit Score</h3>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {loadingData ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : `${overview?.aiAuditScore ?? 100}%`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verifications — live from Supabase */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" /> Pending Verifications
          </h2>
          <div className="space-y-4">
            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
              </div>
            ) : pending.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No pending registrations.</p>
            ) : (
              pending.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-800">{p.name}</p>
                    <p className="text-sm text-slate-500">{p.state} — Documents Uploaded</p>
                  </div>
                  <Link
                    href="/portals/admin/verification"
                    className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold hover:bg-amber-200 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
            {pending.length > 0 && (
              <Link
                href="/portals/admin/verification"
                className="flex items-center gap-1 text-sm text-amber-600 font-semibold hover:underline pt-1"
              >
                View all pending <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Platform Administration — corrected paths */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Platform Administration</h3>
            <p className="text-slate-400 text-sm mb-6">
              Manage global CMS, adjust AI confidence thresholds, or export anonymized tracking data for regulatory compliance.
            </p>
            <div className="space-y-3">
              <Link
                href="/portals/admin/ai-audit"
                className="flex items-center justify-between bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <span className="font-medium">Review AI Bias Logs</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/portals/admin/opportunities"
                className="flex items-center justify-between bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <span className="font-medium">Manage Transition CMS</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/portals/admin/security"
                className="flex items-center justify-between bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <span className="font-medium">Fraud & Security Monitor</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/portals/admin/settings"
                className="flex items-center justify-between bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <span className="font-medium">Export Anonymized Data</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
