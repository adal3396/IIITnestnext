"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

type Ann = { id: string; title: string; message: string; created_at: string };

export default function AnnouncementsStrip() {
    const [list, setList] = useState<Ann[]>([]);

    useEffect(() => {
        fetch("/api/announcements?audience=Orphanages")
            .then((r) => r.json())
            .then((d) => setList(Array.isArray(d) ? d.slice(0, 3) : []))
            .catch(() => {});
    }, []);

    if (list.length === 0) return null;

    return (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4" /> Announcements
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
