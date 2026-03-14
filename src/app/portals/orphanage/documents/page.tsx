"use client";

import { useState, useRef } from "react";
import {
    FileText,
    Upload,
    CheckCircle,
    AlertTriangle,
    Lock,
    Eye,
    Loader2,
    ShieldCheck,
} from "lucide-react";

const mockDocuments = [
    {
        id: 1, childId: "#1094", childName: "Aryan Sharma",
        docType: "Aadhaar Card", uploadedAt: "2026-01-15",
        status: "Verified", aiExtracted: true,
        extractedData: { name: "Aryan Sharma", dob: "2012-03-10", uid: "XXXX-XXXX-1094" },
    },
    {
        id: 2, childId: "#1095", childName: "Priya Patel",
        docType: "Birth Certificate", uploadedAt: "2026-02-05",
        status: "Verified", aiExtracted: true,
        extractedData: { name: "Priya Patel", dob: "2016-07-22", issuedBy: "Municipal Corp, Pune" },
    },
    {
        id: 3, childId: "#1096", childName: "Rahul Mehta",
        docType: "Medical Record", uploadedAt: "2026-03-10",
        status: "Anomaly Flagged", aiExtracted: true,
        extractedData: { note: "Discrepancy in DOB detected. Requires manual review." },
    },
    {
        id: 4, childId: "#1097", childName: "Meena Das",
        docType: "School Certificate", uploadedAt: "2026-03-12",
        status: "Pending Review", aiExtracted: false,
        extractedData: {},
    },
];

const docTypes = ["Aadhaar Card", "Birth Certificate", "Medical Record", "School Certificate", "NGO Reference Letter"];

export default function DocumentsPage() {
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
    const [docType, setDocType] = useState(docTypes[0]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = () => {
        if (!fileInputRef.current?.files?.length) return;
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        }, 2000);
    };

    const statusStyle = (status: string) => {
        if (status === "Verified") return "bg-emerald-50 text-emerald-700";
        if (status === "Anomaly Flagged") return "bg-red-50 text-red-700";
        return "bg-amber-50 text-amber-700";
    };

    const selectedDocument = mockDocuments.find((d) => d.id === selectedDoc);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-800 font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6 text-purple-600" /> Document Intelligence Hub
                    </h1>
                    <p className="text-gray-500 mt-1">Securely upload and manage child documents with AI-assisted OCR extraction.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 font-medium">
                    <Lock className="w-4 h-4" /> AES-256 Encrypted
                </div>
            </div>

            {/* JJ Act Compliance Notice */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm">
                    <p className="font-semibold text-blue-800">JJ Act 2015 & DPDP Act 2023 Compliant</p>
                    <p className="text-blue-600">All documents are stored with end-to-end encryption. Only verified caretakers of this facility can access these records. Personal data is anonymized before AI processing.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-purple-500" /> Upload Document
                    </h2>

                    <div>
                        <label className="text-sm text-gray-600 font-medium block mb-1">Document Type</label>
                        <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        >
                            {docTypes.map((t) => <option key={t}>{t}</option>)}
                        </select>
                    </div>

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center cursor-pointer hover:bg-purple-50 transition-colors"
                    >
                        <FileText className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Click to select file</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max 10MB)</p>
                        <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-60"
                    >
                        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with OCR...</> : <><Upload className="w-4 h-4" /> Upload & Analyze</>}
                    </button>

                    {uploadSuccess && (
                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-sm">
                            <CheckCircle className="w-4 h-4 shrink-0" /> Document uploaded and analyzed successfully!
                        </div>
                    )}
                </div>

                {/* Documents List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-bold text-gray-800">All Documents ({mockDocuments.length})</h2>
                    <div className="space-y-3">
                        {mockDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className={`bg-white rounded-2xl shadow-sm border p-4 cursor-pointer transition-all hover:border-purple-200 ${selectedDoc === doc.id ? "border-purple-400 ring-1 ring-purple-300" : "border-gray-100"}`}
                                onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <FileText className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{doc.docType}</p>
                                            <p className="text-xs text-gray-500">{doc.childName} · {doc.childId} · {doc.uploadedAt}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyle(doc.status)}`}>{doc.status}</span>
                                        <button className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded AI Extraction */}
                                {selectedDoc === doc.id && doc.aiExtracted && (
                                    <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> AI OCR Extracted Data
                                        </p>
                                        {doc.status === "Anomaly Flagged" && (
                                            <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
                                                <AlertTriangle className="w-4 h-4" /> {doc.extractedData.note}
                                            </div>
                                        )}
                                        {Object.entries(doc.extractedData)
                                            .filter(([k]) => k !== "note")
                                            .map(([key, val]) => (
                                                <div key={key} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                                                    <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                                                    <span className="text-gray-800 font-medium">{val as string}</span>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
