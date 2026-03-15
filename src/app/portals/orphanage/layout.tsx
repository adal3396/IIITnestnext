import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    FileText,
    GraduationCap,
    Settings,
    LogOut,
    AlertTriangle,
    ShieldCheck
} from "lucide-react";

export default function OrphanageDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">
                        NextNest Care
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link href="/portals/orphanage" className="flex items-center gap-3 px-3 py-2 text-purple-700 bg-purple-50 rounded-lg font-medium">
                        <LayoutDashboard className="w-5 h-5" />
                        Overview
                    </Link>
                    <Link href="/portals/orphanage/children" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-purple-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <Users className="w-5 h-5" />
                        Child Roster
                    </Link>
                    <Link href="/portals/orphanage/documents" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-purple-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <FileText className="w-5 h-5" />
                        Document Hub
                    </Link>
                    <Link href="/portals/orphanage/transition" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-purple-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <GraduationCap className="w-5 h-5" />
                        Transition Planning
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-200 space-y-2 flex flex-col items-start w-full">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 w-full mb-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        DPDP Compliant
                    </div>
                    <Link href="/portals/orphanage/settings" className="flex items-center gap-3 w-full px-3 py-2 text-gray-600 hover:text-purple-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                    <Link href="/" className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors mt-auto">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:justify-end">
                    <div className="md:hidden text-xl font-bold text-purple-600">NextNest Care</div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">Sunshine Orphanage</span>
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                            SO
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
