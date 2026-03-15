import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: transactions, error } = await supabase
            .from('transactions_ledger')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("[Finance API] Supabase Error:", error);
            throw error;
        }
        
        const safeTransactions = transactions || [];
        
        // Calculate aggregations with safety fallbacks for both schemas
        const totalVolume = safeTransactions.reduce((acc, txn) => 
            acc + (Number(txn.amount_total ?? txn.gross_amount) || 0), 0);
        
        const totalFees = safeTransactions.reduce((acc, txn) => 
            acc + (Number(txn.fee_platform ?? txn.maintenance_fee) || 0), 0);
            
        const totalTips = safeTransactions.reduce((acc, txn) => 
            acc + (Number(txn.tip_amount ?? txn.donor_tip) || 0), 0);

        console.log(`[Finance API] Sync Summary - Volume: ${totalVolume}, Fees: ${totalFees}, Tips: ${totalTips}`);

        return NextResponse.json({
            transactions: safeTransactions,
            summary: {
                total_volume: totalVolume,
                platform_fees: totalFees,
                donor_tips: totalTips,
                net_revenue: totalFees + totalTips
            }
        });
    } catch (error: any) {
        console.error("[Finance API] Catch Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
