import Link from "next/link";

export default function PublicPortal() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-blue-50 text-gray-900 font-sans p-8">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-10 text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-6">Public Portal</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Welcome to the public face of NextNest. Here you can learn about our mission, see our impact, and find ways to get involved.
                </p>
                <Link href="/" className="inline-block px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    &larr; Back to Home
                </Link>
            </div>
        </div>
    );
}
