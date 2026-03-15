-- =============================================
-- NextNest — Donor features: medical progress & achievements
-- Run in Supabase Dashboard → SQL Editor (after schema.sql)
-- =============================================

-- -----------------------------------------------
-- Medical case progress updates (encrypted / non-PII)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS medical_case_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES medical_cases(id) ON DELETE CASCADE,
    update_date DATE NOT NULL DEFAULT CURRENT_DATE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medical_case_progress_case_id ON medical_case_progress(case_id);

-- Seed progress for approved cases (run after some medical_cases exist)
-- INSERT INTO medical_case_progress (case_id, title, description)
-- SELECT id, 'Surgery scheduled', 'Procedure date confirmed. No PII in this update.'
-- FROM medical_cases WHERE status = 'approved' LIMIT 1;

-- -----------------------------------------------
-- Achievement portal (anonymized milestones)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description_anon TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Education', 'Health', 'Transition', 'Community', 'Impact')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO achievements (title, description_anon, category) VALUES
('Class 10 completed', 'A youth in our care completed Class 10 this term. Identity protected per DPDP Act 2023.', 'Education'),
('Vocational placement', 'Two careleavers joined partner-led vocational training. No personal data shared.', 'Transition'),
('Medical fund goal met', 'Critical care case reached 100% funding. Thank you, donors.', 'Health'),
('Digital literacy batch', '15 children completed the Digital Literacy Hub program.', 'Education'),
('Housing linkage', 'A careleaver was linked to affordable transitional housing. Privacy preserved.', 'Transition'),
('Nutrition program', 'Nutritional support reached 200+ beneficiaries this quarter.', 'Impact');
