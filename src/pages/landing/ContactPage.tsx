import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    CheckCircle2,
    Clock,
    Loader2,
    Mail,
    MapPin,
    MessageSquare,
    Send,
} from "lucide-react";
import AOS from "aos";
import LandingNav from "@src/components/landing/LandingNav.tsx";
import LandingFooter from "@src/components/landing/LandingFooter.tsx";

const GOLD = '#C09A3A';
const GOLD_T = '#D4B06A';
const DARK = '#0F172A';
const DARK2 = '#1e293b';
const DARK3 = '#334155';

const contactInfo = [
    {
        icon: <Mail size={18} />,
        label: "Email Us",
        value: "support@resucraft.app",
        sub: "We reply within 24 hours",
        accent: "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400",
    },
    {
        icon: <Clock size={18} />,
        label: "Response Time",
        value: "Under 24 hours",
        sub: "Monday – Friday, 9am–6pm PKT",
        accent: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
        icon: <MapPin size={18} />,
        label: "Location",
        value: "Lahore, Pakistan",
        sub: "Lahore Garrison University",
        accent: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
];

const topics = [
    "General Inquiry",
    "Technical Support",
    "Account & Billing",
    "Feature Request",
    "Template Marketplace",
    "Partnership",
    "Other",
];

const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 0.75rem',
    borderRadius: '8px',
    background: DARK,
    border: `1px solid ${DARK3}`,
    color: '#f8fafc',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#64748b',
    marginBottom: '0.375rem',
    fontFamily: "'DM Sans', sans-serif",
};

const ContactPage: React.FC = () => {
    const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        AOS.init({ once: true, duration: 650, easing: "ease-out-cubic", offset: 60 });
    }, []);

    const set = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate submission
        await new Promise((r) => setTimeout(r, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = GOLD;
        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(192,154,58,0.15)`;
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = DARK3;
        e.currentTarget.style.boxShadow = 'none';
    };

    return (
        <div style={{ minHeight: '100vh', background: DARK, fontFamily: "'DM Sans', sans-serif" }}>
            <LandingNav />

            {/* Hero */}
            <section
                style={{ background: DARK, paddingTop: '8rem', paddingBottom: '4rem', position: 'relative', overflow: 'hidden', textAlign: 'center' }}
                className="rc-dot-bg"
            >
                <div className="rc-glow-gold rc-pulse" style={{ width: '26rem', height: '26rem', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                <div style={{ maxWidth: '36rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
                    <div className="rc-icon-box" style={{ width: 56, height: 56, margin: '0 auto 1.5rem' }}>
                        <MessageSquare size={24} />
                    </div>
                    <h1
                        className="rc-serif"
                        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#f8fafc', lineHeight: 1.1, marginBottom: '1rem' }}
                    >
                        Get in <em style={{ color: GOLD_T, fontStyle: 'italic' }}>Touch</em>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif" }}>
                        Have a question, feedback, or just want to say hi? We'd love to hear
                        from you.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section style={{ padding: '4rem 0 5rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem', alignItems: 'start' }}>
                        {/* Info sidebar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {contactInfo.map((c, i) => (
                                <div
                                    key={c.label}
                                    className="rc-card"
                                    style={{ padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
                                    data-aos="fade-right"
                                    data-aos-delay={i * 100}
                                >
                                    <div className="rc-icon-box" style={{ width: 40, height: 40, flexShrink: 0 }}>
                                        {c.icon}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.2rem', fontFamily: "'DM Sans', sans-serif" }}>
                                            {c.label}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>
                                            {c.value}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem', fontFamily: "'DM Sans', sans-serif" }}>
                                            {c.sub}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* FAQ promo card */}
                            <div
                                style={{ padding: '1.25rem', borderRadius: '0.875rem', background: 'rgba(192,154,58,0.08)', border: '1px solid rgba(192,154,58,0.2)' }}
                                data-aos="fade-right"
                                data-aos-delay="300"
                            >
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: GOLD_T, marginBottom: '0.35rem', fontFamily: "'DM Sans', sans-serif" }}>
                                    Looking for quick answers?
                                </p>
                                <p style={{ fontSize: '0.775rem', color: '#94a3b8', marginBottom: '0.875rem', lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>
                                    Check our FAQ for answers to the most common questions.
                                </p>
                                <Link
                                    to="/faq"
                                    style={{ fontSize: '0.775rem', fontWeight: 600, color: GOLD_T, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    Browse FAQ →
                                </Link>
                            </div>
                        </div>

                        {/* Contact form */}
                        <div data-aos="fade-left">
                            {submitted ? (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    padding: '4rem 2rem',
                                    borderRadius: '1rem',
                                    background: DARK2,
                                    border: `1px solid ${DARK3}`,
                                }}>
                                    <div style={{
                                        width: '4rem',
                                        height: '4rem',
                                        borderRadius: '1rem',
                                        background: `rgba(192,154,58,0.12)`,
                                        border: `1px solid rgba(192,154,58,0.25)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.25rem',
                                    }}>
                                        <CheckCircle2 size={28} style={{ color: GOLD_T }} />
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: "'DM Sans', sans-serif" }}>
                                        Message Sent!
                                    </h3>
                                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '20rem', fontFamily: "'DM Sans', sans-serif" }}>
                                        Thanks for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", topic: "", message: "" }); }}
                                        style={{ fontSize: '0.875rem', fontWeight: 600, color: GOLD_T, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    style={{ padding: '2rem 2.25rem', borderRadius: '1rem', background: DARK2, border: `1px solid ${DARK3}`, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                                >
                                    <h2 className="rc-serif" style={{ fontSize: '1.6rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>
                                        Send us a <em style={{ color: GOLD_T, fontStyle: 'italic' }}>message</em>
                                    </h2>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={labelStyle}>Your Name</label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => set("name", e.target.value)}
                                                placeholder="Liaqat Ali"
                                                style={fieldStyle}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Email Address</label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => set("email", e.target.value)}
                                                placeholder="you@email.com"
                                                style={fieldStyle}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Topic</label>
                                        <select
                                            value={form.topic}
                                            onChange={(e) => set("topic", e.target.value)}
                                            style={{ ...fieldStyle, cursor: 'pointer' }}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            required
                                        >
                                            <option value="" disabled>Select a topic...</option>
                                            {topics.map((t) => (
                                                <option key={t} value={t} style={{ background: DARK2, color: '#f8fafc' }}>{t}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Message</label>
                                        <textarea
                                            value={form.message}
                                            onChange={(e) => set("message", e.target.value)}
                                            rows={5}
                                            placeholder="Tell us how we can help..."
                                            style={{ ...fieldStyle, resize: 'none' }}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rc-btn"
                                        style={{ borderRadius: '8px', width: '100%', justifyContent: 'center', opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                                    >
                                        {loading ? (
                                            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                                        ) : (
                                            <><Send size={15} /> Send Message</>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default ContactPage;