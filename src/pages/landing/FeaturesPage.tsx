import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Award,
    Bot,
    BrainCircuit,
    FileDown,
    GraduationCap,
    LayoutTemplate,
    MessageSquare,
    Palette,
    ShieldCheck,
    Sparkles,
    Target,
    Users,
    Zap,
} from "lucide-react";
import AOS from "aos";
import LandingNav from "@src/components/landing/LandingNav.tsx";
import LandingFooter from "@src/components/landing/LandingFooter.tsx";
import { useLandingTheme } from "@hooks/useLandingTheme";

interface FeatureDetailProps {
    icon: React.ReactNode;
    badge: string;
    title: string;
    description: string;
    bullets: string[];
    accent: string;
    badgeCls: string;
    reverse?: boolean;
}

const FeatureDetail: React.FC<FeatureDetailProps & { accentColor: string; cardBg: string; cardBorder: string; textColor: string; textSub: string; textMuted: string }> = ({
    icon, badge, title, description, bullets, reverse, accentColor, cardBg, cardBorder, textColor, textSub, textMuted,
}) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center', direction: reverse ? 'rtl' : 'ltr' }}>
        <div style={{ direction: 'ltr' }} data-aos={reverse ? "fade-left" : "fade-right"}>
            <span className="rc-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>{badge}</span>
            <h2
                className="rc-serif"
                style={{ fontSize: '2rem', fontWeight: 600, color: textColor, lineHeight: 1.15, marginBottom: '1rem' }}
            >
                {title}
            </h2>
            <p style={{ color: textMuted, lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif" }}>
                {description}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {bullets.map((b, i) => (
                    <li
                        key={b}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.85rem', color: textSub, fontFamily: "'DM Sans', sans-serif" }}
                        data-aos="fade-up"
                        data-aos-delay={i * 60}
                    >
                        <span style={{ color: accentColor, flexShrink: 0, marginTop: '0.1rem', fontSize: '0.7rem' }}>●</span>
                        {b}
                    </li>
                ))}
            </ul>
        </div>
        <div
            style={{
                borderRadius: '1rem',
                padding: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                direction: 'ltr',
                minHeight: '14rem',
            }}
            data-aos={reverse ? "fade-right" : "fade-left"}
        >
            <div className="rc-icon-box rc-float" style={{ width: 80, height: 80 }}>
                {React.cloneElement(icon as React.ReactElement, { size: 36 })}
            </div>
        </div>
    </div>
);

const featuresData: FeatureDetailProps[] = [
    {
        icon: <BrainCircuit />,
        badge: "Core Feature",
        title: "AI-Powered Resume Generation",
        description: "Our NLP engine reads the job description you paste, extracts key requirements and keywords, then rewrites your stored profile data into a perfectly tailored resume — all in under 60 seconds.",
        bullets: [
            "Job description parsing with NLP to extract key skills and keywords",
            "Automatic content rewriting optimized for each specific role",
            "Experience bullet points transformed into achievement-focused statements",
            "Skills prioritized and ranked by relevance to the target job",
            "Multiple resume versions saved for different applications",
        ],
        accent: "bg-gradient-to-br from-primary-600 to-primary-800",
        badgeCls: "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400",
    },
    {
        icon: <Target />,
        badge: "ATS Engine",
        title: "ATS Optimization",
        description: "60% of resumes never reach a human reviewer. ResuCraft's ATS optimization engine ensures your resume uses the right keywords, formatting, and structure to pass automated screening.",
        bullets: [
            "Smart keyword extraction from job descriptions and industry databases",
            "ATS-safe formatting without tables, images, or complex layouts",
            "Real-time ATS compatibility scoring as you build",
            "Industry-specific keyword suggestions",
            "Semantic matching beyond exact keyword repetition",
        ],
        accent: "bg-gradient-to-br from-emerald-600 to-emerald-800",
        badgeCls: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        reverse: true,
    },
    {
        icon: <LayoutTemplate />,
        badge: "Template Builder",
        title: "Drag-and-Drop Designer",
        description: "Create beautiful, professional resumes with our intuitive canvas-based editor. No design skills needed — just drag, drop, and customize.",
        bullets: [
            "Visual drag-and-drop canvas with real-time preview",
            "Rich component library: text blocks, icons, dividers, columns",
            "Full style control: fonts, colors, spacing, and alignment",
            "Template versioning and auto-save",
            "Publish your templates to the marketplace",
        ],
        accent: "bg-gradient-to-br from-violet-600 to-violet-800",
        badgeCls: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
        icon: <MessageSquare />,
        badge: "Interview Prep",
        title: "Interview Question Generator",
        description: "Stop guessing what interviewers will ask. Our AI analyzes the job description and your resume to generate relevant, role-specific interview questions.",
        bullets: [
            "Technical questions tailored to your tech stack",
            "Behavioral STAR-method question prompts",
            "Scenario-based situational questions",
            "Question categorization by difficulty and topic",
            "Downloadable question bank for offline preparation",
        ],
        accent: "bg-gradient-to-br from-amber-600 to-amber-800",
        badgeCls: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
        reverse: true,
    },
    {
        icon: <Award />,
        badge: "Community",
        title: "Template Marketplace",
        description: "Browse hundreds of community-designed and professionally-crafted resume templates. Filter by industry, style, and ATS compatibility.",
        bullets: [
            "Categorized and searchable template library",
            "Community ratings and reviews system",
            "ATS-compatibility badges on all templates",
            "Template designers build reputation and portfolio",
            "Regular new additions from verified creators",
        ],
        accent: "bg-gradient-to-br from-rose-600 to-rose-800",
        badgeCls: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
];

const highlights = [
    { icon: <GraduationCap size={18} />, label: "Profile Management", desc: "Education, experience, skills, projects, certificates — all in one place" },
    { icon: <FileDown size={18} />, label: "PDF Export", desc: "Pixel-perfect PDF export, print-ready and ATS-safe" },
    { icon: <Palette size={18} />, label: "Custom Themes", desc: "Multiple color schemes and font pairings to match your style" },
    { icon: <Bot size={18} />, label: "Speech Input", desc: "Voice-to-text input for accessibility and quick data entry" },
    { icon: <Users size={18} />, label: "Multi-Role Support", desc: "Designed for job seekers, template creators, and career services" },
    { icon: <Zap size={18} />, label: "Instant Generation", desc: "From job description to finished resume in under 60 seconds" },
    { icon: <ShieldCheck size={18} />, label: "Data Security", desc: "JWT auth, encrypted storage, full GDPR compliance" },
    { icon: <Sparkles size={18} />, label: "Smart Suggestions", desc: "AI-powered content suggestions as you type" },
];

const FeaturesPage: React.FC = () => {
    const theme = useLandingTheme();

    useEffect(() => {
        AOS.init({ once: true, duration: 650, easing: "ease-out-cubic", offset: 60 });
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'DM Sans', sans-serif" }}>
            <LandingNav />

            {/* Hero */}
            <section
                style={{ background: theme.bg, paddingTop: '8rem', paddingBottom: '5rem', position: 'relative', overflow: 'hidden', textAlign: 'center' }}
                className="rc-dot-bg"
            >
                <div className="rc-glow-gold rc-pulse" style={{ width: '30rem', height: '30rem', top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
                    <span className="rc-label" style={{ marginBottom: '1.25rem', display: 'inline-block' }}>
                        <Sparkles size={11} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        Built for Modern Job Seekers
                    </span>
                    <h1
                        className="rc-serif"
                        style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 600, color: theme.text, lineHeight: 1.1, marginBottom: '1.25rem' }}
                    >
                        Every Feature You Need to{' '}
                        <em style={{ color: theme.accentLight, fontStyle: 'italic' }}>Get Hired Faster</em>
                    </h1>
                    <p style={{ color: theme.textSub, fontSize: '1rem', lineHeight: 1.75, maxWidth: '36rem', margin: '0 auto 2.25rem', fontFamily: "'DM Sans', sans-serif" }}>
                        ResuCraft packs AI, ATS optimization, drag-and-drop design, and interview
                        prep into one streamlined platform.
                    </p>
                    <Link to="/auth/sign-up" className="rc-btn">
                        Start Free — No Card Needed <span style={{ color: theme.accentLight, position: 'relative', zIndex: 1 }}>↗</span>
                    </Link>
                </div>
            </section>

            {/* Feature details */}
            <section style={{ padding: '4rem 0 2rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                    {featuresData.map((f) => (
                        <FeatureDetail
                            key={f.title}
                            {...f}
                            accentColor={theme.accent}
                            cardBg={theme.card}
                            cardBorder={theme.border}
                            textColor={theme.text}
                            textSub={theme.textSub}
                            textMuted={theme.textMuted}
                        />
                    ))}
                </div>
            </section>

            {/* Highlights grid */}
            <section style={{ background: theme.bgDeep, padding: '5rem 0' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }} data-aos="fade-up">
                        <span className="rc-label">More Capabilities</span>
                        <h2 className="rc-serif" style={{ fontSize: '2.2rem', fontWeight: 600, color: theme.text, lineHeight: 1.1, margin: '0.75rem 0 0.75rem' }}>
                            Plus Everything Else <em style={{ color: theme.accentLight, fontStyle: 'italic' }}>You Need</em>
                        </h2>
                        <p style={{ color: theme.textMuted, fontSize: '0.88rem', maxWidth: '28rem', margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
                            Small details that make a big difference.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                        {highlights.map((h, i) => (
                            <div
                                key={h.label}
                                className="rc-card"
                                style={{ padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}
                                data-aos="fade-up"
                                data-aos-delay={i * 60}
                            >
                                <div className="rc-icon-box" style={{ width: 36, height: 36, flexShrink: 0 }}>
                                    {h.icon}
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>{h.label}</p>
                                    <p style={{ fontSize: '0.775rem', color: theme.textMuted, marginTop: '0.25rem', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{h.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: theme.bg, padding: '5rem 0', textAlign: 'center' }}>
                <div style={{ maxWidth: '40rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    <h2 className="rc-serif" data-aos="fade-up"
                        style={{ fontSize: '2.2rem', fontWeight: 600, color: theme.text, lineHeight: 1.1, marginBottom: '1rem' }}>
                        Explore It All <em style={{ color: theme.accentLight, fontStyle: 'italic' }}>For Free</em>
                    </h2>
                    <p style={{ color: theme.textMuted, fontSize: '0.88rem', marginBottom: '2rem', lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif" }} data-aos="fade-up" data-aos-delay="60">
                        Create your profile, generate your first resume, and see the difference AI makes.
                    </p>
                    <div data-aos="fade-up" data-aos-delay="120">
                        <Link to="/auth/sign-up" className="rc-btn">
                            Create Free Account <span style={{ color: theme.accentLight, position: 'relative', zIndex: 1 }}>↗</span>
                        </Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default FeaturesPage;
