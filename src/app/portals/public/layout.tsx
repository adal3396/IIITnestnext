import Link from "next/link";
import type { Metadata } from "next";
import { Landmark, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "NextNest — Bridging Care Gaps for India's Orphan Children",
    description:
        "NextNest is a privacy-first AI platform connecting donors, orphanages, and administrators to build a transparent support ecosystem for children in India — fully compliant with DPDP Act 2023 & JJ Act 2015.",
    keywords: ["orphan care india", "child welfare", "donate orphanage", "PM CARES", "DPDP compliant", "NextNest"],
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
            {/* Sticky Navigation */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/portals/public" className="flex items-center gap-2">
                        <Landmark className="w-7 h-7 text-orange-600" />
                        <span className="text-xl font-extrabold tracking-tight text-blue-900 uppercase">
                            NextNest
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <Link href="/portals/public#about" className="hover:text-blue-900 transition-colors">About</Link>
                        <Link href="/portals/public#how-it-works" className="hover:text-blue-900 transition-colors">How It Works</Link>
                        <Link href="/portals/public#impact" className="hover:text-blue-900 transition-colors">Impact</Link>
                        <Link href="/portals/public#trust" className="hover:text-blue-900 transition-colors">Trust &amp; Privacy</Link>
                        <Link href="/portals/public#contact" className="hover:text-blue-900 transition-colors">Contact</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/portals/public/login"
                            className="text-sm font-semibold text-gray-700 hover:text-blue-900 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/portals/public/register"
                            className="text-sm font-semibold bg-blue-900 text-white px-5 py-2 rounded-md hover:bg-blue-800 transition-colors shadow-sm"
                        >
                            Get Started
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-3">
                                <Landmark className="w-6 h-6 text-orange-500" />
                                <span className="text-lg font-extrabold text-white uppercase tracking-wider">
                                    NextNest
                                </span>
                            </div>
                            <p className="text-gray-400 leading-relaxed max-w-sm">
                                A privacy-first AI platform bridging care gaps for India&apos;s 1.5 lakh youth who exit orphan care every year into vulnerability.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-3">Portals</h4>
                            <ul className="space-y-2">
                                <li><Link href="/portals/donor" className="hover:text-white transition-colors">Donor Portal</Link></li>
                                <li><Link href="/portals/orphanage" className="hover:text-white transition-colors">Orphanage Portal</Link></li>
                                <li><Link href="/portals/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-3">Compliance</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> DPDP Act 2023</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> JJ Act 2015</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> WCAG 2.1 AA</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> AI Bias Audited</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p>© {new Date().getFullYear()} NextNest. All rights reserved.</p>
                        <p className="flex items-center gap-2 text-green-500 font-medium text-sm">
                            <ShieldCheck className="w-4 h-4" />
                            DPDP Act 2023 Compliant
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
