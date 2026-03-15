"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Users, TrendingUp, Building2, Heart, Lightbulb,
    FileText, CheckCircle, GraduationCap, Trophy, Lock, Scale, Bot, Key, ShieldCheck
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const stats = [
    { value: "1.5L+", label: "Youth exit care yearly in India", icon: <Users className="w-8 h-8 mx-auto text-orange-600" /> },
    { value: "50%", label: "Reduction in funding leaks", icon: <TrendingUp className="w-8 h-8 mx-auto text-orange-600" /> },
    { value: "80%", label: "More welfare benefits unlocked", icon: <CheckCircle className="w-8 h-8 mx-auto text-orange-600" /> },
    { value: "128+", label: "Orphanages on the platform", icon: <Building2 className="w-8 h-8 mx-auto text-orange-600" /> },
];

const howItWorksSteps = [
    {
        step: "01",
        role: "Donors & CSR",
        icon: <Heart className="w-8 h-8 text-orange-600" />,
        gradient: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        title: "Give Transparently",
        desc: "Browse verified orphanages, sponsor individual children with consent-based tracking, or fund critical illness crowdfunding. Every rupee is auditable in real time.",
        href: "/portals/public/register?role=donor",
        cta: "Become a Donor",
    },
    {
        step: "02",
        role: "Orphanages",
        icon: <Building2 className="w-8 h-8 text-blue-800" />,
        gradient: "text-blue-800",
        bg: "bg-blue-50",
        border: "border-blue-200",
        title: "Manage & Get AI Support",
        desc: "Register your facility, manage child profiles, upload OCR-assisted documents, and let AI detect government scheme eligibility (PM CARES, state scholarships) automatically.",
        href: "/portals/public/register?role=orphanage",
        cta: "Register Orphanage",
    },
    {
        step: "03",
        role: "Aging-Out Youth",
        icon: <GraduationCap className="w-8 h-8 text-green-700" />,
        gradient: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-200",
        title: "Build Your Future",
        desc: "Get opt-in career guidance, job matching via partner networks, affordable housing linkages, and mentor connections — with full privacy control over your data.",
        href: "/portals/public/register?role=donor",
        cta: "Explore Opportunities",
    },
];

const features = [
    { icon: <TrendingUp className="w-8 h-8 text-blue-900" />, title: "Real-Time Funding Dashboards", desc: "Live, auditable fund-utilization breakdowns — medical, education, daily supplies — for donors and CSR partners." },
    { icon: <Lightbulb className="w-8 h-8 text-blue-900" />, title: "AI Scheme Matcher", desc: "Automatically detects eligibility for PM CARES, state scholarships, and other government welfare programs with explainable reasoning." },
    { icon: <CheckCircle className="w-8 h-8 text-blue-900" />, title: "Predictive Risk Alerts", desc: "Explainable AI monitors aggregated academic & behavioral indicators to flag at-risk children early — no personal data exposed." },
    { icon: <FileText className="w-8 h-8 text-blue-900" />, title: "OCR Document Hub", desc: "Secure Aadhaar, birth certificate & legal document management with automated data extraction (JJ Act 2015 compliant)." },
    { icon: <GraduationCap className="w-8 h-8 text-blue-900" />, title: "Post-18 Transition Support", desc: "Career guidance, vocational matching, housing linkages, and mentor connections for aging-out youth — opt-in, consent-based." },
    { icon: <Trophy className="w-8 h-8 text-blue-900" />, title: "Achievement Portal", desc: "Celebrate child milestones and foster donor engagement without ever exposing personal identity data." },
];

const trustBadges = [
    { icon: <Lock className="w-8 h-8 text-orange-400" />, title: "DPDP Act 2023", desc: "Every data point collected with explicit, granular consent. Full right to erasure and withdrawal." },
    { icon: <Scale className="w-8 h-8 text-orange-400" />, title: "JJ Act 2015", desc: "Child safety and anonymization at every layer. Compliant with Juvenile Justice Act norms." },
    { icon: <Bot className="w-8 h-8 text-orange-400" />, title: "Auditable AI", desc: "Every AI decision returns a human-readable reasoning string. Regular bias audits by super admins." },
    { icon: <Key className="w-8 h-8 text-orange-400" />, title: "Encrypted Medical Data", desc: "Critical illness updates are end-to-end encrypted. Only authorized donors see progress." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicPortalPage() {
    return (
        <>
            {/* ── HERO ──────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-800 text-white">
                <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="inline-block bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
                    >
                        DPDP Act 2023 · JJ Act 2015 · WCAG 2.1 AA Compliant
                    </motion.span>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                        Bridging Care Gaps for
                        <br />
                        <span className="text-orange-400">India&apos;s Orphan Children</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                        NextNest is a privacy-first, multi-agent AI platform that builds a transparent support ecosystem
                        for orphanage children — before <em>and</em> after age 18. Connecting donors, orphanages,
                        and administrators with trust at every layer.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/portals/public/register"
                            className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold px-8 py-4 rounded-md hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Get Started Free →
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-md hover:bg-white/10 transition-all"
                        >
                            How It Works
                        </Link>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        className="mt-8 text-blue-200 text-sm"
                    >
                        1.5 lakh youth exit care yearly into vulnerability — together we can change that.
                    </motion.p>
                </motion.div>
            </section>

            {/* ── IMPACT STATS ──────────────────────────────────────── */}
            <section id="impact" className="py-16 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                        {stats.map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="mb-2 flex justify-center">{s.icon}</div>
                                <div className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-1">{s.value}</div>
                                <p className="text-gray-500 text-sm leading-tight">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ABOUT ─────────────────────────────────────────────── */}
            <section id="about" className="py-20 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-14 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-orange-600 text-sm font-bold uppercase tracking-widest">About NextNest</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-5 leading-tight">
                                Tackling India&apos;s orphan care crisis with AI + transparency
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Every year, 1.5 lakh young people leave orphanage care in India with no safety net — no job, no
                                housing, no mentor. Simultaneously, billions of rupees in welfare funds go unclaimed due to
                                documentation gaps and scheme unawareness.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                NextNest brings together donors, CSR partners, orphanage staff, government bodies, and AI to
                                plug these gaps — with explainable AI, human oversight, and privacy as non-negotiables from
                                day one.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {["Privacy-First", "AI with Human Oversight", "Bias Audited", "Open Impact Data"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-blue-50 text-blue-900 text-xs font-semibold px-3 py-1.5 rounded-md border border-blue-200"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            {features.slice(0, 4).map((f, i) => (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                                    className="bg-white rounded-md p-5 shadow-sm border border-gray-100 transition-colors"
                                >
                                    <div className="mb-3">{f.icon}</div>
                                    <h3 className="font-bold text-gray-800 mb-1 text-sm">{f.title}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────────────────────── */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">How It Works</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                            One platform, every stakeholder
                        </h2>
                        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                            Whether you&apos;re a donor, an orphanage, or a youth aging out of care — NextNest has a
                            dedicated, privacy-respecting experience for you.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {howItWorksSteps.map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                whileHover={{ y: -5 }}
                                className={`rounded-md border ${item.border} ${item.bg} p-8 flex flex-col`}
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="flex-shrink-0">{item.icon}</span>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.role}</p>
                                        <p className={`text-2xl font-extrabold ${item.gradient}`}>
                                            {item.step}
                                        </p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed flex-1">{item.desc}</p>
                                <Link
                                    href={item.href}
                                    className={`mt-6 inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors shadow-sm self-start`}
                                >
                                    {item.cta} →
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ALL FEATURES ──────────────────────────────────────── */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-14"
                    >
                        <span className="text-orange-600 text-sm font-bold uppercase tracking-widest">Core Features</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                            Built for measurable societal impact
                        </h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                className="bg-white rounded-md p-6 shadow-sm border border-gray-100 transition-colors"
                            >
                                <div className="mb-4">{f.icon}</div>
                                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TRUST & PRIVACY ───────────────────────────────────── */}
            <section id="trust" className="py-20 bg-slate-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-14"
                    >
                        <span className="text-orange-400 text-sm font-bold uppercase tracking-widest">Trust &amp; Privacy</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                            Privacy is not an afterthought
                        </h2>
                        <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
                            Every architectural decision at NextNest starts with data minimization, consent, and compliance
                            with Indian law.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {trustBadges.map((b, i) => (
                            <motion.div
                                key={b.title}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-slate-800 border border-slate-700 rounded-md p-6 transition-colors"
                            >
                                <div className="mb-4">{b.icon}</div>
                                <h3 className="font-bold text-white mb-2">{b.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="bg-blue-800 border border-blue-700 rounded-md p-8 text-center"
                    >
                        <h3 className="text-2xl font-bold mb-2">Anonymized by Default</h3>
                        <p className="text-blue-100 max-w-2xl mx-auto">
                            Child data is anonymized at rest and in transit. AI models operate on aggregated,
                            non-identifiable statistical indicators only. No child&apos;s personal identity is ever exposed to
                            any third party.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── AUTH BRIDGES / PORTAL SELECTOR ────────────────────── */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <span className="text-orange-600 text-sm font-bold uppercase tracking-widest">Join NextNest</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Select your portal</h2>
                        <p className="text-gray-500 mt-3">Role-based access — your account is scoped to only what you need.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <motion.div
                            whileHover={{ y: -5, scale: 1.02 }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <Link
                                href="/portals/public/register?role=donor"
                                className="group flex flex-col items-center p-8 rounded-md border-2 border-orange-200 bg-orange-50 hover:border-orange-400 shadow-sm hover:shadow-lg transition-all h-full"
                            >
                                <Heart className="w-12 h-12 mb-4 text-orange-600" />
                                <h3 className="text-xl font-bold text-orange-800 mb-2 group-hover:text-orange-600 transition-colors">I&apos;m a Donor</h3>
                                <p className="text-orange-700 text-sm text-center leading-relaxed flex-1">
                                    Track donations, meet the AI Advisor, sponsor children
                                </p>
                                <span className="mt-5 text-sm font-semibold text-orange-600 group-hover:underline">
                                    Register as Donor →
                                </span>
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5, scale: 1.02 }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            <Link
                                href="/portals/public/register?role=orphanage"
                                className="group flex flex-col items-center p-8 rounded-md border-2 border-blue-200 bg-blue-50 hover:border-blue-400 shadow-sm hover:shadow-lg transition-all h-full"
                            >
                                <Building2 className="w-12 h-12 mb-4 text-blue-600" />
                                <h3 className="text-xl font-bold text-blue-800 mb-2 group-hover:text-blue-600 transition-colors">I&apos;m an Orphanage</h3>
                                <p className="text-blue-700 text-sm text-center leading-relaxed flex-1">
                                    Manage child profiles, documents, AI insights &amp; schemes
                                </p>
                                <span className="mt-5 text-sm font-semibold text-blue-600 group-hover:underline">
                                    Register Facility →
                                </span>
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5, scale: 1.02 }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            <Link
                                href="/portals/public/login?role=admin"
                                className="group flex flex-col items-center p-8 rounded-md border-2 border-green-200 bg-green-50 hover:border-green-400 shadow-sm hover:shadow-lg transition-all h-full"
                            >
                                <ShieldCheck className="w-12 h-12 mb-4 text-green-600" />
                                <h3 className="text-xl font-bold text-green-800 mb-2 group-hover:text-green-600 transition-colors">I&apos;m an Admin</h3>
                                <p className="text-green-700 text-sm text-center leading-relaxed flex-1">
                                    Global oversight, verifications, AI bias audits
                                </p>
                                <span className="mt-5 text-sm font-semibold text-green-600 group-hover:underline">
                                    Admin Sign In →
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── CONTACT ────────────────────────────────────────────── */}
            <section id="contact" className="py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <span className="text-orange-600 text-sm font-bold uppercase tracking-widest">Contact Us</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Get in touch</h2>
                        <p className="text-gray-500 mt-3">
                            Questions about partnering, compliance, or onboarding your facility?
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        onSubmit={(e: React.FormEvent) => { e.preventDefault(); alert("Contact form submitted (Simulation)"); }}
                        className="bg-white rounded-md shadow-sm border border-gray-100 p-8 space-y-5"
                    >
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    placeholder="Priya Sharma"
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    placeholder="priya@example.com"
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="contact-role" className="block text-sm font-semibold text-gray-700 mb-1">
                                I am a…
                            </label>
                            <select
                                id="contact-role"
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition bg-white"
                                required
                            >
                                <option value="">Select your role</option>
                                <option value="donor">Donor / CSR Partner</option>
                                <option value="orphanage">Orphanage / NGO</option>
                                <option value="government">Government Official</option>
                                <option value="press">Press / Researcher</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-1">
                                Message
                            </label>
                            <textarea
                                id="contact-message"
                                rows={4}
                                placeholder="Tell us how we can help…"
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition resize-none"
                                required
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-blue-900 text-white font-bold py-3 rounded-md shadow-sm hover:bg-blue-800 transition-colors"
                        >
                            Send Message
                        </motion.button>
                        <p className="text-xs text-gray-400 text-center mt-2">
                            🔒 Your data is handled per DPDP Act 2023. We never share your details with third parties.
                        </p>
                    </motion.form>
                </div>
            </section>
        </>
    );
}
