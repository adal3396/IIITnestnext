# NextNest — Demo Script & One-Pager

Use this flow to present NextNest to judges or stakeholders in **~5–7 minutes**.

---

## 1. Problem (30 sec)

- **1.5 lakh youth** exit institutional care in India every year with no safety net.
- Welfare funds go **unclaimed** due to documentation gaps and scheme unawareness.
- Donors lack **transparency**; orphanages lack **AI-assisted** scheme matching and risk alerts.

**NextNest** is a privacy-first, multi-agent AI platform that bridges these gaps while complying with **DPDP Act 2023** and **JJ Act 2015**.

---

## 2. Public portal & compliance (1 min)

- Open **`/portals/public`** (or `/`).
- Scroll to **Trust & Privacy**: DPDP, JJ Act, Auditable AI, Encrypted medical data.
- Show **How it works**: Donors, Orphanages, Aging-out youth.
- **Join NextNest**: three roles — Donor, Orphanage, Admin.

---

## 3. Donor experience (1.5 min)

- Go to **Register** → role **Donor** → sign up (or use **Login** if already registered).
- **Donor dashboard**: total contributions, children supported, **“Speak to the AI Advisor”**.
- **Make a Donation**:
  - **Sponsor a Child**: select anonymised child, amount, consent checkbox (DPDP), then Razorpay (or simulated).
  - **Critical Illness Fund**: show verified campaigns and progress.
- **Contribution History**: **auditable ledger** — real transactions from `transactions_ledger`; “No PII stored”.
- **Medical Cases**: approved crowdfunding cases with **encrypted progress updates** (no child identity).
- **Achievements**: anonymised milestones (education, health, transition) — **donor engagement without PII**.

---

## 4. Orphanage experience (1.5 min)

- Login as **Orphanage** (or register).
- **Dashboard**: total children, **AI Risk Alerts**, **Scheme Matcher** CTA.
- **Children**: list and **Register Child** (anonymised).
- **Scheme Matcher**: explain — “AI detects eligibility for PM CARES, NSP, Ayushman Bharat, etc., with **rule engine + explainable reasoning**.”
- **Documents**: OCR-assisted, PII redacted.
- **Transition**: aging-out youth — job/vocational/housing matching (opt-in).

---

## 5. Super Admin (1.5 min)

- Login as **Admin** (`/portals/public/login?role=admin` — use env credentials).
- **Global oversight**: registered orphanages, active donors, funds processed, **AI Bias Audit Score**.
- **Verification**: orphanage registrations queue (approve/reject).
- **Medical cases**: moderate critical illness crowdfunding (approve to go live).
- **AI Audit**: show **ai_audit_logs** — every AI decision has input snapshot, output, reasoning, `dpdp_compliant`.
- **Disputes**, **Finance** (transactions ledger), **Settings** (platform toggles).

---

## 6. Closing (30 sec)

- **Impact**: 50% fewer funding leaks, 80% more welfare benefits unlocked, post-18 transition support.
- **Privacy**: anonymization at rest and in transit; AI on aggregated, non-identifiable indicators only.
- **Tech**: Next.js 16, Supabase, Groq (Llama), Tailwind; all AI agents log to audit table.

---

## Quick links

| Role      | Entry |
|----------|--------|
| Public   | `/portals/public` |
| Donor    | `/portals/donor` (after login) |
| Orphanage| `/portals/orphanage` (after login) |
| Admin    | `/portals/admin` (after admin login) |

---

## Env checklist (for live demo)

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY` (for AI agents)
- `NEXT_ADMIN_EMAIL`, `NEXT_ADMIN_PASSWORD` (admin login)
- Optional: `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (real payments)

Run **`supabase/schema.sql`** and **`supabase/migration_v3_donor_features.sql`** in Supabase for donor features (transactions ledger, medical progress, achievements).
