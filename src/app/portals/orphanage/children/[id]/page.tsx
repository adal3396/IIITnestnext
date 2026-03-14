"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    User,
    AlertTriangle,
    CheckCircle,
    ShieldCheck,
    BookOpen,
    Trophy,
    Heart,
    Brain,
} from "lucide-react";

const mockProfiles: Record<string, {
    name: string; age: number; gender: string; dob: string;
    guardian: string; enrolledDate: string; riskScore: number;
    attendance: number; behaviorScore: string;
    schemes: { name: string; confidence: number; status: string }[];
    alerts: string[];
    academics: { subject: string; grade: string }[];
}> = {
    "1094": {
        name: "Aryan Sharma", age: 14, gender: "Male", dob: "2012-03-10",
        guardian: "Mrs. Kamla Devi", enrolledDate: "2019-06-15", riskScore: 72,
        attendance: 58, behaviorScore: "Concerning",
        schemes: [
            { name: "PM CARES for Children", confidence: 91, status: "Eligible" },
            { name: "State Education Scholarship", confidence: 65, status: "Partially Eligible" },
        ],
        alerts: [
            "72% academic drop-out risk based on attendance data.",
            "Missed 3 consecutive counseling sessions.",
        ],
        academics: [
            { subject: "Mathematics", grade: "D" },
            { subject: "Science", grade: "C" },
            { subject: "English", grade: "D" },
        ],
    },
    "1098": {
        name: "Vikram Singh", age: 17, gender: "Male", dob: "2009-11-04",
        guardian: "Mr. Suresh Kumar", enrolledDate: "2015-01-20", riskScore: 61,
        attendance: 70, behaviorScore: "Moderate",
        schemes: [
            { name: "Skill India Mission", confidence: 88, status: "Eligible" },
            { name: "PM CARES for Children", confidence: 73, status: "Eligible" },
        ],
        alerts: [
            "Approaching age 18 — transition plan should be activated.",
            "Skills assessment pending.",
        ],
        academics: [
            { subject: "Mathematics", grade: "C" },
            { subject: "Vocational Training", grade: "B" },
            { subject: "English", grade: "C" },
        ],
    },
};

const defaultProfile = {
    name: "Child Profile", age: 10, gender: "Female", dob: "2016-05-12",
    guardian: "Mrs. Radha Bai", enrolledDate: "2020-09-01", riskScore: 18,
    attendance: 94, behaviorScore: "Good",
    schemes: [
        { name: "Mid-Day Meal Scheme", confidence: 99, status: "Eligible" },
        { name: "State Scholarship", confidence: 80, status: "Eligible" },
    ],
    alerts: [],
    academics: [
        { subject: "Mathematics", grade: "A" },
        { subject: "Science", grade: "B" },
        { subject: "English", grade: "A" },
    ],
};

function RiskMeter({ score }: { score: number }) {
    const color = score >= 60 ? "bg-red-500" : score >= 35 ? "bg-amber-400" : "bg-emerald-500";
    const textColor = score >= 60 ? "text-red-600" : score >= 35 ? "text-amber-600" : "text-emerald-600";
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">AI Risk Score</span>
                <span className={`text-2xl font-bold ${textColor}`}>{score}<span className="text-base text-gray-400">/100</span></span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-3 rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
            </div>
            <p className="text-xs text-gray-400">
                {score >= 60 ? "⚠️ High risk — Immediate caretaker action required."
                    : score >= 35 ? "⚡ Moderate risk — Monitor closely."
                        : "✅ Low risk — Child is progressing well."}
            </p>
        </div>
    );
}

export default function ChildProfilePage() {
    const params = useParams();
    const id = params?.id as string;
    const profile = mockProfiles[id] ?? { ...defaultProfile, name: `Child #${id}` };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/portals/orphanage/children" className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                    <p className="text-gray-500 text-sm">Child ID: #{id} · Enrolled {profile.enrolledDate}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Demographics */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-2xl mb-3">
                                {profile.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
                            <p className="text-gray-400 text-sm">{profile.gender}, {profile.age} years old</p>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 flex items-center gap-1"><User className="w-4 h-4" /> Guardian</span>
                                <span className="text-gray-800 font-medium">{profile.guardian}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 flex items-center gap-1"><BookOpen className="w-4 h-4" /> Attendance</span>
                                <span className={`font-semibold ${profile.attendance < 70 ? "text-red-600" : "text-emerald-600"}`}>{profile.attendance}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 flex items-center gap-1"><Heart className="w-4 h-4" /> Behavior</span>
                                <span className="text-gray-800 font-medium">{profile.behaviorScore}</span>
                            </div>
                        </div>
                    </div>

                    {/* Academics */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Academic Grades</h3>
                        <div className="space-y-3">
                            {profile.academics.map((a) => (
                                <div key={a.subject} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">{a.subject}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                        a.grade === "A" ? "bg-emerald-50 text-emerald-700"
                                        : a.grade === "B" ? "bg-blue-50 text-blue-700"
                                        : a.grade === "C" ? "bg-amber-50 text-amber-700"
                                        : "bg-red-50 text-red-700"
                                    }`}>{a.grade}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Insights */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Risk Agent */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-600" /> Predictive Risk & Care Alert Agent
                        </h3>
                        <RiskMeter score={profile.riskScore} />

                        {profile.alerts.length > 0 && (
                            <div className="mt-5 space-y-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Alerts</p>
                                {profile.alerts.map((alert, i) => (
                                    <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                        <p className="text-sm text-red-700">{alert}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {profile.alerts.length === 0 && (
                            <div className="mt-5 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                <p className="text-sm text-emerald-700">No active risk alerts. Child is progressing well.</p>
                            </div>
                        )}
                    </div>

                    {/* Scheme Matcher */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-600" /> Smart Government Scheme Matcher
                        </h3>
                        <div className="space-y-4">
                            {profile.schemes.map((s) => (
                                <div key={s.name} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-gray-800">{s.name}</p>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                            s.status === "Eligible"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-amber-50 text-amber-700"
                                        }`}>{s.status}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${s.confidence}%` }} />
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium w-12">{s.confidence}% match</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-4">
                            AI confidence scores are generated using child profile data. All scheme applications are reviewed by a caretaker before submission.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
