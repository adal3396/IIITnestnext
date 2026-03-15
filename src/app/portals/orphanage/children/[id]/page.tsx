"use client";

import { useState } from "react";
import { ArrowLeft, Brain, Calendar, GraduationCap, MapPin, User, AlertTriangle, Printer, Settings, X } from "lucide-react";
import Link from "next/link";

export default function ChildProfile({ params }: { params: { id: string } }) {
    const child = {
        name: "Rahul Sharma",
        id: "1094",
        age: "14",
        gender: "Male",
        admissionDate: "August 12, 2022",
        school: "Sunshine Model School",
        grade: "9th Standard",
        riskScore: 72,
        riskReason: "Predictive Risk: 72% academic drop-out risk detected",
        biometricStatus: "Verified",
        address: "Block B, Care Home Wing"
    };

    const [interventionModal, setInterventionModal] = useState(false);
    const [notifyDone, setNotifyDone] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [alertEmail, setAlertEmail] = useState(true);
    const [alertSms, setAlertSms] = useState(false);

    const loadSettings = () => {
        if (!settingsLoaded) {
            setAlertEmail(true);
            setAlertSms(false);
            setSettingsLoaded(true);
        }
        setSettingsModal(true);
    };

    const handlePrint = () => {
        const w = window.open("", "_blank");
        if (!w) return;
        w.document.write(`
            <!DOCTYPE html><html><head><title>Child Profile - ${child.name}</title></head><body style="font-family:sans-serif;padding:2rem;">
            <h1>NextNest — Child Profile</h1>
            <p style="color:#666;">Child ID: #${child.id} · Generated ${new Date().toLocaleString("en-IN")}</p>
            <table style="border-collapse:collapse;margin-top:1rem;">
            <tr><td style="padding:0.5rem;font-weight:600;">Name</td><td style="padding:0.5rem;">${child.name}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:600;">Age / Gender</td><td style="padding:0.5rem;">${child.age} yrs, ${child.gender}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:600;">Admission</td><td style="padding:0.5rem;">${child.admissionDate}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:600;">School / Grade</td><td style="padding:0.5rem;">${child.school} — ${child.grade}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:600;">AI Risk Score</td><td style="padding:0.5rem;">${child.riskScore}%</td></tr>
            </table>
            <p style="font-size:0.75rem;color:#888;margin-top:1.5rem;">DPDP Act 2023 compliant. Internal use only.</p>
            </body></html>
        `);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); w.close(); }, 250);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <Link 
                    href="/portals/orphanage" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-2 rounded-lg"
                >
                    <Printer className="w-4 h-4" />
                    Print profile
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Basic Info */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-3xl mb-4">
                            RS
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">{child.name}</h1>
                        <p className="text-gray-500 font-medium">Child ID: #{params.id}</p>
                        
                        <div className="mt-6 w-full space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>{child.age} Years Old, {child.gender}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>Admitted: {child.admissionDate}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>Location: {child.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Verification Status</h3>
                        <div className="bg-green-50 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-green-500 text-white p-1 rounded-full">
                                <Brain className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-green-800">Biometric Verified</p>
                                <p className="text-xs text-green-600 italic">Face and Thumbprint ID active</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Insights & Activities */}
                <div className="flex-1 space-y-6">
                    {/* Risk Alert Card */}
                    <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-amber-600" />
                            <h2 className="text-xl font-bold text-amber-900">AI Predictive Risk Alert</h2>
                        </div>
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-5xl font-black text-amber-600">{child.riskScore}%</span>
                            <span className="text-amber-800 font-bold mb-1">Risk of Secondary School Drop-out</span>
                        </div>
                        <p className="text-amber-800 text-sm leading-relaxed mb-6">
                            Academic tracking data shows significant gaps in math and science attendance over the last quarter. AI models suggest a high probability of disengagement if intervention is not initiated within the next 30 days.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button
                                type="button"
                                onClick={() => setInterventionModal(true)}
                                className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-amber-700 transition-colors text-sm"
                            >
                                Create Intervention Plan
                            </button>
                            <button
                                type="button"
                                onClick={() => { setNotifyDone(true); setTimeout(() => setNotifyDone(false), 3000); }}
                                className="bg-white border-2 border-amber-200 text-amber-700 px-4 py-2 rounded-lg font-bold hover:bg-amber-100 transition-colors text-sm"
                            >
                                {notifyDone ? "Notified ✓" : "Notify Case Worker"}
                            </button>
                            <button
                                type="button"
                                onClick={loadSettings}
                                className="bg-white border-2 border-amber-200 text-amber-700 px-4 py-2 rounded-lg font-bold hover:bg-amber-100 transition-colors text-sm flex items-center justify-center gap-1.5"
                            >
                                <Settings className="w-4 h-4" />
                                Alert settings
                            </button>
                        </div>
                    </div>

                    {/* Create Intervention Plan modal */}
                    {interventionModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Create Intervention Plan</h3>
                                <p className="text-sm text-gray-600 mb-4">Outline steps for this child (e.g. tutoring, counselling, parent meeting). Plan will be logged for the case worker.</p>
                                <textarea
                                    placeholder="e.g. 1. Schedule math tuition 2x/week&#10;2. Weekly check-in with class teacher&#10;3. Review in 30 days"
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                                />
                                <div className="flex gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setInterventionModal(false)}
                                        className="flex-1 py-2 border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setInterventionModal(false); }}
                                        className="flex-1 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
                                    >
                                        Save plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Alert settings modal */}
                    {settingsModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">Risk alert settings</h3>
                                    <button type="button" onClick={() => setSettingsModal(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">How to be notified when AI flags this child.</p>
                                <label className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-700">Email alerts</span>
                                    <input type="checkbox" checked={alertEmail} onChange={(e) => setAlertEmail(e.target.checked)} className="w-4 h-4 accent-amber-500" />
                                </label>
                                <label className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-700">SMS alerts</span>
                                    <input type="checkbox" checked={alertSms} onChange={(e) => setAlertSms(e.target.checked)} className="w-4 h-4 accent-amber-500" />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setSettingsModal(false)}
                                    className="mt-4 w-full py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}

                    {/* School Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-purple-600" /> Academic Standing
                            </h2>
                            <span className="text-xs text-purple-600 bg-purple-50 font-bold px-3 py-1 rounded-full uppercase">Term Tracking Active</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs text-gray-400 font-bold mb-1 uppercase">School</p>
                                <p className="text-lg font-bold text-gray-700">{child.school}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Grade</p>
                                <p className="text-lg font-bold text-gray-700">{child.grade}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <p className="text-sm font-bold text-gray-500 mb-4">Attendance Trend (Current Term)</p>
                            <div className="flex gap-1 h-32 items-end">
                                {[65, 80, 45, 30, 20, 15].map((h, i) => (
                                    <div key={i} className="flex-1 space-y-2 group relative">
                                        <div 
                                            className={`rounded-t-md transition-all duration-300 ${h < 50 ? 'bg-amber-400 group-hover:bg-amber-500' : 'bg-purple-400 group-hover:bg-purple-500'}`} 
                                            style={{ height: `${h}%` }}
                                        ></div>
                                        <p className="text-[10px] text-gray-400 font-medium text-center">Month {i+1}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
