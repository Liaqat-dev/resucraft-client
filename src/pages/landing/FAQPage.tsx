import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MessageSquare, Search } from "lucide-react";
import AOS from "aos";
import LandingNav from "@src/components/landing/LandingNav.tsx";
import LandingFooter from "@src/components/landing/LandingFooter.tsx";

const GOLD = '#C09A3A';
const GOLD_T = '#D4B06A';
const DARK = '#0F172A';
const DARK2 = '#1e293b';
const DARK3 = '#334155';

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
    <div
        className="rc-accordion-item"
        data-open={isOpen ? "true" : undefined}
    >
        <button
            onClick={onToggle}
            className="rc-accordion-btn"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left' }}
        >
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>{item.q}</span>
            <ChevronDown
                size={16}
                style={{
                    flexShrink: 0,
                    color: '#64748b',
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
            />
        </button>
        <div
            className="rc-accordion-body"
            style={{
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
                maxHeight: isOpen ? '24rem' : '0',
            }}
        >
            <div style={{ padding: '0 1.25rem 1.25rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif" }}>
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
        <div style={{ minHeight: '100vh', background: DARK, fontFamily: "'DM Sans', sans-serif" }}>
            <LandingNav />

            {/* Hero */}
            <section
                style={{ background: DARK, paddingTop: '8rem', paddingBottom: '4rem', position: 'relative', overflow: 'hidden', textAlign: 'center' }}
                className="rc-dot-bg"
            >
                <div className="rc-glow-gold rc-pulse" style={{ width: '28rem', height: '28rem', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                <div style={{ maxWidth: '40rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
                    <div className="rc-icon-box" style={{ width: 56, height: 56, margin: '0 auto 1.5rem' }}>
                        <MessageSquare size={24} />
                    </div>
                    <h1
                        className="rc-serif"
                        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#f8fafc', lineHeight: 1.1, marginBottom: '1rem' }}
                    >
                        Frequently Asked <em style={{ color: GOLD_T, fontStyle: 'italic' }}>Questions</em>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
                        Everything you need to know about ResuCraft. Can't find an answer?{' '}
                        <Link to="/contact" style={{ color: GOLD_T, textDecoration: 'none' }}>Contact us</Link>.
                    </p>
                    {/* Search */}
                    <div style={{ position: 'relative', maxWidth: '28rem', margin: '0 auto' }}>
                        <Search size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setOpenIdx(null); }}
                            placeholder="Search questions..."
                            style={{
                                width: '100%',
                                paddingLeft: '2.75rem',
                                paddingRight: '1rem',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                borderRadius: '0.75rem',
                                background: DARK2,
                                border: `1px solid ${DARK3}`,
                                color: '#f8fafc',
                                fontSize: '0.875rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                                fontFamily: "'DM Sans', sans-serif",
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = GOLD;
                                e.currentTarget.style.boxShadow = `0 0 0 3px rgba(192,154,58,0.15)`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = DARK3;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Body */}
            <section style={{ padding: '3.5rem 0 5rem' }}>
                <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    {/* Category filter */}
                    {!search && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem', justifyContent: 'center' }} data-aos="fade-down">
                            {["All", ...categories].map((cat, i) => (
                                <button
                                    key={cat}
                                    onClick={() => { setActiveCategory(cat); setOpenIdx(null); }}
                                    style={{
                                        padding: '0.375rem 1rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        border: `1px solid ${DARK3}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontFamily: "'DM Sans', sans-serif",
                                        animationDelay: `${i * 40}ms`,
                                        ...(activeCategory === cat
                                            ? { background: `linear-gradient(135deg, ${GOLD}, #8B6914)`, color: '#fff', borderColor: 'transparent' }
                                            : { background: DARK3, color: '#94a3b8' }),
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Accordions */}
                    {filteredFAQs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }} data-aos="fade-up">
                            <p style={{ color: '#64748b', fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif" }}>
                                No questions found matching "{search}".{' '}
                                <Link to="/contact" style={{ color: GOLD_T, textDecoration: 'none', fontWeight: 600 }}>
                                    Ask us directly →
                                </Link>
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
            <section style={{ paddingBottom: '5rem' }}>
                <div style={{ maxWidth: '36rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }} data-aos="zoom-in">
                    <div style={{ padding: '2.5rem', borderRadius: '1rem', background: DARK2, border: `1px solid ${DARK3}` }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: "'DM Sans', sans-serif" }}>
                            Still have questions?
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                            Our team is happy to help. Send us a message and we'll get back to you
                            within 24 hours.
                        </p>
                        <Link to="/contact" className="rc-btn">
                            Contact Support <span style={{ color: GOLD_T, position: 'relative', zIndex: 1 }}>↗</span>
                        </Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default FAQPage;