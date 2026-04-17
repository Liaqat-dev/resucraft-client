import {useEffect, useState} from 'react';
import {getAvatar, timeAgo} from "@src/utils/url_helper";
import {Link} from 'react-router-dom';
import {
    Activity,
    ArrowRight,
    Ban,
    BarChart3,
    CheckCircle2,
    CircleSlash2,
    Crown,
    FileText,
    Mail,
    RefreshCw,
    Shield,
    ShieldCheck,
    UserCheck,
    Users as UsersIcon,
    XCircle,
    Zap,
} from 'lucide-react';
import {adminService, AdminStats, AdminUser} from '@src/services/adminService';
import {StatCardGrid} from "@pages/dashboard/components/StatCard.tsx";


/* ─── stat cards config ─────────────────────────────────────────────── */
const STAT_ITEMS = [
    {
        key: 'total',
        label: 'Total Users',
        icon: <UsersIcon className="size-4"/>,
        color: 'text-sky-400',
        bg: 'bg-sky-400/10',
    },
    {
        key: 'activeSessions',
        label: 'Active Sessions',
        icon: <Activity className="size-4"/>,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10',
    },
    {
        key: 'admin',
        label: 'Admins',
        icon: <Crown className="size-4"/>,
        color: 'text-violet-400',
        bg: 'bg-violet-400/10',
    },
    {
        key: 'moderator',
        label: 'Moderators',
        icon: <Shield className="size-4"/>,
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
    },
    {
        key: 'suspended',
        label: 'Suspended',
        icon: <Ban className="size-4"/>,
        color: 'text-red-400',
        bg: 'bg-red-400/10',
    },
];

/* ─── quick nav cards ───────────────────────────────────────────────── */
const NAV_CARDS = [
    {
        label: 'Users',
        desc: 'Manage accounts, roles & suspensions',
        path: '/dashboard/users',
        icon: <UsersIcon className="size-5"/>,
        color: 'text-sky-400',
        bg: 'bg-sky-400/10',
        border: 'rgba(56,189,248,0.2)',
        glow: 'rgba(56,189,248,0.06)',
    },
    {
        label: 'Templates',
        desc: 'Browse & manage resume templates',
        path: '/dashboard/templates',
        icon: <FileText className="size-5"/>,
        color: 'text-violet-400',
        bg: 'bg-violet-400/10',
        border: 'rgba(167,139,250,0.2)',
        glow: 'rgba(167,139,250,0.06)',
    },
    {
        label: 'Analytics',
        desc: 'Platform metrics & usage trends',
        path: '/dashboard/analytics',
        icon: <BarChart3 className="size-5"/>,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10',
        border: 'rgba(52,211,153,0.2)',
        glow: 'rgba(52,211,153,0.06)',
    },
    {
        label: 'Messages',
        desc: 'Support messages & notifications',
        path: '/dashboard/messages',
        icon: <Mail className="size-5"/>,
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'rgba(251,191,36,0.2)',
        glow: 'rgba(251,191,36,0.06)',
    },
];


function UserRowSkeleton() {
    return (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/4">
            <div className="size-8 rounded-lg bg-white/5 animate-pulse shrink-0"/>
            <div className="flex-1 min-w-0">
                <div className="h-3.5 w-28 rounded bg-white/5 animate-pulse mb-1.5"/>
                <div className="h-2.5 w-40 rounded bg-white/5 animate-pulse"/>
            </div>
            <div className="h-3 w-12 rounded bg-white/5 animate-pulse"/>
        </div>
    );
}

/* ─── main component ────────────────────────────────────────────────── */
export default function Overview() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

    const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
        setToast({msg, type});
        setTimeout(() => setToast(null), 3500);
    };

    const fetchData = async (showRefreshing = false) => {
        if (showRefreshing) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const [statsData, usersData] = await Promise.all([
                adminService.getStats(),
                adminService.listUsers({page: 1, limit: 6}),
            ]);
            setStats(statsData);
            setRecentUsers(usersData.users);
            if (showRefreshing) showToast('Data refreshed');
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const statValues: Record<string, number> = {
        total: stats?.total ?? 0,
        activeSessions: stats?.activeSessions ?? 0,
        admin: stats?.roles?.admin ?? 0,
        moderator: stats?.roles?.moderator ?? 0,
        suspended: stats?.suspended ?? 0,
    };

    const memberCount = (stats?.total ?? 0) - (stats?.roles?.admin ?? 0) - (stats?.roles?.moderator ?? 0);
    const healthScore = stats
        ? Math.max(
            0,
            Math.round(100 - (stats.suspended / Math.max(stats.total, 1)) * 100)
        )
        : null;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

                .adm-page   { font-family: system-ui, sans-serif; }
                .adm-mono   { font-family: 'JetBrains Mono', monospace; }
                .adm-display{ font-family: 'Syne', sans-serif; }

                .adm-card {
                    background: linear-gradient(145deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0.04) 100%);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 16px;
                    backdrop-filter: blur(4px);
                }

                .adm-stat-card {
                    transition: transform 0.15s ease, border-color 0.15s ease;
                }
                .adm-stat-card:hover {
                    transform: translateY(-2px);
                    border-color: rgba(255,255,255,0.12) !important;
                }

                .adm-nav-card {
                    transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
                    text-decoration: none;
                }
                .adm-nav-card:hover {
                    transform: translateY(-3px);
                }

                .adm-user-row {
                    transition: background 0.1s ease;
                    animation: fadeSlideIn 0.2s ease both;
                }
                .adm-user-row:hover {
                    background: rgba(255,255,255,0.025);
                }

                .adm-pulse-dot {
                    animation: pulseDot 2s ease-in-out infinite;
                }
                @keyframes pulseDot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.5; transform: scale(0.8); }
                }

                .adm-counter {
                    animation: countIn 0.4s ease both;
                }
                @keyframes countIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .toast-ok  { background: linear-gradient(135deg,#064e3b,#065f46); border: 1px solid rgba(16,185,129,0.3); }
                .toast-err { background: linear-gradient(135deg,#450a0a,#7f1d1d); border: 1px solid rgba(239,68,68,0.3); }

                .adm-health-bar-fill {
                    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .adm-divider {
                    border-color: rgba(255,255,255,0.05);
                }
            `}</style>

            <div className="adm-page min-h-full" style={{color: '#cbd5e1'}}>

                {/* ── Toast ───────────────────────────────────────────── */}
                {toast && (
                    <div
                        className={`fixed top-6 right-6 z-[300] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium ${toast.type === 'ok' ? 'toast-ok text-emerald-200' : 'toast-err text-red-200'}`}
                        style={{animation: 'fadeSlideIn 0.25s ease'}}
                    >
                        {toast.type === 'ok'
                            ? <CheckCircle2 className="size-4 shrink-0"/>
                            : <XCircle className="size-4 shrink-0"/>}
                        {toast.msg}
                    </div>
                )}

                {/* ── Header ──────────────────────────────────────────── */}
                <div className="mb-6 flex items-end gap-4 flex-wrap">
                    <div>
                        <p className="adm-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{color: '#4f6396'}}>
                            Admin / Overview
                        </p>
                        <h1
                            className="adm-display text-2xl font-bold"
                            style={{color: '#3e4042', letterSpacing: '-0.02em'}}
                        >
                            Dashboard
                        </h1>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        {/* Live indicator */}
                        <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full adm-mono text-xs"
                            style={{
                                background: 'rgba(16,185,129,0.08)',
                                border: '1px solid rgba(16,185,129,0.18)',
                                color: '#34d399',
                            }}
                        >
                            <span className="adm-pulse-dot size-1.5 rounded-full bg-emerald-400 inline-block"/>
                            Live
                        </div>

                        {stats && (
                            <span
                                className="adm-mono text-xs px-2.5 py-1 rounded-full"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#64748b',
                                }}
                            >
                                {stats.total.toLocaleString()} records
                            </span>
                        )}

                        <button
                            onClick={() => fetchData(true)}
                            disabled={refreshing}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#94a3b8',
                            }}
                        >
                            <RefreshCw className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`}/>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* ── Error banner ─────────────────────────────────────── */}
                {error && (
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm"
                        style={{
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            color: '#f87171',
                        }}
                    >
                        <XCircle className="size-4 shrink-0"/>
                        {error}
                        <button
                            onClick={() => fetchData()}
                            className="ml-auto text-xs underline underline-offset-2 opacity-70 hover:opacity-100"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <StatCardGrid items={STAT_ITEMS} values={statValues} loading={loading}/>

                {/* ── Body: two-column ─────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                    {/* ── Left column: recent users + health ───────────── */}
                    <div className="lg:col-span-3 flex flex-col gap-4">

                        {/* Recent signups */}
                        <div className="adm-card overflow-hidden">
                            {/* card header */}
                            <div
                                className="flex items-center justify-between px-4 py-3"
                                style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center size-6 rounded-md bg-sky-400/10">
                                        <UsersIcon className="size-3.5 text-sky-400"/>
                                    </div>
                                    <span
                                        className="adm-display text-sm font-semibold"
                                        style={{color: '#94a3b8'}}
                                    >
                                        Recent Signups
                                    </span>
                                </div>
                                <Link
                                    to="/dashboard/users"
                                    className="adm-mono text-[10px] uppercase tracking-widest flex items-center gap-1 transition-colors"
                                    style={{color: '#4f6396'}}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#4f6396')}
                                >
                                    View all <ArrowRight className="size-3"/>
                                </Link>
                            </div>

                            {/* user rows */}
                            {loading
                                ? Array.from({length: 5}).map((_, i) => <UserRowSkeleton key={i}/>)
                                : recentUsers.length === 0
                                    ? (
                                        <div className="flex flex-col items-center justify-center py-14 gap-2">
                                            <UsersIcon className="size-8" style={{color: '#1e293b'}}/>
                                            <p className="text-sm" style={{color: '#475569'}}>No users yet</p>
                                        </div>
                                    )
                                    : recentUsers.map((u, i) => (
                                        <div
                                            key={u._id}
                                            className="adm-user-row flex items-center gap-3 px-4 py-3 border-b border-white/[0.03]"
                                            style={{animationDelay: `${i * 35}ms`}}
                                        >
                                            {/* avatar */}
                                            <img
                                                src={u.profilePic?.url || getAvatar(u.username)}
                                                alt={u.username}
                                                className="size-8 rounded-lg object-cover shrink-0"
                                                style={{border: '1px solid rgba(255,255,255,0.08)'}}
                                            />

                                            {/* name + email */}
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className="text-sm font-medium truncate"
                                                    style={{color: '#e2e8f0'}}
                                                >
                                                    {u.username}
                                                </p>
                                                <p
                                                    className="adm-mono text-xs truncate"
                                                    style={{color: '#475569'}}
                                                >
                                                    {u.email}
                                                </p>
                                            </div>

                                            {/* role badge */}
                                            <span
                                                className="adm-mono text-[10px] px-2 py-0.5 rounded-full shrink-0"
                                                style={{
                                                    background:
                                                        u.role === 'admin'
                                                            ? 'rgba(139,92,246,0.12)'
                                                            : u.role === 'moderator'
                                                                ? 'rgba(245,158,11,0.12)'
                                                                : 'rgba(100,116,139,0.12)',
                                                    border:
                                                        u.role === 'admin'
                                                            ? '1px solid rgba(139,92,246,0.25)'
                                                            : u.role === 'moderator'
                                                                ? '1px solid rgba(245,158,11,0.25)'
                                                                : '1px solid rgba(100,116,139,0.2)',
                                                    color:
                                                        u.role === 'admin'
                                                            ? '#a78bfa'
                                                            : u.role === 'moderator'
                                                                ? '#fbbf24'
                                                                : '#64748b',
                                                }}
                                            >
                                            {u.role}
                                        </span>

                                            {/* status dot */}
                                            {u.isSuspended ? (
                                                <span title="Suspended">
                                                <Ban className="size-3.5 text-amber-400 shrink-0"/>
                                            </span>
                                            ) : u.isVerified ? (
                                                <span title="Verified">
                                                <ShieldCheck className="size-3.5 text-emerald-400 shrink-0"/>
                                            </span>
                                            ) : (
                                                <span title="Unverified">
                                                <CircleSlash2 className="size-3.5 shrink-0" style={{color: '#334155'}}/>
                                            </span>
                                            )}

                                            {/* joined */}
                                            <span
                                                className="adm-mono text-xs shrink-0 hidden sm:block"
                                                style={{color: '#334155', minWidth: '52px', textAlign: 'right'}}
                                            >
                                            {timeAgo(u.createdAt)}
                                        </span>
                                        </div>
                                    ))
                            }
                        </div>

                        {/* Platform health */}
                        {!loading && stats && (
                            <div className="adm-card p-4" style={{animation: 'fadeSlideIn 0.3s ease 0.15s both'}}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="flex items-center justify-center size-6 rounded-md bg-emerald-400/10">
                                            <Zap className="size-3.5 text-emerald-400"/>
                                        </div>
                                        <span className="adm-display text-sm font-semibold" style={{color: '#94a3b8'}}>
                                            Platform Health
                                        </span>
                                    </div>
                                    <span
                                        className="adm-mono text-xs font-medium"
                                        style={{
                                            color: (healthScore ?? 100) >= 90 ? '#34d399' : (healthScore ?? 100) >= 70 ? '#fbbf24' : '#f87171',
                                        }}
                                    >
                                        {healthScore}%
                                    </span>
                                </div>

                                {/* health bar */}
                                <div
                                    className="h-1.5 rounded-full mb-4 overflow-hidden"
                                    style={{background: 'rgba(255,255,255,0.05)'}}
                                >
                                    <div
                                        className="adm-health-bar-fill h-full rounded-full"
                                        style={{
                                            width: `${healthScore ?? 0}%`,
                                            background:
                                                (healthScore ?? 100) >= 90
                                                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                                                    : (healthScore ?? 100) >= 70
                                                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                                        : 'linear-gradient(90deg, #ef4444, #f87171)',
                                        }}
                                    />
                                </div>

                                {/* breakdown row */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        {
                                            label: 'Members',
                                            value: memberCount,
                                            color: 'text-sky-400',
                                            bg: 'bg-sky-400/8',
                                            icon: <UserCheck className="size-3"/>,
                                        },
                                        {
                                            label: 'Sessions',
                                            value: stats.activeSessions,
                                            color: 'text-emerald-400',
                                            bg: 'bg-emerald-400/8',
                                            icon: <Activity className="size-3"/>,
                                        },
                                        {
                                            label: 'Suspended',
                                            value: stats.suspended,
                                            color: 'text-red-400',
                                            bg: 'bg-red-400/8',
                                            icon: <Ban className="size-3"/>,
                                        },
                                    ].map(item => (
                                        <div
                                            key={item.label}
                                            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-3 ${item.bg}`}
                                            style={{border: '1px solid rgba(255,255,255,0.04)'}}
                                        >
                                            <span className={`${item.color}`}>{item.icon}</span>
                                            <span className={`adm-mono text-base font-medium ${item.color}`}>
                                                {item.value.toLocaleString()}
                                            </span>
                                            <span className="text-[10px]" style={{color: '#475569'}}>
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right column: quick nav ───────────────────────── */}
                    <div className="lg:col-span-2 flex flex-col gap-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center justify-center size-6 rounded-md bg-indigo-400/10">
                                <ArrowRight className="size-3.5 text-indigo-400"/>
                            </div>
                            <span className="adm-display text-sm font-semibold" style={{color: '#94a3b8'}}>
                                Quick Navigation
                            </span>
                        </div>

                        {NAV_CARDS.map((card, i) => (
                            <Link
                                key={card.path}
                                to={card.path}
                                className="adm-card adm-nav-card flex items-center gap-3.5 p-4 group/nav"
                                style={{
                                    borderColor: card.border,
                                    animationDelay: `${i * 50}ms`,
                                    animation: 'fadeSlideIn 0.25s ease both',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${card.glow}`;
                                    (e.currentTarget as HTMLElement).style.borderColor = card.border.replace('0.2', '0.4');
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                    (e.currentTarget as HTMLElement).style.borderColor = card.border;
                                }}
                            >
                                {/* icon */}
                                <div
                                    className={`flex items-center justify-center size-10 rounded-xl shrink-0 ${card.bg}`}
                                >
                                    <span className={card.color}>{card.icon}</span>
                                </div>

                                {/* text */}
                                <div className="flex-1 min-w-0">
                                    <p
                                        className="adm-display text-sm font-semibold"
                                        style={{color: '#94a3b8'}}
                                    >
                                        {card.label}
                                    </p>
                                    <p className="text-xs mt-0.5 truncate" style={{color: '#475569'}}>
                                        {card.desc}
                                    </p>
                                </div>

                                {/* arrow */}
                                <ArrowRight
                                    className={`size-4 shrink-0 transition-transform duration-150 ${card.color} opacity-40 group-hover/nav:opacity-100 group-hover/nav:translate-x-0.5`}
                                />
                            </Link>
                        ))}

                        {/* System info footer card */}
                        <div
                            className="adm-card p-4 mt-1"
                            style={{animation: 'fadeSlideIn 0.3s ease 0.2s both'}}
                        >
                            <p
                                className="adm-mono text-[10px] uppercase tracking-widest mb-3"
                                style={{color: '#334155'}}
                            >
                                System
                            </p>
                            <div className="flex flex-col gap-2">
                                {[
                                    {label: 'API Status', value: 'Operational', ok: true},
                                    {label: 'Auth Service', value: 'Operational', ok: true},
                                    {label: 'Database', value: 'Connected', ok: true},
                                ].map(row => (
                                    <div
                                        key={row.label}
                                        className="flex items-center justify-between"
                                        style={{borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px'}}
                                    >
                                        <span className="text-xs" style={{color: '#475569'}}>
                                            {row.label}
                                        </span>
                                        <span
                                            className="adm-mono text-[10px] flex items-center gap-1"
                                            style={{color: row.ok ? '#34d399' : '#f87171'}}
                                        >
                                            <span
                                                className="adm-pulse-dot size-1.5 rounded-full inline-block"
                                                style={{background: row.ok ? '#34d399' : '#f87171'}}
                                            />
                                            {row.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
