import { Briefcase, Plus, GraduationCap, Home, Edit2, Trash2, ToggleLeft, ToggleRight, Bot } from "lucide-react";

const opportunities = [
    {
        id: "OPP-101",
        type: "Job",
        title: "Junior Software Developer",
        partner: "Infosys Foundation",
        location: "Bangalore",
        eligibility: "Age 18-25, 10th Pass",
        aiMatches: 7,
        active: true,
    },
    {
        id: "OPP-102",
        type: "Vocational Training",
        title: "Tailoring & Fashion Design Course",
        partner: "NSDC (National Skill Dev. Corp.)",
        location: "Chennai",
        eligibility: "Age 16+, Female Careleavers",
        aiMatches: 12,
        active: true,
    },
    {
        id: "OPP-103",
        type: "Housing",
        title: "Affordable Transitional Housing",
        partner: "NHB (National Housing Bank)",
        location: "Mumbai",
        eligibility: "Age 18-21, JJ Act Careleavers",
        aiMatches: 4,
        active: false,
    },
    {
        id: "OPP-104",
        type: "Job",
        title: "Retail Management Trainee",
        partner: "Reliance Foundation",
        location: "Pan India",
        eligibility: "Age 18-26, Any Education",
        aiMatches: 15,
        active: true,
    },
];

const typeIcon = (type: string) => {
    if (type === "Job") return <Briefcase className="w-5 h-5" />;
    if (type === "Vocational Training") return <GraduationCap className="w-5 h-5" />;
    return <Home className="w-5 h-5" />;
};

const typeColor = (type: string) => {
    if (type === "Job") return "bg-blue-50 text-blue-600";
    if (type === "Vocational Training") return "bg-purple-50 text-purple-600";
    return "bg-teal-50 text-teal-600";
};

export default function OpportunitiesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-amber-500" />
                        Transition Opportunities CMS
                    </h1>
                    <p className="text-slate-500 mt-1">Manage external opportunities for careleavers. AI auto-matches eligible youth to listings.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-700 transition-colors">
                    <Plus className="w-4 h-4" /> Add Opportunity
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Active Listings", value: "3", icon: <Briefcase className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
                    { label: "Total AI Matches (This Month)", value: "38", icon: <Bot className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" },
                    { label: "Partner Organizations", value: "12", icon: <GraduationCap className="w-5 h-5" />, color: "bg-purple-50 text-purple-600" },
                ].map((s) => (
                    <div key={s.label} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
                        <div>
                            <p className="text-sm text-slate-500">{s.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Opportunities List */}
            <div className="space-y-4">
                {opportunities.map((opp) => (
                    <div key={opp.id} className={`bg-white border rounded-2xl shadow-sm p-6 ${opp.active ? "border-slate-200" : "border-slate-100 opacity-70"}`}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${typeColor(opp.type)}`}>{typeIcon(opp.type)}</div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h2 className="text-lg font-bold text-slate-900">{opp.title}</h2>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColor(opp.type)}`}>{opp.type}</span>
                                        {!opp.active && (
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Inactive</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        <strong>Partner:</strong> {opp.partner} · <strong>Location:</strong> {opp.location}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        <strong>Eligibility:</strong> {opp.eligibility}
                                    </p>
                                    <div className="mt-2 flex items-center gap-1.5 text-sm text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg w-fit">
                                        <Bot className="w-3.5 h-3.5" />
                                        <span>{opp.aiMatches} AI-matched careleavers</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                                <button className="p-2 text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-500 bg-slate-100 rounded-lg hover:bg-amber-100 transition-colors">
                                    {opp.active ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
                                </button>
                                <button className="p-2 text-red-400 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
