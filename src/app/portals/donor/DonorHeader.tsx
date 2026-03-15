"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DonorHeader() {
    const [name, setName] = useState("Donor");
    const [initials, setInitials] = useState("D");

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user;
            const n = (u?.user_metadata?.full_name as string) || u?.email?.split("@")[0] || "Donor";
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
            <span className="text-sm font-medium text-gray-500">Welcome, {name}</span>
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                {initials}
            </div>
        </>
    );
}
