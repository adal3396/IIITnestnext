-- =============================================
-- NextNest Super Admin Portal — Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================

-- -----------------------------------------------
-- 1. Orphanage Registrations (Verification Queue)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS orphanage_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    registration_no TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    submitted_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    ai_status TEXT NOT NULL DEFAULT 'Needs Review' CHECK (ai_status IN ('Pre-verified', 'Needs Review')),
    ai_confidence INTEGER NOT NULL DEFAULT 70 CHECK (ai_confidence BETWEEN 0 AND 100),
    documents JSONB DEFAULT '[]',
    admin_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 2. Medical Crowdfunding Cases
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS medical_cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_alias TEXT NOT NULL,
    orphanage_name TEXT NOT NULL,
    condition TEXT NOT NULL,
    target_amount INTEGER NOT NULL,
    urgency TEXT NOT NULL DEFAULT 'Moderate' CHECK (urgency IN ('Critical', 'Moderate', 'Low')),
    ai_flag TEXT NOT NULL DEFAULT 'Documents Partially Verified',
    submitted_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 3. AI Audit Logs (Stage 3: DPDP Compliant)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS ai_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    agent_name VARCHAR(100) NOT NULL,           -- e.g., 'Predictive Risk Agent'
    action_type VARCHAR(100) NOT NULL,          -- e.g., 'risk_scoring'
    input_snapshot JSONB NOT NULL,              -- Sanitized input (NO PII)
    output_snapshot JSONB NOT NULL,             -- The AI's decision
    reasoning TEXT,                             -- The explainable output string
    dpdp_compliant BOOLEAN NOT NULL DEFAULT true,
    human_override_applied BOOLEAN DEFAULT false,
    human_reviewer_id UUID REFERENCES auth.users(id),
    review_notes TEXT
);

-- RLS Policies (Super Admin Only)
ALTER TABLE public.ai_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow the backend service role or authenticated service to insert logs
CREATE POLICY "Enable insert for authenticated backend" ON public.ai_audit_logs
    FOR INSERT 
    WITH CHECK (true);

-- Only Super Admins can select/view the logs
CREATE POLICY "Enable read for Super Admins only" ON public.ai_audit_logs
    FOR SELECT
    USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' );

-- Index for querying by agent and time
CREATE INDEX IF NOT EXISTS idx_ai_audit_agent ON public.ai_audit_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_ai_audit_created_at ON public.ai_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_audit_dpdp ON public.ai_audit_logs(dpdp_compliant);

-- -----------------------------------------------
-- 4. Transition Opportunities (CMS)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS transition_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('Job', 'Vocational Training', 'Housing')),
    title TEXT NOT NULL,
    partner TEXT NOT NULL,
    location TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    ai_matches INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 5. Support Tickets (Disputes)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    subject TEXT NOT NULL,
    raised_by TEXT NOT NULL,
    against TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
    reply TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 6. Platform Settings (Key-Value Store)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    description TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SEED DATA
-- =============================================

-- Orphanage Registrations
INSERT INTO orphanage_registrations (name, state, registration_no, contact_person, ai_status, ai_confidence, documents) VALUES
('Hope House', 'Maharashtra', 'NGO-MH-2024-1892', 'Suresh Nair', 'Pre-verified', 96, '["NGO Certificate", "Tax Exemption (80G)", "Audit Report 2024"]'),
('Asha Kiran Sadan', 'Delhi', 'NGO-DL-2024-0431', 'Meena Kapoor', 'Needs Review', 72, '["NGO Certificate", "Audit Report 2023"]'),
('Green Valley Children''s Home', 'Karnataka', 'NGO-KA-2025-0087', 'Anand Rao', 'Pre-verified', 88, '["NGO Certificate", "Tax Exemption (80G)", "Audit Report 2024", "JJ Act Compliance"]');

-- Medical Cases
INSERT INTO medical_cases (child_alias, orphanage_name, condition, target_amount, urgency, ai_flag) VALUES
('Child A (Age 7)', 'Hope House, Mumbai', 'Congenital Heart Surgery', 350000, 'Critical', 'High Priority - Verified Medical Records'),
('Child B (Age 12)', 'Asha Kiran Sadan, Delhi', 'Spinal Deformity Treatment', 210000, 'Moderate', 'Documents Partially Verified'),
('Child C (Age 5)', 'Green Valley Home, Bangalore', 'Kidney Transplant', 800000, 'Critical', 'Hospital Letter Verified');

-- AI Audit Logs
INSERT INTO ai_audit_logs (agent_name, action_type, input_snapshot, output_snapshot, reasoning, dpdp_compliant) VALUES
('Scheme Matcher Agent', 'scheme_eligibility', '{"age": 14, "orphan_type": "double_orphan"}', '{"matched": ["pm_cares_children"]}', 'Evaluated 7 schemes. Matched 1 schemes with score >= 40.', true),
('Philanthropy Advisor Agent', 'donor_guidance', '{"intent": "support education", "budget": 10000}', '{"recommendations": ["Education"]}', 'Base data source: live_supabase. Directed funds to active ITI training gaps.', true),
('Transition Matcher Agent', 'opportunity_matching', '{"age": 18, "skills": ["retail_sales"]}', '{"matched_opportunities": ["op_retail_001"]}', 'Vector-matched 3 opportunities. Top match: Retail Store Assistant', true),
('Predictive Risk Agent', 'risk_scoring', '{"avg_grade_percent": 35, "consecutive_absences": 12}', '{"score": 85, "level": "critical"}', 'High risk due to critical attendance drop and failing grades.', true);

-- Transition Opportunities
INSERT INTO transition_opportunities (type, title, partner, location, eligibility, ai_matches, active) VALUES
('Job', 'Junior Software Developer', 'Infosys Foundation', 'Bangalore', 'Age 18-25, 10th Pass', 7, TRUE),
('Vocational Training', 'Tailoring & Fashion Design Course', 'NSDC', 'Chennai', 'Age 16+, Female Careleavers', 12, TRUE),
('Housing', 'Affordable Transitional Housing', 'NHB', 'Mumbai', 'Age 18-21, JJ Act Careleavers', 4, FALSE),
('Job', 'Retail Management Trainee', 'Reliance Foundation', 'Pan India', 'Age 18-26, Any Education', 15, TRUE);

-- Support Tickets
INSERT INTO support_tickets (type, subject, raised_by, against, status, priority) VALUES
('Donor-Orphanage Dispute', 'Donation not reflected in orphanage ledger', 'Donor D-8821', 'Hope House, Mumbai', 'Open', 'High'),
('Technical Issue', 'OCR document upload failing on Orphanage portal', 'Asha Kiran Admin', 'Platform', 'In Progress', 'Medium'),
('Verification Complaint', 'Application rejected despite all documents submitted', 'Green Valley Home', 'Super Admin Review', 'Resolved', 'Low');

-- Platform Settings
INSERT INTO platform_settings (key, label, description, enabled) VALUES
('maintenance_fee', 'Platform Maintenance Fee (2.5%)', 'Deducted from each transaction to cover infrastructure costs', TRUE),
('donor_tip', 'Optional Donor Tip (up to 5%)', 'Allow donors to optionally add a tip to support NextNest operations', TRUE),
('achievement_portal', 'Public Achievement Portal', 'Allow donor achievements to be shown publicly (privacy-safe)', FALSE),
('ai_auto_apply', 'AI Scheme Auto-Application', 'Allow AI to auto-submit pre-approved government scheme applications', TRUE);
