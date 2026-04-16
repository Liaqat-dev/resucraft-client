import React, { useRef } from "react";
import {
    BrainCircuit,
    FileText,
    LayoutTemplate,
    MessageSquare,
    Target,
    Zap,
    Sparkles,
    GraduationCap,
    Rocket,
    ShieldCheck,
    Award,
    Download,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Palette  (dark navy + electric gold)
───────────────────────────────────────────── */
const C = {
    bg: "#050c18",           // deep navy
    bgAlt: "#07111f",
    card: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    accent: "#d4a017",       // golden
    accentBright: "#f5c842",
    accentDark: "#a07808",
    text: "#f0f4ff",
    textSub: "#b8c4da",
    textMuted: "#6b7fa3",
    teal: "#00d4c8",
    purple: "#8b5cf6",
};

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const features = [
    { icon: <BrainCircuit size={16} />, title: "AI Resume Generation", desc: "NLP engine rewrites your profile into ATS-optimised CVs from any job description." },
    { icon: <Target size={16} />, title: "ATS Optimisation", desc: "Smart keyword matching for 60% higher recruiter pass-through rates." },
    { icon: <LayoutTemplate size={16} />, title: "Drag-Drop Builder", desc: "Visual canvas editor with rich component library and real-time preview." },
    { icon: <MessageSquare size={16} />, title: "Interview Prep", desc: "Auto-generates technical & behavioural questions tailored to the role." },
    { icon: <Award size={16} />, title: "Template Marketplace", desc: "Publish, browse and rate community-designed resume templates." },
    { icon: <ShieldCheck size={16} />, title: "Secure & Private", desc: "JWT auth, encrypted storage — your career data stays yours." },
];

const steps = [
    { n: "01", icon: <GraduationCap size={14} />, label: "Build Profile" },
    { n: "02", icon: <Sparkles size={14} />, label: "AI Generates" },
    { n: "03", icon: <Rocket size={14} />, label: "Download & Apply" },
];

const stats = [
    { v: "80%", l: "Time Saved" },
    { v: "60%", l: "ATS Boost" },
    { v: "10K+", l: "Resumes Built" },
    { v: "50+", l: "Templates" },
];

const team = [
    { name: "Muhammad Liaqat", role: "Full-Stack Lead" },
    { name: "Member 2", role: "AI / NLP Module" },
    { name: "Member 3", role: "UI/UX Design" },
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const Blob: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
    <div
        style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(80px)",
            pointerEvents: "none",
            ...style,
        }}
    />
);

const Divider: React.FC = () => (
    <div
        style={{
            width: "60px",
            height: "2px",
            background: `linear-gradient(90deg, ${C.accent}, ${C.teal})`,
            borderRadius: "2px",
            margin: "0 auto",
        }}
    />
);

/* ─────────────────────────────────────────────
   POSTER  — fixed 1.5 : 4  aspect ratio
   Rendered at 600 × 1600 px on screen
───────────────────────────────────────────── */
const POSTER_W = 600;
const POSTER_H = 1600;

const PosterInner: React.FC = () => (
    <div
        id="resucraft-poster"
        style={{
            width: POSTER_W,
            height: POSTER_H,
            background: C.bg,
            position: "relative",
            overflow: "hidden",
            fontFamily: "'DM Sans', 'Inter', sans-serif",
            color: C.text,
            flexShrink: 0,
        }}
    >
        {/* ── Decorative blobs ── */}
        <Blob style={{ width: 340, height: 340, background: C.accent + "22", top: -80, left: -80 }} />
        <Blob style={{ width: 280, height: 280, background: C.teal + "18", top: 220, right: -60 }} />
        <Blob style={{ width: 260, height: 260, background: C.purple + "18", top: 700, left: -40 }} />
        <Blob style={{ width: 300, height: 300, background: C.accent + "15", bottom: 200, right: -80 }} />
        <Blob style={{ width: 200, height: 200, background: C.teal + "12", bottom: -60, left: 60 }} />

        {/* ── Fine dot grid ── */}
        <div
            style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `radial-gradient(${C.border} 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
                opacity: 0.6,
            }}
        />

        {/* ── Golden top accent bar ── */}
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${C.accentDark}, ${C.accentBright}, ${C.teal}, ${C.accentBright}, ${C.accentDark})`,
            }}
        />

        {/* ── Content ── */}
        <div style={{ position: "relative", zIndex: 1, padding: "32px 36px", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>

            {/* ── University badge ── */}
            <div style={{ textAlign: "center", marginBottom: 18 }}>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(212,160,23,0.1)",
                    border: `1px solid ${C.accent}40`,
                    borderRadius: 999,
                    padding: "5px 14px",
                }}>
                    <GraduationCap size={13} color={C.accentBright} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.accentBright, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Final Year Project · 2026
                    </span>
                </div>
            </div>

            {/* ── Logo / Title ── */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
                {/* Logo mark */}
                <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: `linear-gradient(135deg, ${C.accent}, ${C.accentBright})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    boxShadow: `0 12px 36px ${C.accent}44`,
                }}>
                    <FileText size={30} color="#050c18" />
                </div>

                <h1 style={{
                    fontSize: 52,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    margin: 0,
                    background: `linear-gradient(135deg, ${C.accentBright} 30%, #ffffff 70%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}>
                    ResuCraft
                </h1>

                <p style={{
                    margin: "8px 0 0",
                    fontSize: 13,
                    color: C.teal,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                }}>
                    AI-Powered Resume Builder
                </p>
            </div>

            <Divider />

            {/* ── Tagline ── */}
            <div style={{ textAlign: "center", margin: "18px 0 22px" }}>
                <p style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: C.textSub,
                    lineHeight: 1.55,
                    margin: 0,
                    maxWidth: 440,
                    marginLeft: "auto",
                    marginRight: "auto",
                }}>
                    An intelligent platform that uses{" "}
                    <span style={{ color: C.accentBright, fontWeight: 700 }}>NLP & AI</span>{" "}
                    to transform user profiles into perfectly-tailored,{" "}
                    <span style={{ color: C.teal, fontWeight: 700 }}>ATS-optimised</span>{" "}
                    resumes — in under 60 seconds.
                </p>
            </div>

            {/* ── Stats row ── */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
                marginBottom: 24,
            }}>
                {stats.map(s => (
                    <div key={s.v} style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        borderRadius: 12,
                        padding: "12px 8px",
                        textAlign: "center",
                        backdropFilter: "blur(8px)",
                    }}>
                        <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.accentBright, lineHeight: 1 }}>{s.v}</p>
                        <p style={{ margin: "4px 0 0", fontSize: 9, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</p>
                    </div>
                ))}
            </div>

            {/* ── Section: About ── */}
            <SectionLabel label="About the Project" />
            <div style={{
                background: `linear-gradient(135deg, rgba(212,160,23,0.08), rgba(0,212,200,0.05))`,
                border: `1px solid ${C.accent}30`,
                borderRadius: 16,
                padding: "16px 18px",
                marginBottom: 18,
            }}>
                <p style={{ margin: 0, fontSize: 11.5, color: C.textSub, lineHeight: 1.7 }}>
                    ResuCraft is a full-stack web application built as a Final Year Project (FYP) to solve the
                    real-world problem of generic, poorly-formatted resumes failing ATS filters. The system
                    combines a personalised user profile, an NLP-driven AI generation engine, a drag-and-drop
                    template builder, a community marketplace, and an interview preparation module — all in one
                    secure, cloud-connected platform.
                </p>
            </div>

            {/* ── Section: Features ── */}
            <SectionLabel label="Core Features" />
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 18,
            }}>
                {features.map((f) => (
                    <div key={f.title} style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        borderRadius: 12,
                        padding: "12px 12px",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                    }}>
                        <div style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: `linear-gradient(135deg, ${C.accent}33, ${C.teal}22)`,
                            border: `1px solid ${C.accent}40`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: C.accentBright,
                        }}>
                            {f.icon}
                        </div>
                        <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, color: C.text }}>{f.title}</p>
                        <p style={{ margin: 0, fontSize: 9.5, color: C.textMuted, lineHeight: 1.55 }}>{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* ── Section: How it works ── */}
            <SectionLabel label="How It Works" />
            <div style={{ display: "flex", gap: 8, marginBottom: 18, alignItems: "stretch" }}>
                {steps.map((s, i) => (
                    <React.Fragment key={s.n}>
                        <div style={{
                            flex: 1,
                            background: C.card,
                            border: `1px solid ${C.border}`,
                            borderRadius: 12,
                            padding: "14px 10px",
                            textAlign: "center",
                            backdropFilter: "blur(8px)",
                        }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${C.accent}, ${C.accentBright})`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#050c18",
                                margin: "0 auto 8px",
                                boxShadow: `0 4px 16px ${C.accent}44`,
                            }}>
                                {s.icon}
                            </div>
                            <p style={{ margin: 0, fontSize: 9, fontWeight: 800, color: C.accentBright, letterSpacing: "0.06em" }}>{s.n}</p>
                            <p style={{ margin: "3px 0 0", fontSize: 10, fontWeight: 700, color: C.text }}>{s.label}</p>
                        </div>
                        {i < steps.length - 1 && (
                            <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                                <Zap size={12} color={C.accentBright} />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* ── Section: Tech Stack ── */}
            <SectionLabel label="Technology Stack" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                {[
                    { l: "React + TypeScript", c: C.teal },
                    { l: "Node.js + Express", c: "#68d391" },
                    { l: "MongoDB", c: "#4ade80" },
                    { l: "Python NLP", c: C.purple + "ee" },
                    { l: "JWT Auth", c: C.accentBright },
                    { l: "Vite + TailwindCSS", c: "#60a5fa" },
                    { l: "Redux Toolkit", c: "#f472b6" },
                    { l: "Gemini AI API", c: C.accent },
                ].map(t => (
                    <span key={t.l} style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: t.c,
                        background: t.c + "18",
                        border: `1px solid ${t.c}44`,
                        borderRadius: 999,
                        padding: "3px 10px",
                        letterSpacing: "0.04em",
                    }}>
                        {t.l}
                    </span>
                ))}
            </div>

            {/* ── Section: Team ── */}
            <SectionLabel label="Project Team" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
                {team.map((m) => (
                    <div key={m.name} style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        borderRadius: 12,
                        padding: "12px 8px",
                        textAlign: "center",
                        backdropFilter: "blur(8px)",
                    }}>
                        <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${C.accent}, ${C.teal})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 8px",
                            fontSize: 14,
                            fontWeight: 800,
                            color: "#050c18",
                        }}>
                            {m.name.charAt(0)}
                        </div>
                        <p style={{ margin: 0, fontSize: 9.5, fontWeight: 700, color: C.text }}>{m.name}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 8.5, color: C.textMuted }}>{m.role}</p>
                    </div>
                ))}
            </div>

            {/* ── QR / URL area ── */}
            <div style={{
                background: `linear-gradient(135deg, ${C.accent}10, ${C.teal}08)`,
                border: `1px solid ${C.accent}30`,
                borderRadius: 16,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
            }}>
                <div>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: C.accentBright, textTransform: "uppercase", letterSpacing: "0.08em" }}>Try it live</p>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: C.text, fontWeight: 600 }}>resucraft.vercel.app</p>
                </div>
                {/* Decorative QR placeholder */}
                <div style={{
                    width: 48,
                    height: 48,
                    background: "#fff",
                    borderRadius: 8,
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    padding: 4,
                    gap: 2,
                    boxSizing: "border-box",
                }}>
                    {Array.from({ length: 25 }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                borderRadius: 1,
                                background: [0,1,5,6,3,4,10,14,15,19,20,21,23,24].includes(i) ? "#050c18" : "transparent",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div style={{ textAlign: "center", marginTop: "auto" }}>
                <div style={{
                    height: 1,
                    background: `linear-gradient(90deg, transparent, ${C.accent}60, transparent)`,
                    marginBottom: 10,
                }} />
                <p style={{ margin: 0, fontSize: 9.5, color: C.textMuted, letterSpacing: "0.05em" }}>
                    Department of Computer Science &nbsp;·&nbsp; BS Software Engineering &nbsp;·&nbsp; 2026
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 9, color: C.textMuted + "99", letterSpacing: "0.04em" }}>
                    Supervised by: Faculty Supervisor &nbsp;·&nbsp; Presented at FYP Exhibition 2026
                </p>
            </div>

        </div>

        {/* ── Sheen overlay ── */}
        <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, transparent 50%)",
            pointerEvents: "none",
        }} />
    </div>
);

/* Section label helper */
const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.accent}50, transparent)` }} />
        <span style={{
            fontSize: 9,
            fontWeight: 800,
            color: C.accentBright,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
        }}>
            {label}
        </span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.accent}50)` }} />
    </div>
);

/* ─────────────────────────────────────────────
   Page wrapper
───────────────────────────────────────────── */
const PosterPage: React.FC = () => {
    const posterRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* ── Screen UI ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

                body { margin: 0; background: #02070f; }

                .poster-page-wrapper {
                    min-height: 100vh;
                    background: radial-gradient(ellipse at 30% 20%, #1a0f0230 0%, #02070f 60%),
                                radial-gradient(ellipse at 80% 80%, #001a1a30 0%, #02070f 60%);
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
                    gap: 8px;
                    background: linear-gradient(135deg, #d4a017, #f5c842);
                    border: none;
                    border-radius: 10px;
                    padding: 10px 20px;
                    font-size: 12px;
                    font-weight: 700;
                    color: #050c18;
                    cursor: pointer;
                    letter-spacing: 0.04em;
                    box-shadow: 0 6px 20px #d4a01740;
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                .poster-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 28px #d4a01760;
                }

                .poster-label {
                    font-size: 11px;
                    font-weight: 600;
                    color: #6b7fa3;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                }

                .poster-shadow {
                    box-shadow:
                        0 0 0 1px rgba(212,160,23,0.25),
                        0 24px 80px rgba(0,0,0,0.8),
                        0 8px 32px rgba(212,160,23,0.15);
                    border-radius: 2px;
                }

                .poster-info {
                    margin-top: 20px;
                    display: flex;
                    gap: 20px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .poster-info-chip {
                    font-size: 10px;
                    color: #6b7fa3;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 999px;
                    padding: 4px 12px;
                }

                /* ── Print ── */
                @media print {
                    .poster-page-wrapper { background: white; padding: 0; }
                    .poster-toolbar, .poster-info { display: none !important; }
                    .poster-shadow { box-shadow: none !important; }
                    @page {
                        size: 18in 48in;
                        margin: 0;
                    }
                    #resucraft-poster {
                        width: 18in !important;
                        height: 48in !important;
                        page-break-after: always;
                    }
                }
            `}</style>

            <div className="poster-page-wrapper">
                {/* Toolbar */}
                <div className="poster-toolbar">
                    <div>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#f0f4ff" }}>ResuCraft Panaflex</p>
                        <p className="poster-label" style={{ margin: "2px 0 0" }}>Poster Preview — 1.5 ft × 4 ft</p>
                    </div>
                    <button className="poster-btn" onClick={handlePrint} id="poster-print-btn">
                        <Download size={14} />
                        Print / Export
                    </button>
                </div>

                {/* Poster */}
                <div
                    ref={posterRef}
                    className="poster-shadow"
                    style={{
                        width: POSTER_W,
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    <PosterInner />
                </div>

                {/* Info chips */}
                <div className="poster-info">
                    {["Size: 1.5 ft × 4 ft", "Aspect Ratio: 3:8", "Resolution: 300 DPI recommended", "Format: Panaflex / Vinyl"].map(chip => (
                        <span key={chip} className="poster-info-chip">{chip}</span>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PosterPage;
