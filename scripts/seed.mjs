/**
 * NextNest — Supabase Seed Script
 * ================================
 * Generates ~500 realistic rows across all tables.
 * Creates two demo accounts:
 *   Donor  : adalseju@gmail.com   / Shimu@2708
 *   Orphanage: rosemary@gmail.com / rose4728
 *
 * Run: node scripts/seed.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lqfoxyrphkbhosmivzod.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZm94eXJwaGtiaG9zbWl2em9kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQyMjA1NCwiZXhwIjoyMDg4OTk4MDU0fQ.Xpv3WKhqcI5bEyaBnAddl_HNV03PydxK4LOTQkpNm04";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const randomDate = (daysBack = 365) => {
  const d = new Date();
  d.setDate(d.getDate() - randInt(0, daysBack));
  return d.toISOString();
};

// ─── Reference Data ───────────────────────────────────────────────────────────

const states = [
  "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Kerala",
  "Uttar Pradesh", "West Bengal", "Rajasthan", "Gujarat", "Telangana",
  "Odisha", "Bihar", "Madhya Pradesh", "Punjab", "Haryana",
];
const orphanageNames = [
  "Hope House", "Asha Kiran Sadan", "Green Valley Children's Home",
  "Sunrise Shelter", "Little Angels", "Rainbow Home", "Sparrow Nest",
  "New Horizon", "Bal Mandir", "Children of Light", "Apna Ghar",
  "Navjeevan Trust", "Shanti Sadan", "Prem Niwas", "Udayan Care",
  "Child Haven", "Sahara Home", "Mamta Sadan", "Kiran Bala Trust",
  "Nishay Foundation",
];
const contactPersons = [
  "Suresh Nair", "Meena Kapoor", "Anand Rao", "Priya Sharma", "Rajan Pillai",
  "Lata Menon", "Deepak Jain", "Sunita Iyer", "Vikram Bose", "Anjali Singh",
  "Ramesh Tiwari", "Kavita Shah", "Mohan Das", "Rekha Patel", "Arjun Khanna",
];
const donorNames = [
  "Rahul Mehta", "Anita Desai", "Vijay Kumar", "Sunita Rao", "Kiran Shah",
  "Arjun Nair", "Deepa Pillai", "Manish Gupta", "Pooja Joshi", "Sanjay Bhat",
  "Geeta Menon", "Ashok Reddy", "Swati Singh", "Nikhil Tiwari", "Ritu Agarwal",
  "CSR Trust Mumbai", "Infosys Foundation", "TCS Cares", "Reliance CSR", "HDFC Bank Foundation",
  "adalseju@gmail.com - Adal Seju", "Corporate Donor A", "Anonymous CSR Fund",
  "Mahindra Caring", "Birla Foundation",
];
const medicalConditions = [
  "Congenital Heart Surgery", "Spinal Deformity Treatment", "Kidney Transplant",
  "Cleft Palate Surgery", "Bone Marrow Transplant", "Eye Surgery (Cataract)",
  "Thalassemia Treatment", "Cerebral Palsy Therapy", "Liver Transplant",
  "Dental Restoration", "Cochlear Implant", "Hip Replacement",
];
const fraudTypes = ["Fake Registration", "Money Laundering Risk", "Suspicious Login", "Other"];
const fraudSeverities = ["Low", "Medium", "High", "Critical"];
const ticketTypes = [
  "Donor-Orphanage Dispute", "Technical Issue", "Verification Complaint",
  "Payment Dispute", "Data Privacy Request",
];
const jobTitles = [
  "Junior Software Developer", "Retail Management Trainee", "Bank Clerk",
  "Data Entry Operator", "Customer Support Executive", "BPO Agent",
  "Accounts Assistant", "Warehouse Associate", "Delivery Executive",
];
const vocationalTitles = [
  "Tailoring & Fashion Design", "Electrician Training", "Plumbing Course",
  "Mobile Repair Training", "Beauty & Wellness", "Cooking & Hospitality",
  "Welding Certification", "AC Technician Course", "Driving License Program",
];
const housingTitles = [
  "Transitional Housing — Metro", "Affordable Housing Scheme",
  "Government Lodge for Care Leavers", "NHB Subsidised Flat",
  "Hostel for Working Youth",
];
const partners = [
  "Infosys Foundation", "NSDC", "NHB", "Reliance Foundation", "TCS iON",
  "Azim Premji Foundation", "Tata Trusts", "HCL Foundation", "NASSCOM", "Mahindra Shiksha",
];
const agentNames = [
  "Scheme Matcher Agent", "Philanthropy Advisor Agent",
  "Transition Matcher Agent", "Predictive Risk Agent", "Document Verifier Agent",
];
const actionTypes = [
  "scheme_eligibility", "donor_guidance", "opportunity_matching",
  "risk_scoring", "document_verification",
];
const childAliases = [
  "Rahul S.", "Priya M.", "Amit K.", "Sneha R.", "Rohan T.", "Meera L.",
  "Arjun P.", "Divya N.", "Kiran A.", "Suresh B.", "Lakshmi C.", "Vishnu D.",
  "Pooja E.", "Ganesh F.", "Ananya G.", "Ravi H.", "Kavya I.", "Naveen J.",
  "Swati K.", "Deepak L.",
];
const childGenders = ["Male", "Female", "Non-binary"];
const riskLevels = ["low", "medium", "high", "critical"];
const docTypes = [
  "Birth Certificate", "Vaccination Record", "School Report Card",
  "Medical Certificate", "Aadhaar Card", "Income Certificate",
];
const programCategories = [
  "Medical", "Education", "Supplies", "Welfare",
];
const announcements = [
  ["System Maintenance Tonight", "Portal will be under maintenance from 2–4 AM IST tonight.", "All"],
  ["New DPDP Compliance Guidelines", "All partners must re-verify data handling protocols by Friday.", "Orphanages"],
  ["Razorpay Payment Upgrade", "We have upgraded our payment gateway for faster transactions.", "Donors"],
  ["AI Advisor Enhanced", "The Philanthropy Advisor AI now supports regional language queries.", "Donors"],
  ["New Scheme: PM CARES Children", "Matching eligible children to PM CARES benefits — check your dashboard.", "Orphanages"],
  ["Year-End Giving Campaign", "Double your impact this season — NextNest matches all donations above ₹5000.", "All"],
  ["Data Audit Complete", "Annual DPDP audit completed successfully. No violations found.", "All"],
  ["Staff Training Schedule", "Admin staff training on new OCR verification tool — Monday 10 AM.", "Internal Staff"],
];

// ─── 1. Create Demo User Accounts ─────────────────────────────────────────────

async function createDemoUsers() {
  console.log("\n📧 Creating demo user accounts...");

  // Donor Account
  const { data: donor, error: donorError } = await supabase.auth.admin.createUser({
    email: "adalseju@gmail.com",
    password: "Shimu@2708",
    email_confirm: true,
    user_metadata: { role: "donor", full_name: "Adal Seju" },
  });
  if (donorError && !donorError.message.includes("already registered")) {
    console.error("  ❌ Donor:", donorError.message);
  } else {
    console.log("  ✅ Donor account: adalseju@gmail.com");
  }

  // Orphanage Account
  const { data: orphanage, error: orphanageError } = await supabase.auth.admin.createUser({
    email: "rosemary@gmail.com",
    password: "rose4728",
    email_confirm: true,
    user_metadata: { role: "orphanage", full_name: "Rosemary Joseph", orphanage_name: "Rosemary Children's Trust" },
  });
  if (orphanageError && !orphanageError.message.includes("already registered")) {
    console.error("  ❌ Orphanage:", orphanageError.message);
  } else {
    console.log("  ✅ Orphanage account: rosemary@gmail.com");
  }

  // Insert orphanage registration for rosemary
  await supabase.from("orphanage_registrations").upsert([{
    name: "Rosemary Children's Trust",
    state: "Kerala",
    registration_no: "NGO-KL-2024-0042",
    contact_person: "Rosemary Joseph",
    status: "approved",
    ai_status: "Pre-verified",
    ai_confidence: 94,
    documents: ["NGO Certificate", "Tax Exemption (80G)", "Audit Report 2024", "JJ Act Compliance"],
    admin_note: "Demo account — verified.",
  }], { onConflict: "registration_no" });

  return { donorId: donor?.user?.id, orphanageId: orphanage?.user?.id };
}

// ─── 2. Seed Orphanage Registrations ──────────────────────────────────────────

async function seedOrphanageRegistrations() {
  console.log("\n🏛️  Seeding orphanage_registrations (50)...");
  const rows = [];
  for (let i = 0; i < 50; i++) {
    const state = rand(states);
    const stateCode = state.substring(0, 2).toUpperCase();
    rows.push({
      name: `${rand(orphanageNames)} ${i + 1}`,
      state,
      registration_no: `NGO-${stateCode}-2024-${String(1000 + i).padStart(4, "0")}`,
      contact_person: rand(contactPersons),
      submitted_date: randomDate(500).substring(0, 10),
      status: rand(["pending", "approved", "approved", "approved", "rejected"]),
      ai_status: rand(["Pre-verified", "Needs Review", "Pre-verified"]),
      ai_confidence: randInt(60, 98),
      documents: JSON.stringify(rand([
        ["NGO Certificate", "Audit Report 2024"],
        ["NGO Certificate", "Tax Exemption (80G)", "Audit Report 2024"],
        ["NGO Certificate", "Tax Exemption (80G)", "Audit Report 2024", "JJ Act Compliance"],
      ])),
    });
  }
  const { error } = await supabase.from("orphanage_registrations").insert(rows);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Done");
}

// ─── 3. Seed Medical Cases ─────────────────────────────────────────────────────

async function seedMedicalCases() {
  console.log("\n🏥  Seeding medical_cases (50)...");
  const rows = [];
  for (let i = 0; i < 50; i++) {
    rows.push({
      child_alias: `Child ${String.fromCharCode(65 + (i % 26))} (Age ${randInt(3, 17)})`,
      orphanage_name: `${rand(orphanageNames)}, ${rand(states)}`,
      condition: rand(medicalConditions),
      target_amount: randInt(50000, 900000),
      urgency: rand(["Critical", "Critical", "Moderate", "Moderate", "Low"]),
      ai_flag: rand([
        "High Priority - Verified Medical Records",
        "Documents Partially Verified",
        "Hospital Letter Verified",
        "Awaiting Lab Reports",
      ]),
      submitted_date: randomDate(200).substring(0, 10),
      status: rand(["pending", "approved", "approved", "rejected"]),
      admin_note: rand([null, null, "Documents verified by admin.", "Pending secondary review."]),
    });
  }
  const { error } = await supabase.from("medical_cases").insert(rows);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Done");
}

// ─── 4. Seed Transactions Ledger ──────────────────────────────────────────────

async function seedTransactions() {
  console.log("\n💸  Seeding transactions_ledger (200)...");
  const rows = [];
  for (let i = 0; i < 200; i++) {
    const gross = randFloat(500, 100000);
    const fee = parseFloat((gross * 0.025).toFixed(2));
    const tip = randFloat(0, gross * 0.05);
    const net = parseFloat((gross - fee).toFixed(2));
    const isAdal = i < 15; // First 15 transactions from the demo donor
    rows.push({
      transaction_ref: `TXN-${Date.now()}-${i}`,
      donor_name: isAdal ? "Adal Seju" : rand(donorNames),
      orphanage_name: isAdal ? "Rosemary Children's Trust" : `${rand(orphanageNames)}, ${rand(states)}`,
      amount_total: gross,
      amount_orphanage: net,
      fee_platform: fee,
      tip_amount: parseFloat(tip.toFixed(2)),
      status: rand(["Completed", "Completed", "Completed", "Pending", "Failed"]),
      created_at: randomDate(365),
    });
  }
  const { error } = await supabase.from("transactions_ledger").insert(rows);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Done");
}

// ─── 5. Seed Fraud Alerts ─────────────────────────────────────────────────────

async function seedFraudAlerts() {
  console.log("\n🚨  Seeding fraud_alerts (40)...");
  const descriptions = [
    "Multiple registration attempts from the same IP cluster trying to register duplicate orphanage details.",
    "Unusual micro-donation structuring pattern detected — possible money laundering risk.",
    "Admin login from unrecognized geographic location — flagged for review.",
    "Batch donation of identical amounts from 10 new accounts created within 30 minutes.",
    "Orphanage registration document SHA mismatch — possible document tampering.",
    "Rapid successive withdrawals after a large one-time donation — anomaly pattern.",
    "Dormant donor account suddenly donating ₹2,00,000+ without prior history.",
    "Multiple orphanages linked to the same bank account — potential fraud ring.",
  ];
  const rows = [];
  for (let i = 0; i < 40; i++) {
    rows.push({
      type: rand(fraudTypes),
      severity: rand(fraudSeverities),
      description: rand(descriptions),
      ai_confidence: randInt(60, 99),
      status: rand(["Open", "Open", "Investigating", "Resolved", "False Positive"]),
      metadata: JSON.stringify({ ip: `103.${randInt(1,255)}.${randInt(1,255)}.${randInt(1,255)}`, flag_count: randInt(1, 12) }),
      created_at: randomDate(180),
    });
  }
  const { error } = await supabase.from("fraud_alerts").insert(rows);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Done");
}

// ─── 6. Seed Support Tickets ──────────────────────────────────────────────────

async function seedSupportTickets() {
  console.log("\n🎫  Seeding support_tickets (50)...");
  const subjects = [
    "Donation not reflected in orphanage ledger",
    "OCR document upload failing on portal",
    "Application rejected despite valid documents",
    "Payment gateway timeout during donation",
    "Unable to reset orphanage admin password",
    "AI advisor giving incorrect scheme recommendations",
    "Child document verification pending for 2 weeks",
    "Tax receipt not generated after donation",
    "Dashboard stats showing incorrect figures",
    "Request for anonymized data export",
  ];
  const rows = [];
  for (let i = 0; i < 50; i++) {
    const isAdal = i < 5;
    rows.push({
      type: rand(ticketTypes),
      subject: rand(subjects),
      raised_by: isAdal ? "Adal Seju (adalseju@gmail.com)" : `Donor D-${randInt(1000, 9999)}`,
      against: isAdal ? "Rosemary Children's Trust" : `${rand(orphanageNames)}, ${rand(states)}`,
      status: rand(["Open", "Open", "In Progress", "Resolved"]),
      priority: rand(["High", "Medium", "Medium", "Low"]),
      reply: rand([null, null, "Under investigation.", "Resolved — please re-verify documents.", "Awaiting orphanage response."]),
      created_at: randomDate(180),
    });
  }
  const { error } = await supabase.from("support_tickets").insert(rows);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Done");
}

// ─── 7. Seed Transition Opportunities ────────────────────────────────────────

async function seedTransitionOpportunities() {
  console.log("\n💼  Seeding transition_opportunities (40)...");
  const rows = [];
  for (let i = 0; i < 40; i++) {
    const type = rand(["Job", "Vocational Training", "Housing"]);
    const title = type === "Job" ? rand(jobTitles)
      : type === "Vocational Training" ? rand(vocationalTitles)
      : rand(housingTitles);
    rows.push({
      type,
      title: `${title} (Batch ${i + 1})`,
      partner: rand(partners),
      location: rand(states),
      eligibility: rand([
        "Age 18-25, 10th Pass",
        "Age 16+, Female Care Leavers",
        "Age 18-21, JJ Act Care Leavers",
        "Age 18-26, Any Education",
        "Age 17+, Government ID Required",
      ]),
      ai_matches: randInt(0, 25),
      active: rand([true, true, true, false]),
      created_at: randomDate(300),
    });
  }
  const { error } = await supabase.from("transition_opportunities").insert(rows);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Done");
}

// ─── 8. Seed AI Audit Logs ────────────────────────────────────────────────────

async function seedAIAuditLogs() {
  console.log("\n🤖  Seeding ai_audit_logs (60)...");
  const rows = [];
  for (let i = 0; i < 60; i++) {
    const agent = rand(agentNames);
    const action = rand(actionTypes);
    rows.push({
      agent_name: agent,
      action_type: action,
      input_snapshot: JSON.stringify({ age: randInt(8, 18), budget: randInt(1000, 50000), intent: rand(["education", "medical", "supplies"]) }),
      output_snapshot: JSON.stringify({ score: randInt(50, 99), matched: rand(["PM CARES", "Education Scheme", "Vocational Grant"]) }),
      reasoning: `Evaluated ${randInt(3, 10)} factors. Confidence: ${randInt(70, 99)}%. Action: ${action.replace("_", " ")}.`,
      dpdp_compliant: rand([true, true, true, false]),
      human_override_applied: rand([false, false, false, true]),
      created_at: randomDate(90),
    });
  }
  const { error } = await supabase.from("ai_audit_logs").insert(rows);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Done");
}

// ─── 9. Seed Announcements ───────────────────────────────────────────────────

async function seedAnnouncements() {
  console.log("\n📢  Seeding announcements...");
  const rows = announcements.map(([title, message, target_audience]) => ({
    title,
    message,
    target_audience,
    sent_by: "Super Admin",
    created_at: randomDate(60),
  }));
  const { error } = await supabase.from("announcements").insert(rows);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Done");
}

// ─── 10. Seed Children ────────────────────────────────────────────────────────

async function seedChildren() {
  console.log("\n👶  Seeding children (80)...");
  // Get orphanage IDs
  const { data: orgs } = await supabase.from("orphanage_registrations").select("id").limit(20);
  const orgIds = (orgs ?? []).map((o) => o.id);

  const rows = [];
  for (let i = 0; i < 80; i++) {
    rows.push({
      alias: `${rand(childAliases)} (${i + 1})`,
      age: randInt(3, 17),
      gender: rand(childGenders),
      risk_level: rand(riskLevels),
      is_enrolled_in_school: rand([true, true, true, false]),
      has_health_insurance: rand([true, true, false]),
      orphanage_id: orgIds.length > 0 ? rand(orgIds) : null,
      created_at: randomDate(400),
    });
  }
  const { error } = await supabase.from("children").insert(rows);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Done");
}

// ─── 11. Seed Child Documents ─────────────────────────────────────────────────

async function seedChildDocuments() {
  console.log("\n📄  Seeding child_documents (80)...");
  const { data: kids } = await supabase.from("children").select("id").limit(40);
  if (!kids || kids.length === 0) { console.log("  ⚠️  No children found, skipping."); return; }

  const rows = [];
  for (let i = 0; i < 80; i++) {
    const kid = rand(kids);
    rows.push({
      child_id: kid.id,
      doc_type: rand(docTypes),
      file_name: `${rand(docTypes).replace(/\s/g, "_").toLowerCase()}_${i + 1}.pdf`,
      file_path: `/uploads/children/${kid.id}/doc_${i + 1}.pdf`,
      file_size: randInt(100000, 5000000),
      status: rand(["Pending Review", "Pending Review", "Verified", "Anomaly Flagged"]),
      created_at: randomDate(200),
    });
  }
  const { error } = await supabase.from("child_documents").insert(rows);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Done");
}

// ─── 12. Seed Programs ────────────────────────────────────────────────────────

async function seedPrograms() {
  console.log("\n📚  Seeding programs (20)...");
  const programNames = [
    "Digital Literacy Hub", "Critical Care Fund", "Nutritional Support", "Career Mentorship",
    "Primary Education Support", "Mental Health Counselling", "Vocational Skill Lab",
    "Sports & Recreation Fund", "Legal Aid for Care Leavers", "Scholarship Bridge Program",
    "Sanitation & Hygiene Drive", "Library & Books Initiative", "Startup Seed Fund",
    "Music & Arts Therapy", "Home Tutoring Network", "Winter Relief Drive",
    "Emergency Medical Relief", "Rehabilitation Support", "Peer Mentoring Program", "Alumni Network Fund",
  ];
  const rows = programNames.map((name, i) => ({
    name,
    category: rand(programCategories),
    description: `${name} — supporting underprivileged children with targeted care and resources.`,
    cost_per_beneficiary_inr: randFloat(500, 10000),
    current_enrollment: randInt(10, 200),
    capacity: randInt(100, 500),
    status: rand(["active", "active", "inactive"]),
    priority: randInt(1, 20),
    created_at: randomDate(400),
  }));
  const { error } = await supabase.from("programs").insert(rows);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Done");
}

// ─── Run All ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 NextNest Seed Script Starting...\n");
  console.log("📊 Tables: orphanage_registrations, medical_cases, transactions_ledger,");
  console.log("   fraud_alerts, support_tickets, transition_opportunities,");
  console.log("   ai_audit_logs, announcements, children, child_documents, programs\n");

  await createDemoUsers();
  await seedOrphanageRegistrations();
  await seedMedicalCases();
  await seedTransactions();
  await seedFraudAlerts();
  await seedSupportTickets();
  await seedTransitionOpportunities();
  await seedAIAuditLogs();
  await seedAnnouncements();
  await seedChildren();
  await seedChildDocuments();
  await seedPrograms();

  console.log("\n✅ Seed complete! ~580 rows inserted across 11 tables.");
  console.log("\n🔑 Demo Accounts:");
  console.log("   Donor    → adalseju@gmail.com    / Shimu@2708");
  console.log("   Orphanage → rosemary@gmail.com   / rose4728");
  console.log("   Admin     → admin@nextnest.org   / (env var)\n");
}

main().catch((err) => {
  console.error("\n💥 Fatal error:", err);
  process.exit(1);
});
