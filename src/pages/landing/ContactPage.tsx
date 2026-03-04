import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
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

const inputCls =
    "w-full px-4 py-3 text-sm rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white " +
    "border-gray-200 dark:border-slate-700 placeholder-gray-400 dark:placeholder-slate-500 " +
    "focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors";

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
                        Get in Touch
                    </h1>
                    <p
                        className="text-slate-400 text-sm leading-relaxed animate-fade-in-up"
                        style={{ animationDelay: "160ms" }}
                    >
                        Have a question, feedback, or just want to say hi? We'd love to hear
                        from you.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 md:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Info sidebar */}
                        <div className="space-y-5">
                            {contactInfo.map((c, i) => (
                                <div
                                    key={c.label}
                                    className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow duration-200"
                                    data-aos="fade-right"
                                    data-aos-delay={i * 100}
                                >
                                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${c.accent}`}>
                                        {c.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-0.5">
                                            {c.label}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {c.value}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                                            {c.sub}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* FAQ link */}
                            <div
                                className="p-5 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20"
                                data-aos="fade-right"
                                data-aos-delay="300"
                            >
                                <p className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-1">
                                    Looking for quick answers?
                                </p>
                                <p className="text-xs text-primary-600/70 dark:text-primary-400/70 mb-3 leading-relaxed">
                                    Check our FAQ for answers to the most common questions.
                                </p>
                                <Link
                                    to="/faq"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all"
                                >
                                    Browse FAQ <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>

                        {/* Contact form */}
                        <div className="lg:col-span-2" data-aos="fade-left">
                            {submitted ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                                    <div className="size-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-5 animate-scale-in">
                                        <CheckCircle2 size={28} className="text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-6 max-w-xs">
                                        Thanks for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", topic: "", message: "" }); }}
                                        className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5"
                                >
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Send us a message
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => set("name", e.target.value)}
                                                placeholder="Liaqat Ali"
                                                className={inputCls}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => set("email", e.target.value)}
                                                placeholder="you@email.com"
                                                className={inputCls}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                                            Topic
                                        </label>
                                        <select
                                            value={form.topic}
                                            onChange={(e) => set("topic", e.target.value)}
                                            className={inputCls}
                                            required
                                        >
                                            <option value="" disabled>Select a topic...</option>
                                            {topics.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                                            Message
                                        </label>
                                        <textarea
                                            value={form.message}
                                            onChange={(e) => set("message", e.target.value)}
                                            rows={5}
                                            placeholder="Tell us how we can help..."
                                            className={`${inputCls} resize-none`}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <><Loader2 size={16} className="animate-spin" /> Sending...</>
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
