import Link from "next/link";
import {
    LayoutDashboard,
    HandHeart,
    MessageSquareHeart,
    History,
    Settings,
    LogOut,
    TrendingUp,
    Users
} from "lucide-react";

export default function DonorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500">
                        NextNest Donor
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link href="/donor" className="flex items-center gap-3 px-3 py-2 text-teal-700 bg-teal-50 rounded-lg font-medium">
                        <LayoutDashboard className="w-5 h-5" />
                        Impact Dashboard
                    </Link>
                    <Link href="/donor/donate" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-teal-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <HandHeart className="w-5 h-5" />
                        Make a Donation
                    </Link>
                    <Link href="/donor/advisor" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-teal-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <MessageSquareHeart className="w-5 h-5" />
                        AI Advisor
                    </Link>
                    <Link href="/donor/history" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-teal-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <History className="w-5 h-5" />
                        Contribution History
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-200 space-y-2">
                    <Link href="/donor/settings" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-teal-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors mt-auto">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Top Header (Mobile menu toggle goes here eventually) */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:justify-end">
                    <div className="md:hidden text-xl font-bold text-teal-600">NextNest Donor</div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">Welcome, Donor</span>
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                            JD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-6 md:p-8 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
