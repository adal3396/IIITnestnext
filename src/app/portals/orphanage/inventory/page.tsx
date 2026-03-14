"use client";

import { useState } from "react";
import { PackageSearch, AlertTriangle, TrendingUp, ShoppingCart, Plus, CheckCircle } from "lucide-react";

const inventoryData = [
    { id: 1, item: "Rice/Wheat (kg)", stock: 45, consumptionRate: "12 kg/week", daysLeft: 26, status: "Adequate" },
    { id: 2, item: "Baby Formula (tins)", stock: 3, consumptionRate: "2 tins/week", daysLeft: 10, status: "Low Stock Warning" },
    { id: 3, item: "Diapers (packs)", stock: 8, consumptionRate: "4 pks/week", daysLeft: 14, status: "Moderate" },
    { id: 4, item: "Pediatric Paracetamol", stock: 2, consumptionRate: "variable", daysLeft: 5, status: "Critical Shortage" },
];

const wishlistData = [
    { id: 1, item: "Dell Laptops (Refurbished)", quantity: 3, reason: "For 10th grade computer classes", funded: 1 },
    { id: 2, item: "Bunk Beds", quantity: 5, reason: "New dormitory expansion", funded: 5 },
    { id: 3, item: "Winter Blankets", quantity: 50, reason: "Upcoming winter season", funded: 12 },
];

export default function InventoryPage() {
    const [activeTab, setActiveTab] = useState("predictive");

    const getStatusStyle = (status: string) => {
        if (status === "Adequate") return "bg-emerald-50 text-emerald-700";
        if (status === "Critical Shortage") return "bg-red-50 text-red-700 font-bold border border-red-200";
        if (status === "Low Stock Warning") return "bg-amber-50 text-amber-700";
        return "bg-blue-50 text-blue-700";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-800 font-bold flex items-center gap-2">
                        <PackageSearch className="w-6 h-6 text-purple-600" /> Inventory & Needs
                    </h1>
                    <p className="text-gray-500 mt-1">AI-predicted supply shortages and public asset wishlist.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    <Plus className="w-5 h-5" /> Request Supplies
                </button>
            </div>

            <div className="flex gap-4 border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab("predictive")}
                    className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === "predictive" ? "border-purple-600 text-purple-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                >
                    Predictive Inventory
                </button>
                <button 
                    onClick={() => setActiveTab("wishlist")}
                    className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === "wishlist" ? "border-purple-600 text-purple-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                >
                    Infrastructure Wishlist
                </button>
            </div>

            {activeTab === "predictive" && (
                <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-amber-900">AI Reorder Alert</p>
                            <p className="text-sm text-amber-800">Based on consumption rates, <strong>Pediatric Paracetamol</strong> and <strong>Baby Formula</strong> will run out within 10 days. Would you like to auto-generate a donor campaign request?</p>
                            <button className="mt-3 bg-amber-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                                Draft Campaign
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Item</th>
                                    <th className="px-6 py-4">Current Stock</th>
                                    <th className="px-6 py-4">Consumption Rate</th>
                                    <th className="px-6 py-4 border-l border-gray-100 bg-purple-50/50 text-purple-800">Predicted Days Left</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {inventoryData.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">{item.item}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.stock}</td>
                                        <td className="px-6 py-4 text-gray-500 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3 text-purple-400" /> {item.consumptionRate}
                                        </td>
                                        <td className="px-6 py-4 border-l border-gray-100 font-bold font-mono text-gray-700">
                                            {item.daysLeft} days
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "wishlist" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistData.map(item => {
                        const progress = (item.funded / item.quantity) * 100;
                        const isComplete = progress >= 100;
                        return (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-gray-800 text-lg">{item.item}</h3>
                                    {isComplete ? (
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                    ) : (
                                        <ShoppingCart className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <p className="text-gray-500 text-sm mb-6 flex-1">{item.reason}</p>
                                
                                <div className="space-y-2 mt-auto">
                                    <div className="flex justify-between text-sm font-semibold text-gray-700">
                                        <span>{item.funded} funded</span>
                                        <span>Target: {item.quantity}</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-purple-500'}`} 
                                            style={{ width: `${progress}%` }} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
