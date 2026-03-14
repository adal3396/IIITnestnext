"use client";

import { useState } from "react";
import { Download, CheckCircle, RefreshCw, Filter, History } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Category = "Medical" | "Education" | "Supplies" | "Welfare";
type Status = "Completed" | "Recurring";

type Contribution = {
    id: string;
    date: string;
    description: string;
    beneficiary: string;
    category: Category;
    amount: number;
    status: Status;
};

const contributions: Contribution[] = [
    { id: "TXN-A1", date: "2025-03-10", description: "Medical Fund Contribution", beneficiary: "Sunshine Home, Delhi", category: "Medical", amount: 5000, status: "Completed" },
    { id: "TXN-A2", date: "2025-03-01", description: "Education Sponsorship", beneficiary: "Anonymous — Child B", category: "Education", amount: 2000, status: "Recurring" },
    { id: "TXN-A3", date: "2025-02-20", description: "School Supplies Fund", beneficiary: "Hope Haven, Mumbai", category: "Supplies", amount: 1500, status: "Completed" },
    { id: "TXN-A4", date: "2025-02-10", description: "General Welfare Donation", beneficiary: "Sunrise Shelter, Bengaluru", category: "Welfare", amount: 3000, status: "Completed" },
    { id: "TXN-A5", date: "2025-01-25", description: "Education Sponsorship", beneficiary: "Anonymous — Child D", category: "Education", amount: 2000, status: "Recurring" },
    { id: "TXN-A6", date: "2025-01-15", description: "Critical Illness Fund", beneficiary: "Anonymous — Case #A12", category: "Medical", amount: 10000, status: "Completed" },
];

const CATEGORIES = ["All", "Medical", "Education", "Supplies", "Welfare"];

const categoryStyle: Record<Category, string> = {
    Medical: "text-rose-600 bg-rose-50",
    Education: "text-blue-600 bg-blue-50",
    Supplies: "text-amber-600 bg-amber-50",
    Welfare: "text-purple-600 bg-purple-50",
};

function downloadReceipt(c: Contribution) {
    const doc = new jsPDF();
    const dateStr = new Date(c.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
    
    // Header
    doc.setTextColor(45, 122, 115); // Teal color matching UI
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("NEXTNEST", 105, 20, { align: "center" });
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Transparency & Care for Every Child.", 105, 28, { align: "center" });

    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("DONATION RECEIPT", 20, 50);

    // Date & Tax Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`DATE: ${dateStr}`, 20, 60);

    doc.setFont("helvetica", "normal");
    doc.text("NextNest is a registered Section 8 Nonprofit Organization.", 20, 68);
    doc.setFont("helvetica", "bold");
    doc.text("Tax ID: 12-3456789", 20, 74);

    // Table 1: Donor Info
    autoTable(doc, {
        startY: 85,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3, textColor: [0, 0, 0] },
        columnStyles: { 
            0: { cellWidth: 40, fillColor: [200, 225, 230], fontStyle: 'bold' },
            1: { cellWidth: 130 }
        },
        body: [
            ['DONOR NAME', 'Anonymous Donor'], // Replace with actual context if available
            ['ADDRESS', 'N/A (Digital Receipt)'],
            ['CITY', 'Bengaluru'],
            ['STATE', 'Karnataka'],
            ['PHONE', '[Protected per DPDP Act]'],
        ],
    });

    // Table 2: Donation Details
    const finalY = (doc as any).lastAutoTable?.finalY || 135;
    autoTable(doc, {
        startY: finalY + 15,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3, textColor: [0, 0, 0] },
        columnStyles: { 
            0: { cellWidth: 40, fillColor: [200, 225, 230], fontStyle: 'bold' },
            1: { cellWidth: 130 }
        },
        body: [
            ['DONATION DATE', dateStr],
            ['PAYMENT METHOD', 'Online Transfer'],
            ['VALUE', `INR ${c.amount.toLocaleString("en-IN")}.00`],
            ['DESCRIPTION', c.description],
            ['BENEFICIARY', c.beneficiary],
            ['CATEGORY', c.category],
        ],
    });

    // Footer Thank You message
    const bottomY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for supporting our mission!", 20, bottomY);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
        "Your contribution will help us continue our efforts to transform the orphanage\n" +
        "ecosystem by providing verified resources and care.",
        20, bottomY + 8
    );

    doc.save(`nextnest-receipt-${c.id}.pdf`);
}

export default function HistoryPage() {
    const [filter, setFilter] = useState("All");
    const filtered = filter === "All" ? contributions : contributions.filter((c) => c.category === filter);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Contribution History</h1>
                    <p className="text-gray-500 text-sm mt-0.5">A full record of your anonymised donations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" aria-hidden="true" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        aria-label="Filter contributions by category"
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <History className="w-10 h-10 mx-auto mb-3 text-gray-200" aria-hidden="true" />
                    <p className="text-gray-400 font-semibold">No contributions yet.</p>
                    <p className="text-gray-300 text-sm mt-1">Your donation history will appear here once you make a contribution.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th scope="col" className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th scope="col" className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                                    <th scope="col" className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                                    <th scope="col" className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                                            {new Date(c.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-800">{c.description}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{c.beneficiary}</div>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyle[c.category]}`}>
                                                {c.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 font-bold text-gray-800 whitespace-nowrap">
                                            ₹{c.amount.toLocaleString("en-IN")}
                                        </td>
                                        <td className="px-5 py-4 hidden sm:table-cell">
                                            {c.status === "Completed" ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                                    <CheckCircle className="w-3 h-3" aria-hidden="true" /> Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                                                    <RefreshCw className="w-3 h-3" aria-hidden="true" /> Recurring
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => downloadReceipt(c)}
                                                aria-label={`Download receipt for transaction ${c.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                                                Receipt
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                        Showing {filtered.length} of {contributions.length} contributions · No personally identifiable child data is stored.
                    </div>
                </div>
            )}
        </div>
    );
}
