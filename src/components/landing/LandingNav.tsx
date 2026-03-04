import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";

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
        <header
            className={`fixed top-0 inset-x-0 z-50 animate-slide-in-top transition-all duration-300 ${
                scrolled
                    ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link
                        to="/welcome"
                        className="flex items-center gap-2.5 shrink-0 animate-fade-in"
                        style={{ animationDelay: "100ms" }}
                    >
                        <div className="size-8 rounded-lg bg-primary-600 flex items-center justify-center transition-transform duration-200 hover:scale-110">
                            <FileText size={16} className="text-white" />
                        </div>
                        <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                            Resu<span className="text-primary-600">Craft</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                style={{ animationDelay: `${i * 60 + 150}ms` }}
                                className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors animate-fade-in-up
                                    hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-slate-800
                                    ${isActive(link.href)
                                        ? "text-primary-600 dark:text-primary-400"
                                        : "text-gray-600 dark:text-slate-300"
                                    }`}
                            >
                                {link.label}
                                {/* Active underline */}
                                {isActive(link.href) && (
                                    <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary-600 dark:bg-primary-400 animate-scale-in" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3 animate-fade-in" style={{ animationDelay: "500ms" }}>
                        <Link
                            to="/auth/sign-in"
                            className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/auth/sign-up"
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-all shadow-sm hover:shadow-primary-600/30 hover:shadow-md hover:-translate-y-px"
                        >
                            Get Started Free
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden p-2 rounded-md text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors animate-fade-in"
                        style={{ animationDelay: "200ms" }}
                        aria-label="Toggle menu"
                    >
                        <span className={`block transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`}>
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile menu — CSS-animated drawer */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
                    bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800
                    ${open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="px-4 py-3 space-y-1">
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.label}
                            to={link.href}
                            style={{
                                transitionDelay: open ? `${i * 40}ms` : "0ms",
                                transform: open ? "translateX(0)" : "translateX(-10px)",
                                opacity: open ? 1 : 0,
                                transition: "transform 0.25s ease, opacity 0.25s ease",
                            }}
                            className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                                hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-slate-800
                                ${isActive(link.href)
                                    ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10"
                                    : "text-gray-700 dark:text-slate-200"
                                }`}
                        >
                            {link.label}
                            {isActive(link.href) && (
                                <span className="size-1.5 rounded-full bg-primary-500" />
                            )}
                        </Link>
                    ))}
                    <div
                        className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-2"
                        style={{
                            transitionDelay: open ? `${navLinks.length * 40}ms` : "0ms",
                            transform: open ? "translateX(0)" : "translateX(-10px)",
                            opacity: open ? 1 : 0,
                            transition: "transform 0.25s ease, opacity 0.25s ease",
                        }}
                    >
                        <Link
                            to="/auth/sign-in"
                            className="px-3 py-2.5 text-sm font-medium text-center text-gray-700 dark:text-slate-200 rounded-md border border-gray-200 dark:border-slate-700 hover:border-primary-400 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/auth/sign-up"
                            className="px-3 py-2.5 text-sm font-semibold text-center rounded-md bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default LandingNav;
