import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const GOLD = "#C09A3A";
const DARK = "#0F172A";

const productLinks = [
    { label: "Features", href: "/features" },
    { label: "How It Works", href: "/welcome#how-it-works" },
    { label: "Templates", href: "/" },
    { label: "Resume Builder", href: "/builder" },
    { label: "Pricing", href: "/page/pricing" },
];

const resourceLinks = [
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Help Center", href: "/help-center" },
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/page/privacy-policy" },
];

const socialLinks = [
    { icon: <Twitter size={15} />, href: "#", label: "Twitter" },
    { icon: <Linkedin size={15} />, href: "#", label: "LinkedIn" },
    { icon: <Github size={15} />, href: "#", label: "GitHub" },
    { icon: <Mail size={15} />, href: "/contact", label: "Email" },
];

const Footer: React.FC = () => (
    <footer style={{ background: DARK, borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
            {/* Top */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "2.5rem",
                padding: "3.5rem 0 2.5rem",
            }}>
                {/* Brand col */}
                <div style={{ gridColumn: "span 1" }}>
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none", marginBottom: "1rem" }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                            background: `linear-gradient(135deg, ${GOLD}, #8B6914)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                <rect x="4" y="3" width="16" height="18" rx="2" />
                                <line x1="8" y1="8" x2="16" y2="8" />
                                <line x1="8" y1="12" x2="13" y2="12" />
                                <line x1="8" y1="16" x2="11" y2="16" />
                            </svg>
                        </div>
                        <span className="rc-serif" style={{ fontSize: "1.25rem", fontWeight: 600, color: "#f8fafc", letterSpacing: "0.04em" }}>
                            ResuCraft
                        </span>
                    </Link>
                    <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1.25rem", maxWidth: 220 }}>
                        AI-powered resume builder designed to get you through ATS filters and land interviews faster.
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        {socialLinks.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                aria-label={s.label}
                                style={{
                                    width: 32, height: 32, borderRadius: 8, display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    background: "#1e293b", color: "#64748b",
                                    border: "1px solid #334155",
                                    transition: "background 0.2s, color 0.2s, border-color 0.2s",
                                    textDecoration: "none",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = `${GOLD}20`;
                                    e.currentTarget.style.color = GOLD;
                                    e.currentTarget.style.borderColor = `${GOLD}50`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#1e293b";
                                    e.currentTarget.style.color = "#64748b";
                                    e.currentTarget.style.borderColor = "#334155";
                                }}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Product */}
                <div>
                    <h3 style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "1rem", fontFamily: "'DM Sans', sans-serif" }}>
                        Product
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {productLinks.map((link) => (
                            <li key={link.label}>
                                <Link to={link.href} style={{
                                    fontSize: "0.82rem", color: "#64748b", textDecoration: "none",
                                    transition: "color 0.15s", fontFamily: "'DM Sans', sans-serif",
                                }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#D4B06A")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "1rem", fontFamily: "'DM Sans', sans-serif" }}>
                        Resources
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {resourceLinks.map((link) => (
                            <li key={link.label}>
                                <Link to={link.href} style={{
                                    fontSize: "0.82rem", color: "#64748b", textDecoration: "none",
                                    transition: "color 0.15s", fontFamily: "'DM Sans', sans-serif",
                                }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#D4B06A")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "1rem", fontFamily: "'DM Sans', sans-serif" }}>
                        Stay Updated
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.875rem", lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>
                        Tips on resume writing, interview prep, and career growth.
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            style={{
                                flex: 1, padding: "0.5rem 0.75rem", borderRadius: 8,
                                background: "#1e293b", border: "1px solid #334155",
                                color: "#f8fafc", fontSize: "0.8rem", outline: "none",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        />
                        <button style={{
                            padding: "0.5rem 0.875rem", borderRadius: 8, flexShrink: 0,
                            background: `linear-gradient(135deg, ${GOLD}, #8B6914)`,
                            border: "none", color: "#fff", fontSize: "0.8rem", fontWeight: 600,
                            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                            transition: "opacity 0.15s",
                        }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                            Join
                        </button>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#1e293b" }} />

            {/* Bottom */}
            <div style={{
                padding: "1.5rem 0",
                display: "flex", flexWrap: "wrap", alignItems: "center",
                justifyContent: "space-between", gap: "0.75rem",
            }}>
                <p style={{ fontSize: "0.72rem", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
                    © {new Date().getFullYear()} ResuCraft. Built by Alishba Ramzan &amp; Liaqat Ali — Lahore Garrison University.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                    {[
                        { label: "Privacy Policy", href: "/page/privacy-policy" },
                        { label: "FAQ", href: "/faq" },
                        { label: "Contact", href: "/contact" },
                    ].map((link, i) => (
                        <React.Fragment key={link.label}>
                            {i > 0 && <span style={{ color: "#334155", fontSize: "0.7rem" }}>·</span>}
                            <Link to={link.href} style={{
                                fontSize: "0.72rem", color: "#475569", textDecoration: "none",
                                transition: "color 0.15s", fontFamily: "'DM Sans', sans-serif",
                            }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
                            >
                                {link.label}
                            </Link>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;