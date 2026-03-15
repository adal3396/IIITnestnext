import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: transactions, error } = await supabase
            .from('transactions_ledger')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Calculate aggregations
        const totalVolume = transactions.reduce((acc, txn) => acc + Number(txn.amount_total), 0);
        const totalFees = transactions.reduce((acc, txn) => acc + Number(txn.fee_platform), 0);
        const totalTips = transactions.reduce((acc, txn) => acc + Number(txn.tip_amount), 0);

        return NextResponse.json({
            transactions,
            summary: {
                total_volume: totalVolume,
                platform_fees: totalFees,
                donor_tips: totalTips,
                net_revenue: totalFees + totalTips
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
