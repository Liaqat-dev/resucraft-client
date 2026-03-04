import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Award,
    Bot,
    BrainCircuit,
    CheckCircle2,
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

const FeatureDetail: React.FC<FeatureDetailProps> = ({
    icon, badge, title, description, bullets, accent, badgeCls, reverse,
}) => (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}>
        <div
            className={reverse ? "lg:[direction:ltr]" : ""}
            data-aos={reverse ? "fade-left" : "fade-right"}
        >
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${badgeCls}`}>
                {badge}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 leading-relaxed mb-6 text-sm">
                {description}
            </p>
            <ul className="space-y-2.5">
                {bullets.map((b, i) => (
                    <li
                        key={b}
                        className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300"
                        data-aos="fade-up"
                        data-aos-delay={i * 60}
                    >
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        {b}
                    </li>
                ))}
            </ul>
        </div>
        <div
            className={`rounded-2xl p-10 flex items-center justify-center ${accent} ${reverse ? "lg:[direction:ltr]" : ""}`}
            data-aos={reverse ? "fade-right" : "fade-left"}
        >
            <div className="size-20 rounded-3xl bg-white/20 flex items-center justify-center text-white animate-float">
                {React.cloneElement(icon as React.ReactElement, { size: 40 })}
            </div>
        </div>
    </div>
);

const features: FeatureDetailProps[] = [
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
    useEffect(() => {
        AOS.init({ once: true, duration: 650, easing: "ease-out-cubic", offset: 60 });
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
            <LandingNav />

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-slate-950 to-slate-900 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-xs font-semibold mb-5 animate-fade-in-up"
                    >
                        <Sparkles size={12} />
                        Built for Modern Job Seekers
                    </div>
                    <h1
                        className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight animate-fade-in-up"
                        style={{ animationDelay: "100ms" }}
                    >
                        Every Feature You Need to{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">
                            Get Hired Faster
                        </span>
                    </h1>
                    <p
                        className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto mb-8 animate-fade-in-up"
                        style={{ animationDelay: "200ms" }}
                    >
                        ResuCraft packs AI, ATS optimization, drag-and-drop design, and interview
                        prep into one streamlined platform.
                    </p>
                    <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                        <Link
                            to="/auth/sign-up"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-primary-600/20"
                        >
                            Start Free — No Card Needed
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature details */}
            <section className="py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
                    {features.map((f) => (
                        <FeatureDetail key={f.title} {...f} />
                    ))}
                </div>
            </section>

            {/* Quick features grid */}
            <section className="py-16 md:py-20 bg-gray-50 dark:bg-slate-900/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12" data-aos="fade-up">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            Plus Everything Else You Need
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                            Small details that make a big difference.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {highlights.map((h, i) => (
                            <div
                                key={h.label}
                                className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all duration-200 hover:-translate-y-0.5"
                                data-aos="fade-up"
                                data-aos-delay={i * 60}
                            >
                                <div className="size-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                                    {h.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{h.label}</p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 leading-relaxed">{h.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-primary-600 text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4" data-aos="fade-up">
                        Explore It All For Free
                    </h2>
                    <p className="text-primary-100 text-sm mb-7 leading-relaxed" data-aos="fade-up" data-aos-delay="60">
                        Create your profile, generate your first resume, and see the difference AI makes.
                    </p>
                    <div data-aos="fade-up" data-aos-delay="120">
                        <Link
                            to="/auth/sign-up"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-700 hover:bg-primary-50 font-bold text-sm transition-colors shadow-lg"
                        >
                            Create Free Account <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default FeaturesPage;
