import { ArrowLeft, CheckCircle, Info } from "lucide-react";
import Link from "next/link";

export default function SchemeMatcher() {
    const schemes = [
        {
            id: 1,
            name: "PM CARES for Children",
            description: "Support for children who have lost both parents, surviving parent, or legal guardian/adoptive parents due to COVID-19 pandemic.",
            confidence: "98%",
            status: "High Match",
            criteria: ["Lost both parents", "Admission date after March 2020"]
        },
        {
            id: 2,
            name: "Mission Vatsalya",
            description: "Centrally sponsored scheme for child protection services in India.",
            confidence: "85%",
            status: "Strong Match",
            criteria: ["Orphan or abandoned", "Resident of project state"]
        },
        {
            id: 3,
            name: "Beti Bachao Beti Padhao",
            description: "Empowerment through education and protection for female children.",
            confidence: "72%",
            status: "Medium Match",
            criteria: ["Female child", "Enrolled in school"]
        }
    ];

    return (
        <div className="space-y-6">
            <Link 
                href="/portals/orphanage" 
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h1 className="text-2xl text-gray-800 font-bold">Government Scheme Matcher</h1>
                <p className="text-gray-500 mt-1">Found 3 eligible schemes based on your current child roster and profile data.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {schemes.map((scheme) => (
                    <div key={scheme.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                        <div className="p-6 flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-bold text-gray-800">{scheme.name}</h3>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    scheme.confidence > "90%" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                }`}>
                                    {scheme.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                {scheme.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {scheme.criteria.map((c, i) => (
                                    <span key={i} className="bg-gray-50 text-gray-500 text-xs px-3 py-1.25 rounded-md border border-gray-100 flex items-center gap-1.5">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 w-full md:w-56 text-center">
                            <div className="mb-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Confidence Score</p>
                                <div className="text-4xl font-black text-purple-600">{scheme.confidence}</div>
                            </div>
                            <button className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                                <Info className="w-4 h-4" />
                                View Criteria
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
