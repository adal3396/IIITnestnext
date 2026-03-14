import { Building2, CheckCircle, XCircle, FileText, Eye, ShieldCheck, Clock } from "lucide-react";

const pendingOrphanages = [
    {
        id: "ORG-2046",
        name: "Hope House, Mumbai",
        state: "Maharashtra",
        registrationNo: "NGO-MH-2024-1892",
        submittedDate: "2026-03-12",
        aiStatus: "Pre-verified",
        aiConfidence: 96,
        docs: ["NGO Certificate", "Tax Exemption (80G)", "Audit Report 2024"],
        contact: "Suresh Nair",
    },
    {
        id: "ORG-2047",
        name: "Asha Kiran Sadan, Delhi",
        state: "Delhi",
        registrationNo: "NGO-DL-2024-0431",
        submittedDate: "2026-03-13",
        aiStatus: "Needs Review",
        aiConfidence: 72,
        docs: ["NGO Certificate", "Audit Report 2023"],
        contact: "Meena Kapoor",
    },
    {
        id: "ORG-2048",
        name: "Green Valley Children's Home, Bangalore",
        state: "Karnataka",
        registrationNo: "NGO-KA-2025-0087",
        submittedDate: "2026-03-14",
        aiStatus: "Pre-verified",
        aiConfidence: 88,
        docs: ["NGO Certificate", "Tax Exemption (80G)", "Audit Report 2024", "JJ Act Compliance"],
        contact: "Anand Rao",
    },
];

const statusColor = (status: string) =>
    status === "Pre-verified"
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "bg-amber-50 text-amber-700 border border-amber-200";

export default function VerificationQueuePage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-amber-500" />
                        Orphanage Verification Queue
                    </h1>
                    <p className="text-slate-500 mt-1">Review newly registered orphanages. AI has pre-screened all documents.</p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm font-semibold border border-amber-200">
                    <Clock className="w-4 h-4" />
                    {pendingOrphanages.length} Pending
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-slate-500">Approved This Month</p>
                        <p className="text-2xl font-bold text-slate-900">14</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Clock className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-slate-500">Awaiting Review</p>
                        <p className="text-2xl font-bold text-slate-900">3</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-xl text-red-500"><XCircle className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-slate-500">Rejected This Month</p>
                        <p className="text-2xl font-bold text-slate-900">2</p>
                    </div>
                </div>
            </div>

            {/* Verification Cards */}
            <div className="space-y-4">
                {pendingOrphanages.map((org) => (
                    <div key={org.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-lg font-bold text-slate-900">{org.name}</h2>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(org.aiStatus)}`}>
                                            AI: {org.aiStatus} ({org.aiConfidence}%)
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {org.state} · Reg No: {org.registrationNo} · Contact: {org.contact}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">Submitted: {org.submittedDate} · ID: {org.id}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                                    <Eye className="w-4 h-4" /> View Docs
                                </button>
                                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                                    <CheckCircle className="w-4 h-4" /> Approve
                                </button>
                                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        </div>

                        {/* Documents List */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Uploaded Documents</p>
                            <div className="flex flex-wrap gap-2">
                                {org.docs.map((doc) => (
                                    <span key={doc} className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg">
                                        <FileText className="w-3 h-3" /> {doc}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
