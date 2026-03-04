import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, MessageSquare, Search } from "lucide-react";
import AOS from "aos";
import LandingNav from "@src/components/landing/LandingNav.tsx";
import LandingFooter from "@src/components/landing/LandingFooter.tsx";

interface FAQItem {
    q: string;
    a: string;
    category: string;
}

const faqs: FAQItem[] = [
    // Getting Started
    { category: "Getting Started", q: "What is ResuCraft?", a: "ResuCraft is an AI-powered, ATS-optimized resume builder. You build a profile once with your education, experience, skills, and projects. Then, whenever you apply for a job, you paste the job description and ResuCraft's AI generates a tailored, ATS-optimized resume for that specific role — in under 60 seconds." },
    { category: "Getting Started", q: "Is ResuCraft free to use?", a: "Yes! ResuCraft has a generous free plan that includes profile building, AI resume generation, and PDF export. Premium features like advanced templates, unlimited resume versions, and priority support are available in paid plans." },
    { category: "Getting Started", q: "How do I get started?", a: "Sign up for a free account, complete your profile (personal info, education, experience, skills, projects), then head to the Resume Builder. Paste a job description and click Generate — your tailored resume will be ready instantly." },
    { category: "Getting Started", q: "Do I need design skills to use ResuCraft?", a: "No design skills required. ResuCraft handles all formatting automatically. If you want more control, the drag-and-drop template builder lets you customize layouts visually without writing any code." },

    // AI & ATS
    { category: "AI & ATS", q: "How does AI resume generation work?", a: "When you paste a job description, our NLP engine extracts required skills, keywords, and responsibilities. It then maps those to your profile data, rewrites your experience bullet points into achievement-focused statements, prioritizes relevant skills, and produces a formatted resume — all tailored to the specific job." },
    { category: "AI & ATS", q: "What is ATS optimization?", a: "ATS stands for Applicant Tracking System — software used by employers to automatically screen resumes. ATS optimization means ensuring your resume uses the right keywords, formatting, and structure to pass this screening and reach a human reviewer. ResuCraft's engine boosts your ATS pass-through rate by up to 60%." },
    { category: "AI & ATS", q: "Does ResuCraft guarantee I'll get an interview?", a: "ResuCraft significantly improves your chances by optimizing for ATS and presenting your experience compellingly. However, interviews depend on many factors including your experience, the role, and the hiring company. We provide the best possible resume — the rest is in your hands." },
    { category: "AI & ATS", q: "Can I create different resumes for different jobs?", a: "Absolutely. You can generate as many tailored resumes as you need — one for each job application. Each version is saved in your dashboard so you can track and manage all your applications." },

    // Templates
    { category: "Templates", q: "What is the Template Marketplace?", a: "The Template Marketplace is a community-driven library of resume templates designed by ResuCraft and by the community. You can browse, filter by industry, rate templates, and use any template for your resume. Template creators can publish their designs and build their reputation." },
    { category: "Templates", q: "Are all templates ATS-compatible?", a: "Yes. Every template in ResuCraft — whether from our library or the marketplace — is validated for ATS compatibility. They use clean formatting, standard fonts, and avoid elements like tables, images in text, and complex layouts that confuse ATS scanners." },
    { category: "Templates", q: "Can I create and publish my own templates?", a: "Yes! If you're a Template Creator, you can use the drag-and-drop builder to design your own templates and publish them to the marketplace. This lets you build a portfolio, gain community recognition, and potentially monetize your designs in future premium tiers." },

    // Privacy & Security
    { category: "Privacy & Security", q: "Is my data secure?", a: "Absolutely. ResuCraft uses JWT authentication with HttpOnly cookies for session management, bcrypt password hashing, and encrypted data storage. We're GDPR compliant and you retain full ownership of your data. We never sell your information to third parties." },
    { category: "Privacy & Security", q: "Who can see my profile and resumes?", a: "Your profile and resumes are completely private. Only you can see your data. If you publish a template to the marketplace, only the template design is visible — not your personal information." },
    { category: "Privacy & Security", q: "Can I delete my account and data?", a: "Yes. You can delete your account and all associated data at any time from Account Settings. All your data — including profile, resumes, and templates — is permanently removed from our servers." },

    // Export & PDF
    { category: "Export & PDF", q: "What formats can I export my resume in?", a: "ResuCraft generates pixel-perfect PDF exports that are print-ready and ATS-safe. We use Puppeteer for server-side rendering to ensure consistent, professional output across all template designs." },
    { category: "Export & PDF", q: "Can I edit my resume after generating it?", a: "Yes. After AI generation, you can fine-tune any section in the builder before downloading. You can also regenerate at any time if you update your profile or want to try different phrasing." },

    // Interview Prep
    { category: "Interview Prep", q: "How does the interview question generator work?", a: "After generating a resume, ResuCraft analyzes the job description and your background to produce a personalized question bank. This includes technical questions for your specific skills, behavioral questions using the STAR method, and scenario-based situational questions relevant to the role." },
    { category: "Interview Prep", q: "Are the interview questions specific to my field?", a: "Yes. The questions are tailored to the job description you provided and the skills and technologies in your profile. A software engineer applying for a React role gets different questions than a data analyst or a project manager." },
];

const categories = Array.from(new Set(faqs.map(f => f.category)));

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
    item, isOpen, onToggle,
}) => (
    <div className={`border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden transition-shadow duration-200 ${isOpen ? "shadow-sm" : ""}`}>
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
        >
            <span className="text-sm font-semibold text-gray-800 dark:text-white">{item.q}</span>
            <ChevronDown
                size={16}
                className={`shrink-0 text-gray-400 dark:text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"}`}
        >
            <div className="px-5 pb-5 bg-white dark:bg-slate-900 border-t border-gray-50 dark:border-slate-800">
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed pt-4">
                    {item.a}
                </p>
            </div>
        </div>
    </div>
);

const FAQPage: React.FC = () => {
    const [openIdx, setOpenIdx] = useState<number | null>(0);
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [search, setSearch] = useState("");

    useEffect(() => {
        AOS.init({ once: true, duration: 650, easing: "ease-out-cubic", offset: 60 });
    }, []);

    const filteredFAQs = faqs.filter((f) => {
        const matchCat = activeCategory === "All" || f.category === activeCategory;
        const matchSearch = !search.trim() ||
            f.q.toLowerCase().includes(search.toLowerCase()) ||
            f.a.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <LandingNav />

            {/* Hero */}
            <section className="pt-28 pb-14 md:pt-36 md:pb-16 bg-gradient-to-b from-slate-950 to-slate-900 text-center">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    <div className="inline-flex size-14 rounded-2xl bg-primary-500/15 text-primary-400 items-center justify-center mb-5 animate-scale-in">
                        <MessageSquare size={24} />
                    </div>
                    <h1
                        className="text-3xl md:text-4xl font-extrabold text-white mb-4 animate-fade-in-up"
                        style={{ animationDelay: "80ms" }}
                    >
                        Frequently Asked Questions
                    </h1>
                    <p
                        className="text-slate-400 text-sm leading-relaxed mb-8 animate-fade-in-up"
                        style={{ animationDelay: "160ms" }}
                    >
                        Everything you need to know about ResuCraft. Can't find an answer?{" "}
                        <Link to="/contact" className="text-primary-400 hover:underline">Contact us</Link>.
                    </p>
                    {/* Search */}
                    <div
                        className="relative max-w-md mx-auto animate-fade-in-up"
                        style={{ animationDelay: "240ms" }}
                    >
                        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setOpenIdx(null); }}
                            placeholder="Search questions..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Body */}
            <section className="py-14 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category filter */}
                    {!search && (
                        <div className="flex flex-wrap gap-2 mb-10 justify-center" data-aos="fade-down">
                            {["All", ...categories].map((cat, i) => (
                                <button
                                    key={cat}
                                    onClick={() => { setActiveCategory(cat); setOpenIdx(null); }}
                                    style={{ animationDelay: `${i * 40}ms` }}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5 ${
                                        activeCategory === cat
                                            ? "bg-primary-600 border-primary-600 text-white shadow-sm shadow-primary-600/20"
                                            : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-500/50"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Accordions */}
                    {filteredFAQs.length === 0 ? (
                        <div className="text-center py-16" data-aos="fade-up">
                            <p className="text-gray-400 dark:text-slate-500 text-sm">
                                No questions found matching "{search}".{" "}
                                <Link to="/contact" className="text-primary-600 dark:text-primary-400 hover:underline">
                                    Ask us directly →
                                </Link>
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredFAQs.map((item, i) => (
                                <div key={i} data-aos="fade-up" data-aos-delay={Math.min(i * 40, 300)}>
                                    <AccordionItem
                                        item={item}
                                        isOpen={openIdx === i}
                                        onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Still have questions */}
            <section className="pb-16 md:pb-20">
                <div className="max-w-xl mx-auto px-4 text-center" data-aos="zoom-in">
                    <div className="p-8 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Still have questions?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">
                            Our team is happy to help. Send us a message and we'll get back to you
                            within 24 hours.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
                        >
                            Contact Support <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default FAQPage;
