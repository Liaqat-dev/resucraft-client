import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Award,
    Bot,
    BrainCircuit,
    FileText,
    GraduationCap,
    LayoutTemplate,
    MessageSquare,
    Rocket,
    ShieldCheck,
    Sparkles,
    Star,
    Target,
    Users,
    Zap,
} from "lucide-react";
import AOS from "aos";
import LandingNav from "@src/components/landing/LandingNav.tsx";
import LandingFooter from "@src/components/landing/LandingFooter.tsx";
import { useLandingTheme } from "@hooks/useLandingTheme";

// ── Stats ─────────────────────────────────────────────────────────────────────

const stats = [
    { value: "80%", label: "Time Saved", sub: "vs. manual writing", icon: <Zap size={20} /> },
    { value: "60%", label: "Better ATS Score", sub: "pass-through rate", icon: <Target size={20} /> },
    { value: "10K+", label: "Resumes Built", sub: "and counting", icon: <FileText size={20} /> },
    { value: "50+", label: "Templates", sub: "ATS-optimized", icon: <LayoutTemplate size={20} /> },
];

// ── Features ──────────────────────────────────────────────────────────────────

const features = [
    {
        icon: <BrainCircuit size={22} />,
        title: "AI Resume Generation",
        desc: "Paste a job description and our NLP engine rewrites your profile into a tailored, ATS-optimized resume in seconds.",
        accent: "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400",
    },
    {
        icon: <Target size={22} />,
        title: "ATS Optimization",
        desc: "Smart keyword matching ensures your resume sails through Applicant Tracking Systems at 60% higher rates.",
        accent: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
        icon: <LayoutTemplate size={22} />,
        title: "Template Builder",
        desc: "Drag-and-drop canvas with a rich component library. Customize colors, fonts, and layouts without any design skills.",
        accent: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
        icon: <MessageSquare size={22} />,
        title: "Interview Prep",
        desc: "Automatically generates technical, behavioral, and scenario-based interview questions tailored to the job role.",
        accent: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
        icon: <Award size={22} />,
        title: "Template Marketplace",
        desc: "Browse, rate and use community-designed templates. Creators can publish and build their reputation.",
        accent: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
        icon: <ShieldCheck size={22} />,
        title: "Secure & Private",
        desc: "JWT authentication, encrypted storage, and full data ownership. Your career data stays yours.",
        accent: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
];

// ── How it works ─────────────────────────────────────────────────────────────

const steps = [
    {
        n: "01",
        title: "Build Your Profile",
        desc: "Add your personal info, education, work experience, projects, skills, and certifications once. ResuCraft stores everything securely.",
        icon: <GraduationCap size={20} />,
    },
    {
        n: "02",
        title: "Generate with AI",
        desc: "Paste a job description. Our AI engine parses keywords, rewrites your bullet points, and produces an ATS-optimized resume instantly.",
        icon: <Sparkles size={20} />,
    },
    {
        n: "03",
        title: "Download & Apply",
        desc: "Export your polished resume as a PDF. Track multiple versions for different roles and prepare with auto-generated interview questions.",
        icon: <Rocket size={20} />,
    },
];

// ── Testimonials ──────────────────────────────────────────────────────────────

const testimonials = [
    {
        quote: "I applied to 20 jobs and got 14 callbacks. ResuCraft's ATS optimization is genuinely different — it completely changed my job search.",
        name: "Sara K.",
        role: "Software Engineer",
        initials: "SK",
        color: "bg-primary-600",
    },
    {
        quote: "As a fresh graduate, I had no idea how to tailor a resume per job. ResuCraft does it in literally 30 seconds. I landed my first job within 3 weeks.",
        name: "Ahmed R.",
        role: "Junior Data Analyst",
        initials: "AR",
        color: "bg-emerald-600",
    },
    {
        quote: "The interview prep feature is underrated. I knew exactly what to expect walking into every technical interview thanks to the AI-generated questions.",
        name: "Fatima N.",
        role: "UX Designer",
        initials: "FN",
        color: "bg-violet-600",
    },
];

// ── Page ──────────────────────────────────────────────────────────────────────

const WelcomePage: React.FC = () => {
    const theme = useLandingTheme();

    useEffect(() => {
        AOS.init({ once: true, duration: 650, easing: "ease-out-cubic", offset: 60 });
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
            <LandingNav />

            {/* ── Hero ── */}
            <section
                style={{ background: theme.bg, paddingTop: '8rem', paddingBottom: '5rem', position: 'relative', overflow: 'hidden' }}
                className="rc-dot-bg"
            >
                {/* Ambient glow */}
                <div
                    className="rc-glow-gold rc-pulse"
                    style={{ width: '36rem', height: '36rem', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <span className="rc-label" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
                        <Bot size={11} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        AI-Powered · ATS-Optimized · Free to Start
                    </span>

                    <h1
                        className="rc-serif"
                        style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 600, color: theme.text, lineHeight: 1.08, marginBottom: '1.5rem', maxWidth: '52rem', marginLeft: 'auto', marginRight: 'auto' }}
                    >
                        Build a Resume That{' '}
                        <em style={{ color: theme.accentLight, fontStyle: 'italic', display: 'block' }}>Gets You Hired</em>
                    </h1>

                    <p
                        style={{ fontSize: '1rem', color: theme.textSub, lineHeight: 1.75, maxWidth: '36rem', margin: '0 auto 2.5rem', fontFamily: "'DM Sans', sans-serif" }}
                    >
                        ResuCraft uses AI and NLP to transform your profile into a perfectly
                        tailored, ATS-optimized resume for every job — in under 60 seconds.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                        <Link to="/auth/sign-up" className="rc-btn">
                            Start Building Free <span style={{ color: theme.accentLight, position: 'relative', zIndex: 1 }}>↗</span>
                        </Link>
                        <Link to="/features" className="rc-btn-ghost">
                            See Features
                        </Link>
                    </div>

                    {/* Trust signals */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1.5rem 2rem' }}>
                        {["No credit card required", "Free forever plan", "PDF export included", "GDPR compliant"].map((t) => (
                            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                                <span style={{ color: theme.accent, fontSize: '0.7rem' }}>✓</span>
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section style={{ background: theme.bgAlt, borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`, padding: '3.5rem 0' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem' }}>
                        {stats.map((s, i) => (
                            <div
                                key={s.value}
                                style={{ textAlign: 'center' }}
                                data-aos="fade-up"
                                data-aos-delay={i * 80}
                            >
                                <div className="rc-icon-box" style={{ width: 40, height: 40, margin: '0 auto 0.75rem' }}>
                                    {s.icon}
                                </div>
                                <p className="rc-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: theme.accentLight, lineHeight: 1 }}>{s.value}</p>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: theme.textSub, marginTop: '0.25rem', fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
                                <p style={{ fontSize: '0.75rem', color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section style={{ background: theme.bg, padding: '5rem 0' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }} data-aos="fade-up">
                        <span className="rc-label">Everything You Need</span>
                        <h2 className="rc-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: theme.text, lineHeight: 1.1, margin: '0.75rem 0 1rem' }}>
                            The Complete <em style={{ color: theme.accentLight, fontStyle: 'italic' }}>Resume Toolkit</em>
                        </h2>
                        <p style={{ color: theme.textMuted, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '36rem', margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
                            From AI generation to interview prep — ResuCraft covers every step of
                            your job application journey.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {features.map((f, i) => (
                            <div
                                key={f.title}
                                className="rc-card"
                                style={{ padding: '1.5rem' }}
                                data-aos="fade-up"
                                data-aos-delay={i * 70}
                            >
                                <div className="rc-icon-box" style={{ width: 44, height: 44, marginBottom: '1rem' }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: theme.text, marginBottom: '0.5rem', fontFamily: "'DM Sans', sans-serif" }}>{f.title}</h3>
                                <p style={{ fontSize: '0.8rem', color: theme.textMuted, lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center' }} data-aos="fade-up">
                        <Link to="/features" style={{ fontSize: '0.85rem', fontWeight: 600, color: theme.accentLight, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
                            Explore all features →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section id="how-it-works" style={{ background: theme.bgDeep, padding: '5rem 0' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }} data-aos="fade-up">
                        <span className="rc-label">Simple Process</span>
                        <h2 className="rc-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: theme.text, lineHeight: 1.1, margin: '0.75rem 0 1rem' }}>
                            How <em style={{ color: theme.accentLight, fontStyle: 'italic' }}>ResuCraft</em> Works
                        </h2>
                        <p style={{ color: theme.textMuted, fontSize: '0.9rem', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                            Three simple steps from blank page to hired.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                        {steps.map((step, i) => (
                            <div
                                key={step.n}
                                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                                data-aos="fade-up"
                                data-aos-delay={i * 150}
                            >
                                {/* Connector line */}
                                {i < steps.length - 1 && (
                                    <div style={{
                                        // display: 'none',
                                        position: 'absolute',
                                        top: '2.5rem',
                                        left: 'calc(50% + 4rem)',
                                        width: 'calc(100% - 6rem)',
                                        height: '1px',
                                        background: `${theme.accent}30 `,
                                    }} className="step-connector" />
                                )}
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '5rem',
                                        height: '5rem',
                                        borderRadius: '1.25rem',
                                        background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDark})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        marginBottom: '1.25rem',
                                        boxShadow: `0 8px 24px ${theme.accent}30`,
                                    }}
                                    className="rc-float"
                                >
                                    {step.icon}
                                    <span style={{
                                        position: 'absolute',
                                        top: '-0.5rem',
                                        right: '-0.5rem',
                                        width: '1.4rem',
                                        height: '1.4rem',
                                        borderRadius: '50%',
                                        background: theme.card,
                                        border: `2px solid ${theme.accent}`,
                                        color: theme.accentLight,
                                        fontSize: '0.6rem',
                                        fontWeight: 900,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}>
                                        {i + 1}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: theme.text, marginBottom: '0.5rem', fontFamily: "'DM Sans', sans-serif" }}>
                                    {step.title}
                                </h3>
                                <p style={{ fontSize: '0.82rem', color: theme.textMuted, lineHeight: 1.7, maxWidth: '18rem', fontFamily: "'DM Sans', sans-serif" }}>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section style={{ background: theme.bg, padding: '5rem 0' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }} data-aos="fade-up">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                            {[1,2,3,4,5].map(i => <Star key={i} size={16} style={{ color: theme.accentLight, fill: theme.accentLight }} />)}
                        </div>
                        <span className="rc-label">Testimonials</span>
                        <h2 className="rc-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: theme.text, lineHeight: 1.1, margin: '0.75rem 0 1rem' }}>
                            Loved by <em style={{ color: theme.accentLight, fontStyle: 'italic' }}>Job Seekers</em>
                        </h2>
                        <p style={{ color: theme.textMuted, fontSize: '0.9rem', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                            Real people, real results.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {testimonials.map((t, i) => (
                            <div
                                key={t.name}
                                style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '1rem', padding: '1.75rem', position: 'relative' }}
                                data-aos="fade-up"
                                data-aos-delay={i * 100}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '1rem' }}>
                                    {[1,2,3,4,5].map(j => <Star key={j} size={12} style={{ color: theme.accentLight, fill: theme.accentLight }} />)}
                                </div>
                                <p style={{ fontSize: '2.5rem', color: theme.accent, lineHeight: 1, marginBottom: '0.5rem', fontFamily: 'Georgia, serif', opacity: 0.6 }}>"</p>
                                <p style={{ fontSize: '0.85rem', color: theme.textSub, lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic', fontFamily: "'DM Sans', sans-serif" }}>
                                    {t.quote}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '2.25rem',
                                        height: '2.25rem',
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDark})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        flexShrink: 0,
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>{t.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ background: theme.bgDeep, padding: '5rem 0', position: 'relative', overflow: 'hidden' }} className="rc-dot-bg">
                <div className="rc-glow-gold" style={{ width: '28rem', height: '28rem', bottom: '-8rem', right: '-4rem', opacity: 0.4 }} />
                <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div data-aos="zoom-in" style={{ marginBottom: '1.5rem' }}>
                        <div className="rc-icon-box" style={{ width: 56, height: 56, margin: '0 auto' }}>
                            <Users size={24} />
                        </div>
                    </div>
                    <h2 className="rc-serif" data-aos="fade-up" data-aos-delay="50"
                        style={{ fontSize: '2.5rem', fontWeight: 600, color: theme.text, lineHeight: 1.1, marginBottom: '1rem' }}>
                        Ready to Land Your <em style={{ color: theme.accentLight, fontStyle: 'italic' }}>Dream Job?</em>
                    </h2>
                    <p style={{ color: theme.textMuted, fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '2.5rem', fontFamily: "'DM Sans', sans-serif" }} data-aos="fade-up" data-aos-delay="100">
                        Join thousands of professionals who use ResuCraft to get more interviews,
                        faster. It's free to start — no credit card needed.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem' }} data-aos="fade-up" data-aos-delay="150">
                        <Link to="/auth/sign-up" className="rc-btn">
                            Start Building for Free <span style={{ color: theme.accentLight, position: 'relative', zIndex: 1 }}>↗</span>
                        </Link>
                        <Link to="/features" className="rc-btn-ghost">
                            See All Features
                        </Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default WelcomePage;
