import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useLandingTheme } from "@hooks/useLandingTheme";
import { changeLayoutMode } from "@src/slices/thunk";
import { LAYOUT_MODE_TYPES } from "@src/components/constants/layout";
import { AppDispatch } from "@src/slices/store.ts";
import logo from "@assets/images/main-logo.png";
import logoWhite from "@assets/images/logo-white.png";
import Profile from "@layout/topBar/profile.tsx";
import { useAuth } from "@hooks/useAuth.ts";

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
    const theme = useLandingTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();

    const toggleTheme = () => {
        dispatch(changeLayoutMode(
            theme.isDark ? LAYOUT_MODE_TYPES.LIGHT : LAYOUT_MODE_TYPES.DARK
        ));
    };

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

    const navBg = theme.isDark
        ? `rgba(${theme.bg === '#000000' ? '0,0,0' : '15,23,42'},0.96)`
        : `rgba(255,255,255,0.96)`;

    const mobileBg = theme.isDark
        ? `rgba(${theme.bg === '#000000' ? '0,0,0' : '15,23,42'},0.98)`
        : `rgba(255,255,255,0.98)`;

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
                    color: ${theme.textSub};
                    white-space: nowrap;
                }
                .rc-nav-link:hover { color: ${theme.text}; background: ${theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
                .rc-nav-link.active { color: ${theme.accentLight}; }
                .rc-nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: 2px;
                    left: 0.75rem;
                    right: 0.75rem;
                    height: 1.5px;
                    border-radius: 99px;
                    background: ${theme.accent};
                }
                .rc-nav-signin {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: ${theme.textSub};
                    text-decoration: none;
                    padding: 0.38rem 0.65rem;
                    border-radius: 6px;
                    transition: color 0.15s, background 0.15s;
                    font-family: 'DM Sans', sans-serif;
                }
                .rc-nav-signin:hover { color: ${theme.text}; background: ${theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
            `}</style>
            <header
                style={{
                    position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
                    transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
                    background: scrolled ? navBg : "transparent",
                    borderBottom: scrolled ? `1px solid ${theme.border}` : "1px solid transparent",
                    backdropFilter: scrolled ? "blur(12px)" : "none",
                    boxShadow: scrolled ? `0 2px 20px rgba(0,0,0,0.3)` : "none",
                }}
            >
                <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "4rem" }}>
                        <Link to="/">
                            <img
                                src={logo}
                                aria-label="Read more about Seminole tax hike"
                                alt="logo"
                                className="h-14 group-data-[layout=modern]:hidden inline-block dark:hidden"
                                height={164}

                            />
                            <img
                                src={logoWhite}
                                aria-label="Read more about Seminole tax hike"
                                alt="logoWhite"
                                className="h-14 hidden dark:inline-block group-data-[layout=modern]:hidden"
                                height={24}

                            />
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
                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                title={theme.isDark ? "Switch to light mode" : "Switch to dark mode"}
                                style={{
                                    width: 34, height: 34, borderRadius: 8, border: `1px solid ${theme.border}`,
                                    background: "transparent", color: theme.textSub, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "background 0.15s, color 0.15s, border-color 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = `${theme.accent}18`;
                                    e.currentTarget.style.color = theme.accent;
                                    e.currentTarget.style.borderColor = `${theme.accent}50`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = theme.textSub;
                                    e.currentTarget.style.borderColor = theme.border;
                                }}
                            >
                                {theme.isDark ? <Sun size={15} /> : <Moon size={15} />}
                            </button>
                            <Profile />
                        </div>

                        {/* Mobile controls */}
                        <div className="flex md:hidden" style={{  alignItems: "center", gap: "0.4rem" }}>
                            <button
                                onClick={toggleTheme}
                                title={theme.isDark ? "Switch to light mode" : "Switch to dark mode"}
                                style={{
                                    width: 34, height: 34, borderRadius: 8, border: `1px solid ${theme.border}`,
                                    background: "transparent", color: theme.textSub, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "background 0.15s, color 0.15s",
                                }}
                            >
                                {theme.isDark ? <Sun size={15} /> : <Moon size={15} />}
                            </button>
                            <button
                                onClick={() => setOpen(!open)}
                                style={{
                                    padding: "0.5rem", borderRadius: 8, border: `1px solid ${theme.border}`,
                                    background: "transparent", color: theme.textSub, cursor: "pointer",
                                    transition: "background 0.15s",
                                }}
                            >
                                {open ? <X size={18} /> : <Menu size={18} />}
                            </button>
                        </div>
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
                        background: mobileBg,
                        borderTop: `1px solid ${theme.border}`,
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
                                    color: isActive(link.href) ? theme.accentLight : theme.textSub,
                                    background: isActive(link.href) ? `${theme.accent}14` : "transparent",
                                    textDecoration: "none",
                                    transitionDelay: open ? `${i * 35}ms` : "0ms",
                                    transform: open ? "translateX(0)" : "translateX(-8px)",
                                    transition: "transform 0.22s ease, opacity 0.22s ease, color 0.15s",
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent }} />
                                )}
                            </Link>
                        ))}
                        <div style={{
                            paddingTop: "0.75rem", borderTop: `1px solid ${theme.border}`,
                            display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem",
                        }}>
                            {user ? (
                                <Link to="/dashboard" style={{
                                    padding: "0.65rem", textAlign: "center", fontSize: "0.875rem",
                                    fontWeight: 600, borderRadius: 8,
                                    background: "linear-gradient(135deg, #0F172A 0%, #1e293b 100%)",
                                    color: "#fff", textDecoration: "none",
                                    border: "1px solid #334155",
                                    fontFamily: "'DM Sans', sans-serif",
                                }}>
                                    Go to Dashboard ↗
                                </Link>
                            ) : (
                                <>
                                    <Link to="/auth/sign-in" style={{
                                        padding: "0.65rem", textAlign: "center", fontSize: "0.875rem",
                                        fontWeight: 500, borderRadius: 8, border: `1px solid ${theme.border}`,
                                        color: theme.textSub, textDecoration: "none",
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}>
                                        Sign in
                                    </Link>
                                    <Link to="/auth/sign-up" className="rc-btn" style={{ justifyContent: "center" }}>
                                        <span style={{ position: "relative", zIndex: 1 }}>Start crafting</span>
                                        <span style={{ color: theme.accent, position: "relative", zIndex: 1 }}>↗</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default LandingNav;
