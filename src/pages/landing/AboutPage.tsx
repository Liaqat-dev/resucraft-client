import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Award,
    BookOpen,
    BrainCircuit,
    FileText,
    GraduationCap,
    Heart,
    Lightbulb,
    MapPin,
    Shield,
    Target,
    Users,
    Zap,
} from "lucide-react";
import AOS from "aos";
import LandingNav from "@src/components/landing/LandingNav.tsx";
import LandingFooter from "@src/components/landing/LandingFooter.tsx";

const GOLD = '#C09A3A';
const GOLD_T = '#D4B06A';
const DARK = '#0F172A';
const DARK2 = '#1e293b';
const DARK3 = '#334155';

const values = [
    {
        icon: <Lightbulb size={20} />,
        title: "Innovation First",
        desc: "We leverage cutting-edge NLP and AI to solve real problems — not for hype, but because the technology genuinely helps people land jobs faster.",
        accent: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
        icon: <Target size={20} />,
        title: "Results-Driven",
        desc: "Every feature we build is measured against one metric: does it improve your chances of getting hired? ATS pass-through, interview prep, clean exports — all engineered for outcomes.",
        accent: "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400",
    },
    {
        icon: <Shield size={20} />,
        title: "Privacy & Trust",
        desc: "Your resume data is deeply personal. We treat it that way — GDPR-compliant architecture, encrypted storage, zero data selling, and you own everything you create.",
        accent: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
        icon: <Users size={20} />,
        title: "Community-Powered",
        desc: "The Template Marketplace puts designers and job seekers on the same platform. When talented creators publish templates, everyone's resumes get better.",
        accent: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
        icon: <Heart size={20} />,
        title: "Student-Built",
        desc: "ResuCraft started as a final-year project by two students who understood the frustration firsthand. That empathy is baked into every design decision.",
        accent: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
        icon: <BookOpen size={20} />,
        title: "Continuous Learning",
        desc: "We actively research ATS systems, hiring trends, and AI advancements. ResuCraft evolves with the job market so your resume always stays competitive.",
        accent: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
];

const team = [
    {
        name: "Alishba Ramzan",
        role: "Co-Founder & Lead Developer",
        bio: "Computer Science student at Lahore Garrison University with a passion for full-stack development and building products that make a difference. Focused on backend architecture, AI integration, and system design.",
        initials: "AR",
        accent: "from-primary-500 to-primary-700",
    },
    {
        name: "Liaqat Ali",
        role: "Co-Founder & Lead Developer",
        bio: "Computer Science student at Lahore Garrison University passionate about frontend engineering, UI/UX design, and crafting seamless user experiences. Specializes in React, TypeScript, and design systems.",
        initials: "LA",
        accent: "from-violet-500 to-violet-700",
    },
];

const stats = [
    { value: "80%", label: "Time saved building resumes", icon: <Zap size={16} /> },
    { value: "60%", label: "Better ATS pass-through rate", icon: <Target size={16} /> },
    { value: "50+", label: "Professional templates", icon: <FileText size={16} /> },
    { value: "16", label: "Languages supported", icon: <Award size={16} /> },
];

const AboutPage: React.FC = () => {
    useEffect(() => {
        AOS.init({ once: true, duration: 650, easing: "ease-out-cubic", offset: 60 });
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: DARK, fontFamily: "'DM Sans', sans-serif" }}>
            <LandingNav />

            {/* Hero */}
            <section
                style={{ background: DARK, paddingTop: '8rem', paddingBottom: '5rem', position: 'relative', overflow: 'hidden', textAlign: 'center' }}
                className="rc-dot-bg"
            >
                <div className="rc-glow-gold rc-pulse" style={{ width: '32rem', height: '32rem', top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
                    <span className="rc-label" style={{ marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                        <GraduationCap size={11} style={{ display: 'inline' }} />
                        Final Year Project — Lahore Garrison University
                    </span>
                    <h1
                        className="rc-serif"
                        style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 600, color: '#f8fafc', lineHeight: 1.08, marginBottom: '1.25rem' }}
                    >
                        Built by Students,{' '}
                        <em style={{ color: GOLD_T, fontStyle: 'italic' }}>for Everyone</em>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.75, maxWidth: '38rem', margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
                        ResuCraft was born from a simple frustration: spending hours tailoring a resume for each
                        job, only to get filtered out by a machine before a human ever sees it. We built the
                        tool we wished existed.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section style={{ background: '#111827', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', padding: '3rem 0' }}>
                <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem' }}>
                        {stats.map((s, i) => (
                            <div
                                key={s.label}
                                style={{ textAlign: 'center' }}
                                data-aos="fade-up"
                                data-aos-delay={i * 80}
                            >
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: GOLD_T, marginBottom: '0.5rem', fontFamily: "'DM Sans', sans-serif" }}>
                                    {s.icon}
                                </div>
                                <p className="rc-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: GOLD_T, lineHeight: 1 }}>{s.value}</p>
                                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.35rem', lineHeight: 1.45, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section style={{ background: DARK, padding: '5rem 0' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                        <div data-aos="fade-right">
                            <span className="rc-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Our Story</span>
                            <h2 className="rc-serif" style={{ fontSize: '2rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.15, marginBottom: '1.25rem' }}>
                                A problem every student and{' '}
                                <em style={{ color: GOLD_T, fontStyle: 'italic' }}>job seeker knows</em>
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
                                <p>
                                    When we started applying for internships and jobs, we discovered a
                                    frustrating reality: companies use Applicant Tracking Systems (ATS) that
                                    automatically reject 60% of resumes before a single human reviewer sees
                                    them. Not because candidates aren't qualified — but because their resumes
                                    aren't formatted and worded to match what the machine is looking for.
                                </p>
                                <p>
                                    We spent weeks customizing resumes, rewriting bullet points, and guessing
                                    which keywords would pass the filter. There had to be a better way.
                                </p>
                                <p>
                                    ResuCraft is our answer. An AI-powered platform that reads the job
                                    description you paste, maps it to your stored profile, and generates a
                                    perfectly tailored, ATS-optimized resume in under 60 seconds. The tool we
                                    needed when we were in your position.
                                </p>
                            </div>
                        </div>

                        {/* Visual card */}
                        <div
                            style={{ borderRadius: '1rem', background: DARK2, border: `1px solid ${DARK3}`, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                            data-aos="fade-left"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.5rem' }}>
                                <div className="rc-icon-box rc-float" style={{ width: 40, height: 40, flexShrink: 0 }}>
                                    <BrainCircuit size={18} />
                                </div>
                                <p style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif" }}>The Problem We Solved</p>
                            </div>
                            {[
                                { label: "ATS rejection rate", value: "60%", color: '#f43f5e' },
                                { label: "Avg. time spent per resume", value: "3–4 hrs", color: '#f59e0b' },
                                { label: "Keyword match after ResuCraft", value: "+60%", color: '#10b981' },
                                { label: "Time to generate a resume", value: "<60 sec", color: GOLD },
                            ].map((item, i) => (
                                <div
                                    key={item.label}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                    data-aos="fade-left"
                                    data-aos-delay={i * 80}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                        <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }}>{item.label}</span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>{item.value}</span>
                                </div>
                            ))}
                            <div style={{ paddingTop: '0.875rem', borderTop: `1px solid ${DARK3}` }}>
                                <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                                    Statistics derived from industry research and internal testing during
                                    development. ATS rejection rate based on published HR industry data.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section style={{ background: '#0c1520', padding: '5rem 0' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }} data-aos="fade-up">
                        <span className="rc-label">Our Principles</span>
                        <h2 className="rc-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.1, margin: '0.75rem 0 1rem' }}>
                            What We <em style={{ color: GOLD_T, fontStyle: 'italic' }}>Stand For</em>
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '32rem', margin: '0 auto', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                            The principles that guide every feature we build and every decision we make.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                        {values.map((v, i) => (
                            <div
                                key={v.title}
                                className="rc-card"
                                style={{ padding: '1.5rem' }}
                                data-aos="fade-up"
                                data-aos-delay={i * 70}
                            >
                                <div className="rc-icon-box" style={{ width: 44, height: 44, marginBottom: '1rem' }}>
                                    {v.icon}
                                </div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: "'DM Sans', sans-serif" }}>{v.title}</h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section style={{ background: DARK, padding: '5rem 0' }}>
                <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }} data-aos="fade-up">
                        <span className="rc-label">The Team</span>
                        <h2 className="rc-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.1, margin: '0.75rem 0 1rem' }}>
                            The People <em style={{ color: GOLD_T, fontStyle: 'italic' }}>Behind It</em>
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '30rem', margin: '0 auto', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                            Two developers, one shared mission — making the job search less painful for everyone.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        {team.map((member, i) => (
                            <div
                                key={member.name}
                                className="rc-card"
                                style={{ padding: '1.75rem' }}
                                data-aos="fade-up"
                                data-aos-delay={i * 120}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: '4rem',
                                    height: '4rem',
                                    borderRadius: '1rem',
                                    background: `linear-gradient(135deg, ${GOLD}, #8B6914)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontSize: '1.2rem',
                                    fontWeight: 700,
                                    marginBottom: '1rem',
                                    flexShrink: 0,
                                    fontFamily: "'DM Sans', sans-serif",
                                }}>
                                    {member.initials}
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem', fontFamily: "'DM Sans', sans-serif" }}>
                                    {member.name}
                                </h3>
                                <p style={{ fontSize: '0.775rem', fontWeight: 600, color: GOLD_T, marginBottom: '0.875rem', fontFamily: "'DM Sans', sans-serif" }}>
                                    {member.role}
                                </p>
                                <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Supervisor card */}
                    <div
                        className="rc-card"
                        style={{ padding: '1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}
                        data-aos="fade-up"
                    >
                        <div style={{
                            width: '3.5rem',
                            height: '3.5rem',
                            borderRadius: '1rem',
                            background: `linear-gradient(135deg, #10b981, #047857)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 700,
                            flexShrink: 0,
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            MT
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>
                                    Dr. Maria Tariq
                                </h3>
                                <span style={{
                                    padding: '0.2rem 0.625rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    background: 'rgba(16,185,129,0.1)',
                                    color: '#34d399',
                                    border: '1px solid rgba(16,185,129,0.2)',
                                    fontFamily: "'DM Sans', sans-serif",
                                }}>
                                    Supervisor
                                </span>
                            </div>
                            <p style={{ fontSize: '0.775rem', fontWeight: 600, color: '#475569', marginBottom: '0.625rem', fontFamily: "'DM Sans', sans-serif" }}>
                                Faculty Supervisor — Lahore Garrison University
                            </p>
                            <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                                ResuCraft was developed as a Final Year Project (FYP) under the supervision of
                                Dr. Maria Tariq at the Department of Computer Science, Lahore Garrison University.
                                Her guidance shaped the project's research foundation and architectural direction.
                            </p>
                        </div>
                    </div>

                    {/* Institution badge */}
                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }} data-aos="fade-up">
                        <MapPin size={14} />
                        <span>Lahore Garrison University, Lahore, Pakistan</span>
                    </div>
                </div>
            </section>

            {/* Mission CTA */}
            <section style={{ background: '#0c1520', padding: '5rem 0', position: 'relative', overflow: 'hidden' }} className="rc-dot-bg">
                <div className="rc-glow-gold" style={{ width: '24rem', height: '24rem', bottom: '-6rem', left: '-4rem', opacity: 0.3 }} />
                <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div data-aos="zoom-in" style={{ marginBottom: '1.5rem' }}>
                        <div className="rc-icon-box rc-float" style={{ width: 56, height: 56, margin: '0 auto' }}>
                            <Heart size={24} />
                        </div>
                    </div>
                    <h2 className="rc-serif" data-aos="fade-up" data-aos-delay="60"
                        style={{ fontSize: '2.5rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.1, marginBottom: '1rem' }}>
                        Join Thousands of <em style={{ color: GOLD_T, fontStyle: 'italic' }}>Job Seekers</em>
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '36rem', margin: '0 auto 2.5rem', fontFamily: "'DM Sans', sans-serif" }} data-aos="fade-up" data-aos-delay="120">
                        ResuCraft is free to start. Build your profile, generate a tailored resume, and see
                        what it feels like to apply for jobs with confidence.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }} data-aos="fade-up" data-aos-delay="180">
                        <Link to="/auth/sign-up" className="rc-btn">
                            Get Started Free <span style={{ color: GOLD_T, position: 'relative', zIndex: 1 }}>↗</span>
                        </Link>
                        <Link to="/features" className="rc-btn-ghost">
                            Explore Features
                        </Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default AboutPage;