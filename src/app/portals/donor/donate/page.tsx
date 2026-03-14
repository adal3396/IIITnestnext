"use client";

import { useState, useEffect } from "react";
import {
    HeartHandshake,
    AlertCircle,
    CheckCircle,
    Loader2,
    Heart,
    Activity,
    Users,
} from "lucide-react";

type Tab = "sponsor" | "illness";

type Campaign = {
    id: string;
    alias: string;
    description: string;
    target: number;
    raised: number;
};

const campaigns: Campaign[] = [
    {
        id: "c1",
        alias: "Case #M01",
        description: "Post-operative care and physiotherapy for a 7-year-old affected by a congenital condition.",
        target: 80000,
        raised: 62000,
    },
    {
        id: "c2",
        alias: "Case #M02",
        description: "Specialist consultation and medication support for chronic illness management.",
        target: 50000,
        raised: 12000,
    },
    {
        id: "c3",
        alias: "Case #M03",
        description: "Corrective surgery funding for a 4-year-old with a visual impairment.",
        target: 120000,
        raised: 93000,
    },
];

const childAliases = ["Child A (Age 7)", "Child B (Age 10)", "Child C (Age 5)", "Child D (Age 13)"];
const AMOUNTS = [500, 1000, 2000, 5000];
const FREQUENCIES = ["One-Time", "Monthly", "Quarterly"];

function getMilestone(pct: number) {
    if (pct >= 75) return { label: "75% Reached 🎉", color: "text-emerald-700 bg-emerald-100" };
    if (pct >= 50) return { label: "50% Reached 🔥", color: "text-orange-700 bg-orange-100" };
    if (pct >= 25) return { label: "25% Reached ⭐", color: "text-yellow-700 bg-yellow-100" };
    return null;
}

type DonateResult = { success: boolean; message?: string; error?: string };

export default function DonatePage() {
    const [tab, setTab] = useState<Tab>("sponsor");

    // Sponsor state
    const [selectedChild, setSelectedChild] = useState(childAliases[0]);
    const [amount, setAmount] = useState(1000);
    const [customAmount, setCustomAmount] = useState("");
    const [frequency, setFrequency] = useState(FREQUENCIES[0]);

    // Pre-fill amount from AI Advisor suggestions if passed via URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const amountParam = params.get("amount");
        if (amountParam) {
            const parsed = parseInt(amountParam.replace(/,/g, ""));
            if (!isNaN(parsed)) {
                if (AMOUNTS.includes(parsed)) {
                    setAmount(parsed);
                } else {
                    setAmount(0); // Clear selected fixed amount
                    setCustomAmount(parsed.toString()); // Use custom amount input
                }
            }
        }
    }, []);
    const [consent, setConsent] = useState(false);
    const [sponsorLoading, setSponsorLoading] = useState(false);
    const [sponsorResult, setSponsorResult] = useState<DonateResult | null>(null);

    // Campaign state
    const [campaignLoading, setCampaignLoading] = useState<string | null>(null);
    const [campaignResult, setCampaignResult] = useState<Record<string, DonateResult>>({});

    const finalAmount = customAmount ? parseInt(customAmount) : amount;

    async function handleSponsor() {
        if (!consent || sponsorLoading) return;
        setSponsorLoading(true);
        setSponsorResult(null);
        try {
            const res = await fetch("/api/donor/donate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "sponsorship",
                    amount: finalAmount,
                    category: "Education",
                    childAlias: selectedChild,
                    frequency,
                    consent,
                }),
            });
            setSponsorResult(await res.json());
        } catch {
            setSponsorResult({ success: false, error: "Network error. Please try again." });
        } finally {
            setSponsorLoading(false);
        }
    }

    async function handleCampaignDonate(c: Campaign) {
        if (campaignLoading) return;
        setCampaignLoading(c.id);
        try {
            const res = await fetch("/api/donor/donate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "illness_fund", amount: 1000, category: "Medical", campaignId: c.id }),
            });
            setCampaignResult((prev) => ({ ...prev, [c.id]: (res.ok ? res.json() : { success: false }) as unknown as DonateResult }));
            const data = await res.json();
            setCampaignResult((prev) => ({ ...prev, [c.id]: data }));
        } catch {
            setCampaignResult((prev) => ({ ...prev, [c.id]: { success: false, error: "Network error." } }));
        } finally {
            setCampaignLoading(null);
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Make a Donation</h1>
                <p className="text-gray-500 text-sm">All contributions are transparently tracked and DPDP Act 2023 compliant.</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 gap-1.5">
                {(["sponsor", "illness"] as Tab[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        aria-label={t === "sponsor" ? "Sponsor a Child tab" : "Critical Illness Fund tab"}
                        aria-pressed={tab === t}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${tab === t ? "bg-teal-600 text-white" : "text-gray-600 hover:text-teal-700"}`}
                    >
                        {t === "sponsor" ? "Sponsor a Child" : "Critical Illness Fund"}
                    </button>
                ))}
            </div>

            {/* Sponsor Tab */}
            {tab === "sponsor" && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                    {sponsorResult && (
                        <div className={`flex items-start gap-2 p-3 rounded-xl text-sm ${sponsorResult.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                            {sponsorResult.success ? <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                            {sponsorResult.success ? sponsorResult.message : sponsorResult.error}
                        </div>
                    )}

                    {/* Child selector */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Select Child (Anonymised)</p>
                        <div className="grid grid-cols-2 gap-2">
                            {childAliases.map((alias) => (
                                <button
                                    key={alias}
                                    onClick={() => setSelectedChild(alias)}
                                    aria-label={`Select ${alias}`}
                                    aria-pressed={selectedChild === alias}
                                    className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${selectedChild === alias ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600 hover:border-teal-300"}`}
                                >
                                    <Users className="w-4 h-4 mb-1 inline mr-1.5" aria-hidden="true" />
                                    {alias}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">Aliases protect child identity per DPDP Act 2023.</p>
                    </div>

                    {/* Amount */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Donation Amount (₹)</p>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                            {AMOUNTS.map((a) => (
                                <button
                                    key={a}
                                    onClick={() => { setAmount(a); setCustomAmount(""); }}
                                    aria-label={`₹${a.toLocaleString("en-IN")}`}
                                    aria-pressed={amount === a && !customAmount}
                                    className={`py-2.5 text-sm font-semibold rounded-xl transition-all ${amount === a && !customAmount ? "bg-teal-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-teal-50"}`}
                                >
                                    ₹{a.toLocaleString("en-IN")}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            placeholder="Or enter a custom amount"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            aria-label="Custom donation amount in rupees"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    {/* Frequency */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Frequency</p>
                        <div className="flex gap-2">
                            {FREQUENCIES.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFrequency(f)}
                                    aria-label={`${f} donation`}
                                    aria-pressed={frequency === f}
                                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${frequency === f ? "bg-teal-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-teal-50"}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Consent */}
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            aria-label="Consent to anonymous child sponsorship tracking"
                            className="mt-0.5 w-4 h-4 accent-teal-600"
                        />
                        <span className="text-sm text-gray-600">
                            I consent to anonymous child sponsorship tracking. No personally identifiable information will be shared, in accordance with the{" "}
                            <span className="text-teal-600 font-medium">DPDP Act 2023</span>.
                        </span>
                    </label>

                    {/* Submit */}
                    <button
                        onClick={handleSponsor}
                        disabled={!consent || sponsorLoading || !finalAmount || finalAmount <= 0}
                        aria-label="Confirm sponsorship"
                        className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sponsorLoading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Processing…</>
                        ) : (
                            <><HeartHandshake className="w-4 h-4" aria-hidden="true" /> Confirm Sponsorship — ₹{(finalAmount || 0).toLocaleString("en-IN")}</>
                        )}
                    </button>
                </div>
            )}

            {/* Critical Illness Tab */}
            {tab === "illness" && (
                <div className="space-y-4">
                    {campaigns.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-400">
                            <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" aria-hidden="true" />
                            <p className="font-medium">No active campaigns at the moment.</p>
                            <p className="text-sm mt-1 text-gray-300">Please check back later.</p>
                        </div>
                    ) : (
                        campaigns.map((c) => {
                            const pct = Math.round((c.raised / c.target) * 100);
                            const milestone = getMilestone(pct);
                            const result = campaignResult[c.id];
                            return (
                                <div key={c.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-800">{c.alias}</h3>
                                        {milestone && (
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${milestone.color}`}>
                                                {milestone.label}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-400 ml-auto">Medical · Crowdfunding</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{c.description}</p>
                                    <div className="mb-3">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>₹{c.raised.toLocaleString("en-IN")} raised</span>
                                            <span>Goal: ₹{c.target.toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                                            <div className="h-full bg-rose-400 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                        <div className="text-right text-xs text-gray-400 mt-1">{pct}% funded</div>
                                    </div>
                                    {result && (
                                        <div className={`flex items-center gap-1.5 text-xs mb-2 ${result.success ? "text-emerald-600" : "text-red-500"}`}>
                                            {result.success ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                            {result.message ?? (result.success ? "Contribution recorded!" : result.error)}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleCampaignDonate(c)}
                                        disabled={campaignLoading === c.id || result?.success}
                                        aria-label={`Donate ₹1,000 to ${c.alias}`}
                                        className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {campaignLoading === c.id ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                                        ) : result?.success ? (
                                            <><CheckCircle className="w-4 h-4" /> Contributed!</>
                                        ) : (
                                            <><Heart className="w-4 h-4" /> Contribute ₹1,000</>
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
