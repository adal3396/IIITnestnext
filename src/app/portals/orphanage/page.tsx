"use client";

import { useState, useEffect } from "react";
import { Users, AlertTriangle, ArrowRight, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AnnouncementsStrip from "./AnnouncementsStrip";

export default function OrphanageDashboard() {
    const [orgName, setOrgName] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user;
            const n = (u?.user_metadata?.organization_name as string) || (u?.user_metadata?.full_name as string) || "Orphanage";
            setOrgName(n);
        });
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate Supabase 'insert'
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        setIsModalOpen(false);
        setShowToast(true);
        
        // Reset toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="space-y-6 relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-6 right-6 z-50 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <div className="bg-green-500 text-white p-1 rounded-full">
                        <Users className="w-4 h-4" />
                    </div>
                    <p className="font-medium">Child registered successfully!</p>
                </div>
            )}

            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-800 font-bold">{orgName ?? "Orphanage"} Dashboard</h1>
                    <p className="text-gray-500 mt-1">Here is the daily overview for your facility.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium cursor-pointer"
                >
                    <Users className="w-5 h-5" />
                    Register Child
                </button>
            </div>

            <AnnouncementsStrip />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Total Children</h3>
                    <div className="text-3xl font-bold text-gray-800 mt-1">42</div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <span className="text-amber-600 bg-amber-50 text-xs font-semibold px-2 py-1 rounded-full">Requires Attention</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">AI Risk Alerts</h3>
                    <div className="text-3xl font-bold text-gray-800 mt-1">3</div>
                </div>

                {/* Action Card */}
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Scheme Matcher</h3>
                        <p className="text-purple-50 text-sm">Review 5 new confidence-scored matches for government subsidies (e.g., PM CARES).</p>
                    </div>
                    <Link href="/portals/orphanage/schemes" className="mt-4 flex items-center gap-2 text-sm font-semibold hover:text-purple-100 transition-colors">
                        Review Matches <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Alert Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 border-l-4 border-l-amber-500">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Action Items
                </h2>
                <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0 border-gray-100">
                        <div>
                            <p className="font-medium text-gray-800">Child ID: #1094 - Predictive Risk Alert</p>
                            <p className="text-sm text-gray-500">AI has flagged a 72% academic drop-out risk based on recent attendance patterns.</p>
                        </div>
                        <Link href="/portals/orphanage/children/1094" className="text-sm text-purple-600 font-semibold hover:underline">View Profile</Link>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0 border-gray-100">
                        <div>
                            <p className="font-medium text-gray-800">Review Pending Transitions</p>
                            <p className="text-sm text-gray-500">2 careleavers are awaiting vocational skill matching.</p>
                        </div>
                        <Link href="/portals/orphanage/transition" className="text-sm text-purple-600 font-semibold hover:underline">Review Now</Link>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">Register New Child</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-hidden"
                                    placeholder="e.g. Rahul Sharma"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input 
                                        required
                                        type="date" 
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select 
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-hidden"
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                                <input 
                                    required
                                    type="date" 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-hidden"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="flex-1 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        'Submit Registration'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
