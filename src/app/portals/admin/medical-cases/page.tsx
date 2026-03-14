import { HeartPulse, CheckCircle, XCircle, AlertCircle, Eye, Lock, Clock } from "lucide-react";

const medicalCases = [
    {
        id: "MED-0091",
        childAlias: "Child A (Age 7)",
        orphanage: "Hope House, Mumbai",
        condition: "Congenital Heart Surgery",
        targetAmount: "₹ 3,50,000",
        urgency: "Critical",
        aiFlag: "High Priority - Verified Medical Records",
        submittedDate: "2026-03-11",
        encrypted: true,
    },
    {
        id: "MED-0092",
        childAlias: "Child B (Age 12)",
        orphanage: "Asha Kiran Sadan, Delhi",
        condition: "Spinal Deformity Treatment",
        targetAmount: "₹ 2,10,000",
        urgency: "Moderate",
        aiFlag: "Documents Partially Verified",
        submittedDate: "2026-03-13",
        encrypted: true,
    },
    {
        id: "MED-0093",
        childAlias: "Child C (Age 5)",
        orphanage: "Green Valley Home, Bangalore",
        condition: "Kidney Transplant",
        targetAmount: "₹ 8,00,000",
        urgency: "Critical",
        aiFlag: "Hospital Letter Verified",
        submittedDate: "2026-03-14",
        encrypted: true,
    },
];

const urgencyStyle = (urgency: string) =>
    urgency === "Critical"
        ? "bg-red-50 text-red-700 border border-red-200"
        : "bg-amber-50 text-amber-700 border border-amber-200";

export default function MedicalCasesPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <HeartPulse className="w-6 h-6 text-red-500" />
                        Medical Crowdfunding Moderation
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Review critical illness cases before they go live. All child identities are encrypted and anonymized.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    {medicalCases.length} Awaiting Approval
                </div>
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start gap-3 bg-slate-800 text-slate-300 p-4 rounded-xl text-sm">
                <Lock className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                <p>
                    <span className="font-semibold text-white">Privacy Notice (DPDP Act 2023): </span>
                    All child identity fields are encrypted. You are viewing anonymized case codes only. Medical progress updates to donors are also encrypted end-to-end.
                </p>
            </div>

            {/* Case Cards */}
            <div className="space-y-4">
                {medicalCases.map((c) => (
                    <div key={c.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h2 className="text-lg font-bold text-slate-900">{c.childAlias}</h2>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urgencyStyle(c.urgency)}`}>
                                        {c.urgency}
                                    </span>
                                    {c.encrypted && (
                                        <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                                            <Lock className="w-3 h-3" /> Encrypted Identity
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-700 font-medium">{c.condition}</p>
                                <p className="text-sm text-slate-500 mt-1">
                                    {c.orphanage} · Target: {c.targetAmount} · Submitted: {c.submittedDate} · ID: {c.id}
                                </p>
                                <div className="mt-3 flex items-center gap-2 text-sm">
                                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    <span className="text-slate-600">AI Assessment: <strong>{c.aiFlag}</strong></span>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                                    <Eye className="w-4 h-4" /> Review
                                </button>
                                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                                    <CheckCircle className="w-4 h-4" /> Approve to Go Live
                                </button>
                                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recently Approved */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    Recently Approved Cases
                </h2>
                <div className="space-y-3">
                    {["MED-0088 — Cleft Lip Surgery — ₹40,000 — Fully Funded", "MED-0085 — Bone Marrow Transplant — ₹6,20,000 — 78% Funded"].map((item) => (
                        <div key={item} className="flex items-center gap-3 text-sm text-slate-600 bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
