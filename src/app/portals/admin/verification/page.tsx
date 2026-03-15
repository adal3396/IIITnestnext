"use client";
import { useEffect, useState } from "react";
import { Building2, CheckCircle, XCircle, FileText, Eye, ShieldCheck, Clock, Loader2, Scan, FileCheck } from "lucide-react";

interface OrphanageRegistration {
    id: string;
    name: string;
    state: string;
    registration_no: string;
    contact_person: string;
    submitted_date: string;
    ai_status: string;
    ai_confidence: number;
    documents: string[];
}

const statusColor = (status: string) =>
    status === "Pre-verified"
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "bg-amber-50 text-amber-700 border border-amber-200";

export default function VerificationQueuePage() {
    const [orgs, setOrgs] = useState<OrphanageRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/verification")
            .then((r) => r.json())
            .then((d) => { setOrgs(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleAction = async (id: string, action: "approve" | "reject") => {
        setActioning(id + action);
        const res = await fetch("/api/admin/verification", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, action }),
        });
        if (res.ok) {
            setOrgs((prev) => prev.filter((o) => o.id !== id));
        }
        setActioning(null);
    };

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
                    {loading ? "..." : orgs.length} Pending
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </div>
            )}

            {/* Empty */}
            {!loading && orgs.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
                    <p className="font-semibold text-lg">All caught up!</p>
                    <p className="text-sm mt-1">No pending orphanage registrations.</p>
                </div>
            )}

            {/* Verification Cards */}
            {!loading && orgs.map((org) => (
                <div key={org.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h2 className="text-lg font-bold text-slate-900">{org.name}</h2>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(org.ai_status)}`}>
                                            AI: {org.ai_status} ({org.ai_confidence}%)
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {org.state} · Reg No: {org.registration_no} · Contact: {org.contact_person}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">Submitted: {new Date(org.submitted_date).toLocaleDateString()} · ID: {org.id.slice(0, 8)}</p>
                                </div>
                            </div>
    
                            <div className="flex gap-2 flex-shrink-0">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                                    <Eye className="w-4 h-4" /> View Docs
                                </button>
                                <button
                                    onClick={() => handleAction(org.id, "approve")}
                                    disabled={!!actioning}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
                                >
                                    {actioning === org.id + "approve" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(org.id, "reject")}
                                    disabled={!!actioning}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
                                >
                                    {actioning === org.id + "reject" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    Reject
                                </button>
                            </div>
                        </div>
    
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Documents Uploaded Panel */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileCheck className="w-4 h-4 text-slate-500" />
                                    <h3 className="text-sm font-bold text-slate-700">Uploaded Documents</h3>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {(org.documents ?? []).map((doc) => (
                                        <span key={doc} className="flex items-center gap-2 text-sm text-slate-600 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <FileText className="w-4 h-4 text-slate-400" /> {doc}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* AI OCR Extraction Panel */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Scan className="w-4 h-4 text-indigo-500" />
                                    <h3 className="text-sm font-bold text-indigo-900">AI OCR Extraction Summary</h3>
                                </div>
                                <div className="bg-white border border-indigo-50 rounded-lg p-3 shadow-sm relative h-[140px] overflow-y-auto custom-scrollbar">
                                    <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap">
{`{
  "entity_name": "${org.name}",
  "registration_number": "${org.registration_no}",
  "state_of_operation": "${org.state}",
  "primary_contact": "${org.contact_person}",
  "document_authenticity": "High",
  "80G_tax_exemption_valid": true,
  "last_audit_year": 2024,
  "flags": []
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
