"use client";

import { useState } from "react";
import { Save, Trash2, Shield, Bell, Eye, Lock, CheckCircle } from "lucide-react";

export default function SettingsPage() {
    const [displayName, setDisplayName] = useState("John Doe");
    const [notifications, setNotifications] = useState({
        impactUpdates: true,
        receipts: true,
        newsletter: false,
    });
    const [saved, setSaved] = useState(false);
    const [deletionRequested, setDeletionRequested] = useState(false);

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        // In production: persist to Supabase
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    function handleDeletionRequest() {
        // In production: trigger a verified data-deletion workflow
        setDeletionRequested(true);
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage your profile and privacy preferences.</p>
            </div>

            {/* Profile */}
            <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-teal-600" aria-hidden="true" />
                    <h2 className="font-bold text-gray-800">Profile</h2>
                </div>

                <div>
                    <label htmlFor="displayName" className="block text-sm font-semibold text-gray-600 mb-1.5">
                        Display Name
                    </label>
                    <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        aria-label="Your display name"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-1.5">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value="john.doe@example.com"
                        readOnly
                        aria-label="Your email address (read-only)"
                        aria-readonly="true"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Managed by your authentication provider.</p>
                </div>

                {saved && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-xl" role="status">
                        <CheckCircle className="w-4 h-4" aria-hidden="true" />
                        Settings saved successfully.
                    </div>
                )}

                <button
                    type="submit"
                    aria-label="Save profile settings"
                    className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors"
                >
                    <Save className="w-4 h-4" aria-hidden="true" />
                    Save Changes
                </button>
            </form>

            {/* Notification Preferences */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-4 h-4 text-teal-600" aria-hidden="true" />
                    <h2 className="font-bold text-gray-800">Notification Preferences</h2>
                </div>
                {(
                    [
                        { key: "impactUpdates", label: "Impact Updates", desc: "Anonymised updates on how your donations are making a difference." },
                        { key: "receipts", label: "Donation Receipts", desc: "Receive a copy of your receipt after each contribution." },
                        { key: "newsletter", label: "NextNest Newsletter", desc: "Monthly highlights from the platform." },
                    ] as const
                ).map(({ key, label, desc }) => (
                    <label key={key} className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notifications[key]}
                            onChange={(e) => setNotifications((prev) => ({ ...prev, [key]: e.target.checked }))}
                            aria-label={label}
                            className="mt-0.5 w-4 h-4 accent-teal-600"
                        />
                        <div>
                            <p className="text-sm font-semibold text-gray-700">{label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                        </div>
                    </label>
                ))}
            </div>

            {/* Privacy & DPDP Notice */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-teal-600" aria-hidden="true" />
                    <h2 className="font-bold text-gray-800">Privacy & Data Rights</h2>
                </div>

                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 space-y-2 text-sm text-teal-800">
                    <div className="flex items-center gap-2 font-semibold">
                        <Shield className="w-4 h-4" aria-hidden="true" />
                        DPDP Act 2023 Compliance Notice
                    </div>
                    <p className="text-xs text-teal-700 leading-relaxed">
                        NextNest processes your personal data solely to facilitate donations and generate anonymised impact reports. No child-identifiable data is ever shared with donors. Under the Digital Personal Data Protection Act 2023, you have the right to access, correct, and request deletion of your personal data at any time.
                    </p>
                    <p className="text-xs text-teal-600 font-medium mt-1">
                        Also aligned with: JJ Act 2015 · Privacy-First principles.
                    </p>
                </div>

                {deletionRequested ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-xl" role="status">
                        <CheckCircle className="w-4 h-4" aria-hidden="true" />
                        Data deletion request submitted. Our team will process it within 30 days.
                    </div>
                ) : (
                    <button
                        onClick={handleDeletionRequest}
                        aria-label="Request personal data deletion"
                        className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors"
                    >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        Request Data Deletion
                    </button>
                )}
            </div>
        </div>
    );
}
