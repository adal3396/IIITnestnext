-- =============================================
-- NextNest Super Admin Portal — Phase 2 Migration
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================

-- -----------------------------------------------
-- 1. Fraud Alerts Table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS fraud_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('IP Cluster', 'Financial Anomaly', 'Fake Profile', 'Duplicate Registration', 'Suspicious Withdrawal')),
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'Medium' CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
    entity_type TEXT NOT NULL DEFAULT 'Orphanage' CHECK (entity_type IN ('Orphanage', 'Donor', 'Platform', 'User')),
    entity_ref TEXT,
    ip_address TEXT,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Investigating', 'Resolved', 'False Positive')),
    ai_confidence INTEGER CHECK (ai_confidence BETWEEN 0 AND 100),
    admin_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 2. Transactions Ledger Table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS transactions_ledger (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('Donation', 'Medical Fund', 'Sponsorship', 'Withdrawal')),
    orphanage_name TEXT NOT NULL,
    donor_alias TEXT,
    gross_amount INTEGER NOT NULL,
    maintenance_fee INTEGER NOT NULL DEFAULT 0,
    donor_tip INTEGER NOT NULL DEFAULT 0,
    net_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Completed', 'Pending', 'Failed', 'Refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 3. Announcements Table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_audience TEXT NOT NULL DEFAULT 'All' CHECK (target_audience IN ('All', 'Orphanages', 'Donors', 'Careleavers')),
    sent_by TEXT NOT NULL DEFAULT 'Super Admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SEED DATA
-- =============================================

-- Fraud Alerts
INSERT INTO fraud_alerts (type, description, severity, entity_type, entity_ref, ip_address, status, ai_confidence) VALUES
('IP Cluster', 'Multiple orphanage registration attempts from the same IP range in 24 hours', 'Critical', 'Orphanage', 'NGO-UP-2025-CLUSTER', '103.21.58.0/24', 'Open', 92),
('Financial Anomaly', 'Withdrawal of ₹9.8L requested within 2 hours of donation for NGO-GJ-2024-0912', 'High', 'Orphanage', 'NGO-GJ-2024-0912', NULL, 'Investigating', 87),
('Fake Profile', 'Donor profile D-9021 has zero donation history but raised 3 disputes', 'Medium', 'Donor', 'D-9021', NULL, 'Open', 74),
('Duplicate Registration', 'Registration NGO-MH-2025-0042 shares contact details with NGO-MH-2024-1892', 'High', 'Orphanage', 'NGO-MH-2025-0042', NULL, 'Open', 81),
('Suspicious Withdrawal', 'Back-to-back withdrawals under ₹50K (structuring pattern) from Hope House', 'Medium', 'Orphanage', 'Hope House', NULL, 'False Positive', 65);

-- Transactions Ledger
INSERT INTO transactions_ledger (transaction_type, orphanage_name, donor_alias, gross_amount, maintenance_fee, donor_tip, net_amount, status) VALUES
('Donation', 'Hope House, Mumbai', 'Donor D-4892', 50000, 1250, 2000, 46750, 'Completed'),
('Medical Fund', 'Green Valley Home, Bangalore', 'Anonymous', 350000, 8750, 0, 341250, 'Completed'),
('Donation', 'Asha Kiran Sadan, Delhi', 'Donor D-1127', 25000, 625, 1000, 23375, 'Completed'),
('Sponsorship', 'Hope House, Mumbai', 'Donor D-7745', 120000, 3000, 5000, 112000, 'Completed'),
('Donation', 'Green Valley Home, Bangalore', 'Donor D-2231', 10000, 250, 500, 9250, 'Pending'),
('Medical Fund', 'Asha Kiran Sadan, Delhi', 'Anonymous', 210000, 5250, 0, 204750, 'Completed'),
('Withdrawal', 'Hope House, Mumbai', NULL, 80000, 0, 0, 80000, 'Completed'),
('Donation', 'Hope House, Mumbai', 'Donor D-5532', 75000, 1875, 3000, 70125, 'Completed');

-- Announcements
INSERT INTO announcements (title, message, target_audience) VALUES
('Platform Maintenance Scheduled', 'NextNest will undergo scheduled maintenance on March 20, 2026 from 2:00 AM to 4:00 AM IST. Services may be intermittently unavailable.', 'All'),
('New DPDP Act Compliance Update', 'All orphanage profiles must re-confirm consent settings before April 1, 2026 to comply with the DPDP Act 2023 amendments.', 'Orphanages'),
('Tax Exemption Receipts Now Available', 'Your 80G donation receipts for FY 2025-26 are now available in your dashboard for download.', 'Donors');
