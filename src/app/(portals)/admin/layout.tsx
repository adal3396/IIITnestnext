import Link from "next/link";
import {
    LayoutDashboard,
    Building2,
    HeartHandshake,
    Activity,
    Settings,
    LogOut,
    Shield,
    Database
} from "lucide-react";

export default function SuperAdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
                        <Shield className="w-6 h-6 text-amber-500" />
                        NextNest Admin
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-white bg-slate-800 rounded-lg font-medium">
                        <LayoutDashboard className="w-5 h-5 text-amber-500" />
                        Global Overview
                    </Link>
                    <Link href="/admin/orphanages" className="flex items-center gap-3 px-3 py-2 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                        <Building2 className="w-5 h-5" />
                        Orphanages
                    </Link>
                    <Link href="/admin/donors" className="flex items-center gap-3 px-3 py-2 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                        <HeartHandshake className="w-5 h-5" />
                        Donors & Funds
                    </Link>
                    <Link href="/admin/ai-audit" className="flex items-center gap-3 px-3 py-2 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                        <Activity className="w-5 h-5" />
                        AI Bias Audit
                    </Link>
                    <Link href="/admin/database" className="flex items-center gap-3 px-3 py-2 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                        <Database className="w-5 h-5" />
                        Data Export
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                        <Settings className="w-5 h-5" />
                        Platform Settings
                    </Link>
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-slate-800 rounded-lg font-medium transition-colors mt-auto">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:justify-end shadow-sm z-10">
                    <div className="md:hidden text-xl font-bold text-amber-600 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Admin
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">Super Admin</span>
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold border-2 border-amber-500">
                            SA
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-6 md:p-8 overflow-auto bg-slate-50/50">
                    {children}
                </div>
            </main>
        </div>
    );
}
