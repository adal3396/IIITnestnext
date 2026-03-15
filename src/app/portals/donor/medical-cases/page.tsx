"use client";

import { useEffect, useState } from "react";
import {
  HeartPulse,
  Lock,
  ChevronDown,
  ChevronUp,
  Loader2,
  ShieldCheck,
  Calendar,
} from "lucide-react";

type ProgressUpdate = {
  id: string;
  case_id: string;
  update_date: string;
  title: string;
  description: string;
  created_at: string;
};

type MedicalCase = {
  id: string;
  child_alias: string;
  orphanage_name: string;
  condition: string;
  target_amount: number;
  urgency: string;
  ai_flag: string;
  submitted_date: string;
  progress_updates: ProgressUpdate[];
};

const urgencyClass = (u: string) =>
  u === "Critical"
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

export default function DonorMedicalCasesPage() {
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/donor/medical-cases")
      .then((r) => r.json())
      .then((data) => {
        setCases(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-rose-500" />
          Critical Illness Fund — Verified Cases
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Approved crowdfunding cases with encrypted medical progress updates. No child identity is exposed (DPDP Act 2023).
        </p>
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
          <Lock className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>All updates are non-PII and consent-based. Donors see progress only for cases they support.</span>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
        </div>
      )}

      {!loading && cases.length === 0 && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          <HeartPulse className="w-10 h-10 mx-auto mb-3 text-gray-200" />
          <p className="font-medium">No approved cases right now.</p>
          <p className="text-sm mt-1">Check back later or make a general donation.</p>
        </div>
      )}

      {!loading &&
        cases.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
              className="w-full flex flex-wrap items-center justify-between gap-3 p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-800">{c.child_alias}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${urgencyClass(c.urgency)}`}
                >
                  {c.urgency}
                </span>
                <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                  <Lock className="w-3 h-3" /> Encrypted identity
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Target: ₹{c.target_amount.toLocaleString("en-IN")}
                </span>
                {expandedId === c.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
            <div className="px-6 pb-2">
              <p className="text-gray-700 font-medium">{c.condition}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {c.orphanage_name} · AI assessment: {c.ai_flag}
              </p>
            </div>

            {expandedId === c.id && (
              <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  Encrypted progress updates (no PII)
                </h3>
                {c.progress_updates.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No updates yet. Progress will appear here once the care team posts anonymized updates.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {c.progress_updates.map((u) => (
                      <li
                        key={u.id}
                        className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100"
                      >
                        <Lock className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-800">{u.title}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{u.description}</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(u.update_date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
