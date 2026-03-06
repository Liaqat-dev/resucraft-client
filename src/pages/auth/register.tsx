import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useForm, GlobalErrorAlert } from '@hooks/useForm';
import * as Yup from 'yup';
import { Mail, Lock, User, Eye, EyeOff, AtSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PasswordStrength from '@src/components/common/passwordStrength.tsx';

const GOLD = '#C09A3A';
const DARK = '#0F172A';

const registerSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters'),
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    password: Yup.string()
        .required('Password is required')
        .min(12, 'Password must be at least 12 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});

export default function Register() {
    useEffect(() => {
        document.title = `Sign Up | ResuCraft`;
    }, []);

    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useForm({
        initialValues: { name: '', username: '', email: '', password: '' },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            await register(values).unwrap();
            navigate('/auth/verify-email', { state: { email: values.email } });
        },
        onSuccess: (response) => {
            toast.success(response.message || 'Registration successful! Check your email.');
        },
        onError: (error) => console.error('Registration error:', error),
    });

    /* ── Step indicators ───────────────────────────────────────── */
    const steps = [
        { label: 'Create account', desc: 'Fill in your details' },
        { label: 'Verify email', desc: 'Confirm your address' },
        { label: 'Start crafting', desc: 'Build your resume' },
    ];

    return (
        <>
            <style>{`
                @keyframes rc-float-reg {
                    0%, 100% { transform: translateY(0px) rotate(1.5deg); }
                    50% { transform: translateY(-12px) rotate(1.5deg); }
                }
                @keyframes rc-float-reg-back {
                    0%, 100% { transform: translateY(0px) rotate(-2.5deg); }
                    50% { transform: translateY(-7px) rotate(-2.5deg); }
                }
                @keyframes rc-glow-reg {
                    0%, 100% { opacity: 0.07; transform: translate(-50%,-50%) scale(1); }
                    50% { opacity: 0.16; transform: translate(-50%,-50%) scale(1.1); }
                }
                .rc-card-front-reg { animation: rc-float-reg 7s ease-in-out infinite; }
                .rc-card-back-reg  { animation: rc-float-reg-back 7s ease-in-out infinite 0.5s; }
                .rc-glow-reg       { animation: rc-glow-reg 5s ease-in-out infinite; }
                .rc-dot-grid-reg {
                    background-image: radial-gradient(circle, rgba(148,163,184,0.09) 1px, transparent 1px);
                    background-size: 28px 28px;
                }
                .rc-btn-dark-reg {
                    background: linear-gradient(135deg, #0F172A 0%, #1e293b 100%);
                    box-shadow: 0 4px 18px rgba(15,23,42,0.28);
                    transition: box-shadow 0.2s, opacity 0.2s;
                }
                .rc-btn-dark-reg:hover:not(:disabled) {
                    box-shadow: 0 6px 26px rgba(15,23,42,0.4);
                    opacity: 0.92;
                }
            `}</style>

            <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif" }}>

                {/* ── LEFT PANEL: Form ───────────────────────────── */}
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '2.5rem 1.5rem', background: '#fff', overflowY: 'auto',
                }}>
                    <div style={{ width: '100%', maxWidth: 420, padding: '1rem 0' }}>

                        {/* Brand (always visible on mobile, also on desktop for this layout) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 9,
                                background: `linear-gradient(135deg, ${GOLD}, #8B6914)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                    <rect x="4" y="3" width="16" height="18" rx="2" />
                                    <line x1="8" y1="8" x2="16" y2="8" />
                                    <line x1="8" y1="12" x2="13" y2="12" />
                                    <line x1="8" y1="16" x2="11" y2="16" />
                                </svg>
                            </div>
                            <span style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '1.45rem', fontWeight: 600, color: DARK,
                            }}>
                                ResuCraft
                            </span>
                        </div>

                        {/* Heading */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <h1 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '2.5rem', fontWeight: 600, lineHeight: 1.1,
                                color: DARK, margin: '0 0 0.5rem',
                            }}>
                                Create your account
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
                                Join thousands crafting standout resumes.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            <GlobalErrorAlert
                                error={formik.globalError}
                                onDismiss={() => formik.setStatus(null)}
                            />

                            {/* Name + Username row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {/* Full Name */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                            <User className="w-4 h-4" />
                                        </span>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Jane Doe"
                                            autoComplete="off"
                                            className={[
                                                'w-full pl-9 pr-4 py-2.5 text-sm rounded-md border bg-white',
                                                'transition-colors duration-150 focus:outline-none focus:ring-2',
                                                formik.touched.name && formik.errors.name
                                                    ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
                                                    : 'border-gray-200 hover:border-gray-300 focus:ring-primary-500/20 focus:border-primary-500',
                                            ].join(' ')}
                                        />
                                    </div>
                                    {formik.touched.name && formik.errors.name && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <span className="inline-block size-1 rounded-full bg-red-500" />
                                            {formik.errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Username */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Username <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                            <AtSign className="w-4 h-4" />
                                        </span>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formik.values.username}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="janedoe"
                                            autoComplete="off"
                                            className={[
                                                'w-full pl-9 pr-4 py-2.5 text-sm rounded-md border bg-white',
                                                'transition-colors duration-150 focus:outline-none focus:ring-2',
                                                formik.touched.username && formik.errors.username
                                                    ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
                                                    : 'border-gray-200 hover:border-gray-300 focus:ring-primary-500/20 focus:border-primary-500',
                                            ].join(' ')}
                                        />
                                    </div>
                                    {formik.touched.username && formik.errors.username && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <span className="inline-block size-1 rounded-full bg-red-500" />
                                            {formik.errors.username}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="you@example.com"
                                        autoComplete="off"
                                        className={[
                                            'w-full pl-9 pr-4 py-2.5 text-sm rounded-md border bg-white',
                                            'transition-colors duration-150 focus:outline-none focus:ring-2',
                                            formik.touched.email && formik.errors.email
                                                ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
                                                : 'border-gray-200 hover:border-gray-300 focus:ring-primary-500/20 focus:border-primary-500',
                                        ].join(' ')}
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block size-1 rounded-full bg-red-500" />
                                        {formik.errors.email}
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
                                        placeholder="Min. 12 characters"
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
                                {formik.values.password && (
                                    <div style={{ marginTop: '0.4rem' }}>
                                        <PasswordStrength password={formik.values.password} />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="rc-btn-dark-reg"
                                style={{
                                    width: '100%', padding: '0.85rem',
                                    borderRadius: 10, border: 'none',
                                    cursor: formik.isSubmitting ? 'not-allowed' : 'pointer',
                                    color: '#fff', fontSize: '0.95rem', fontWeight: 500,
                                    letterSpacing: '0.02em', fontFamily: "'DM Sans', sans-serif",
                                    opacity: formik.isSubmitting ? 0.6 : 1,
                                    background: formik.isSubmitting ? '#94a3b8' : undefined,
                                    boxShadow: formik.isSubmitting ? 'none' : undefined,
                                    marginTop: '0.25rem',
                                }}
                            >
                                {formik.isSubmitting ? 'Creating account…' : 'Create Account'}
                            </button>
                        </form>

                        {/* Sign in link */}
                        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                            Already have an account?{' '}
                            <Link
                                to="/auth/sign-in"
                                style={{ color: GOLD, fontWeight: 600, textDecoration: 'none' }}
                                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                            >
                                Sign in
                            </Link>
                        </p>

                        {/* Terms note */}
                        <p style={{
                            marginTop: '1rem', textAlign: 'center',
                            fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.5,
                        }}>
                            By creating an account you agree to our{' '}
                            <span style={{ color: '#64748b' }}>Terms of Service</span> and{' '}
                            <span style={{ color: '#64748b' }}>Privacy Policy</span>.
                        </p>
                    </div>
                </div>

                {/* ── RIGHT PANEL: Brand visual ────────────────────── */}
                <div
                    className="hidden lg:flex lg:w-5/12 xl:w-[44%] rc-dot-grid-reg flex-col justify-between"
                    style={{ background: DARK, padding: '3rem', position: 'relative', overflow: 'hidden' }}
                >

                    {/* Ambient glow */}
                    <div
                        className="rc-glow-reg"
                        style={{
                            position: 'absolute', top: '42%', left: '50%',
                            width: '28rem', height: '28rem', borderRadius: '50%',
                            background: `radial-gradient(circle, ${GOLD}28 0%, transparent 70%)`,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Brand mark */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: 38, height: 38, borderRadius: 10,
                                background: `linear-gradient(135deg, ${GOLD}, #8B6914)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                    <rect x="4" y="3" width="16" height="18" rx="2" />
                                    <line x1="8" y1="8" x2="16" y2="8" />
                                    <line x1="8" y1="12" x2="13" y2="12" />
                                    <line x1="8" y1="16" x2="11" y2="16" />
                                </svg>
                            </div>
                            <span style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '1.55rem', fontWeight: 600,
                                color: '#fff', letterSpacing: '0.04em',
                            }}>ResuCraft</span>
                        </div>
                    </div>

                    {/* Central illustration: 3-step progress card */}
                    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: '17rem' }}>
                            {/* Back card */}
                            <div
                                className="rc-card-back-reg"
                                style={{
                                    position: 'absolute', inset: 0,
                                    background: '#1e293b', borderRadius: 18,
                                    border: '1px solid #334155',
                                    transform: 'rotate(-2.5deg)',
                                }}
                            />
                            {/* Front card: onboarding steps */}
                            <div
                                className="rc-card-front-reg"
                                style={{
                                    position: 'relative', background: '#1e293b',
                                    borderRadius: 18, border: '1px solid #334155',
                                    padding: '1.5rem', boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                                }}
                            >
                                <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    Your journey
                                </div>
                                {steps.map((step, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: i < steps.length - 1 ? '1.1rem' : 0 }}>
                                        {/* Circle */}
                                        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{
                                                width: 30, height: 30, borderRadius: '50%',
                                                background: i === 0 ? `linear-gradient(135deg, ${GOLD}, #8B6914)` : '#334155',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: i === 0 ? 'none' : `1.5px solid ${i === 1 ? GOLD + '40' : '#475569'}`,
                                            }}>
                                                {i === 0 ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                ) : (
                                                    <span style={{ color: i === 1 ? GOLD : '#475569', fontSize: '0.7rem', fontWeight: 600 }}>{i + 1}</span>
                                                )}
                                            </div>
                                            {i < steps.length - 1 && (
                                                <div style={{
                                                    width: 1.5, height: 22,
                                                    background: i === 0 ? `linear-gradient(180deg, ${GOLD}60, ${GOLD}10)` : '#334155',
                                                    marginTop: 3,
                                                }} />
                                            )}
                                        </div>
                                        {/* Text */}
                                        <div style={{ paddingTop: 4 }}>
                                            <div style={{
                                                fontSize: '0.82rem', fontWeight: 600,
                                                color: i === 0 ? '#f8fafc' : i === 1 ? '#94a3b8' : '#475569',
                                            }}>{step.label}</div>
                                            <div style={{ fontSize: '0.7rem', color: i === 0 ? '#94a3b8' : '#475569', marginTop: 2 }}>{step.desc}</div>
                                        </div>
                                    </div>
                                ))}

                                {/* Progress bar */}
                                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Profile completion</span>
                                        <span style={{ fontSize: '0.65rem', color: GOLD, fontWeight: 600 }}>Step 1 of 3</span>
                                    </div>
                                    <div style={{ height: 5, background: '#334155', borderRadius: 10, overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', width: '33%', borderRadius: 10,
                                            background: `linear-gradient(90deg, ${GOLD}, ${GOLD}80)`,
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tagline */}
                        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '2rem', fontWeight: 400, lineHeight: 1.2,
                                color: '#f8fafc', margin: 0,
                            }}>
                                Your career,<br />
                                <em style={{ color: GOLD, fontStyle: 'italic' }}>beautifully crafted.</em>
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                                Professional templates for every stage.
                            </p>
                        </div>
                    </div>

                    {/* Bottom feature pills */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {['16 Languages', 'PDF Export', 'ATS-Friendly', '100% Free'].map((feat) => (
                                <span key={feat} style={{
                                    padding: '0.3rem 0.8rem', borderRadius: 20,
                                    background: `${GOLD}10`, color: '#94a3b8',
                                    fontSize: '0.72rem', fontWeight: 500,
                                    border: `1px solid ${GOLD}25`,
                                }}>{feat}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}