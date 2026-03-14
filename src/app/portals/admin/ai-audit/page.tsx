import { Activity, AlertTriangle, CheckCircle, BarChart3, RefreshCw, Eye } from "lucide-react";

const auditMetrics = [
    { label: "Overall Fairness Score", value: "98.2%", change: "+0.3%", good: true },
    { label: "Scheme Eligibility Accuracy", value: "96.7%", change: "+1.1%", good: true },
    { label: "Donor Match Bias Index", value: "1.8%", change: "-0.4%", good: true },
    { label: "Open Alerts", value: "3", change: "+1", good: false },
];

const recentDecisions = [
    {
        id: "AI-LOG-4412",
        model: "Scheme Eligibility Engine",
        action: "Recommended PM CARES for Child #A19F",
        demographic: "State: Bihar | Age: 14",
        confidence: 94,
        status: "Fair",
        time: "2 hrs ago",
    },
    {
        id: "AI-LOG-4411",
        model: "Donor Matchmaking",
        action: "Matched Donor #D4892 to Hope House, Mumbai",
        demographic: "Region: Western India",
        confidence: 88,
        status: "Fair",
        time: "4 hrs ago",
    },
    {
        id: "AI-LOG-4410",
        model: "Careleavers Job Matchmaker",
        action: "Matched Careleaver #CL221 to Tech Opportunity",
        demographic: "State: Tamil Nadu | Gender: Female",
        confidence: 71,
        status: "Flagged",
        time: "6 hrs ago",
    },
    {
        id: "AI-LOG-4409",
        model: "Fraud Detection",
        action: "Flagged registration IP cluster from UP region",
        demographic: "State: Uttar Pradesh",
        confidence: 89,
        status: "Fair",
        time: "8 hrs ago",
    },
];

const statusStyle = (status: string) =>
    status === "Flagged"
        ? "bg-red-50 text-red-700 border border-red-200"
        : "bg-emerald-50 text-emerald-700 border border-emerald-200";

export default function AIAuditPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-amber-500" />
                        AI Bias Audit Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">Monitor AI Engine decisions for fairness, accuracy, and demographic equity across all models.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Refresh Audit
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {auditMetrics.map((m) => (
                    <div key={m.label} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${m.good ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                                {m.good ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            </div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.good ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"}`}>
                                {m.change}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">{m.label}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Bias Breakdown Bar Chart (Visual Representation) */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-500" />
                    Fairness by Demographic Group
                </h2>
                <div className="space-y-4">
                    {[
                        { label: "Northern States", score: 97, color: "bg-emerald-500" },
                        { label: "Southern States", score: 99, color: "bg-emerald-500" },
                        { label: "Eastern States", score: 95, color: "bg-amber-500" },
                        { label: "Western States", score: 98, color: "bg-emerald-500" },
                        { label: "Rural Areas", score: 93, color: "bg-amber-500" },
                        { label: "Urban Areas", score: 99, color: "bg-emerald-500" },
                    ].map((d) => (
                        <div key={d.label}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600 font-medium">{d.label}</span>
                                <span className="font-bold text-slate-900">{d.score}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5">
                                <div className={`${d.color} h-2.5 rounded-full transition-all`} style={{ width: `${d.score}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent AI Decisions Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Recent AI Decision Logs</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-400 border-b border-slate-100">
                                <th className="pb-3 font-semibold">Log ID</th>
                                <th className="pb-3 font-semibold">Model</th>
                                <th className="pb-3 font-semibold">Action</th>
                                <th className="pb-3 font-semibold">Demographic</th>
                                <th className="pb-3 font-semibold">Confidence</th>
                                <th className="pb-3 font-semibold">Status</th>
                                <th className="pb-3 font-semibold">Time</th>
                                <th className="pb-3 font-semibold"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentDecisions.map((d) => (
                                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 font-mono text-xs text-slate-500">{d.id}</td>
                                    <td className="py-3 font-medium text-slate-700">{d.model}</td>
                                    <td className="py-3 text-slate-600 max-w-[180px] truncate">{d.action}</td>
                                    <td className="py-3 text-slate-500">{d.demographic}</td>
                                    <td className="py-3">
                                        <span className="font-semibold text-slate-800">{d.confidence}%</span>
                                    </td>
                                    <td className="py-3">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle(d.status)}`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-slate-400 text-xs">{d.time}</td>
                                    <td className="py-3">
                                        <button className="text-slate-500 hover:text-slate-800">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
