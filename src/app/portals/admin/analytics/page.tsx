"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, AlertCircle, ArrowUpRight, ArrowDownRight, MapPin, Loader2 } from "lucide-react";

type ResourceSuggestion = {
    orphanage_name: string;
    status: "Over-funded" | "Under-funded";
    suggestion: string;
    urgency: "High" | "Low";
};

type AnalyticsData = {
    monthly_growth: string;
    donor_retention: string;
    resource_suggester: ResourceSuggestion[];
    regional_distribution: Record<string, number>;
};

export default function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch("/api/admin/analytics");
                if (!res.ok) throw new Error("Failed to load analytics");
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
    );
    
    if (error || !data) return (
        <div className="p-8 text-red-600 bg-red-50 rounded-xl border border-red-200">
            Error loading analytics: {error}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div>
                    <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-2">
                        <TrendingUp className="w-7 h-7 text-indigo-600" />
                        Platform Health & AI Analytics
                    </h1>
                    <p className="text-slate-500 mt-1">Real-time metrics and intelligent resource reallocation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Growth Metric */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">MoM Donation Growth</div>
                    <div className="text-4xl font-black text-emerald-600 flex items-center gap-2">
                        {data.monthly_growth} <ArrowUpRight className="w-6 h-6" />
                    </div>
                </div>

                {/* Retention Metric */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Donor Retention</div>
                    <div className="text-4xl font-black text-blue-600 flex items-center gap-2">
                        {data.donor_retention} <Users className="w-6 h-6" />
                    </div>
                </div>

                {/* Region Distribution */}
                <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 text-white flex flex-col">
                    <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Top Regions
                    </div>
                    <div className="space-y-3 flex-1">
                        {Object.entries(data.regional_distribution).map(([region, value]) => (
                            <div key={region} className="flex justify-between items-center text-sm">
                                <span>{region}</span>
                                <span className="font-bold text-amber-400">{value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    AI Resource Reallocation Suggestions
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {data.resource_suggester.map((suggestion, idx) => (
                        <div key={idx} className={`p-6 rounded-2xl border ${suggestion.status === 'Under-funded' ? 'bg-orange-50/50 border-orange-200' : 'bg-emerald-50/50 border-emerald-200'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{suggestion.orphanage_name}</h3>
                                    <p className={`text-sm font-semibold ${suggestion.status === 'Under-funded' ? 'text-orange-700' : 'text-emerald-700'}`}>
                                        Status: {suggestion.status}
                                    </p>
                                </div>
                                {suggestion.urgency === 'High' && (
                                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded tracking-wide align-top">CRITICAL</span>
                                )}
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                {suggestion.suggestion}
                            </p>
                            <button className={`w-full py-2.5 rounded-lg text-sm font-bold shadow-sm transition-transform active:scale-[0.98] ${suggestion.status === 'Under-funded' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200'}`}>
                                {suggestion.status === 'Under-funded' ? 'Draft Promoter Email' : 'Pause Recommendations'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
