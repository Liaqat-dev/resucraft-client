import React, {useCallback, useEffect, useState} from "react";
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Globe,
    Laptop,
    LogIn,
    LogOut,
    Monitor,
    RefreshCw,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Smartphone,
    Tablet,
    Trash2,
    XCircle,
} from "lucide-react";
import {NextPageWithLayout} from "@dtos/layout";
import {authService} from "@src/services/authService.ts";
import {ActivityLog, AuthStats, Session} from "@dtos/auth.ts";
import toast from "react-hot-toast";

// ── Helpers ───────────────────────────────────────────────────────────────────

const relativeTime = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(iso).toLocaleDateString("default", {month: "short", day: "numeric"});
};

const fmtDate = (iso: string): string =>
    new Date(iso).toLocaleString("default", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const formatAction = (action: string): string => {
    const map: Record<string, string> = {
        login: "Sign In",
        logout: "Sign Out",
        logout_all: "Sign Out All Devices",
        register: "Account Created",
        password_change: "Password Changed",
        password_reset: "Password Reset",
        email_verification: "Email Verified",
        resend_code: "Verification Code Resent",
        session_revoke: "Session Revoked",
        profile_update: "Profile Updated",
        two_factor_enable: "2FA Enabled",
        two_factor_disable: "2FA Disabled",
        google_login: "Google Sign In",
    };
    const key = action.toLowerCase().replace(/[\s-]/g, "_");
    return map[key] ?? action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const DeviceIcon: React.FC<{type: Session["deviceType"]; cls?: string}> = ({type, cls = ""}) => {
    if (type === "mobile") return <Smartphone size={14} className={cls}/>;
    if (type === "tablet") return <Tablet size={14} className={cls}/>;
    return <Monitor size={14} className={cls}/>;
};

const ActionIcon: React.FC<{action: string; cls?: string}> = ({action, cls = ""}) => {
    const a = action.toLowerCase();
    if (a.includes("login") || a.includes("sign_in") || a === "login") return <LogIn size={13} className={cls}/>;
    if (a.includes("logout") || a.includes("sign_out")) return <LogOut size={13} className={cls}/>;
    if (a.includes("password")) return <Shield size={13} className={cls}/>;
    if (a.includes("session")) return <Laptop size={13} className={cls}/>;
    return <Activity size={13} className={cls}/>;
};

// ── Skeleton rows ─────────────────────────────────────────────────────────────

const SkeletonRow: React.FC = () => (
    <div className="flex gap-4 px-4 py-3.5 animate-pulse">
        <div className="size-7 rounded-md bg-gray-100 dark:bg-dark-800 shrink-0"/>
        <div className="flex-1 space-y-2">
            <div className="h-3.5 w-40 bg-gray-200 dark:bg-dark-700 rounded"/>
            <div className="h-3 w-24 bg-gray-100 dark:bg-dark-800 rounded"/>
        </div>
        <div className="h-3 w-16 bg-gray-100 dark:bg-dark-800 rounded self-center"/>
    </div>
);

const Skeleton: React.FC<{rows?: number}> = ({rows = 3}) => (
    <div className="space-y-px">
        {Array.from({length: rows}).map((_, i) => <SkeletonRow key={i}/>)}
    </div>
);

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub?: string;
    accent?: "primary" | "emerald" | "red" | "amber";
}

const accentMap = {
    primary: {icon: "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400", val: "text-primary-600 dark:text-primary-400"},
    emerald: {icon: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", val: "text-emerald-600 dark:text-emerald-400"},
    red:     {icon: "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400",                 val: "text-red-500 dark:text-red-400"},
    amber:   {icon: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",         val: "text-amber-600 dark:text-amber-400"},
};

const StatCard: React.FC<StatCardProps> = ({icon, label, value, sub, accent = "primary"}) => {
    const cls = accentMap[accent];
    return (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-dark-800 bg-white dark:bg-dark-900">
            <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${cls.icon}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-400 dark:text-dark-500 truncate">{label}</p>
                <p className={`text-lg font-bold leading-tight ${cls.val}`}>{value}</p>
                {sub && <p className="text-xs text-gray-400 dark:text-dark-500">{sub}</p>}
            </div>
        </div>
    );
};

// ── Session row ───────────────────────────────────────────────────────────────

interface SessionRowProps {
    session: Session;
    onRevoke: (id: string) => void;
    revoking: boolean;
}

const SessionRow: React.FC<SessionRowProps> = ({session, onRevoke, revoking}) => {
    const location = session.location
        ? `${session.location.city}, ${session.location.country}`
        : session.ipAddress;

    const accentCls = session.isCurrent
        ? "before:bg-emerald-400 dark:before:bg-emerald-500"
        : "before:bg-gray-300 dark:before:bg-dark-600";

    return (
        <div className={`relative pl-4 px-4 py-3.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors before:absolute before:left-0 before:inset-y-3 before:w-0.5 before:rounded-full ${accentCls}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`size-7 rounded-md flex items-center justify-center shrink-0 ${session.isCurrent ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-gray-100 dark:bg-dark-800 text-gray-400 dark:text-dark-500"}`}>
                        <DeviceIcon type={session.deviceType}/>
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-800 dark:text-dark-100 truncate">
                                {session.browser} on {session.os}
                            </span>
                            {session.isCurrent && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                                    <span className="size-1 rounded-full bg-emerald-500 animate-pulse"/>
                                    Current
                                </span>
                            )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400 dark:text-dark-500 flex-wrap">
                            <span className="flex items-center gap-1">
                                <Globe size={10}/>
                                {location}
                            </span>
                            <span className="text-gray-200 dark:text-dark-700">·</span>
                            <span>Active {relativeTime(session.lastActivity)}</span>
                        </div>
                    </div>
                </div>
                {!session.isCurrent && (
                    <button
                        onClick={() => onRevoke(session.sessionId)}
                        disabled={revoking}
                        className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-100 dark:border-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Trash2 size={11}/>
                        Revoke
                    </button>
                )}
            </div>
        </div>
    );
};

// ── Activity log row ──────────────────────────────────────────────────────────

const ActivityRow: React.FC<{entry: ActivityLog}> = ({entry}) => {
    const location = entry.location
        ? `${entry.location.city}, ${entry.location.country}`
        : entry.ipAddress;

    const accentCls = entry.success
        ? "before:bg-emerald-400 dark:before:bg-emerald-500"
        : "before:bg-red-400 dark:before:bg-red-500";

    const iconBoxCls = entry.success
        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400";

    return (
        <div className={`relative pl-4 px-4 py-3.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors before:absolute before:left-0 before:inset-y-3 before:w-0.5 before:rounded-full ${accentCls}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`size-7 rounded-md flex items-center justify-center shrink-0 ${iconBoxCls}`}>
                        <ActionIcon action={entry.action}/>
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-800 dark:text-dark-100">
                                {formatAction(entry.action)}
                            </span>
                            {entry.success ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={10}/>
                                    Success
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 dark:text-red-400">
                                    <XCircle size={10}/>
                                    Failed
                                </span>
                            )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400 dark:text-dark-500 flex-wrap">
                            <span className="flex items-center gap-1">
                                <Globe size={10}/>
                                {location}
                            </span>
                            {entry.errorMessage && (
                                <>
                                    <span className="text-gray-200 dark:text-dark-700">·</span>
                                    <span className="text-red-400 dark:text-red-500 truncate max-w-[180px]">{entry.errorMessage}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <span className="text-xs text-gray-400 dark:text-dark-500 shrink-0 whitespace-nowrap">{fmtDate(entry.timestamp)}</span>
            </div>
        </div>
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const LogsPage: NextPageWithLayout = () => {
    const [stats, setStats] = useState<AuthStats | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activity, setActivity] = useState<ActivityLog[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [loadingActivity, setLoadingActivity] = useState(true);
    const [revoking, setRevoking] = useState<string | null>(null);
    const [activityLimit, setActivityLimit] = useState(20);
    const [showAll, setShowAll] = useState(false);

    const fetchAll = useCallback(async () => {
        setLoadingStats(true);
        setLoadingSessions(true);
        setLoadingActivity(true);
        try {
            const [statsRes, sessionsRes, activityRes] = await Promise.all([
                authService.getStats(),
                authService.getSessions(),
                authService.getActivity(activityLimit),
            ]);
            setStats(statsRes);
            setSessions(sessionsRes.sessions);
            setActivity(activityRes.activity);
        } catch {
            toast.error("Failed to load security data");
        } finally {
            setLoadingStats(false);
            setLoadingSessions(false);
            setLoadingActivity(false);
        }
    }, [activityLimit]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleRevoke = async (sessionId: string) => {
        setRevoking(sessionId);
        try {
            await authService.revokeSession(sessionId);
            toast.success("Session revoked");
            setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
            setStats((prev) => prev ? {
                ...prev,
                sessions: {
                    ...prev.sessions,
                    activeSessions: Math.max(0, prev.sessions.activeSessions - 1),
                },
            } : prev);
        } catch {
            toast.error("Failed to revoke session");
        } finally {
            setRevoking(null);
        }
    };

    const handleLoadMore = () => {
        setShowAll(true);
        setActivityLimit(100);
    };

    const displayedActivity = showAll ? activity : activity.slice(0, 10);

    return (
        <div className="space-y-5">
            {/* Suspicious activity alert */}
            {stats?.security.suspiciousActivity && (
                <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5">
                    <ShieldAlert size={18} className="text-red-500 shrink-0 mt-0.5"/>
                    <div>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">Suspicious activity detected</p>
                        <p className="text-xs text-red-500/80 dark:text-red-400/70 mt-0.5">
                            {[
                                stats.security.details?.multipleFailedAttempts && "Multiple failed login attempts",
                                stats.security.details?.multipleLocations && "Sign-ins from multiple locations",
                            ].filter(Boolean).join(" · ") || "Unusual account activity was detected."}
                            {" "}Review your sessions below and revoke any you don't recognise.
                        </p>
                    </div>
                </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {loadingStats ? (
                    <>
                        {[1,2,3,4].map((i) => (
                            <div key={i} className="h-20 rounded-xl border border-gray-100 dark:border-dark-800 animate-pulse bg-gray-50 dark:bg-dark-800"/>
                        ))}
                    </>
                ) : stats ? (
                    <>
                        <StatCard
                            icon={<ShieldCheck size={16}/>}
                            label="Active Sessions"
                            value={stats.sessions.activeSessions}
                            sub={`of ${stats.sessions.maxAllowed} max`}
                            accent="primary"
                        />
                        <StatCard
                            icon={<LogIn size={16}/>}
                            label="Logins (30d)"
                            value={stats.authentication.logins}
                            accent="emerald"
                        />
                        <StatCard
                            icon={<XCircle size={16}/>}
                            label="Failed Logins (30d)"
                            value={stats.authentication.failedLogins}
                            accent={stats.authentication.failedLogins > 5 ? "red" : "amber"}
                        />
                        <StatCard
                            icon={stats.security.suspiciousActivity ? <ShieldAlert size={16}/> : <Shield size={16}/>}
                            label="Security Status"
                            value={stats.security.suspiciousActivity ? "Alert" : "Secure"}
                            accent={stats.security.suspiciousActivity ? "red" : "emerald"}
                        />
                    </>
                ) : null}
            </div>

            {/* Sessions */}
            <div className="card">
                <div className="card-header flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-md bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
                            <Laptop size={15} className="text-primary-600 dark:text-primary-400"/>
                        </div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                            Active Sessions
                            {!loadingSessions && sessions.length > 0 && (
                                <span className="ml-2 text-xs font-normal text-gray-400 dark:text-dark-500">
                                    ({sessions.length})
                                </span>
                            )}
                        </h2>
                    </div>
                    <button
                        onClick={fetchAll}
                        className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:text-primary-400 dark:hover:bg-primary-500/10 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={14}/>
                    </button>
                </div>

                <div className="card-body">
                    {loadingSessions ? (
                        <Skeleton rows={2}/>
                    ) : sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="size-10 rounded-xl bg-gray-50 dark:bg-dark-800 flex items-center justify-center mb-3">
                                <Monitor size={18} className="text-gray-300 dark:text-dark-600"/>
                            </div>
                            <p className="text-sm text-gray-400 dark:text-dark-500">No active sessions found.</p>
                        </div>
                    ) : (
                        <div className="space-y-px">
                            {/* Current session first */}
                            {[...sessions].sort((a, b) => (a.isCurrent ? -1 : b.isCurrent ? 1 : 0)).map((session) => (
                                <SessionRow
                                    key={session.sessionId}
                                    session={session}
                                    onRevoke={handleRevoke}
                                    revoking={revoking === session.sessionId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Activity log */}
            <div className="card">
                <div className="card-header flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-md bg-amber-50 dark:bg-amber-950 flex items-center justify-center shrink-0">
                            <Activity size={15} className="text-amber-600 dark:text-amber-400"/>
                        </div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                            Activity Log
                            {!loadingActivity && activity.length > 0 && (
                                <span className="ml-2 text-xs font-normal text-gray-400 dark:text-dark-500">
                                    ({activity.length})
                                </span>
                            )}
                        </h2>
                    </div>
                    <button
                        onClick={fetchAll}
                        className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:text-primary-400 dark:hover:bg-primary-500/10 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={14}/>
                    </button>
                </div>

                <div className="card-body">
                    {loadingActivity ? (
                        <Skeleton rows={4}/>
                    ) : activity.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="size-10 rounded-xl bg-gray-50 dark:bg-dark-800 flex items-center justify-center mb-3">
                                <Activity size={18} className="text-gray-300 dark:text-dark-600"/>
                            </div>
                            <p className="text-sm text-gray-400 dark:text-dark-500">No activity recorded yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-px">
                                {displayedActivity.map((entry, i) => (
                                    <ActivityRow key={i} entry={entry}/>
                                ))}
                            </div>

                            {activity.length > 10 && !showAll && (
                                <div className="mt-3 flex justify-center">
                                    <button
                                        onClick={handleLoadMore}
                                        className="flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                                    >
                                        <ChevronDown size={13}/>
                                        Show more ({activity.length - 10} remaining)
                                    </button>
                                </div>
                            )}
                            {showAll && activity.length > 10 && (
                                <div className="mt-3 flex justify-center">
                                    <button
                                        onClick={() => setShowAll(false)}
                                        className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 transition-colors"
                                    >
                                        <ChevronUp size={13}/>
                                        Show less
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogsPage;