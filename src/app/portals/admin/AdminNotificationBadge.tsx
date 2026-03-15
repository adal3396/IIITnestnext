"use client";

/**
 * AdminNotificationBadge
 *
 * A lightweight client component that subscribes to Supabase Realtime
 * for live counts of:
 *  - Open fraud alerts
 *  - New support tickets
 *
 * Renders a bell icon with a live badge counter in the admin header.
 * The server layout (layout.tsx) remains a pure server component.
 */

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminNotificationBadge() {
    const [count, setCount] = useState(0);
    const [showPanel, setShowPanel] = useState(false);
    const [alerts, setAlerts] = useState<{ message: string; type: string }[]>([]);

    useEffect(() => {
        // Fetch initial open count
        const fetchInitial = async () => {
            const [fraudRes, ticketRes] = await Promise.all([
                fetch("/api/admin/security").then((r) => r.json()).catch(() => ({ alerts: [] })),
                fetch("/api/admin/disputes").then((r) => r.json()).catch(() => ({ tickets: [] })),
            ]);

            const openFraud = (fraudRes.alerts || []).filter((a: { status: string }) => a.status === "Open" || a.status === "Investigating");
            const openTickets = (ticketRes.tickets || []).filter((t: { status: string }) => t.status === "Open");

            const items = [
                ...openFraud.slice(0, 2).map((a: { description: string; type: string }) => ({ message: a.description?.slice(0, 60) + "…", type: "Fraud" })),
                ...openTickets.slice(0, 2).map((t: { subject: string }) => ({ message: t.subject, type: "Ticket" })),
            ];

            setAlerts(items);
            setCount(openFraud.length + openTickets.length);
        };

        fetchInitial();

        // Realtime subscription for new fraud alerts
        const fraudChannel = supabase
            .channel("admin-fraud-alerts")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "fraud_alerts" },
                (payload) => {
                    const alert = payload.new as { description: string; type: string };
                    setAlerts((prev) => [{ message: alert.description?.slice(0, 60) + "…", type: "Fraud" }, ...prev].slice(0, 5));
                    setCount((c) => c + 1);
                }
            )
            .subscribe();

        // Realtime subscription for new support tickets
        const ticketChannel = supabase
            .channel("admin-support-tickets")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "support_tickets" },
                (payload) => {
                    const ticket = payload.new as { subject: string };
                    setAlerts((prev) => [{ message: ticket.subject, type: "Ticket" }, ...prev].slice(0, 5));
                    setCount((c) => c + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(fraudChannel);
            supabase.removeChannel(ticketChannel);
        };
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => { setShowPanel((p) => !p); setCount(0); }}
                className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notifications"
            >
                <Bell className="w-5 h-5" />
                {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-0.5 flex items-center justify-center">
                        {count > 99 ? "99+" : count}
                    </span>
                )}
            </button>

            {showPanel && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-800">Live Alerts</h4>
                        <button onClick={() => setShowPanel(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {alerts.length === 0 ? (
                            <p className="text-sm text-gray-500 p-4">No active alerts or tickets.</p>
                        ) : (
                            alerts.map((a, i) => (
                                <div key={i} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mr-2 ${a.type === "Fraud" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                                        {a.type}
                                    </span>
                                    <span className="text-sm text-gray-700">{a.message}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
