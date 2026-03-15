"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Ann = { id: string; title: string; message: string; created_at: string };

export default function AnnouncementsStrip() {
    const [list, setList] = useState<Ann[]>([]);
    const [newCount, setNewCount] = useState(0);

    useEffect(() => {
        // Initial fetch
        fetch("/api/announcements?audience=Orphanages")
            .then((r) => r.json())
            .then((d) => setList(Array.isArray(d) ? d.slice(0, 3) : []))
            .catch(() => {});

        // Supabase Realtime subscription for live announcements
        const channel = supabase
            .channel("orphanage-announcements")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "announcements",
                    filter: "target_audience=eq.All",
                },
                (payload) => {
                    const ann = payload.new as Ann;
                    setList((prev) => [ann, ...prev].slice(0, 3));
                    setNewCount((c) => c + 1);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "announcements",
                    filter: "target_audience=eq.Orphanages",
                },
                (payload) => {
                    const ann = payload.new as Ann;
                    setList((prev) => [ann, ...prev].slice(0, 3));
                    setNewCount((c) => c + 1);
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    if (list.length === 0) return null;

    return (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-2">
                <span className="relative">
                    <Bell className="w-4 h-4" />
                    {newCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                            {newCount > 9 ? "9+" : newCount}
                        </span>
                    )}
                </span>
                Announcements
                {newCount > 0 && (
                    <button
                        onClick={() => setNewCount(0)}
                        className="ml-auto text-xs text-purple-600 hover:text-purple-800 font-medium"
                    >
                        Mark read
                    </button>
                )}
            </h3>
            <ul className="space-y-2">
                {list.map((a) => (
                    <li key={a.id} className="text-sm">
                        <span className="font-medium text-gray-800">{a.title}</span>
                        <span className="text-gray-600"> — {a.message.slice(0, 80)}{a.message.length > 80 ? "…" : ""}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
