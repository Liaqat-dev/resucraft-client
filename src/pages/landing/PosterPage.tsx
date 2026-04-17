import React, { useRef } from "react";
import {
    BarChart2, Bot, BrainCircuit, ClipboardList, Cpu,
    Database, Download, FileText, Globe, GraduationCap,
    Headphones, LayoutTemplate, Lightbulb, Mic, Palette,
    Server, Shield, Sparkles, Target, UserCircle,
    Volume2, Waves, Zap,
} from "lucide-react";
import lguLogo from "@assets/images/lgu-logo.jpeg";
import logoWhite from "@assets/images/logo (3).png";
import mock from '@assets/images/mock.png'

/* ─────────────────────────────────────────────────────────────────
   Light theme design tokens
   Cormorant Garamond headings · DM Sans body · gold + charcoal
───────────────────────────────────────────────────────────────── */
const T = {
    bg:           "#f9fafb",
    bgAlt:        "#f1f5f9",
    bgDeep:       "#e8eef6",
    card:         "#ffffff",
    border:       "#e2e8f0",
    borderAccent: "rgba(192,154,58,0.45)",
    accent:       "#C09A3A",
    accentLight:  "#A07820",   // darker gold — readable on white
    accentDark:   "#7A5C10",
    accentPale:   "rgba(192,154,58,0.1)",
    text:         "#0f172a",
    textSub:      "#334155",
    textMuted:    "#64748b",
    teal:         "#0891b2",
    tealPale:     "rgba(8,145,178,0.1)",
    purple:       "#7c3aed",
    purplePale:   "rgba(124,58,237,0.1)",
    blue:         "#2563eb",
    green:        "#16a34a",
    greenPale:    "rgba(22,163,74,0.1)",
    rose:         "#e11d48",
};

/* ── Canvas — 2 ft × 5 ft → ratio 2:5 = 0.4  (1000 / 2500 = 0.4 ✓) */
const POSTER_W = 1000;
const POSTER_H = 2500;
const PAD = 46;

/* ─────────────── Helpers ─────────────── */
const SectionHead: React.FC<{ label: string; icon?: React.ReactNode }> = ({ label, icon }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${T.accent}70, transparent)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {icon && <span style={{ color: T.accent, display: "flex" }}>{icon}</span>}
            <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10.5,
                fontWeight: 800,
                color: T.accentLight,
                textTransform: "uppercase",
                letterSpacing: "0.17em",
            }}>{label}</span>
        </div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${T.accent}70)` }} />
    </div>
);

const ScoreBar: React.FC<{ label: string; score: number; color: string }> = ({ label, score, color }) => (
    <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: T.textMuted, fontWeight: 600 }}>{label}</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 800, color }}>{score}/10</span>
        </div>
        <div style={{ height: 5, background: "rgba(0,0,0,0.07)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
                height: "100%", width: `${score * 10}%`,
                background: `linear-gradient(90deg, ${color}99, ${color})`,
                borderRadius: 999,
            }} />
        </div>
    </div>
);

/* ─── Laptop mockup (dark interior — realistic contrast) ─── */
const LaptopMockup: React.FC = () => (
    <div style={{ position: "relative", width: "100%" }}>
        <div style={{
            background: "linear-gradient(145deg,#111e36,#0c1526)",
            border: "1px solid #1e3050",
            borderRadius: "10px 10px 0 0",
            padding: "8px 8px 0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
        }}>
            {/* Chrome */}
            <div style={{
                background: "#08111e", borderRadius: "7px 7px 0 0",
                padding: "7px 10px", display: "flex", alignItems: "center", gap: 8,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
                <div style={{ display: "flex", gap: 5 }}>
                    {["#ef4444","#f59e0b","#22c55e"].map((c, i) => (
                        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.85 }} />
                    ))}
                </div>
                <div style={{ flex: 1, height: 14, background: "rgba(255,255,255,0.07)", borderRadius: 999, display: "flex", alignItems: "center", paddingLeft: 10 }}>
                    <span style={{ fontSize: 8, color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>resucraft.app/builder</span>
                </div>
            </div>
            {/* App content */}
            <div style={{ display: "flex", height: 130, background: "#060d1a", overflow: "hidden" }}>
                <div style={{ width: 90, background: "#070e1c", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "8px 6px", flexShrink: 0 }}>
                    <div style={{ height: 10, background: "rgba(192,154,58,0.3)", borderRadius: 4, marginBottom: 8, width: "85%" }} />
                    {["Personal","Education","Experience","Skills","Projects","Certs"].map((s, i) => (
                        <div key={s} style={{
                            height: 7, marginBottom: 5,
                            background: i === 2 ? "rgba(192,154,58,0.35)" : "rgba(255,255,255,0.05)",
                            borderRadius: 3,
                            borderLeft: i === 2 ? "2px solid #C09A3A" : "none",
                        }}>
                            <div style={{ height: 3, width: `${[70,55,80,65,50,58][i]}%`, background: i === 2 ? "rgba(192,154,58,0.55)" : "rgba(255,255,255,0.12)", borderRadius: 2, margin: "2px 5px" }} />
                        </div>
                    ))}
                </div>
                <div style={{ flex: 1.2, padding: 10, borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ height: 8, background: "rgba(8,145,178,0.3)", borderRadius: 3, marginBottom: 8, width: "55%" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 6 }}>
                        {[80,60,90,70].map((w, i) => (
                            <div key={i} style={{ height: 14, background: "rgba(255,255,255,0.05)", borderRadius: 3, border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", paddingLeft: 5 }}>
                                <div style={{ height: 3, width: `${w}%`, background: "rgba(255,255,255,0.14)", borderRadius: 2 }} />
                            </div>
                        ))}
                    </div>
                    <div style={{ height: 20, background: "linear-gradient(135deg,rgba(192,154,58,0.25),rgba(8,145,178,0.15))", borderRadius: 5, border: "1px solid rgba(192,154,58,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                        <Sparkles size={8} color="#D4B06A" />
                        <span style={{ fontSize: 7.5, color: "#D4B06A", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Generate with AI</span>
                    </div>
                    <div style={{ display: "flex", gap: 3, marginTop: 5 }}>
                        {[{l:"ATS",c:"#22c55e"},{l:"Keywords",c:"#0891b2"},{l:"Format",c:"#C09A3A"}].map(x => (
                            <span key={x.l} style={{ fontSize: 6, color: x.c, background: `${x.c}18`, border: `1px solid ${x.c}30`, borderRadius: 999, padding: "2px 5px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>{x.l} ✓</span>
                        ))}
                    </div>
                </div>
                <div style={{ flex: 1, padding: 8 }}>
                    <div style={{ background: "white", borderRadius: 4, height: "100%", padding: "8px 7px", display: "flex", flexDirection: "column", gap: 3 }}>
                        <div style={{ height: 9, background: "#1e293b", borderRadius: 2, width: "65%", margin: "0 auto" }} />
                        <div style={{ height: 5, background: "#3b82f6", borderRadius: 2, width: "40%", margin: "0 auto" }} />
                        <div style={{ height: 1, background: "#e2e8f0", margin: "2px 0" }} />
                        <div style={{ height: 5, background: "#475569", borderRadius: 2, width: "30%" }} />
                        {[75,60,85,55,70].map((w,i) => <div key={i} style={{ height: 4, background: "#94a3b8", borderRadius: 1, width: `${w}%` }} />)}
                        <div style={{ height: 1, background: "#e2e8f0", margin: "1px 0" }} />
                        <div style={{ height: 5, background: "#475569", borderRadius: 2, width: "35%" }} />
                        {[65,50,80].map((w,i) => <div key={i} style={{ height: 4, background: "#94a3b8", borderRadius: 1, width: `${w}%` }} />)}
                    </div>
                </div>
            </div>
        </div>
        <div style={{ height: 10, background: "linear-gradient(180deg,#14213a,#0f1a2e)", borderRadius: "0 0 4px 4px", margin: "0 -4px" }} />
        <div style={{ height: 5, background: "linear-gradient(180deg,#0b1422,#08101a)", borderRadius: "0 0 10px 10px", margin: "0 -16px" }} />
    </div>
);

/* ─── Interview chat (dark — visual contrast on light poster) ─── */
const InterviewMockup: React.FC = () => (
    <div style={{
        background: "linear-gradient(145deg,#0f1829,#080f1e)",
        border: "1px solid rgba(124,58,237,0.35)",
        borderRadius: 12, overflow: "hidden",
        boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
        height: 160, display: "flex", flexDirection: "column",
    }}>
        <div style={{ padding: "9px 13px", background: "rgba(124,58,237,0.2)", borderBottom: "1px solid rgba(124,58,237,0.22)", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#5b21b6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={13} color="white" />
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>AI Interview Coach</p>
                <p style={{ margin: 0, fontSize: 8, color: "#00c9be", fontFamily: "'DM Sans', sans-serif" }}>● Live · Phase 3: Behavioral</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {[3,6,4,8,5,7,3].map((h,i) => <div key={i} style={{ width: 2, height: h+4, borderRadius: 1, background: "#7c3aed", opacity: 0.75 }} />)}
                <Mic size={8} color="#7c3aed" style={{ marginLeft: 3 }} />
            </div>
        </div>
        <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6, flex: 1, overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#5b21b6)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={8} color="white" /></div>
                <div style={{ background: "rgba(124,58,237,0.14)", border: "1px solid rgba(124,58,237,0.24)", borderRadius: "0 9px 9px 9px", padding: "5px 9px", maxWidth: "78%" }}>
                    <p style={{ margin: 0, fontSize: 8, color: "#94a3b8", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>Describe a time you had to make a critical technical decision under pressure. What was your process?</p>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ background: "rgba(192,154,58,0.13)", border: "1px solid rgba(192,154,58,0.3)", borderRadius: "9px 0 9px 9px", padding: "5px 9px", maxWidth: "80%" }}>
                    <p style={{ margin: 0, fontSize: 8, color: "#94a3b8", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>I built a risk matrix and chose dual-write — zero downtime, 40% fewer errors in production.</p>
                </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "linear-gradient(135deg,#0891b2,#0e7490)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Lightbulb size={8} color="white" /></div>
                <div style={{ background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.22)", borderRadius: "0 9px 9px 9px", padding: "5px 9px", maxWidth: "78%" }}>
                    <p style={{ margin: 0, fontSize: 7.5, color: "#00c9be", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>✓ Strong STAR response</p>
                    <p style={{ margin: 0, fontSize: 7.5, color: "#64748b", lineHeight: 1.45, fontFamily: "'DM Sans', sans-serif" }}>Good use of metrics. Expand on team alignment.</p>
                </div>
            </div>
        </div>
    </div>
);

/* ─── Poster Inner ─── */
const PosterInner: React.FC = () => (
    <div id="resucraft-poster" style={{
        width: POSTER_W, height: POSTER_H,
        background: T.bg,
        position: "relative", overflow: "hidden",
        color: T.text, flexShrink: 0,
    }}>
        {/* ── Subtle tinted blobs on light bg ── */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", filter: "blur(100px)", background: "rgba(192,154,58,0.09)", top: -100, left: -100, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", filter: "blur(100px)", background: "rgba(8,145,178,0.07)", top: 600, right: -100, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", filter: "blur(90px)", background: "rgba(124,58,237,0.06)", top: 1300, left: -80, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", filter: "blur(90px)", background: "rgba(192,154,58,0.07)", top: 1900, right: -80, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", filter: "blur(80px)", background: "rgba(22,163,74,0.05)", bottom: 50, left: 80, pointerEvents: "none" }} />

        {/* ── Light dot grid ── */}
        <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px", opacity: 0.7,
        }} />

        {/* ── Top prismatic bar (thick, vivid) ── */}
        <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 5,
            background: `linear-gradient(90deg,${T.accentDark},${T.accent} 28%,${T.teal} 50%,${T.purple} 68%,${T.accent} 87%,${T.accentDark})`,
        }} />

        {/* ── CONTENT ── */}
        <div style={{
            position: "relative", zIndex: 1,
            padding: `30px ${PAD}px 0`,
            display: "flex", flexDirection: "column",
            height: "100%", boxSizing: "border-box",
        }}>

            {/* ─── 1. UNIVERSITY BADGE ─── */}
            <div style={{ textAlign: "center", marginBottom: 18 }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 9,
                    background: T.accentPale,
                    border: `1px solid ${T.borderAccent}`,
                    borderRadius: 999, padding: "6px 18px",
                }}>
                    <GraduationCap size={13} color={T.accentLight} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 700, color: T.accentLight, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Final Year Project · Lahore Garrison University · 2026
                    </span>
                </div>
            </div>

            {/* ─── 2. TITLE ─── */}
            <div style={{ textAlign: "center", marginBottom: 18 }}>
                <div>

                    <img
                        src={logoWhite}
                        alt="ResuCraft"
                        style={{
                            height: 200,
                            display: "inline-block",
                            marginBottom: 10,
                            objectFit: "contain",
                        }}
                    />
                </div>
                <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 92,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                    margin: 0,
                    display: "inline-block",
                    background: `linear-gradient(135deg, ${T.accentDark} 15%, ${T.accent} 50%, ${T.accentDark} 85%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                }}>ResuCraft</h1>
                <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    margin: "7px 0 0",
                    fontSize: 13,
                    color: T.teal,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                }}>AI-Powered Resume Builder &amp; Mock Interview Platform</p>
            </div>

            {/* ─── 3. TAGLINE ─── */}
            <div style={{
                textAlign: "center", marginBottom: 20,
                padding: "14px 28px",
                background: `linear-gradient(135deg,rgba(192,154,58,0.07),rgba(8,145,178,0.05))`,
                border: `1px solid ${T.borderAccent}`,
                borderRadius: 14,
            }}>
                <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 26,
                    fontWeight: 600,
                    fontStyle: "italic",
                    color: T.text,
                    lineHeight: 1.4,
                    margin: 0,
                }}>
                    "Craft Smarter Resumes.{" "}
                    <span style={{ color: T.accentLight }}>Prepare Smarter Interviews.</span>"
                </p>
            </div>

            {/* ─── 4. KEY FEATURES ─── */}
            <SectionHead label="Core Features" icon={<Zap size={11} />} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 20 }}>
                {[
                    { icon: <BrainCircuit size={18} />, title: "AI Resume Builder", desc: "Paste any job description — Gemini AI crafts a perfectly tailored, ATS-optimized resume in under 60 seconds with 50+ customizable templates.", color: T.accentLight, pale: T.accentPale, border: T.borderAccent },
                    { icon: <Mic size={18} />, title: "Live Voice Mock Interview", desc: "Real-time AI voice interviews via WebSocket. Gemini 2.5 Flash conducts structured 5-phase sessions with live speech-to-text transcription.", color: T.purple, pale: T.purplePale, border: "rgba(124,58,237,0.3)" },
                    { icon: <Target size={18} />, title: "ATS Optimization", desc: "Smart keyword matching and professional formatting ensure 60%+ higher resume pass-through rates across all major Applicant Tracking Systems.", color: T.teal, pale: T.tealPale, border: "rgba(8,145,178,0.3)" },
                    { icon: <Lightbulb size={18} />, title: "Instant AI Feedback", desc: "Post-interview report with 4-dimension scoring — Overall, Communication, Technical, Relevance — plus specific strengths and improvements.", color: T.green, pale: T.greenPale, border: "rgba(22,163,74,0.3)" },
                ].map(f => (
                    <div key={f.title} style={{
                        background: T.card,
                        border: `1px solid ${f.border}`,
                        borderRadius: 14,
                        padding: "13px 15px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        <div style={{ position: "absolute", top: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: f.pale, filter: "blur(16px)", pointerEvents: "none" }} />
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: f.pale, border: `1px solid ${f.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 8, position: "relative" }}>{f.icon}</div>
                        <p style={{ margin: "0 0 5px", fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.25 }}>{f.title}</p>
                        <p style={{ margin: 0, fontSize: 10, color: T.textMuted, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* ─── 5. UI MOCKUPS ─── */}
            <SectionHead label="Interface Preview" icon={<LayoutTemplate size={11} />} />
            <div >
               <img src={mock} alt={'dfd'}/>
            </div>

            {/* ─── 6. RESUME GENERATION STEPS ─── */}
            <SectionHead label="How to Generate Your Resume" icon={<Sparkles size={11} />} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                    { n: "Step 01", icon: <UserCircle size={22} />, label: "Build Your Profile", desc: "Add personal info, education, work experience, projects, skills, and certifications. ResuCraft stores everything securely.", color: T.accentLight, pale: T.accentPale, border: T.borderAccent },
                    { n: "Step 02", icon: <ClipboardList size={22} />, label: "Paste Job Description", desc: "Copy any JD from LinkedIn, Indeed, or a company site. Our AI parses every keyword and required skill automatically.", color: T.teal, pale: T.tealPale, border: "rgba(8,145,178,0.3)" },
                    { n: "Step 03", icon: <Palette size={22} />, label: "Select a Template", desc: "Browse 50+ ATS-friendly templates. Preview in real time as AI populates all sections with tailored, role-specific content.", color: T.purple, pale: T.purplePale, border: "rgba(124,58,237,0.3)" },
                    { n: "Step 04", icon: <Download size={22} />, label: "Download ATS Resume", desc: "Export as a polished PDF — keyword-matched, correctly formatted, guaranteed to pass ATS filters and reach human recruiters.", color: T.green, pale: T.greenPale, border: "rgba(22,163,74,0.3)" },
                ].map(s => (
                    <div key={s.n} style={{
                        position: "relative",
                        background: T.card,
                        borderRadius: 16,
                        border: `1px solid ${s.border}`,
                        padding: "14px 16px",
                        boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
                        overflow: "hidden",
                    }}>
                        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 0% 0%, ${s.pale}, transparent 55%)`, pointerEvents: "none" }} />
                        <div style={{ display: "inline-flex", alignItems: "center", background: s.pale, border: `1px solid ${s.border}`, borderRadius: 999, padding: "3px 10px", marginBottom: 9 }}>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 800, color: s.color, letterSpacing: "0.08em" }}>{s.n}</span>
                        </div>
                        <div style={{ color: s.color, marginBottom: 7 }}>{s.icon}</div>
                        <p style={{ margin: "0 0 5px", fontSize: 13.5, fontWeight: 700, color: T.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}>{s.label}</p>
                        <p style={{ margin: 0, fontSize: 10, color: T.textMuted, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
                    </div>
                ))}
            </div>

            {/* ─── 7. MOCK INTERVIEW ─── */}
            <SectionHead label="AI Mock Interview — Deep Dive" icon={<Headphones size={11} />} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>

                {/* 5 phases */}
                <div style={{ background: T.card, border: "1px solid rgba(124,58,237,0.25)", borderRadius: 14, padding: "13px 15px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -25, right: -25, width: 90, height: 90, borderRadius: "50%", background: T.purplePale, filter: "blur(20px)", pointerEvents: "none" }} />
                    <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: T.purple, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>5-Phase Structure</p>
                    {[
                        { n: "1", label: "Warm-up", sub: "Why this role, motivation" },
                        { n: "2", label: "Experience Deep-Dive", sub: "Projects, challenges, decisions" },
                        { n: "3", label: "Behavioral (STAR)", sub: "Past situations & outcomes" },
                        { n: "4", label: "Problem-Solving", sub: "Scenarios & trade-off analysis" },
                        { n: "5", label: "Technical", sub: "Stack-specific depth questions" },
                    ].map(ph => (
                        <div key={ph.n} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 7 }}>
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#5b21b6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 6px rgba(124,58,237,0.3)" }}>
                                <span style={{ fontSize: 8, fontWeight: 900, color: "white", fontFamily: "'DM Sans', sans-serif" }}>{ph.n}</span>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, color: T.text, fontFamily: "'DM Sans', sans-serif" }}>{ph.label}</p>
                                <p style={{ margin: 0, fontSize: 8.5, color: T.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{ph.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feedback report */}
                <div style={{ background: T.card, border: "1px solid rgba(8,145,178,0.25)", borderRadius: 14, padding: "13px 15px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", bottom: -25, left: -25, width: 90, height: 90, borderRadius: "50%", background: T.tealPale, filter: "blur(20px)", pointerEvents: "none" }} />
                    <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: T.teal, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>AI Feedback Report</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 12px", marginBottom: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `conic-gradient(${T.accent} 84%, #e2e8f0 0)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.bgAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: 10, fontWeight: 900, color: T.accentLight, fontFamily: "'DM Sans', sans-serif" }}>8.4</span>
                            </div>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, color: T.text, fontFamily: "'DM Sans', sans-serif" }}>Overall Score</p>
                            <p style={{ margin: 0, fontSize: 8.5, color: T.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Above average for this role</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        <ScoreBar label="Communication" score={9} color={T.blue} />
                        <ScoreBar label="Technical Depth" score={8} color={T.teal} />
                        <ScoreBar label="Answer Relevance" score={8} color={T.green} />
                    </div>
                    <div style={{ marginTop: 9, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            {["Strong metrics","STAR structure","Confident delivery"].map(s => (
                                <span key={s} style={{ fontSize: 8, color: T.green, background: T.greenPale, border: "1px solid rgba(22,163,74,0.25)", borderRadius: 999, padding: "2px 7px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>✓ {s}</span>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            {["Expand team impact","Add timeline context"].map(s => (
                                <span key={s} style={{ fontSize: 8, color: T.rose, background: "rgba(225,29,72,0.07)", border: "1px solid rgba(225,29,72,0.22)", borderRadius: 999, padding: "2px 7px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>↑ {s}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Voice tech pillars */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "13px 18px", marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                {[
                    { icon: <Volume2 size={16} />, label: "Live Voice", sub: "Bidirectional real-time audio", color: T.purple },
                    { icon: <Waves size={16} />, label: "Speech-to-Text", sub: "Auto candidate transcription", color: T.teal },
                    { icon: <Shield size={16} />, label: "JWT Auth", sub: "Secure WebSocket sessions", color: T.accentLight },
                    { icon: <BarChart2 size={16} />, label: "4 Score Dims", sub: "Detailed performance report", color: T.green },
                ].map(x => (
                    <div key={x.label} style={{ textAlign: "center" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${x.color}14`, border: `1px solid ${x.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: x.color, margin: "0 auto 7px" }}>{x.icon}</div>
                        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: T.text, fontFamily: "'DM Sans', sans-serif" }}>{x.label}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 8, color: T.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{x.sub}</p>
                    </div>
                ))}
            </div>

            {/* ─── 8. TECH STACK ─── */}
            <SectionHead label="Technology Stack" icon={<Cpu size={11} />} />
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex",alignItems:'center' ,flexWrap:'wrap', gap: 8, marginBottom: 9 }}>
                    {[
                        { l: "MongoDB", icon: <Database size={10} />, c: T.green },
                        { l: "Express.js", icon: <Server size={10} />, c: T.textSub },
                        { l: "React 19", icon: <Globe size={10} />, c: T.blue },
                        { l: "Node.js", icon: <Server size={10} />, c: "#15803d" },
                        { l: "Gemini 2.5 AI", icon: <Bot size={10} />, c: T.accentLight },
                        { l: "TypeScript", icon: <Cpu size={10} />, c: T.blue },
                        { l: "TailwindCSS v4", icon: <Palette size={10} />, c: T.teal },
                        { l: "Redux Toolkit", icon: <Zap size={10} />, c: T.purple },
                        { l: "JWT Auth", icon: <Shield size={10} />, c: T.accentLight },
                        { l: "WebSockets", icon: <Waves size={10} />, c: T.purple },
                        { l: "Puppeteer PDF", icon: <FileText size={10} />, c: T.teal },
                        { l: "ffmpeg Audio", icon: <Mic size={10} />, c: T.green },
                    ].map(t => (
                        <span key={t.l} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: t.c, background: `${t.c}0f`, border: `1px solid ${t.c}30`, borderRadius: 999, padding: "4px 11px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em" }}>
                            <span style={{ color: t.c, display: "flex" }}>{t.icon}</span>
                            {t.l}
                        </span>
                    ))}
                </div>
                {/* MERN row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "10px 14px", background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 11 }}>
                    {[{ label: "MongoDB", dot: T.green }, { label: "Express", dot: T.textSub }, { label: "React", dot: T.blue }, { label: "Node.js", dot: "#15803d" }].map((item, i) => (
                        <React.Fragment key={item.label}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.dot, boxShadow: `0 0 5px ${item.dot}60` }} />
                                <span style={{ fontSize: 10, fontWeight: 700, color: T.textSub, fontFamily: "'DM Sans', sans-serif" }}>{item.label}</span>
                            </div>
                            {i < 3 && <span style={{ color: T.textMuted, fontSize: 12, fontWeight: 300 }}>+</span>}
                        </React.Fragment>
                    ))}
                    <span style={{ color: T.textMuted }}>·</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, boxShadow: `0 0 5px ${T.accent}70` }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: T.textSub, fontFamily: "'DM Sans', sans-serif" }}>Gemini 2.5 Flash</span>
                    </div>
                </div>
            </div>

            {/* ─── 9. SUPERVISED BY ─── */}
            <div style={{ textAlign: "center", padding: "14px 22px", background: `linear-gradient(135deg,${T.accentPale},rgba(8,145,178,0.05))`, border: `1px solid ${T.borderAccent}`, borderRadius: 14, marginBottom: 18, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: T.accentPale, filter: "blur(28px)", pointerEvents: "none" }} />
                <p style={{ margin: "0 0 5px", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, color: T.textMuted, letterSpacing: "0.13em", textTransform: "uppercase" }}>Supervised By</p>
                <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, display: "inline-block", background: `linear-gradient(135deg, ${T.accentDark}, ${T.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>Dr. Maria Tariq</p>
                <p style={{ margin: "4px 0 0", fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.textMuted }}>Department of Computer Science · Lahore Garrison University</p>
            </div>

            {/* ─── 10. FOOTER ─── */}
            <div style={{ marginTop: "auto", paddingBottom: 20 }}>
                <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${T.accent}60,${T.teal}50,${T.accent}60,transparent)`, marginBottom: 14 }} />

                {/* Team */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 13 }}>
                    {[
                        { name: "Liaqat Ali", roll: "Fa22-BSCS-096", color: T.accentLight },
                        { name: "Alishba Ramzan", roll: "Fa22-BSCS-395", color: T.teal },
                    ].map(m => (
                        <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 11, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "9px 13px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${m.color}40,${m.color}18)`, border: `1.5px solid ${m.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: m.color, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>{m.name.charAt(0)}</div>
                            <div>
                                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'DM Sans', sans-serif" }}>{m.name}</p>
                                <p style={{ margin: 0, fontSize: 9.5, color: m.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{m.roll}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* LGU logo + University */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                      <div style={{ textAlign: "left" }}>
                        <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: T.text, letterSpacing: "0.03em", lineHeight: 1.15 }}>Lahore Garrison University</p>
                        <p style={{ margin: "3px 0 0", fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: T.textMuted, letterSpacing: "0.04em" }}>Department of Computer Science · BS Computer Science · FYP Exhibition 2026</p>
                    </div>
                </div>
            </div>
        </div>

        {/* ── Top-left sheen on light bg ── */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg,rgba(255,255,255,0.5) 0%,transparent 38%)", pointerEvents: "none" }} />
    </div>
);

/* ─────────────────────────────────────────────────────────────────
   Page wrapper
───────────────────────────────────────────────────── */
const PosterPage: React.FC = () => {
    const posterRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');

                * { box-sizing: border-box; }
                body { margin: 0; background: #e8edf5; }

                .poster-root {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #eef2f7 0%, #e4ebf5 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px 20px 60px;
                    font-family: 'DM Sans', sans-serif;
                }

                .poster-toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    max-width: ${POSTER_W}px;
                    margin-bottom: 20px;
                }

                .poster-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    background: linear-gradient(135deg, #C09A3A, #A07820);
                    border: none;
                    border-radius: 11px;
                    padding: 11px 22px;
                    font-size: 12px;
                    font-weight: 700;
                    color: #ffffff;
                    cursor: pointer;
                    letter-spacing: 0.04em;
                    box-shadow: 0 6px 20px rgba(192,154,58,0.35);
                    transition: transform 0.15s, box-shadow 0.15s;
                    font-family: 'DM Sans', sans-serif;
                }
                .poster-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 28px rgba(192,154,58,0.5);
                }

                .poster-frame {
                    box-shadow:
                        0 0 0 1px rgba(192,154,58,0.25),
                        0 30px 80px rgba(0,0,0,0.18),
                        0 8px 24px rgba(0,0,0,0.1);
                    border-radius: 2px;
                }

                .poster-chips {
                    margin-top: 18px;
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .poster-chip {
                    font-size: 10px;
                    color: #64748b;
                    background: rgba(255,255,255,0.7);
                    border: 1px solid #e2e8f0;
                    border-radius: 999px;
                    padding: 4px 12px;
                    font-family: 'DM Sans', sans-serif;
                }

                @media print {
                    .poster-root    { background: white; padding: 0; min-height: auto; }
                    .poster-toolbar, .poster-chips { display: none !important; }
                    .poster-frame   { box-shadow: none !important; }
                    @page { size: 24in 60in; margin: 0; }
                    #resucraft-poster {
                        width: 24in  !important;
                        height: 60in !important;
                        page-break-after: always;
                    }
                }
            `}</style>

            <div className="poster-root">
                <div ref={posterRef} className="poster-frame" style={{ width: POSTER_W, borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
                    <PosterInner />
                </div>

                <div className="poster-chips">
                    {["2 ft × 5 ft", "Ratio 2:5", "1000 × 2500 px", "Print 300 DPI", "Panaflex / Vinyl"].map(c => (
                        <span key={c} className="poster-chip">{c}</span>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PosterPage;
