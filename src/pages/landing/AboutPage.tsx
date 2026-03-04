import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
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
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <LandingNav />

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-slate-950 to-slate-900 text-center overflow-hidden relative">
                {/* Decorative grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-xs font-semibold mb-5 animate-fade-in-up">
                        <GraduationCap size={13} />
                        Final Year Project — Lahore Garrison University
                    </div>
                    <h1
                        className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight animate-fade-in-up"
                        style={{ animationDelay: "100ms" }}
                    >
                        Built by Students,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">
                            for Everyone
                        </span>
                    </h1>
                    <p
                        className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto animate-fade-in-up"
                        style={{ animationDelay: "200ms" }}
                    >
                        ResuCraft was born from a simple frustration: spending hours tailoring a resume for each
                        job, only to get filtered out by a machine before a human ever sees it. We built the
                        tool we wished existed.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 border-b border-gray-100 dark:border-slate-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((s, i) => (
                            <div
                                key={s.label}
                                className="text-center"
                                data-aos="fade-up"
                                data-aos-delay={i * 80}
                            >
                                <div className="inline-flex items-center gap-1.5 text-primary-500 dark:text-primary-400 text-xs font-semibold mb-2">
                                    {s.icon}
                                </div>
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                                    {s.value}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-slate-500 leading-tight">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div data-aos="fade-right">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 mb-4">
                                Our Story
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-5 leading-snug">
                                A problem every student and job seeker knows too well
                            </h2>
                            <div className="space-y-4 text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
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
                            className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-8 space-y-5"
                            data-aos="fade-left"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0 animate-float">
                                    <BrainCircuit size={18} className="text-white" />
                                </div>
                                <p className="text-white font-semibold text-sm">The Problem We Solved</p>
                            </div>
                            {[
                                { label: "ATS rejection rate", value: "60%", color: "bg-rose-500" },
                                { label: "Avg. time spent per resume", value: "3–4 hrs", color: "bg-amber-500" },
                                { label: "Keyword match after ResuCraft", value: "+60%", color: "bg-emerald-500" },
                                { label: "Time to generate a resume", value: "<60 sec", color: "bg-primary-500" },
                            ].map((item, i) => (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between"
                                    data-aos="fade-left"
                                    data-aos-delay={i * 80}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`size-2 rounded-full ${item.color}`} />
                                        <span className="text-xs text-slate-400">{item.label}</span>
                                    </div>
                                    <span className="text-xs font-bold text-white">{item.value}</span>
                                </div>
                            ))}
                            <div className="pt-3 border-t border-slate-700">
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Statistics derived from industry research and internal testing during
                                    development. ATS rejection rate based on published HR industry data.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-20 bg-gray-50 dark:bg-slate-900/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12" data-aos="fade-up">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            What We Stand For
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                            The principles that guide every feature we build and every decision we make.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {values.map((v, i) => (
                            <div
                                key={v.title}
                                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-200"
                                data-aos="fade-up"
                                data-aos-delay={i * 70}
                            >
                                <div className={`size-10 rounded-xl flex items-center justify-center mb-3 ${v.accent}`}>
                                    {v.icon}
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12" data-aos="fade-up">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            The Team
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                            Two developers, one shared mission — making the job search less painful for everyone.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {team.map((member, i) => (
                            <div
                                key={member.name}
                                className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col hover:shadow-md transition-shadow duration-200"
                                data-aos="fade-up"
                                data-aos-delay={i * 120}
                            >
                                {/* Avatar */}
                                <div className={`size-16 rounded-2xl bg-gradient-to-br ${member.accent} flex items-center justify-center text-white text-xl font-bold mb-4 shrink-0`}>
                                    {member.initials}
                                </div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">
                                    {member.name}
                                </h3>
                                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-3">
                                    {member.role}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Supervisor card */}
                    <div
                        className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                        data-aos="fade-up"
                    >
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-lg font-bold shrink-0">
                            MT
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                    Dr. Maria Tariq
                                </h3>
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                                    Supervisor
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 mb-2">
                                Faculty Supervisor — Lahore Garrison University
                            </p>
                            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                                ResuCraft was developed as a Final Year Project (FYP) under the supervision of
                                Dr. Maria Tariq at the Department of Computer Science, Lahore Garrison University.
                                Her guidance shaped the project's research foundation and architectural direction.
                            </p>
                        </div>
                    </div>

                    {/* Institution badge */}
                    <div className="mt-8 flex items-center justify-center gap-3 text-sm text-gray-400 dark:text-slate-500" data-aos="fade-up">
                        <MapPin size={14} />
                        <span>Lahore Garrison University, Lahore, Pakistan</span>
                    </div>
                </div>
            </section>

            {/* Mission CTA */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 to-slate-950">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="inline-flex size-14 rounded-2xl bg-primary-500/15 text-primary-400 items-center justify-center mb-5 animate-float" data-aos="zoom-in">
                        <Heart size={24} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4" data-aos="fade-up" data-aos-delay="60">
                        Join Thousands of Job Seekers
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xl mx-auto" data-aos="fade-up" data-aos-delay="120">
                        ResuCraft is free to start. Build your profile, generate a tailored resume, and see
                        what it feels like to apply for jobs with confidence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center" data-aos="fade-up" data-aos-delay="180">
                        <Link
                            to="/auth/sign-up"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-primary-600/20"
                        >
                            Get Started Free <ArrowRight size={15} />
                        </Link>
                        <Link
                            to="/features"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white font-semibold text-sm transition-colors"
                        >
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
