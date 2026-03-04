import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Award,
    Bot,
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
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
    useEffect(() => {
        AOS.init({ once: true, duration: 650, easing: "ease-out-cubic", offset: 60 });
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
            <LandingNav />

            {/* ── Hero ── */}
            <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* Glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-xs font-semibold mb-6 animate-fade-in-up"
                    >
                        <Bot size={12} />
                        AI-Powered · ATS-Optimized · Free to Start
                    </div>

                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6 max-w-4xl mx-auto animate-fade-in-up"
                        style={{ animationDelay: "100ms" }}
                    >
                        Build a Resume That
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">
                            Gets You Hired
                        </span>
                    </h1>

                    <p
                        className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up"
                        style={{ animationDelay: "200ms" }}
                    >
                        ResuCraft uses AI and NLP to transform your profile into a perfectly
                        tailored, ATS-optimized resume for every job — in under 60 seconds.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
                        style={{ animationDelay: "300ms" }}
                    >
                        <Link
                            to="/auth/sign-up"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-primary-600/20"
                        >
                            Get Started Free
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            to="/features"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-sm transition-colors"
                        >
                            See All Features
                            <ChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Trust signals */}
                    <div
                        className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500 animate-fade-in"
                        style={{ animationDelay: "500ms" }}
                    >
                        {["No credit card required", "Free forever plan", "PDF export included", "GDPR compliant"].map((t) => (
                            <span key={t} className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="py-14 bg-slate-900 dark:bg-slate-900 border-y border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((s, i) => (
                            <div
                                key={s.value}
                                className="text-center"
                                data-aos="fade-up"
                                data-aos-delay={i * 80}
                            >
                                <div className="inline-flex size-10 rounded-xl bg-primary-500/10 text-primary-400 items-center justify-center mb-3">
                                    {s.icon}
                                </div>
                                <p className="text-2xl md:text-3xl font-extrabold text-white">{s.value}</p>
                                <p className="text-sm font-semibold text-slate-300 mt-0.5">{s.label}</p>
                                <p className="text-xs text-slate-500">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14" data-aos="fade-up">
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">
                            Everything You Need
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            The Complete Resume Toolkit
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                            From AI generation to interview prep — ResuCraft covers every step of
                            your job application journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div
                                key={f.title}
                                className="group p-6 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-500/30 hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-900"
                                data-aos="fade-up"
                                data-aos-delay={i * 70}
                            >
                                <div className={`size-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110 ${f.accent}`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                                    {f.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center" data-aos="fade-up">
                        <Link
                            to="/features"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:gap-3 transition-all"
                        >
                            Explore all features <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section id="how-it-works" className="py-20 md:py-28 bg-gray-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14" data-aos="fade-up">
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">
                            Simple Process
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            How ResuCraft Works
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
                            Three simple steps from blank page to hired.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <div
                                key={step.n}
                                className="relative flex flex-col items-center text-center"
                                data-aos="fade-up"
                                data-aos-delay={i * 150}
                            >
                                {/* Connector line */}
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-gradient-to-r from-primary-200 dark:from-primary-500/30 to-transparent" />
                                )}
                                <div className="relative size-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-primary-600/20 animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                                    {step.icon}
                                    <span className="absolute -top-2 -right-2 size-5 rounded-full bg-white dark:bg-slate-800 border-2 border-primary-600 text-primary-600 text-[10px] font-black flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed max-w-xs">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14" data-aos="fade-up">
                        <div className="flex items-center justify-center gap-1 mb-3">
                            {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Loved by Job Seekers
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto text-sm">
                            Real people, real results.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div
                                key={t.name}
                                className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 hover:shadow-md transition-shadow duration-200"
                                data-aos="fade-up"
                                data-aos-delay={i * 100}
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-5 italic">
                                    "{t.quote}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className={`size-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                                        <p className="text-xs text-gray-400 dark:text-slate-500">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: "24px 24px",
                    }} />
                <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <div className="inline-flex size-14 rounded-2xl bg-white/10 items-center justify-center mb-5 animate-float" data-aos="zoom-in">
                        <Users size={24} className="text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" data-aos="fade-up" data-aos-delay="50">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-primary-100 text-base mb-8 leading-relaxed" data-aos="fade-up" data-aos-delay="100">
                        Join thousands of professionals who use ResuCraft to get more interviews,
                        faster. It's free to start — no credit card needed.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="150">
                        <Link
                            to="/auth/sign-up"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-700 hover:bg-primary-50 font-bold text-sm transition-colors shadow-lg"
                        >
                            Start Building for Free
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            to="/features"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-white/30 text-white hover:border-white/60 font-semibold text-sm transition-colors"
                        >
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
