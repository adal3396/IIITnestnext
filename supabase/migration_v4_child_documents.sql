-- =============================================
-- NextNest — Child documents (orphanage portal)
-- Run in Supabase Dashboard → SQL Editor (after schema.sql)
-- =============================================

CREATE TABLE IF NOT EXISTS child_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT,
    file_size INTEGER,
    status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Verified', 'Anomaly Flagged')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_child_documents_child_id ON child_documents(child_id);
CREATE INDEX IF NOT EXISTS idx_child_documents_created_at ON child_documents(created_at DESC);
