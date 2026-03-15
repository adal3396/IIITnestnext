"use client";

import { useState, useEffect } from "react";
import { TrendingUp, HeartHandshake, ArrowRight, Trophy, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AnnouncementsStrip from "./AnnouncementsStrip";

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
}

function getInitials(name: string) {
    return name
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function DonorDashboard() {
    const [userName, setUserName] = useState<string | null>(null);
    const [initials, setInitials] = useState("D");
    const [totalContributions, setTotalContributions] = useState<number | null>(null);
    const [badges, setBadges] = useState<string[]>([]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user;
            const name = (u?.user_metadata?.full_name as string) || u?.email?.split("@")[0] || "Donor";
            setUserName(name);
            setInitials(getInitials(name));
        });
    }, []);

    useEffect(() => {
        const headers: HeadersInit = {};
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.access_token) {
                (headers as Record<string, string>)["Authorization"] = `Bearer ${session.access_token}`;
            }
            fetch("/api/donor/transactions", { headers })
                .then((r) => r.json())
                .then((d) => {
                    const txns = d.transactions || [];
                    const total = txns.reduce((s: number, t: { amount_total: number }) => s + Number(t.amount_total || 0), 0);
                    setTotalContributions(total);
                    const b: string[] = [];
                    if (txns.length >= 1) b.push("First Donation");
                    if (total >= 1000) b.push("Supporter");
                    if (total >= 5000) b.push("Champion");
                    if (total >= 10000) b.push("Hero");
                    setBadges(b);
                })
                .catch(() => {});
        });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-800 font-bold">
                        {userName === null ? (
                            <span className="flex items-center gap-2"><Loader2 className="w-6 h-6 animate-spin text-teal-500" /> Loading…</span>
                        ) : (
                            `${getGreeting()}, ${userName}`
                        )}
                    </h1>
                    <p className="text-gray-500 mt-1">Here is the latest update on your impact.</p>
                </div>
                    <Link href="/portals/donor/donate" className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium">
                    <HeartHandshake className="w-5 h-5" />
                    Donate Now
                </Link>
            </div>

            <AnnouncementsStrip />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-emerald-600 bg-emerald-50 text-xs font-semibold px-2 py-1 rounded-full">+12% this month</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Total Contributions</h3>
                    <div className="text-3xl font-bold text-gray-800 mt-1">
                        {totalContributions !== null ? `₹ ${totalContributions.toLocaleString("en-IN")}` : "₹ 0"}
                    </div>
                </div>

                {/* Metric 2 - Badges */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <Trophy className="w-6 h-6" />
                        </div>
                        {badges.length > 0 && (
                            <span className="text-amber-600 bg-amber-50 text-xs font-semibold px-2 py-1 rounded-full">
                                {badges.length} Badge{badges.length > 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Your Badges</h3>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {badges.length === 0 ? (
                            <span className="text-gray-400 text-sm">Donate to earn badges</span>
                        ) : (
                            badges.map((b) => (
                                <span key={b} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                    {b}
                                </span>
                            ))
                        )}
                    </div>
                </div>

                {/* Action Card */}
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Speak to the AI Advisor</h3>
                        <p className="text-teal-50 text-sm">Get personalized recommendations on where your funds can make the biggest impact right now.</p>
                    </div>
                    <Link href="/portals/donor/advisor" className="mt-4 flex items-center gap-2 text-sm font-semibold hover:text-teal-100 transition-colors">
                        Start Chat <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Recent Impact from ledger */}
            <RecentImpact />
        </div>
    );
}

function RecentImpact() {
    const [txns, setTxns] = useState<{ description: string; beneficiary: string; amount: number }[]>([]);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const headers: HeadersInit = {};
            if (session?.access_token) {
                (headers as Record<string, string>)["Authorization"] = `Bearer ${session.access_token}`;
            }
            fetch("/api/donor/transactions", { headers })
                .then((r) => r.json())
                .then((d) => {
                    const list = (d.transactions || []).slice(0, 5).map((t: { orphanage_name: string; amount_total: number }) => ({
                        description: "Contribution",
                        beneficiary: t.orphanage_name,
                        amount: Number(t.amount_total),
                    }));
                    setTxns(list);
                })
                .catch(() => {});
        });
    }, []);
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Impact</h2>
            <div className="space-y-4">
                {txns.length === 0 ? (
                    <p className="text-gray-500 text-sm">Your recent contributions will appear here.</p>
                ) : (
                    txns.map((t, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 border-gray-100">
                            <div>
                                <p className="font-medium text-gray-800">{t.description}</p>
                                <p className="text-sm text-gray-500">{t.beneficiary}</p>
                            </div>
                            <div className="font-semibold text-gray-700">₹ {t.amount.toLocaleString("en-IN")}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
