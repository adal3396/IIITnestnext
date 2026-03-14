"use client";

import { useState } from "react";
import Link from "next/link";
import {
    GraduationCap,
    Briefcase,
    Home,
    Users,
    ChevronRight,
    CheckCircle,
    Clock,
    Star,
    ArrowRight,
} from "lucide-react";

const transitionYouth = [
    {
        id: "1098",
        name: "Vikram Singh",
        age: 17,
        daysToExit: 180,
        skills: ["Carpentry", "Basic Computing"],
        successScore: 74,
        jobs: [
            { title: "Junior Carpenter", org: "BuildCraft India", match: 88 },
            { title: "Data Entry Operator", org: "Tata Consultancy", match: 72 },
        ],
        housing: { type: "Transitional Housing", location: "Delhi NCR", status: "Available" },
        mentor: { name: "Mr. Ravi Teja", occupation: "Carpenter (Senior)", status: "Matched" },
        tasks: [
            { label: "Skills assessment completed", done: true },
            { label: "Resume drafted by AI", done: true },
            { label: "Housing application submitted", done: false },
            { label: "Job interview scheduled", done: false },
        ],
    },
    {
        id: "1100",
        name: "Deepak Nair",
        age: 16,
        daysToExit: 730,
        skills: ["Cooking", "English Speaking"],
        successScore: 61,
        jobs: [
            { title: "Hospitality Trainee", org: "Taj Hotels Partner", match: 82 },
            { title: "Kitchen Assistant", org: "Zomato Partner Kitchen", match: 77 },
        ],
        housing: { type: "Shared PG", location: "Mumbai", status: "Pending" },
        mentor: { name: "Ms. Anita Nair", occupation: "Hotel Manager", status: "Pending" },
        tasks: [
            { label: "Skills assessment completed", done: true },
            { label: "Resume drafted by AI", done: false },
            { label: "Housing application submitted", done: false },
            { label: "Job interview scheduled", done: false },
        ],
    },
];

function SuccessBar({ score }: { score: number }) {
    const color = score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-amber-400" : "bg-red-500";
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="text-gray-500">Transition Success Score</span>
                <span className="font-bold text-gray-700">{score}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${score}%` }} />
            </div>
        </div>
    );
}

export default function TransitionPage() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const active = transitionYouth.find((y) => y.id === activeId) ?? transitionYouth[0];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-purple-600" /> Transition & Post-18 Planning Board
                    </h1>
                    <p className="text-gray-500 mt-1">AI-powered career guidance, job matching, and housing linkages for aging-out youth (15+).</p>
                </div>
                <div className="text-sm font-semibold bg-purple-50 text-purple-700 px-4 py-2 rounded-xl border border-purple-100">
                    {transitionYouth.length} youth in transition pipeline
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Youth List */}
                <div className="space-y-3">
                    <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Youth Panel</h2>
                    {transitionYouth.map((youth) => (
                        <button
                            key={youth.id}
                            onClick={() => setActiveId(youth.id)}
                            className={`w-full text-left bg-white rounded-2xl shadow-sm border p-4 transition-all ${
                                (activeId === youth.id || (!activeId && youth.id === transitionYouth[0].id))
                                    ? "border-purple-400 ring-1 ring-purple-300"
                                    : "border-gray-100 hover:border-purple-200"
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                                    {youth.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{youth.name}</p>
                                    <p className="text-xs text-gray-400">Age {youth.age} · {youth.daysToExit} days to exit care</p>
                                </div>
                            </div>
                            <SuccessBar score={youth.successScore} />
                            <div className="mt-3 flex flex-wrap gap-1">
                                {youth.skills.map((s) => (
                                    <span key={s} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{s}</span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-gray-800 text-lg">{active.name}'s Transition Plan</h2>
                        <Link
                            href={`/portals/orphanage/children/${active.id}`}
                            className="text-sm text-purple-600 hover:underline flex items-center gap-1"
                        >
                            Full Profile <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Tasks Checklist */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-500" /> Progress Checklist
                        </h3>
                        <div className="space-y-3">
                            {active.tasks.map((task, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${task.done ? "bg-emerald-500" : "bg-gray-200"}`}>
                                        {task.done && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>
                                    <p className={`text-sm ${task.done ? "text-gray-700 line-through" : "text-gray-600"}`}>{task.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Job Matches */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-blue-500" /> AI-Matched Job Opportunities
                        </h3>
                        <div className="space-y-3">
                            {active.jobs.map((job, i) => (
                                <div key={i} className="flex items-center justify-between border border-gray-100 rounded-xl p-3 hover:border-blue-200 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-800">{job.title}</p>
                                        <p className="text-xs text-gray-500">{job.org}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400">Match</div>
                                            <div className="font-bold text-blue-600">{job.match}%</div>
                                        </div>
                                        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Housing */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Home className="w-4 h-4 text-purple-500" /> Housing Linkage
                            </h3>
                            <p className="text-sm font-medium text-gray-800">{active.housing.type}</p>
                            <p className="text-sm text-gray-500">{active.housing.location}</p>
                            <span className={`mt-2 inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                                active.housing.status === "Available" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            }`}>{active.housing.status}</span>
                        </div>

                        {/* Mentor */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-500" /> Mentor Connection
                            </h3>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                                    {active.mentor.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <p className="text-sm font-medium text-gray-800">{active.mentor.name}</p>
                            </div>
                            <p className="text-xs text-gray-500">{active.mentor.occupation}</p>
                            <span className={`mt-2 inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                                active.mentor.status === "Matched" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            }`}>{active.mentor.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
