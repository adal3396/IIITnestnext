"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function OrphanageHeader() {
    const [name, setName] = useState("Orphanage");
    const [initials, setInitials] = useState("O");

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user;
            const n = (u?.user_metadata?.organization_name as string) || (u?.user_metadata?.full_name as string) || u?.email?.split("@")[0] || "Orphanage";
            setName(n);
            setInitials(
                n.split(/\s+/)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
            );
        });
    }, []);

    return (
        <>
            <span className="text-sm font-medium text-gray-500">{name}</span>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                {initials}
            </div>
        </>
    );
}
