import { TrendingUp, Users, HeartHandshake, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DonorDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-800 font-bold">Good Morning, John</h1>
                    <p className="text-gray-500 mt-1">Here is the latest update on your impact.</p>
                </div>
                <Link href="/portals/donor/donate" className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium">
                    <HeartHandshake className="w-5 h-5" />
                    Donate Now
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-emerald-600 bg-emerald-50 text-xs font-semibold px-2 py-1 rounded-full">+12% this month</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Total Contributions</h3>
                    <div className="text-3xl font-bold text-gray-800 mt-1">₹ 45,000</div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-blue-600 bg-blue-50 text-xs font-semibold px-2 py-1 rounded-full">3 Active</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Children Supported</h3>
                    <div className="text-3xl font-bold text-gray-800 mt-1">12</div>
                </div>

                {/* Action Card */}
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Speak to the AI Advisor</h3>
                        <p className="text-teal-50 text-sm">Get personalized recommendations on where your funds can make the biggest impact right now.</p>
                    </div>
                    <Link href="/portals/donor/advisor" className="mt-4 flex items-center gap-2 text-sm font-semibold hover:text-teal-100 transition-colors">
                        Start Chat <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Impact</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 border-gray-100">
                        <div>
                            <p className="font-medium text-gray-800">Medical Fund Contribution</p>
                            <p className="text-sm text-gray-500">Sunshine Orphanage, Delhi</p>
                        </div>
                        <div className="font-semibold text-gray-700">₹ 5,000</div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 border-gray-100">
                        <div>
                            <p className="font-medium text-gray-800">Education Sponsorship (Monthly)</p>
                            <p className="text-sm text-gray-500">Child ID: #4482</p>
                        </div>
                        <div className="font-semibold text-gray-700">₹ 2,000</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
