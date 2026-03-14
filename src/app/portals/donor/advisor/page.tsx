"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, HeartHandshake } from "lucide-react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };
type SuggestedDonation = { amount: string; category: string; childAlias?: string };

function parseDonationToken(text: string): {
    cleaned: string;
    suggestions: SuggestedDonation[];
} {
    const suggestions: SuggestedDonation[] = [];
    const cleaned = text
        .replace(/\[DONATE:(\d+):([^:]+):?([^\]]*)\]/g, (_, amount, category, childAlias) => {
            suggestions.push({ amount, category, childAlias: childAlias || undefined });
            return "";
        })
        .trim();
    return { cleaned, suggestions };
}

const INITIAL_MESSAGE: Message = {
    role: "assistant",
    content:
        "Hello! I'm your NextNest Philanthropy Advisor. I can help you find the most impactful way to use your donations. What causes are closest to your heart today?",
};

export default function AIAdvisorPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Hydrate chat history from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("donor_advisor_chat");
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch {
                setMessages([INITIAL_MESSAGE]);
            }
        } else {
            setMessages([INITIAL_MESSAGE]);
        }
    }, []);

    // Persist chat history to localStorage whenever it changes
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("donor_advisor_chat", JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function handleSend() {
        const text = input.trim();
        if (!text || loading) return;
        const updated: Message[] = [...messages, { role: "user", content: text }];
        setMessages(updated);
        setInput("");
        setLoading(true);
        try {
            const res = await fetch("/api/ai/advisor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ donor_intent: text }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            // Our Stage 2 backend returns structured JSON { summary, recommendations }
            // We convert it back into the token format the frontend UI knows how to render
            let replyContent = data.summary || "Here are some impactful ways to support our children.";
            if (data.recommendations && data.recommendations.length > 0) {
                data.recommendations.forEach((r: any) => {
                    const amount = r.suggested_amount_inr || 5000; 
                    // Optionally include a child alias if the backend suggests one
                    const childAlias = r.child_alias || "";
                    replyContent += ` [DONATE:${amount}:${r.category}${childAlias ? ":" + childAlias : ""}]`;
                });
            }

            setMessages([...updated, { role: "assistant", content: replyContent }]);
        } catch (error) {
            console.error("AI fetch error:", error);
            setMessages([
                ...updated,
                {
                    role: "assistant",
                    content:
                        "I'm currently unable to generate advice. Please try again shortly.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                        <Bot className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-800">Philanthropy AI Advisor</h1>
                        <p className="text-xs text-gray-400">Powered by Groq · Privacy-first · DPDP Compliant</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                        <span className="text-xs text-gray-500">Online</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite" aria-label="Chat messages">
                    {messages.map((msg, i) => {
                        const isUser = msg.role === "user";
                        const { cleaned, suggestions } = isUser
                            ? { cleaned: msg.content, suggestions: [] }
                            : parseDonationToken(msg.content);
                        return (
                            <div key={i} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                                <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-500"}`}
                                    aria-hidden="true"
                                >
                                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className="max-w-[75%] space-y-2">
                                    <div
                                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? "bg-teal-600 text-white rounded-tr-sm" : "bg-gray-50 text-gray-700 rounded-tl-sm"}`}
                                    >
                                        {cleaned}
                                    </div>
                                    {suggestions.map((s, si) => (
                                        <div
                                            key={si}
                                            className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-3 flex items-center justify-between gap-3"
                                        >
                                            <div>
                                                <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">Suggested Donation</p>
                                                <p className="text-gray-800 font-bold text-lg">
                                                    ₹ {parseInt(s.amount).toLocaleString("en-IN")}
                                                </p>
                                                <p className="text-xs text-gray-500">{s.category}{s.childAlias && <> · <span className="font-medium text-teal-700">{s.childAlias}</span></>}</p>
                                            </div>
                                            <Link
                                                href={`/portals/donor/donate?amount=${s.amount}&category=${encodeURIComponent(s.category)}${s.childAlias ? "&child=" + encodeURIComponent(s.childAlias) : ""}`}
                                                aria-label={`Donate ₹${s.amount} towards ${s.category}${s.childAlias ? " for " + s.childAlias : ""}`}
                                                className="flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-teal-700 transition-colors flex-shrink-0"
                                            >
                                                <HeartHandshake className="w-3.5 h-3.5" />
                                                Donate Now
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Loading spinner */}
                    {loading && (
                        <div className="flex gap-3" aria-label="Advisor is thinking">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                <Bot className="w-4 h-4" aria-hidden="true" />
                            </div>
                            <div className="px-4 py-3 bg-gray-50 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-teal-500 animate-spin" aria-hidden="true" />
                                <span className="text-sm text-gray-500">Thinking…</span>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-end gap-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about donation categories, impact areas, or how your funds are used…"
                            aria-label="Message to AI Advisor"
                            rows={2}
                            disabled={loading}
                            className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent disabled:opacity-60"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            aria-label="Send message"
                            className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        All interactions are private. No child-identifiable data is ever shared. DPDP Act 2023 compliant.
                    </p>
                </div>
            </div>
        </div>
    );
}
