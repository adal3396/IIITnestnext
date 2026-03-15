import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: announcements, error } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        return NextResponse.json(announcements);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, message, target_audience } = await request.json();
        
        if (!title || !message || !target_audience) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('announcements')
            .insert([{ title, message, target_audience }])
            .select()
            .single();

        if (error) throw error;
        
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
