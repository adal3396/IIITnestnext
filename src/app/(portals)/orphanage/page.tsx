import { Users, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OrphanageDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-800 font-bold">Sunshine Orphanage Dashboard</h1>
                    <p className="text-gray-500 mt-1">Here is the daily overview for your facility.</p>
                </div>
                <Link href="/orphanage/children/new" className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    <Users className="w-5 h-5" />
                    Register Child
                </Link>
            </div>

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
                    <Link href="/orphanage/schemes" className="mt-4 flex items-center gap-2 text-sm font-semibold hover:text-purple-100 transition-colors">
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
                        <Link href="/orphanage/children/1094" className="text-sm text-purple-600 font-semibold hover:underline">View Profile</Link>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0 border-gray-100">
                        <div>
                            <p className="font-medium text-gray-800">Review Pending Transitions</p>
                            <p className="text-sm text-gray-500">2 careleavers are awaiting vocational skill matching.</p>
                        </div>
                        <Link href="/orphanage/transition" className="text-sm text-purple-600 font-semibold hover:underline">Review Now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
