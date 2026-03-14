import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 font-sans">
      <main className="flex w-full flex-col items-center justify-center p-8 xs:p-12 md:p-24 text-center max-w-4xl">
        <h1 className="text-4xl xs:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 mb-6 pb-2">
          Welcome to NextNest
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl px-4">
          The unified platform bridging care gaps. Select your portal below to get started.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Public Portal Card */}
          <Link href="/portals/public" className="group flex flex-col items-center p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-400">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg suppressHydrationWarning xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">Public Portal</h2>
            <p className="text-gray-500 text-sm">Discover our mission, impact, and how to get involved.</p>
          </Link>

          {/* Donor Portal Card */}
          <Link href="/portals/donor" className="group flex flex-col items-center p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-teal-400">
             <div className="h-16 w-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg suppressHydrationWarning xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-teal-600 transition-colors">Donor Portal</h2>
            <p className="text-gray-500 text-sm">Track funds, meet the AI Advisor, and make a difference.</p>
          </Link>

          {/* Orphanage Portal Card */}
          <Link href="/portals/orphanage" className="group flex flex-col items-center p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-400">
             <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg suppressHydrationWarning xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">Orphanage Portal</h2>
            <p className="text-gray-500 text-sm">Manage children, view AI insights, and handle documents.</p>
          </Link>

           {/* Super Admin Portal Card */}
          <Link href="/portals/admin" className="group flex flex-col items-center p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-amber-400 sm:col-span-2 lg:col-span-3 lg:w-1/3 lg:mx-auto">
             <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg suppressHydrationWarning xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-amber-600 transition-colors">Super Admin</h2>
            <p className="text-gray-500 text-sm">Global command center for operations and bias auditing.</p>
          </Link>

        </div>
      </main>
    </div>
  );
}
