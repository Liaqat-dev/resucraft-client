import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useForm, GlobalErrorAlert } from '@hooks/useForm';
import * as Yup from 'yup';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import  { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import logoWhite from "@assets/images/logo-white.png";

const GOLD = '#C09A3A';
const DARK = '#0F172A';

const loginSchema = Yup.object({
    emailOrUsername: Yup.string().required('Email or username is required'),
    password: Yup.string().required('Password is required'),
});

export default function Login() {
    useEffect(() => {
        document.title = `Sign In | ResuCraft`;
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    // Read the ?redirect= param set by BuilderLayout when token refresh fails
    const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';
    const { login, googleLogin } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useForm({
        initialValues: { emailOrUsername: '', password: '' },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            const result = await login({
                emailOrUsername: values.emailOrUsername,
                password: values.password,
            }).unwrap();

            if (result.needsVerification) {
                navigate('/auth/verify-email', { state: { email: result.email } });
                return;
            }
            if (result.needs2FA) {
                toast.error('2FA not yet implemented');
                return;
            }
            // Redirect back to the page the user tried to visit
            navigate(redirectTo, { replace: true });
        },
        onSuccess: () => toast.success('Logged in successfully!'),
        onError: (error: any) => console.error('Login error:', error),
    });

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            await googleLogin(credentialResponse.credential).unwrap();
            toast.success('Logged in with Google!');
            navigate(redirectTo, { replace: true });
        } catch {
            toast.error('Google login failed');
        }
    };

    return (
        <>
            <style>{`
                @keyframes rc-float {
                    0%, 100% { transform: translateY(0px) rotate(-1deg); }
                    50% { transform: translateY(-14px) rotate(-1deg); }
                }
                @keyframes rc-float-back {
                    0%, 100% { transform: translateY(0px) rotate(3deg); }
                    50% { transform: translateY(-8px) rotate(3deg); }
                }
                @keyframes rc-glow {
                    0%, 100% { opacity: 0.08; transform: scale(1); }
                    50% { opacity: 0.18; transform: scale(1.08); }
                }
                .rc-card-front { animation: rc-float 7s ease-in-out infinite; }
                .rc-card-back  { animation: rc-float-back 7s ease-in-out infinite 0.4s; }
                .rc-glow       { animation: rc-glow 5s ease-in-out infinite; }
                .rc-dot-grid {
                    background-image: radial-gradient(circle, rgba(148,163,184,0.09) 1px, transparent 1px);
                    background-size: 28px 28px;
                }
                .rc-btn-dark {
                    background: linear-gradient(135deg, #0F172A 0%, #1e293b 100%);
                    box-shadow: 0 4px 18px rgba(15,23,42,0.28);
                    transition: box-shadow 0.2s, opacity 0.2s;
                }
                .rc-btn-dark:hover:not(:disabled) {
                    box-shadow: 0 6px 24px rgba(15,23,42,0.38);
                    opacity: 0.92;
                }
            `}</style>

            <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif" }}>

                {/* ── LEFT PANEL ─────────────────────────────────────── */}
                <div
                    className="hidden lg:flex lg:w-5/12 xl:w-[44%] rc-dot-grid flex-col justify-between"
                    style={{ background: DARK, padding: '3rem', position: 'relative', overflow: 'hidden' }}
                >
                    {/* Ambient glow */}
                    <div
                        className="rc-glow"
                        style={{
                            position: 'absolute', top: '38%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '26rem', height: '26rem', borderRadius: '50%',
                            background: `radial-gradient(circle, ${GOLD}30 0%, transparent 70%)`,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Brand mark */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div className="logos">
                            <Link to="/">
                                <img
                                    src={logoWhite}
                                    alt="logoWhite"
                                    className="h-14 inline-block "
                                    height={24}

                                />
                            </Link>
                        </div>
                    </div>

                    {/* Centre: floating resume card illustration */}
                    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}>
                        <div style={{ position: 'relative', width: '17rem' }}>
                            {/* Back card */}
                            <div
                                className="rc-card-back"
                                style={{
                                    position: 'absolute', inset: 0,
                                    background: '#1e293b', borderRadius: 18,
                                    border: '1px solid #334155',
                                    transform: 'rotate(3deg)',
                                }}
                            />
                            {/* Front card */}
                            <div
                                className="rc-card-front"
                                style={{
                                    position: 'relative', background: '#1e293b',
                                    borderRadius: 18, border: '1px solid #334155',
                                    padding: '1.5rem', boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                                }}
                            >
                                {/* Avatar row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                                    <div style={{
                                        width: 46, height: 46, borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}08)`,
                                        border: `2px solid ${GOLD}40`,
                                        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden',
                                    }}>
                                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#475569', marginBottom: 6 }} />
                                    </div>
                                    <div>
                                        <div style={{ height: 12, width: 110, background: '#334155', borderRadius: 6, marginBottom: 7 }} />
                                        <div style={{ height: 9, width: 76, background: '#1e3a5f', borderRadius: 4 }} />
                                    </div>
                                </div>

                                {/* Skill bars */}
                                <div style={{ marginBottom: '1rem' }}>
                                    {[80, 65, 90].map((w, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, flexShrink: 0 }} />
                                            <div style={{ flex: 1, height: 7, background: '#334155', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${w}%`, background: `linear-gradient(90deg, ${GOLD}60, ${GOLD}20)`, borderRadius: 4 }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Tag chips */}
                                <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem' }}>
                                    <div style={{ height: 9, width: 52, background: `${GOLD}25`, borderRadius: 4, marginBottom: '0.6rem' }} />
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {['React', 'TypeScript', 'Node.js'].map((tag) => (
                                            <span key={tag} style={{
                                                padding: '0.2rem 0.6rem', borderRadius: 6,
                                                background: `${GOLD}12`, color: GOLD,
                                                fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.03em',
                                                border: `1px solid ${GOLD}30`,
                                            }}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tagline */}
                        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '2.1rem', fontWeight: 400, lineHeight: 1.2,
                                color: '#f8fafc', margin: 0,
                            }}>
                                Craft your story,<br />
                                <em style={{ color: GOLD, fontStyle: 'italic' }}>land your dream role.</em>
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.75rem', margin: '0.75rem 0 0' }}>
                                Professional resumes, built in minutes.
                            </p>
                        </div>
                    </div>

                    {/* Bottom stats */}
                    <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        {[
                            { n: '10K+', label: 'Resumes created' },
                            { n: '16', label: 'Languages' },
                            { n: 'Free', label: 'Always & forever' },
                        ].map(({ n, label }, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                {i > 0 && <div style={{ width: 1, height: 32, background: '#334155' }} />}
                                <div>
                                    <div style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: '1.2rem', fontWeight: 600, color: '#f8fafc',
                                    }}>{n}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT PANEL ────────────────────────────────────── */}
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '2.5rem 1.5rem', background: '#fff',
                }}>
                    <div style={{ width: '100%', maxWidth: 420 }}>

                        {/* Mobile brand */}
                        <div className="flex items-center gap-2 mb-8 lg:hidden">
                            <div style={{
                                width: 34, height: 34, borderRadius: 9,
                                background: `linear-gradient(135deg, ${GOLD}, #8B6914)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                    <rect x="4" y="3" width="16" height="18" rx="2" />
                                    <line x1="8" y1="8" x2="16" y2="8" />
                                    <line x1="8" y1="12" x2="13" y2="12" />
                                    <line x1="8" y1="16" x2="11" y2="16" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 600, color: DARK }}>
                                ResuCraft
                            </span>
                        </div>

                        {/* Heading */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h1 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '2.6rem', fontWeight: 600, lineHeight: 1.08,
                                color: DARK, margin: '0 0 0.5rem',
                            }}>
                                Welcome back
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                                Sign in to continue building your career story.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            <GlobalErrorAlert
                                error={formik.globalError}
                                onDismiss={() => formik.setStatus(null)}
                            />

                            {/* Email or Username */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Email or Username <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="text"
                                        name="emailOrUsername"
                                        value={formik.values.emailOrUsername}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="you@example.com or username"
                                        autoComplete="off"
                                        className={[
                                            'w-full pl-9 pr-4 py-2.5 text-sm rounded-md border bg-white',
                                            'transition-colors duration-150 focus:outline-none focus:ring-2',
                                            formik.touched.emailOrUsername && formik.errors.emailOrUsername
                                                ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
                                                : 'border-gray-200 hover:border-gray-300 focus:ring-primary-500/20 focus:border-primary-500',
                                        ].join(' ')}
                                    />
                                </div>
                                {formik.touched.emailOrUsername && formik.errors.emailOrUsername && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block size-1 rounded-full bg-red-500" />
                                        {formik.errors.emailOrUsername}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Your password"
                                        autoComplete="off"
                                        className={[
                                            'w-full pl-9 pr-10 py-2.5 text-sm rounded-md border bg-white',
                                            'transition-colors duration-150 focus:outline-none focus:ring-2',
                                            formik.touched.password && formik.errors.password
                                                ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
                                                : 'border-gray-200 hover:border-gray-300 focus:ring-primary-500/20 focus:border-primary-500',
                                        ].join(' ')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block size-1 rounded-full bg-red-500" />
                                        {formik.errors.password}
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Link
                                    to="/auth/forgot-password"
                                    style={{ fontSize: '0.82rem', color: GOLD, textDecoration: 'none' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="rc-btn-dark"
                                style={{
                                    width: '100%', padding: '0.85rem',
                                    borderRadius: 10, border: 'none', cursor: formik.isSubmitting ? 'not-allowed' : 'pointer',
                                    color: '#fff', fontSize: '0.95rem', fontWeight: 500,
                                    letterSpacing: '0.02em', fontFamily: "'DM Sans', sans-serif",
                                    opacity: formik.isSubmitting ? 0.6 : 1,
                                    background: formik.isSubmitting ? '#94a3b8' : undefined,
                                    boxShadow: formik.isSubmitting ? 'none' : undefined,
                                }}
                            >
                                {formik.isSubmitting ? 'Signing in…' : 'Sign In'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>or continue with</span>
                            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                        </div>

                        {/* Google */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error('Google login failed')}
                                useOneTap
                                theme="outline"
                                size="large"
                                text="continue_with"
                            />
                        </div>

                        {/* Sign up link */}
                        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                            Don't have an account?{' '}
                            <Link
                                to="/auth/sign-up"
                                style={{ color: GOLD, fontWeight: 600, textDecoration: 'none' }}
                                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                            >
                                Create one free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}