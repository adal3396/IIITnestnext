import { MessageSquare, AlertCircle, CheckCircle, Clock, Send, Bot } from "lucide-react";

const tickets = [
    {
        id: "TKT-5501",
        type: "Donor-Orphanage Dispute",
        subject: "Donation not reflected in orphanage ledger",
        raisedBy: "Donor D-8821",
        against: "Hope House, Mumbai",
        status: "Open",
        priority: "High",
        time: "1 hr ago",
        aiSuggestion: "Request transaction confirmation from the donor and cross-verify with Supabase payment logs. Escalate to orphanage admin within 24 hrs.",
    },
    {
        id: "TKT-5500",
        type: "Technical Issue",
        subject: "OCR document upload failing on Orphanage portal",
        raisedBy: "Asha Kiran Admin",
        against: "Platform",
        status: "In Progress",
        priority: "Medium",
        time: "3 hrs ago",
        aiSuggestion: "Check Storage bucket permissions and CORS policies. Issue may be related to file size limits. Notify AI dev team.",
    },
    {
        id: "TKT-5499",
        type: "Verification Complaint",
        subject: "Application rejected despite all documents submitted",
        raisedBy: "Green Valley Home",
        against: "Super Admin Review",
        status: "Resolved",
        priority: "Low",
        time: "Yesterday",
        aiSuggestion: "Already resolved — documents re-reviewed and orphanage approved. Close ticket.",
    },
];

const statusStyle = (status: string) => {
    if (status === "Open") return "bg-red-50 text-red-700 border-red-200";
    if (status === "In Progress") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
};

const statusIcon = (status: string) => {
    if (status === "Open") return <AlertCircle className="w-4 h-4" />;
    if (status === "In Progress") return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
};

export default function DisputesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-amber-500" />
                        Dispute & Support Resolution
                    </h1>
                    <p className="text-slate-500 mt-1">Manage donor-orphanage disputes and technical issues. AI suggests resolution steps for each ticket.</p>
                </div>
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    1 Open Ticket
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Open", value: "1", color: "bg-red-50 text-red-600", icon: <AlertCircle className="w-5 h-5" /> },
                    { label: "In Progress", value: "1", color: "bg-amber-50 text-amber-600", icon: <Clock className="w-5 h-5" /> },
                    { label: "Resolved (This Month)", value: "14", color: "bg-emerald-50 text-emerald-600", icon: <CheckCircle className="w-5 h-5" /> },
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

            {/* Ticket Cards */}
            <div className="space-y-4">
                {tickets.map((t) => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h2 className="text-base font-bold text-slate-900">{t.subject}</h2>
                                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusStyle(t.status)}`}>
                                        {statusIcon(t.status)} {t.status}
                                    </span>
                                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                                        {t.priority} Priority
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">
                                    <strong>Type:</strong> {t.type} · <strong>Raised by:</strong> {t.raisedBy} · <strong>Against:</strong> {t.against}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">ID: {t.id} · {t.time}</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                {t.status !== "Resolved" && (
                                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                                        <CheckCircle className="w-4 h-4" /> Mark Resolved
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* AI Suggested Response */}
                        <div className="bg-slate-800 text-slate-300 p-4 rounded-xl text-sm">
                            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                                <Bot className="w-4 h-4" /> AI Suggested Resolution
                            </div>
                            <p>{t.aiSuggestion}</p>
                        </div>

                        {/* Reply Box */}
                        {t.status !== "Resolved" && (
                            <div className="mt-4 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your response to the user..."
                                    className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
                                    <Send className="w-4 h-4" /> Send
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
