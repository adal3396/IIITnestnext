import { Database, Download, ShieldCheck, ToggleLeft, ToggleRight, Bell, Percent, Lock, AlertTriangle } from "lucide-react";

const exportOptions = [
    { label: "Platform Growth Report (Monthly)", description: "Anonymized macro-level donor / orphanage growth trends", format: "CSV" },
    { label: "Fund Flow Summary (Quarterly)", description: "Aggregated fund disbursement summary — no PII", format: "XLSX" },
    { label: "AI Model Performance Report", description: "Accuracy, bias index, and confidence metrics per model", format: "PDF" },
    { label: "Government Scheme Utilization Report", description: "How many schemes were applied for and approved via platform", format: "CSV" },
];

const platformToggles = [
    { label: "Platform Maintenance Fee (2.5%)", description: "Deducted from each transaction to cover infrastructure costs", enabled: true },
    { label: "Optional Donor Tip (up to 5%)", description: "Allow donors to optionally add a tip to support NextNest operations", enabled: true },
    { label: "Public Achievement Portal", description: "Allow donor achievements to be shown publicly (privacy-safe)", enabled: false },
    { label: "AI Scheme Auto-Application", description: "Allow AI to auto-submit pre-approved government scheme applications", enabled: true },
];

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-6 h-6 text-amber-500" />
                    Platform Settings & Data Control
                </h1>
                <p className="text-slate-500 mt-1">Manage global platform toggles, anonymized data exports, and system-wide configurations.</p>
            </div>

            {/* Privacy/Compliance Notice */}
            <div className="flex items-start gap-3 bg-slate-800 text-slate-300 p-4 rounded-xl text-sm">
                <Lock className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                <p>
                    <span className="font-semibold text-white">DPDP Act 2023 Compliance: </span>
                    All data exports are strictly anonymized at the macro level. No Personally Identifiable Information (PII) is included in any export. Audit logs are maintained for all admin actions.
                </p>
            </div>

            {/* Data Export Section */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-slate-500" />
                    Anonymized Data Exports
                </h2>
                <div className="space-y-3">
                    {exportOptions.map((exp) => (
                        <div key={exp.label} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                            <div>
                                <p className="font-semibold text-slate-800">{exp.label}</p>
                                <p className="text-sm text-slate-500 mt-0.5">{exp.description}</p>
                            </div>
                            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0">
                                <Download className="w-4 h-4" /> Export {exp.format}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Platform Toggles */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-slate-500" />
                    Global Platform Toggles
                </h2>
                <div className="space-y-3">
                    {platformToggles.map((toggle) => (
                        <div key={toggle.label} className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
                            <div>
                                <p className="font-semibold text-slate-800">{toggle.label}</p>
                                <p className="text-sm text-slate-500 mt-0.5">{toggle.description}</p>
                            </div>
                            <button className="flex-shrink-0">
                                {toggle.enabled
                                    ? <ToggleRight className="w-8 h-8 text-emerald-500" />
                                    : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Global Communication Hub */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-slate-500" />
                    Global Communication Hub
                </h2>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Announcement Target</label>
                        <select className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
                            <option>All Users</option>
                            <option>All Donors</option>
                            <option>All Orphanage Admins</option>
                            <option>All Careleavers</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                        <textarea
                            rows={4}
                            placeholder="Write your platform-wide announcement here..."
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-700 transition-colors">
                        <Bell className="w-4 h-4" /> Send Announcement
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                </h2>
                <p className="text-sm text-slate-500 mb-4">These actions are irreversible. Proceed only when authorized and after full backups are confirmed.</p>
                <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                        <ShieldCheck className="w-4 h-4" /> Revoke Orphanage Batch Access
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                        <Lock className="w-4 h-4" /> Freeze All Active Campaigns
                    </button>
                </div>
            </div>
        </div>
    );
}
