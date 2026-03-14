"use client";

import { useState } from "react";
import { Sparkles, FileText, Send, Loader2, CheckCircle, ChevronDown, List } from "lucide-react";

export default function ReportsPage() {
    const [bullets, setBullets] = useState("");
    const [generating, setGenerating] = useState(false);
    const [report, setReport] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!bullets.trim()) return;
        setGenerating(true);
        setTimeout(() => {
            setReport(`Dear NextNest Donors,

We are thrilled to share an update from Sunshine Orphanage! This past month has been incredibly productive and joyful for the children, thanks to your continued support.

**Library Expansion**
We successfully purchased 50 new educational books for our library. Watching the children’s eyes light up as they dive into new stories and subjects has been a heartwarming experience. These books will serve as a foundational tool for their academic growth.

**Science Fair Success**
Our annual Science Fair was a massive success! The children showcased remarkable creativity and enthusiasm, presenting projects ranging from volcano models to simple circuits. It’s moments like these that highlight their boundless potential.

**Health & Wellness**
We also completed our quarterly health checkups. We are happy to report that all the children are doing wonderfully, growing stronger and healthier every day.

Thank you for being the pillar of our community. Your contributions truly bridge the gap for these bright young minds.

Warm regards,
The Sunshine Orphanage Team.`);
            setGenerating(false);
        }, 2000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-800 font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6 text-purple-600" /> Automated Impact Reports
                    </h1>
                    <p className="text-gray-500 mt-1">Turn brief notes into compelling, emotional updates for your donors.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                    <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <List className="w-5 h-5 text-gray-400" /> Staff Notes
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Just type a few bullet points about what happened this month. Our AI will expand it into a professional newsletter.
                    </p>
                    <textarea 
                        value={bullets}
                        onChange={(e) => setBullets(e.target.value)}
                        placeholder="- bought 50 books&#10;- had a science fair&#10;- everyone is healthy"
                        className="flex-1 w-full min-h-[200px] border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none mb-4"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={generating || !bullets.trim()}
                        className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {generating ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating Draft...</> : <><Sparkles className="w-5 h-5" /> Generate AI Newsletter</>}
                    </button>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                        Powered by Groq LLM — Always review before sending.
                    </p>
                </div>

                {/* Output Section */}
                <div className="bg-purple-50 rounded-2xl shadow-sm border border-purple-100 p-6 flex flex-col h-full">
                    <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" /> Generated Newsletter
                    </h2>
                    
                    {!report && !generating && (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-purple-200 rounded-xl">
                            <FileText className="w-12 h-12 mb-3 opacity-50 text-purple-300" />
                            <p className="text-sm font-medium">Your generated report will appear here.</p>
                        </div>
                    )}

                    {generating && (
                        <div className="flex-1 flex flex-col items-center justify-center text-purple-600">
                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                            <p className="text-sm font-bold animate-pulse">Weaving your story...</p>
                        </div>
                    )}

                    {report && !generating && (
                        <div className="flex-1 flex flex-col">
                            <div className="bg-white flex-1 rounded-xl p-5 border border-purple-100 overflow-y-auto mb-4 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed shadow-sm">
                                {report}
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                                    Edit Text
                                </button>
                                <button className="flex-1 bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
                                    <Send className="w-4 h-4" /> Send to Donors
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
