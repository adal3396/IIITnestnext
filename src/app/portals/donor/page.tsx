import {
    TrendingUp,
    Users,
    HeartHandshake,
    ArrowRight,
    GraduationCap,
    Stethoscope,
    Package,
    Star,
    CheckCircle,
    Shield,
    Lock,
    Scale,
    Info,
} from "lucide-react";
import Link from "next/link";

const impactMetrics = [
    { icon: Users, label: "Children Supported", value: "127", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: GraduationCap, label: "Scholarships Enabled", value: "43", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Stethoscope, label: "Medical Cases Funded", value: "18", color: "text-rose-600", bg: "bg-rose-50" },
    { icon: Package, label: "Welfare Benefits Unlocked", value: "214", color: "text-amber-600", bg: "bg-amber-50" },
];

const fundAllocation = [
    { label: "Medical Care", pct: 45, color: "bg-rose-400" },
    { label: "Education", pct: 35, color: "bg-blue-400" },
    { label: "Supplies & Welfare", pct: 20, color: "bg-amber-400" },
];

const recentUpdates = [
    { icon: GraduationCap, text: "Child B completed Grade 10 with scholarship support.", time: "2 days ago", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Stethoscope, text: "Medical treatment successfully completed for Case #A12.", time: "5 days ago", color: "text-rose-600", bg: "bg-rose-50" },
    { icon: Package, text: "5 children received school kits this month.", time: "1 week ago", color: "text-amber-600", bg: "bg-amber-50" },
];

const achievements = [
    {
        title: "Academic Milestone",
        story: "Child A (Age 8) secured first rank in a regional Maths Olympiad, supported by donor-funded tutoring from Sunshine Home, Delhi.",
    },
    {
        title: "Health Recovery",
        story: "A young resident (Case #H07, Age 5) completed a full recovery after a funded procedure and has returned to school.",
    },
    {
        title: "Skill Development",
        story: "Anonymous Cohort #3 (three teenagers) completed a vocational training programme; two have already secured internship placements.",
    },
];

const trustBadges = [
    { icon: Shield, label: "DPDP Act 2023 Compliant" },
    { icon: Scale, label: "JJ Act 2015 Aligned" },
    { icon: Lock, label: "Privacy-First Platform" },
];

export default function DonorDashboard() {
    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-800 font-bold">Good Morning, John</h1>
                    <p className="text-gray-500 mt-1">Here is the latest update on your impact.</p>
                </div>
                <Link
                    href="/portals/donor/donate"
                    aria-label="Make a donation"
                    className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                    <HeartHandshake className="w-5 h-5" />
                    Donate Now
                </Link>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-emerald-600 bg-emerald-50 text-xs font-semibold px-2 py-1 rounded-full">+12% this month</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Total Contributions</h3>
                    <div className="text-3xl font-bold text-gray-800 mt-1">₹ 45,000</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-blue-600 bg-blue-50 text-xs font-semibold px-2 py-1 rounded-full">3 Active</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Children Supported</h3>
                    <div className="text-3xl font-bold text-gray-800 mt-1">12</div>
                </div>

                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Speak to the AI Advisor</h3>
                        <p className="text-teal-50 text-sm">Get personalised recommendations on where your funds make the biggest impact.</p>
                    </div>
                    <Link href="/portals/donor/advisor" aria-label="Open AI Advisor chat" className="mt-4 flex items-center gap-2 text-sm font-semibold hover:text-teal-100 transition-colors">
                        Start Chat <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Impact KPIs */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Your Collective Impact</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {impactMetrics.map(({ icon: Icon, label, value, color, bg }) => (
                        <div key={label} className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50">
                            <div className={`p-3 rounded-full ${bg} ${color} mb-3`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{value}</div>
                            <div className="text-xs text-gray-500 mt-1 leading-snug">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fund Utilisation Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Fund Distribution</h2>
                <div className="space-y-4">
                    {fundAllocation.map(({ label, pct, color }) => (
                        <div key={label}>
                            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1.5">
                                <span>{label}</span>
                                <span>{pct}%</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs text-gray-400 border-t border-gray-100 pt-4">
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <p>Funding distribution is calculated from verified orphanage expenditure records and anonymised child support programmes.</p>
                </div>
            </div>

            {/* Recent Impact Updates */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Impact Updates</h2>
                <div className="space-y-3">
                    {recentUpdates.map(({ icon: Icon, text, time, color, bg }) => (
                        <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                            <div className={`p-2 rounded-lg ${bg} ${color} flex-shrink-0`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-700 font-medium">{text}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievement Portal */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Achievement Portal</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {achievements.map(({ title, story }) => (
                        <div key={title} className="p-4 bg-gradient-to-b from-teal-50 to-white border border-teal-100 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-teal-500" />
                                <span className="text-sm font-semibold text-teal-700">{title}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{story}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust & Compliance Badges */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-wrap items-center justify-center gap-6">
                    {trustBadges.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <CheckCircle className="w-4 h-4 text-teal-500" aria-hidden="true" />
                            <Icon className="w-4 h-4 text-gray-400" aria-hidden="true" />
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
