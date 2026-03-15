"use client";

import { useEffect, useState } from "react";
import { Trophy, Lock, Loader2, GraduationCap, Heart, Briefcase, Users, Sparkles } from "lucide-react";

type Achievement = {
  id: string;
  title: string;
  description_anon: string;
  category: string;
  created_at: string;
};

const categoryIcon: Record<string, React.ReactNode> = {
  Education: <GraduationCap className="w-5 h-5" />,
  Health: <Heart className="w-5 h-5" />,
  Transition: <Briefcase className="w-5 h-5" />,
  Community: <Users className="w-5 h-5" />,
  Impact: <Sparkles className="w-5 h-5" />,
};

const categoryColor: Record<string, string> = {
  Education: "bg-blue-50 text-blue-700 border-blue-200",
  Health: "bg-rose-50 text-rose-700 border-rose-200",
  Transition: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Community: "bg-purple-50 text-purple-700 border-purple-200",
  Impact: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function AchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/donor/achievements")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Achievement Portal
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Celebrate milestones and impact without exposing any personal data. Every entry is anonymized (DPDP Act 2023).
        </p>
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>No child or careleaver identity is ever shown. Donor engagement with full privacy.</span>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          <Trophy className="w-10 h-10 mx-auto mb-3 text-gray-200" />
          <p className="font-medium">No achievements yet.</p>
          <p className="text-sm mt-1">Run supabase/migration_v3_donor_features.sql to seed milestones.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border mb-3 ${categoryColor[a.category] ?? "bg-gray-50 text-gray-700 border-gray-200"}`}
              >
                {categoryIcon[a.category] ?? <Sparkles className="w-4 h-4" />}
                {a.category}
              </div>
              <h3 className="font-bold text-gray-800">{a.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{a.description_anon}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(a.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
