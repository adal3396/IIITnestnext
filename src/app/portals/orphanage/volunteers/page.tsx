"use client";

import { useState } from "react";
import { Users, Calendar, MapPin, Search, Check, X, UserPlus, Clock } from "lucide-react";

const opportunities = [
    { id: 1, title: "Weekend Math Tutoring", applicants: 4, slots: 2, schedule: "Saturdays, 10 AM - 12 PM", status: "Active" },
    { id: 2, title: "Art & Craft Workshop", applicants: 12, slots: 5, schedule: "Sunday, March 20th", status: "Active" },
    { id: 3, title: "Career Day Speaker", applicants: 1, slots: 1, schedule: "Friday, April 5th", status: "Urgent" },
];

const applicants = [
    { id: 101, name: "Sneha Rao", role: "Math Tutoring", experience: "High School Teacher (5 yrs)", backgroundCheck: "Passed", status: "Pending" },
    { id: 102, name: "Arjun Desai", role: "Math Tutoring", experience: "Engineering Student", backgroundCheck: "Pending", status: "Pending" },
    { id: 103, name: "Ritu Sharma", role: "Art & Craft", experience: "Professional Artist", backgroundCheck: "Passed", status: "Approved" },
];

export default function VolunteersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-800 font-bold flex items-center gap-2">
                        <Users className="w-6 h-6 text-purple-600" /> Volunteer Management
                    </h1>
                    <p className="text-gray-500 mt-1">Post opportunities and vet applicants for your facility.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    <UserPlus className="w-5 h-5" /> Post Opportunity
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Opportunities Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" /> Active Opportunities
                    </h2>
                    <div className="space-y-4">
                        {opportunities.map(opp => (
                            <div key={opp.id} className="border border-gray-100 rounded-xl p-4 hover:border-purple-200 transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800">{opp.title}</h3>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${opp.status === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {opp.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                                    <Clock className="w-4 h-4" /> {opp.schedule}
                                </div>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <span className="text-purple-600 px-3 py-1 bg-purple-50 rounded-lg">
                                        {opp.applicants} Applicants
                                    </span>
                                    <span className="text-gray-500">
                                        {opp.slots} slots available
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Applicants Review Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-gray-400" /> Applicant Review
                    </h2>
                    <div className="space-y-4">
                        {applicants.map(app => (
                            <div key={app.id} className="border border-gray-100 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{app.name}</h3>
                                        <p className="text-xs text-purple-600 font-semibold">{app.role}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                        app.backgroundCheck === 'Passed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                    }`}>
                                        BGC: {app.backgroundCheck}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">{app.experience}</p>
                                
                                {app.status === "Pending" ? (
                                    <div className="flex gap-2 mt-auto">
                                        <button className="flex-1 bg-emerald-50 text-emerald-700 font-semibold py-2 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                        <button className="flex-1 bg-red-50 text-red-700 font-semibold py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                                            <X className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full bg-gray-50 text-gray-500 font-semibold py-2 rounded-lg mt-auto flex items-center justify-center gap-1 cursor-default border border-gray-100">
                                        <Check className="w-4 h-4 text-emerald-500" /> Approved for onboarding
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
