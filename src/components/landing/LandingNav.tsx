import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const GOLD = "#C09A3A";
const DARK = "#0F172A";

const navLinks = [
    { label: "Features", href: "/features" },
    { label: "How It Works", href: "/welcome#how-it-works" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
];

const LandingNav: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => setOpen(false), [location]);

    const isActive = (href: string) => {
        const path = href.includes("#") ? href.split("#")[0] : href;
        return location.pathname === path;
    };

    return (
        <>
            <style>{`
                .rc-nav-link {
                    position: relative;
                    padding: 0.4rem 0.75rem;
                    font-size: 0.85rem;
                    font-weight: 500;
                    border-radius: 6px;
                    text-decoration: none;
                    transition: color 0.15s, background 0.15s;
                    font-family: 'DM Sans', sans-serif;
                    color: #94a3b8;
                    white-space: nowrap;
                }
                .rc-nav-link:hover { color: #f8fafc; background: rgba(255,255,255,0.05); }
                .rc-nav-link.active { color: #D4B06A; }
                .rc-nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: 2px;
                    left: 0.75rem;
                    right: 0.75rem;
                    height: 1.5px;
                    border-radius: 99px;
                    background: #C09A3A;
                }
                .rc-nav-signin {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #94a3b8;
                    text-decoration: none;
                    padding: 0.38rem 0.65rem;
                    border-radius: 6px;
                    transition: color 0.15s, background 0.15s;
                    font-family: 'DM Sans', sans-serif;
                }
                .rc-nav-signin:hover { color: #f8fafc; background: rgba(255,255,255,0.05); }
            `}</style>
            <header
                style={{
                    position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
                    transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
                    background: scrolled ? "rgba(15,23,42,0.96)" : "transparent",
                    borderBottom: scrolled ? "1px solid #1e293b" : "1px solid transparent",
                    backdropFilter: scrolled ? "blur(12px)" : "none",
                    boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.3)" : "none",
                }}
            >
                <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "4rem" }}>

                        {/* Logo */}
                        <Link to="/welcome" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none", flexShrink: 0 }}>
                            <div style={{
                                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                                background: `linear-gradient(135deg, ${GOLD}, #8B6914)`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                    <rect x="4" y="3" width="16" height="18" rx="2" />
                                    <line x1="8" y1="8" x2="16" y2="8" />
                                    <line x1="8" y1="12" x2="13" y2="12" />
                                    <line x1="8" y1="16" x2="11" y2="16" />
                                </svg>
                            </div>
                            <span className="rc-serif" style={{
                                fontSize: "1.35rem", fontWeight: 600,
                                color: "#f8fafc", letterSpacing: "0.04em",
                            }}>
                                ResuCraft
                            </span>
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex" style={{ alignItems: "center", gap: "0.15rem" }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className={`rc-nav-link${isActive(link.href) ? " active" : ""}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop CTAs */}
                        <div className="hidden md:flex" style={{ alignItems: "center", gap: "0.5rem" }}>
                            <Link to="/auth/sign-in" className="rc-nav-signin">Sign in</Link>
                            <Link to="/auth/sign-up" className="rc-btn" style={{ padding: "0.38rem 1rem", fontSize: "0.82rem" }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
                                    <rect x="4" y="3" width="16" height="18" rx="2" />
                                    <line x1="8" y1="8" x2="16" y2="8" />
                                    <line x1="8" y1="12" x2="13" y2="12" />
                                    <line x1="8" y1="16" x2="11" y2="16" />
                                </svg>
                                <span style={{ position: "relative", zIndex: 1 }}>Start crafting</span>
                                <span style={{ color: GOLD, position: "relative", zIndex: 1, fontSize: "0.9rem" }}>↗</span>
                            </Link>
                        </div>

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden"
                            style={{
                                padding: "0.5rem", borderRadius: 8, border: "1px solid #334155",
                                background: "transparent", color: "#94a3b8", cursor: "pointer",
                                transition: "background 0.15s",
                            }}
                        >
                            {open ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div
                    className="md:hidden"
                    style={{
                        overflow: "hidden",
                        maxHeight: open ? "420px" : "0",
                        opacity: open ? 1 : 0,
                        transition: "max-height 0.3s ease, opacity 0.3s ease",
                        background: "rgba(15,23,42,0.98)",
                        borderTop: "1px solid #1e293b",
                    }}
                >
                    <div style={{ padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "0.65rem 0.75rem", borderRadius: 8,
                                    fontSize: "0.875rem", fontWeight: 500,
                                    color: isActive(link.href) ? "#D4B06A" : "#94a3b8",
                                    background: isActive(link.href) ? "rgba(192,154,58,0.08)" : "transparent",
                                    textDecoration: "none",
                                    transitionDelay: open ? `${i * 35}ms` : "0ms",
                                    transform: open ? "translateX(0)" : "translateX(-8px)",
                                    transition: "transform 0.22s ease, opacity 0.22s ease, color 0.15s",
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
                                )}
                            </Link>
                        ))}
                        <div style={{
                            paddingTop: "0.75rem", borderTop: "1px solid #1e293b",
                            display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem",
                        }}>
                            <Link to="/auth/sign-in" style={{
                                padding: "0.65rem", textAlign: "center", fontSize: "0.875rem",
                                fontWeight: 500, borderRadius: 8, border: "1px solid #334155",
                                color: "#94a3b8", textDecoration: "none",
                                fontFamily: "'DM Sans', sans-serif",
                            }}>
                                Sign in
                            </Link>
                            <Link to="/auth/sign-up" className="rc-btn" style={{ justifyContent: "center" }}>
                                <span style={{ position: "relative", zIndex: 1 }}>Start crafting</span>
                                <span style={{ color: GOLD, position: "relative", zIndex: 1 }}>↗</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default LandingNav;