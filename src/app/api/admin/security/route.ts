import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: alerts, error } = await supabase
            .from('fraud_alerts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        return NextResponse.json(alerts);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json();
        
        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('fraud_alerts')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
