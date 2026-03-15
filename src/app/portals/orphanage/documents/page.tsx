"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    FileText,
    Upload,
    CheckCircle,
    Lock,
    Eye,
    Loader2,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const docTypes = ["Aadhaar Card", "Birth Certificate", "Medical Record", "School Certificate", "NGO Reference Letter", "Other"];

type DocumentRow = {
    id: string;
    child_id: string;
    doc_type: string;
    file_name: string;
    file_path: string | null;
    file_size: number | null;
    status: string;
    created_at: string;
    child_alias?: string;
};

type ChildOption = { id: string; alias: string };

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<DocumentRow[]>([]);
    const [children, setChildren] = useState<ChildOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
    const [docType, setDocType] = useState(docTypes[0]);
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: HeadersInit = {};
        if (session?.access_token) (headers as Record<string, string>)["Authorization"] = `Bearer ${session.access_token}`;
        const [docsRes, childrenRes] = await Promise.all([
            fetch("/api/orphanage/documents", { headers }),
            fetch("/api/orphanage/children", { headers }),
        ]);
        const docsData = await docsRes.json();
        const childrenData = await childrenRes.json();
        setDocuments(Array.isArray(docsData.documents) ? docsData.documents : []);
        setChildren(Array.isArray(childrenData.children) ? childrenData.children : []);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (children.length > 0 && !selectedChildId) setSelectedChildId(children[0].id);
    }, [children, selectedChildId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpload = async () => {
        const file = fileInputRef.current?.files?.[0] ?? selectedFile;
        if (!file || !selectedChildId) return;
        setUploading(true);
        setUploadSuccess(false);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: HeadersInit = { Authorization: session?.access_token ? `Bearer ${session.access_token}` : "" };
            const fd = new FormData();
            fd.set("doc_type", docType);
            fd.set("file", file);
            const res = await fetch(`/api/orphanage/children/${selectedChildId}/documents`, { method: "POST", headers, body: fd });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Upload failed");
            }
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchData();
        } catch (e) {
            alert(e instanceof Error ? e.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const statusStyle = (status: string) => {
        if (status === "Verified") return "bg-emerald-50 text-emerald-700";
        if (status === "Anomaly Flagged") return "bg-red-50 text-red-700";
        return "bg-amber-50 text-amber-700";
    };

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
                        <label className="text-sm text-gray-600 font-medium block mb-1">Select Child</label>
                        <select
                            value={selectedChildId}
                            onChange={(e) => setSelectedChildId(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        >
                            <option value="">— Select child —</option>
                            {children.map((c) => (
                                <option key={c.id} value={c.id}>{c.alias}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 font-medium block mb-1">Document Type</label>
                        <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        >
                            {docTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center cursor-pointer hover:bg-purple-50 transition-colors"
                    >
                        <FileText className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">{selectedFile ? selectedFile.name : "Click to select file"}</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max 10MB)</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading || !selectedChildId || !selectedFile}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-60"
                    >
                        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Document</>}
                    </button>

                    {uploadSuccess && (
                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-sm">
                            <CheckCircle className="w-4 h-4 shrink-0" /> Document uploaded successfully!
                        </div>
                    )}
                </div>

                {/* Documents List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-bold text-gray-800">All Documents ({documents.length})</h2>
                    {loading ? (
                        <div className="flex items-center gap-2 text-gray-500 py-8">
                            <Loader2 className="w-5 h-5 animate-spin" /> Loading…
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {documents.length === 0 ? (
                                <p className="text-gray-500 text-sm py-6">No documents yet. Upload one using the panel or add documents when registering a child.</p>
                            ) : (
                                documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className={`bg-white rounded-2xl shadow-sm border p-4 cursor-pointer transition-all hover:border-purple-200 ${selectedDocId === doc.id ? "border-purple-400 ring-1 ring-purple-300" : "border-gray-100"}`}
                                        onClick={() => setSelectedDocId(selectedDocId === doc.id ? null : doc.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-50 rounded-lg">
                                                    <FileText className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{doc.doc_type}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {doc.child_alias ?? "—"} · #{doc.child_id.slice(0, 8)} · {doc.file_name} · {new Date(doc.created_at).toLocaleDateString("en-IN")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyle(doc.status)}`}>{doc.status}</span>
                                                <Link href={`/portals/orphanage/children/${doc.child_id}`} className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors" title="View child profile">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                        {selectedDocId === doc.id && (
                                            <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Details</p>
                                                <div className="flex justify-between text-sm py-1 border-b border-gray-100"><span className="text-gray-500">File</span><span className="text-gray-800 font-medium">{doc.file_name}</span></div>
                                                {doc.file_size != null && <div className="flex justify-between text-sm py-1 border-b border-gray-100"><span className="text-gray-500">Size</span><span className="text-gray-800 font-medium">{(doc.file_size / 1024).toFixed(1)} KB</span></div>}
                                                <div className="flex justify-between text-sm py-1"><span className="text-gray-500">Status</span><span className="text-gray-800 font-medium">{doc.status}</span></div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
