import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    AlertTriangle,
    Ban,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    CircleSlash2,
    Crown,
    Filter,
    MoreHorizontal,
    RefreshCw,
    Search,
    Shield,
    ShieldCheck,
    Trash2,
    User,
    UserCheck,
    Users as UsersIcon,
    X,
    XCircle,
} from 'lucide-react';
import {adminService, AdminUser} from '@src/services/adminService';
import {useAuth} from '@hooks/useAuth';
import {getAvatar} from '@src/utils/url_helper';
import {UserRole} from '@dtos/auth';
import { StatCardGrid, StatCardItem } from './components/StatCard';

/* ─── tiny helpers ─────────────────────────────────────────────────── */
function timeAgo(iso?: string | null) {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(iso).toLocaleDateString();
}

const ROLE_META: Record<UserRole, { label: string; icon: React.ReactNode; cls: string }> = {
    admin: {
        label: 'Admin',
        icon: <Crown className="size-3"/>,
        cls: 'bg-violet-500/15 text-violet-400 border-violet-500/30'
    },
    moderator: {
        label: 'Moderator',
        icon: <Shield className="size-3"/>,
        cls: 'bg-amber-500/15  text-amber-400  border-amber-500/30'
    },
    user: {
        label: 'User',
        icon: <User className="size-3"/>,
        cls: 'bg-slate-500/15  text-slate-400  border-slate-500/30'
    },
};

const STAT_ITEMS: StatCardItem[] = [
    { key: 'total',     label: 'Total Users',  icon: <UsersIcon  className="size-4"/>, color: 'text-sky-400',     bg: 'bg-sky-400/10'     },
    { key: 'admin',     label: 'Admins',       icon: <Crown      className="size-4"/>, color: 'text-violet-400', bg: 'bg-violet-400/10'  },
    { key: 'moderator', label: 'Moderators',   icon: <Shield     className="size-4"/>, color: 'text-amber-400',  bg: 'bg-amber-400/10'   },
    { key: 'user',      label: 'Members',      icon: <UserCheck  className="size-4"/>, color: 'text-emerald-400',bg: 'bg-emerald-400/10' },
    { key: 'suspended', label: 'Suspended',    icon: <Ban        className="size-4"/>, color: 'text-red-400',    bg: 'bg-red-400/10'     },
];

/* ─── Confirm modal ──────────────────────────────────────────────────── */
interface ConfirmModal {
    open: boolean;
    title: string;
    body: React.ReactNode;
    danger?: boolean;
    onConfirm: () => void;
}

/* ─── Row action menu ────────────────────────────────────────────────── */
function ActionMenu({
                        user,
                        currentUserId,
                        onRoleChange,
                        onSuspend,
                        onUnsuspend,
                        onDelete,
                    }: {
    user: AdminUser;
    currentUserId: string;
    onRoleChange: (u: AdminUser, role: UserRole) => void;
    onSuspend: (u: AdminUser) => void;
    onUnsuspend: (u: AdminUser) => void;
    onDelete: (u: AdminUser) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isSelf = user._id === currentUserId;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const roles: UserRole[] = ['user', 'moderator', 'admin'];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
            >
                <MoreHorizontal className="size-4"/>
            </button>

            {open && (
                <div
                    className="absolute right-0 z-50 w-48 rounded-xl overflow-hidden shadow-2xl"
                    style={{
                        top: 'calc(100% + 4px)',
                        background: 'linear-gradient(135deg, #1a1f2e 0%, #141824 100%)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    {/* Role section */}
                    <div className="px-3 py-2 border-b border-white/5">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-1.5">Change
                            Role</p>
                        <div className="flex flex-col gap-0.5">
                            {roles.map(r => {
                                const meta = ROLE_META[r];
                                const isCurrentRole = user.role === r;
                                return (
                                    <button
                                        key={r}
                                        disabled={isCurrentRole || isSelf}
                                        onClick={() => {
                                            onRoleChange(user, r);
                                            setOpen(false);
                                        }}
                                        className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs transition-colors
                                            ${isCurrentRole
                                            ? 'opacity-40 cursor-not-allowed'
                                            : isSelf
                                                ? 'opacity-30 cursor-not-allowed'
                                                : 'hover:bg-white/5 cursor-pointer'
                                        }`}
                                    >
                                        <span
                                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] ${meta.cls}`}>
                                            {meta.icon} {meta.label}
                                        </span>
                                        {isCurrentRole && <span className="ml-auto text-emerald-500"><CheckCircle2
                                            className="size-3"/></span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions section */}
                    <div className="px-2 py-1.5 flex flex-col gap-0.5">
                        {user.isSuspended ? (
                            <button
                                onClick={() => {
                                    onUnsuspend(user);
                                    setOpen(false);
                                }}
                                className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            >
                                <CircleSlash2 className="size-3.5"/> Unsuspend
                            </button>
                        ) : (
                            <button
                                disabled={isSelf}
                                onClick={() => {
                                    onSuspend(user);
                                    setOpen(false);
                                }}
                                className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-amber-400 hover:bg-amber-500/10 transition-colors
                                    ${isSelf ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                                <Ban className="size-3.5"/> Suspend
                            </button>
                        )}
                        <button
                            disabled={isSelf}
                            onClick={() => {
                                onDelete(user);
                                setOpen(false);
                            }}
                            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-red-400 hover:bg-red-500/10 transition-colors
                                ${isSelf ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                            <Trash2 className="size-3.5"/> Delete User
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Suspend reason input modal ─────────────────────────────────────── */
function SuspendModal({
                          user,
                          onConfirm,
                          onCancel,
                      }: {
    user: AdminUser | null;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
}) {
    const [reason, setReason] = useState('');
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel}/>
            <div
                className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
                style={{
                    background: 'linear-gradient(135deg, #1a1f2e 0%, #141824 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-amber-500/15">
                        <Ban className="size-5 text-amber-400"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-100">Suspend User</h3>
                        <p className="text-xs text-slate-500">@{user.username}</p>
                    </div>
                </div>
                <label className="block text-xs text-slate-400 mb-1.5">Reason <span
                    className="text-slate-600">(optional)</span></label>
                <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="e.g. Violation of terms of service..."
                    rows={3}
                    className="w-full rounded-lg px-3 py-2 text-sm bg-white/5 border border-white/8 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 resize-none"
                />
                <div className="flex gap-2 mt-4">
                    <button onClick={onCancel}
                            className="flex-1 py-2 rounded-lg text-sm text-slate-400 bg-white/5 hover:bg-white/8 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(reason.trim())}
                        className="flex-1 py-2 rounded-lg text-sm font-medium text-amber-900 bg-amber-400 hover:bg-amber-300 transition-colors"
                    >
                        Suspend
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Delete confirm modal ───────────────────────────────────────────── */
function DeleteModal({user, onConfirm, onCancel}: {
    user: AdminUser | null;
    onConfirm: () => void;
    onCancel: () => void
}) {
    if (!user) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel}/>
            <div
                className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
                style={{
                    background: 'linear-gradient(135deg, #1a1f2e 0%, #141824 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-red-500/15">
                        <AlertTriangle className="size-5 text-red-400"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-100">Delete User</h3>
                        <p className="text-xs text-slate-500">This action cannot be undone</p>
                    </div>
                </div>
                <p className="text-sm text-slate-400 mb-5">
                    Are you sure you want to permanently delete{' '}
                    <span className="font-semibold text-slate-200">@{user.username}</span>?
                    All their data and sessions will be removed.
                </p>
                <div className="flex gap-2">
                    <button onClick={onCancel}
                            className="flex-1 py-2 rounded-lg text-sm text-slate-400 bg-white/5 hover:bg-white/8 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                            className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-400 transition-colors">
                        Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Skeleton row ───────────────────────────────────────────────────── */
function SkeletonRow() {
    return (
        <tr className="border-b border-white/4">
            {[48, 32, 24, 16, 20, 20, 8].map((w, i) => (
                <td key={i} className="px-4 py-3.5">
                    <div className="h-4 rounded-md bg-white/5 animate-pulse"
                         style={{width: `${w * 4}px`, maxWidth: '100%'}}/>
                </td>
            ))}
        </tr>
    );
}

/* ─── Main component ─────────────────────────────────────────────────── */
const PAGE_SIZE = 7;

export default function Users() {
    const {user: currentUser} = useAuth();

    /* data */
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [stats, setStats] = useState<{
        total: number;
        roles: Record<string, number>;
        suspended: number
    } | null>(null);

    /* filters */
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [suspendedFilter, setSuspendedFilter] = useState<'' | 'true' | 'false'>('');

    /* ui */
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

    /* modals */
    const [suspendTarget, setSuspendTarget] = useState<AdminUser | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* ── fetch ───────────────────────────────────────────────────────── */
    const fetchUsers = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const params: Record<string, any> = {page, limit: PAGE_SIZE};
            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;
            if (suspendedFilter) params.suspended = suspendedFilter;

            const [data, statsData] = await Promise.all([
                adminService.listUsers(params),
                adminService.getStats(),
            ]);
            setUsers(data.users);
            setTotal(data.pagination.total);
            setPages(data.pagination.pages);
            setStats(statsData);
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [page, search, roleFilter, suspendedFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    /* ── debounced search ────────────────────────────────────────────── */
    const handleSearchChange = (v: string) => {
        setSearch(v);
        setPage(1);
        if (searchTimer.current) clearTimeout(searchTimer.current);
    };

    /* ── toast helper ────────────────────────────────────────────────── */
    const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
        setToast({msg, type});
        setTimeout(() => setToast(null), 3500);
    };

    /* ── actions ─────────────────────────────────────────────────────── */
    const handleRoleChange = async (user: AdminUser, role: UserRole) => {
        try {
            await adminService.updateUserRole(user._id, role);
            showToast(`@${user.username} is now ${role}`);
            fetchUsers(true);
        } catch (e: any) {
            showToast(e?.response?.data?.message || 'Role change failed', 'err');
        }
    };

    const handleSuspend = async (reason: string) => {
        if (!suspendTarget) return;
        try {
            await adminService.suspendUser(suspendTarget._id, reason || undefined);
            showToast(`@${suspendTarget.username} suspended`);
            setSuspendTarget(null);
            fetchUsers(true);
        } catch (e: any) {
            showToast(e?.response?.data?.message || 'Suspend failed', 'err');
            setSuspendTarget(null);
        }
    };

    const handleUnsuspend = async (user: AdminUser) => {
        try {
            await adminService.unsuspendUser(user._id);
            showToast(`@${user.username} unsuspended`);
            fetchUsers(true);
        } catch (e: any) {
            showToast(e?.response?.data?.message || 'Unsuspend failed', 'err');
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await adminService.deleteUser(deleteTarget._id);
            showToast(`@${deleteTarget.username} deleted`);
            setDeleteTarget(null);
            fetchUsers(true);
        } catch (e: any) {
            showToast(e?.response?.data?.message || 'Delete failed', 'err');
            setDeleteTarget(null);
        }
    };

    /* ── stat values ─────────────────────────────────────────────────── */
    const statValues: Record<string, number> = {
        total: stats?.total ?? 0,
        admin: stats?.roles?.admin ?? 0,
        moderator: stats?.roles?.moderator ?? 0,
        user: stats?.roles?.user ?? 0,
        suspended: stats?.suspended ?? 0,
    };

    /* ── render ──────────────────────────────────────────────────────── */
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

                .adm-page { font-family: system-ui, sans-serif; }
                .adm-mono { font-family: 'JetBrains Mono', monospace; }
                .adm-display { font-family: 'Syne', sans-serif; }

                .adm-card {
                   background: linear-gradient(
  145deg,
  rgba(0, 0, 0, 0.03) 0%,
  rgba(255, 255, 255, 0.04) 100%
);
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

                .adm-row {
                    transition: background 0.1s ease;
                }
                .adm-row:hover {
                    background: rgba(255,255,255,0.025);
                }
                .adm-row.suspended-row {
                    opacity: 0.6;
                }
                .adm-row.suspended-row:hover {
                    opacity: 0.85;
                }

                .adm-input {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    color: #cbd5e1;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                    border-radius: 10px;
                    outline: none;
                }
                .adm-input:focus {
                    border-color: rgba(99,102,241,0.5);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
                }
                .adm-input::placeholder { color: #475569; }

                .adm-select {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    color: #94a3b8;
                    border-radius: 10px;
                    outline: none;
                    cursor: pointer;
                    appearance: none;
                    transition: border-color 0.2s;
                }
                .adm-select:focus { border-color: rgba(99,102,241,0.5); }
                .adm-select option { background: #1a1f2e; color: #cbd5e1; }

                .adm-page-btn {
                    display: flex; align-items: center; justify-content: center;
                    width: 32px; height: 32px; border-radius: 8px;
                    font-size: 13px;
                    transition: background 0.15s ease, color 0.15s ease;
                    border: 1px solid transparent;
                }
                .adm-page-btn:hover:not(:disabled) {
                    background: rgba(255,255,255,0.06);
                    color: #e2e8f0;
                }
                .adm-page-btn.active {
                    background: rgba(99,102,241,0.2);
                    border-color: rgba(99,102,241,0.4);
                    color: #a5b4fc;
                    font-weight: 600;
                }
                .adm-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

                .toast-ok  { background: linear-gradient(135deg,#064e3b,#065f46); border: 1px solid rgba(16,185,129,0.3); }
                .toast-err { background: linear-gradient(135deg,#450a0a,#7f1d1d); border: 1px solid rgba(239,68,68,0.3); }

                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .adm-row { animation: fadeSlideIn 0.2s ease both; }
            `}</style>

            <div className="adm-page min-h-full" style={{color: '#cbd5e1'}}>

                {/* ── Toast ────────────────────────────────────────── */}
                {toast && (
                    <div
                        className={`fixed top-6 right-6 z-[300] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium ${toast.type === 'ok' ? 'toast-ok text-emerald-200' : 'toast-err text-red-200'}`}
                        style={{animation: 'fadeSlideIn 0.25s ease'}}
                    >
                        {toast.type === 'ok' ? <CheckCircle2 className="size-4 shrink-0"/> :
                            <XCircle className="size-4 shrink-0"/>}
                        {toast.msg}
                    </div>
                )}

                {/* ── Header ───────────────────────────────────────── */}
                <div className="mb-6 flex items-end gap-4 flex-wrap">
                    <div>
                        <p className="adm-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{color: '#4f6396'}}>
                            Admin / Users
                        </p>
                        <h1 className="adm-display text-2xl font-bold"
                            style={{color: '#3e4042', letterSpacing: '-0.02em'}}>
                            User Management
                        </h1>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        {stats && (
                            <span className="adm-mono text-xs px-2.5 py-1 rounded-full" style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#64748b'
                            }}>
                                {stats.total.toLocaleString()} records
                            </span>
                        )}
                        <button
                            onClick={() => fetchUsers(true)}
                            disabled={refreshing}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#94a3b8'
                            }}
                        >
                            <RefreshCw className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`}/>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* ── Stat cards ───────────────────────────────────── */}
                <StatCardGrid items={STAT_ITEMS} values={statValues} loading={loading} />


                {/* ── Filters ──────────────────────────────────────── */}
                <div className="adm-card p-3 mb-4 flex flex-wrap gap-2 items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5"
                                style={{color: '#475569'}}/>
                        <input
                            type="text"
                            className="adm-input w-full pl-8 pr-3 py-2 text-sm"
                            placeholder="Search username or email…"
                            value={search}
                            onChange={e => handleSearchChange(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => {
                                setSearch('');
                                setPage(1);
                            }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                                <X className="size-3.5"/>
                            </button>
                        )}
                    </div>

                    {/* Role filter */}
                    <div className="relative">
                        <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none"
                                style={{color: '#475569'}}/>
                        <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none"
                                        style={{color: '#475569'}}/>
                        <select
                            className="adm-select pl-7 pr-6 py-2 text-sm"
                            value={roleFilter}
                            onChange={e => {
                                setRoleFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    {/* Suspended filter */}
                    <div className="relative">
                        <Ban className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none"
                             style={{color: '#475569'}}/>
                        <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none"
                                        style={{color: '#475569'}}/>
                        <select
                            className="adm-select pl-7 pr-6 py-2 text-sm"
                            value={suspendedFilter}
                            onChange={e => {
                                setSuspendedFilter(e.target.value as '' | 'true' | 'false');
                                setPage(1);
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="false">Active</option>
                            <option value="true">Suspended</option>
                        </select>
                    </div>

                    {/* Active filter chips */}
                    {(roleFilter || suspendedFilter || search) && (
                        <button
                            onClick={() => {
                                setRoleFilter('');
                                setSuspendedFilter('');
                                setSearch('');
                                setPage(1);
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs transition-colors"
                            style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.2)',
                                color: '#f87171'
                            }}
                        >
                            <X className="size-3"/> Clear filters
                        </button>
                    )}
                </div>

                {/* ── Table ────────────────────────────────────────── */}
                <div className="adm-card overflow-hidden">
                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <XCircle className="size-10 text-red-500/50"/>
                            <p className="text-sm text-red-400">{error}</p>
                            <button onClick={() => fetchUsers()}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/8">
                                Try again
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                    background: 'rgba(255,255,255,0.02)'
                                }}>
                                    {['User', 'Role', 'Status', 'Provider', 'Joined', 'Last Login', ''].map((h, i) => (
                                        <th
                                            key={i}
                                            className="adm-mono px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium"
                                            style={{color: '#334155'}}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {loading
                                    ? Array.from({length: 8}).map((_, i) => <SkeletonRow key={i}/>)
                                    : users.length === 0
                                        ? (
                                            <tr>
                                                <td colSpan={7}>
                                                    <div
                                                        className="flex flex-col items-center justify-center py-20 gap-3">
                                                        <UsersIcon className="size-10" style={{color: '#1e293b'}}/>
                                                        <p className="text-sm" style={{color: '#475569'}}>No users
                                                            found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                        : users.map((u, i) => {
                                            const roleMeta = ROLE_META[u.role];
                                            const isSelf = u._id === currentUser?._id;

                                            return (
                                                <tr
                                                    key={u._id}
                                                    className={`adm-row border-b ${u.isSuspended ? 'suspended-row' : ''}`}
                                                    style={{
                                                        borderColor: 'rgba(255,255,255,0.04)',
                                                        animationDelay: `${i * 25}ms`,
                                                    }}
                                                >
                                                    {/* User */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative shrink-0">
                                                                <img
                                                                    src={u.profilePic?.url || getAvatar(u.username)}
                                                                    alt={u.username}
                                                                    className="size-8 rounded-lg object-cover"
                                                                    style={{border: '1px solid rgba(255,255,255,0.08)'}}
                                                                />
                                                                {isSelf && (
                                                                    <span
                                                                        className="absolute -bottom-1 -right-1 size-3 rounded-full bg-indigo-500 border border-black"
                                                                        title="You"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium truncate"
                                                                   style={{color: '#e2e8f0'}}>
                                                                    {u.username}
                                                                    {isSelf && <span
                                                                        className="ml-1.5 text-[10px] text-indigo-400 font-mono">(you)</span>}
                                                                </p>
                                                                <p className="adm-mono text-xs truncate"
                                                                   style={{color: '#475569'}}>{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Role */}
                                                    <td className="px-4 py-3">
                                                            <span
                                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${roleMeta.cls}`}>
                                                                {roleMeta.icon}
                                                                {roleMeta.label}
                                                            </span>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-4 py-3">
                                                        {u.isSuspended ? (
                                                            <span
                                                                className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
                                                                style={{
                                                                    background: 'rgba(245,158,11,0.1)',
                                                                    border: '1px solid rgba(245,158,11,0.25)',
                                                                    color: '#fbbf24'
                                                                }}
                                                                title={u.suspendedReason || undefined}
                                                            >
                                                                    <Ban className="size-3"/> Suspended
                                                                </span>
                                                        ) : u.isVerified ? (
                                                            <span
                                                                className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
                                                                style={{
                                                                    background: 'rgba(16,185,129,0.1)',
                                                                    border: '1px solid rgba(16,185,129,0.25)',
                                                                    color: '#34d399'
                                                                }}
                                                            >
                                                                    <ShieldCheck className="size-3"/> Verified
                                                                </span>
                                                        ) : (
                                                            <span
                                                                className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
                                                                style={{
                                                                    background: 'rgba(100,116,139,0.1)',
                                                                    border: '1px solid rgba(100,116,139,0.2)',
                                                                    color: '#64748b'
                                                                }}
                                                            >
                                                                    <CircleSlash2 className="size-3"/> Unverified
                                                                </span>
                                                        )}
                                                    </td>

                                                    {/* Provider */}
                                                    <td className="px-4 py-3">
                                                            <span className="adm-mono text-xs"
                                                                  style={{color: '#475569'}}>
                                                                {u.provider === 'google' ? '🔷 Google' : '🔑 Local'}
                                                            </span>
                                                    </td>

                                                    {/* Joined */}
                                                    <td className="px-4 py-3">
                                                            <span className="adm-mono text-xs"
                                                                  style={{color: '#475569'}}>
                                                                {timeAgo(u.createdAt)}
                                                            </span>
                                                    </td>

                                                    {/* Last Login */}
                                                    <td className="px-4 py-3">
                                                            <span className="adm-mono text-xs"
                                                                  style={{color: '#475569'}}>
                                                                {timeAgo(u.lastLogin)}
                                                            </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-3">
                                                        <ActionMenu
                                                            user={u}
                                                            currentUserId={currentUser?._id ?? ''}
                                                            onRoleChange={handleRoleChange}
                                                            onSuspend={setSuspendTarget}
                                                            onUnsuspend={handleUnsuspend}
                                                            onDelete={setDeleteTarget}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                }
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── Pagination ─────────────────────────────────── */}
                    {!loading && !error && pages > 1 && (
                        <div
                            className="flex items-center justify-between px-4 py-3"
                            style={{borderTop: '1px solid rgba(255,255,255,0.05)'}}
                        >
                            <span className="adm-mono text-xs" style={{color: '#334155'}}>
                                {total.toLocaleString()} total · page {page} of {pages}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    className="adm-page-btn"
                                    style={{color: '#475569'}}
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    <ChevronLeft className="size-4"/>
                                </button>
                                {Array.from({length: Math.min(pages, 7)}, (_, i) => {
                                    const p = pages <= 7 ? i + 1 : i === 0 ? 1 : i === 6 ? pages : page - 3 + i;
                                    if (p < 1 || p > pages) return null;
                                    return (
                                        <button
                                            key={p}
                                            className={`adm-page-btn ${p === page ? 'active' : ''}`}
                                            style={{color: p === page ? undefined : '#475569'}}
                                            onClick={() => setPage(p)}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                                <button
                                    className="adm-page-btn"
                                    style={{color: '#475569'}}
                                    disabled={page === pages}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    <ChevronRight className="size-4"/>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modals ─────────────────────────────────────────── */}
            <SuspendModal
                user={suspendTarget}
                onConfirm={handleSuspend}
                onCancel={() => setSuspendTarget(null)}
            />
            <DeleteModal
                user={deleteTarget}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </>
    );
}
