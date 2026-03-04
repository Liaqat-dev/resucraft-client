import React from "react";
import {Link} from "react-router-dom";
import {Github, Linkedin, Mail, Twitter} from "lucide-react";
import logo from '@src/assets/images/logo.png'

const productLinks = [
    {label: "Features", href: "/features"},
    {label: "How It Works", href: "/welcome#how-it-works"},
    {label: "Templates", href: "/"},
    {label: "Resume Builder", href: "/builder"},
    {label: "Pricing", href: "/page/pricing"},
];

const resourceLinks = [
    {label: "FAQ", href: "/faq"},
    {label: "Contact Us", href: "/contact"},
    {label: "Help Center", href: "/help-center"},
    {label: "About Us", href: "/about"},
    {label: "Privacy Policy", href: "/page/privacy-policy"},
];

const socialLinks = [
    {icon: <Twitter size={16}/>, href: "#", label: "Twitter"},
    {icon: <Linkedin size={16}/>, href: "#", label: "LinkedIn"},
    {icon: <Github size={16}/>, href: "#", label: "GitHub"},
    {icon: <Mail size={16}/>, href: "/contact", label: "Email"},
];

const Footer: React.FC = () => (
    <footer className="bg-primary  dark:bg-slate-950 text-slate-400 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800">
            {/* Top section */}
            <div className="py-14 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Brand */}
                <div className="lg:col-span-1">
                    <Link to="/" className="flex items-center gap-2.5 mb-4">
                        {/*<div className="size-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">*/}
                        {/*  <FileText size={16} className="text-white" />*/}
                        {/*</div>*/}
                        {/*<span className="text-base font-bold text-white">*/}
                        {/*              Resu<span className="text-primary-400">Craft</span>*/}
                        {/*          </span>*/}
                        <img className={'h-12'} src={logo} height={18} alt={'logo'}/>
                    </Link>
                    <p className="text-sm leading-relaxed text-slate-400 mb-5">
                        AI-powered resume builder designed to get you through ATS filters and
                        land interviews faster.
                    </p>
                    {/* Social links */}
                    <div className="flex items-center gap-2">
                        {socialLinks.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                aria-label={s.label}
                                className="size-8 rounded-lg bg-slate-800 hover:bg-primary-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Product */}
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                        Product
                    </h3>
                    <ul className="space-y-2.5">
                        {productLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    to={link.href}
                                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                        Resources
                    </h3>
                    <ul className="space-y-2.5">
                        {resourceLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    to={link.href}
                                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter CTA */}
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                        Stay Updated
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                        Get tips on resume writing, interview prep, and career growth.
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-3 py-2 text-sm rounded-lg bg-primary dark:bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
                        />
                        <button
                            className="shrink-0 px-3 py-2 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-800"/>

            {/* Bottom section */}
            <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                    © {new Date().getFullYear()} ResuCraft. Built by Alishba Ramzan & Liaqat Ali —
                    Lahore Garrison University.
                </p>
                <div className="flex items-center gap-5 text-xs text-slate-500">
                    <Link to="/page/privacy-policy" className="hover:text-slate-300 transition-colors">
                        Privacy Policy
                    </Link>
                    <span className="text-slate-700">·</span>
                    <Link to="/faq" className="hover:text-slate-300 transition-colors">
                        FAQ
                    </Link>
                    <span className="text-slate-700">·</span>
                    <Link to="/contact" className="hover:text-slate-300 transition-colors">
                        Contact
                    </Link>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;

