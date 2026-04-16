import React, { useState, useEffect, useCallback } from 'react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    Clock,
    Edit3,
    FileText,
    Filter,
    Globe,
    RefreshCw,
    Search,
    ThumbsDown,
    ThumbsUp,
    Trash2,
    X,
    XCircle,
} from 'lucide-react';
import TemplateCard from '@src/pages/Template/TemplateCard';
import {
    adminService,
    AdminTemplate,
    AdminTemplateStats,
} from '@src/services/adminService';
import { getAvatar } from '@src/utils/url_helper';

/* ─── constants ─────────────────────────────────────────────────────── */
const CATEGORIES = ['Modern', 'Classic', 'Creative', 'Minimal', 'Professional', 'Other'];
const PAGE_SIZE = 12;

const STAT_ITEMS = [
    { key: 'total',    label: 'Total',    icon: <FileText     className="size-4" />, color: 'text-sky-400',     bg: 'bg-sky-400/10'     },
    { key: 'pending',   label: 'Pending',   icon: <Clock        className="size-4" />, color: 'text-amber-400',   bg: 'bg-amber-400/10'   },
    { key: 'published', label: 'Published', icon: <CheckCircle2 className="size-4" />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { key: 'draft',     label: 'Draft',     icon: <Edit3        className="size-4" />, color: 'text-slate-400',   bg: 'bg-slate-400/10'   },
    { key: 'public',   label: 'Public',   icon: <Globe        className="size-4" />, color: 'text-violet-400',  bg: 'bg-violet-400/10'  },
];

/* ─── skeletons ─────────────────────────────────────────────────────── */
function StatSkeleton() {
    return (
        <div className="adm-card adm-stat-card p-4">
            <div className="size-8 rounded-lg bg-white/5 animate-pulse mb-2.5" />
            <div className="h-6 w-10 rounded-md bg-white/5 animate-pulse mb-1" />
            <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
        </div>
    );
}

function TemplateSkeleton() {
    return (
        <div style={{ width: '230px', flexShrink: 0 }}>
            <div
                className="rounded-xl bg-white/5 animate-pulse"
                style={{ width: '230px', aspectRatio: '210 / 297' }}
            />
            <div className="mt-2.5 space-y-1.5">
                <div className="h-3.5 w-32 rounded bg-white/5 animate-pulse" />
                <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
            </div>
        </div>
    );
}

/* ─── submitter chip ────────────────────────────────────────────────── */
function SubmitterChip({ userId }: { userId: AdminTemplate['userId'] }) {
    if (typeof userId === 'string') return null;
    const avatarUrl = userId?.profilePic?.url || getAvatar(userId?.username || 'user');
    return (
        <div className="flex items-center gap-1.5 min-w-0">
            <img
                src={avatarUrl}
                alt={userId?.username}
                className="size-4 rounded-full object-cover shrink-0"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <span
                className="adm-mono text-[10px] truncate"
                style={{ color: '#475569' }}
                title={userId?.email}
            >
                @{userId?.username || 'unknown'}
            </span>
        </div>
    );
}

/* ─── pending card (approve / reject) ──────────────────────────────── */
function PendingCard({
    template,
    onApprove,
    onReject,
    busy,
}: {
    template: AdminTemplate;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    busy: boolean;
}) {
    return (
        <div style={{ width: '230px', flexShrink: 0 }}>
            <TemplateCard template={template} isOwn={false} />

            <div className="mt-1.5 flex items-center justify-between gap-2 px-0.5">
                <SubmitterChip userId={template.userId} />
            </div>

            <div className="mt-1.5 flex gap-1.5 px-0.5">
                <button
                    disabled={busy}
                    onClick={() => onReject(template._id)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                    style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#f87171',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.16)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
                >
                    <ThumbsDown className="size-3" /> Reject
                </button>
                <button
                    disabled={busy}
                    onClick={() => onApprove(template._id)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                    style={{
                        background: 'rgba(16,185,129,0.08)',
                        border: '1px solid rgba(16,185,129,0.2)',
                        color: '#34d399',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.16)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.08)'; }}
                >
                    <ThumbsUp className="size-3" /> Approve
                </button>
            </div>
        </div>
    );
}

/* ─── published card ────────────────────────────────────────────────── */
function PublishedCard({
    template,
    onDelete,
}: {
    template: AdminTemplate;
    onDelete: (id: string) => void;
}) {
    return (
        <div style={{ width: '230px', flexShrink: 0 }}>
            <TemplateCard template={template} isOwn={false} />
            <div className="mt-1.5 flex items-center justify-between gap-2 px-0.5">
                <SubmitterChip userId={template.userId} />
                <button
                    onClick={() => {
                        if (window.confirm(`Delete "${template.name}"?`)) onDelete(template._id);
                    }}
                    className="shrink-0 p-1 rounded-md transition-colors"
                    style={{ color: '#334155' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#334155'; }}
                    title="Delete template"
                >
                    <Trash2 className="size-3.5" />
                </button>
            </div>
        </div>
    );
}

/* ─── main component ────────────────────────────────────────────────── */
export default function Templates() {
    /* stats */
    const [stats, setStats] = useState<AdminTemplateStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    /* tab */
    const [tab, setTab] = useState<'pending' | 'published'>('pending');

    /* pending */
    const [pending, setPending] = useState<AdminTemplate[]>([]);
    const [pendingLoading, setPendingLoading] = useState(true);
    const [actionBusy, setActionBusy] = useState(false);

    /* published */
    const [published, setPublished] = useState<AdminTemplate[]>([]);
    const [pubTotal, setPubTotal] = useState(0);
    const [pubPages, setPubPages] = useState(1);
    const [pubLoading, setPubLoading] = useState(false);
    const [pubPage, setPubPage] = useState(1);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');

    /* ui */
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

    const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    /* ── fetchers ───────────────────────────────────────────────────── */
    const fetchStats = useCallback(async () => {
        try {
            const s = await adminService.getTemplateStats();
            setStats(s);
        } catch {
            /* stats failure is non-critical */
        } finally {
            setStatsLoading(false);
        }
    }, []);

    const fetchPending = useCallback(async () => {
        setPendingLoading(true);
        try {
            const res = await adminService.listAdminTemplates({ status: 'pending', limit: 100 });
            setPending(res.templates);
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Failed to load pending templates');
        } finally {
            setPendingLoading(false);
        }
    }, []);

    const fetchPublished = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        setPubLoading(true);
        try {
            const params: any = { status: 'published', page: pubPage, limit: PAGE_SIZE };
            if (search)    params.search   = search;
            if (catFilter) params.category = catFilter;
            const res = await adminService.listAdminTemplates(params);
            setPublished(res.templates);
            setPubTotal(res.pagination.total);
            setPubPages(res.pagination.pages);
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Failed to load published templates');
        } finally {
            setPubLoading(false);
            setRefreshing(false);
        }
    }, [pubPage, search, catFilter]);

    /* initial load */
    useEffect(() => {
        fetchStats();
        fetchPending();
    }, [fetchStats, fetchPending]);

    /* load published when tab switches or filters change */
    useEffect(() => {
        if (tab === 'published') fetchPublished();
    }, [tab, fetchPublished]);

    const handleRefresh = () => {
        fetchStats();
        fetchPending();
        if (tab === 'published') fetchPublished(true);
    };

    /* ── actions ─────────────────────────────────────────────────────── */
    const handleApprove = async (id: string) => {
        setActionBusy(true);
        try {
            const res = await adminService.approveTemplate(id);
            showToast(res.message);
            setPending(prev => prev.filter(t => t._id !== id));
            fetchStats();
        } catch (e: any) {
            showToast(e?.response?.data?.message || 'Approve failed', 'err');
        } finally {
            setActionBusy(false);
        }
    };

    const handleReject = async (id: string) => {
        setActionBusy(true);
        try {
            const res = await adminService.rejectTemplate(id);
            showToast(res.message);
            setPending(prev => prev.filter(t => t._id !== id));
            fetchStats();
        } catch (e: any) {
            showToast(e?.response?.data?.message || 'Reject failed', 'err');
        } finally {
            setActionBusy(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await adminService.deleteAdminTemplate(id);
            showToast(res.message);
            setPublished(prev => prev.filter(t => t._id !== id));
            fetchStats();
        } catch (e: any) {
            showToast(e?.response?.data?.message || 'Delete failed', 'err');
        }
    };

    /* ── stat values ─────────────────────────────────────────────────── */
    const statValues: Record<string, number> = {
        total:    stats?.total                ?? 0,
        pending:   stats?.status?.pending   ?? 0,
        published: stats?.status?.published ?? 0,
        draft:     stats?.status?.draft     ?? 0,
        public:   stats?.visibility?.public   ?? 0,
    };

    /* ─────────────────────────────────────────────────────────────────── */
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

                .adm-page    { font-family: system-ui, sans-serif; }
                .adm-mono    { font-family: 'JetBrains Mono', monospace; }
                .adm-display { font-family: 'Syne', sans-serif; }

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

                .adm-tab {
                    transition: color 0.15s, border-color 0.15s;
                    border-bottom: 2px solid transparent;
                    cursor: pointer;
                    background: none;
                }
                .adm-tab.active {
                    color: #a5b4fc;
                    border-bottom-color: #6366f1;
                }
                .adm-tab:not(.active) { color: #475569; }
                .adm-tab:not(.active):hover { color: #94a3b8; }

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
                .adm-fade { animation: fadeSlideIn 0.2s ease both; }
            `}</style>

            <div className="adm-page min-h-full" style={{ color: '#cbd5e1' }}>

                {/* ── Toast ────────────────────────────────────────── */}
                {toast && (
                    <div
                        className={`fixed top-6 right-6 z-[300] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium ${
                            toast.type === 'ok' ? 'toast-ok text-emerald-200' : 'toast-err text-red-200'
                        }`}
                        style={{ animation: 'fadeSlideIn 0.25s ease' }}
                    >
                        {toast.type === 'ok'
                            ? <CheckCircle2 className="size-4 shrink-0" />
                            : <XCircle      className="size-4 shrink-0" />
                        }
                        {toast.msg}
                    </div>
                )}

                {/* ── Header ───────────────────────────────────────── */}
                <div className="mb-6 flex items-end gap-4 flex-wrap">
                    <div>
                        <p className="adm-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: '#4f6396' }}>
                            Admin / Templates
                        </p>
                        <h1
                            className="adm-display text-2xl font-bold"
                            style={{ color: '#3e4042', letterSpacing: '-0.02em' }}
                        >
                            Template Management
                        </h1>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        {stats && (
                            <span
                                className="adm-mono text-xs px-2.5 py-1 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
                            >
                                {stats.total.toLocaleString()} templates
                            </span>
                        )}
                        {(stats?.status?.pending ?? 0) > 0 && (
                            <span
                                className="adm-mono text-xs px-2.5 py-1 rounded-full"
                                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}
                            >
                                {stats!.status.pending} pending
                            </span>
                        )}
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
                        >
                            <RefreshCw className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* ── Error banner ─────────────────────────────────── */}
                {error && (
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                    >
                        <XCircle className="size-4 shrink-0" />
                        {error}
                        <button
                            onClick={() => { setError(null); handleRefresh(); }}
                            className="ml-auto text-xs underline underline-offset-2 opacity-70 hover:opacity-100"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* ── Stat cards ───────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                    {statsLoading
                        ? Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
                        : STAT_ITEMS.map((s, i) => (
                            <div
                                key={s.key}
                                className="adm-card adm-stat-card p-4 adm-fade"
                                style={{ animationDelay: `${i * 40}ms` }}
                            >
                                <div className={`inline-flex items-center justify-center size-8 rounded-lg mb-2.5 ${s.bg}`}>
                                    <span className={s.color}>{s.icon}</span>
                                </div>
                                <p className="adm-mono text-xl font-medium" style={{ color: '#3b3d3e' }}>
                                    {statValues[s.key].toLocaleString()}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{s.label}</p>
                            </div>
                        ))
                    }
                </div>

                {/* ── Tab bar ──────────────────────────────────────── */}
                <div
                    className="flex gap-6 mb-5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                    <button
                        className={`adm-tab adm-display text-sm font-semibold pb-3 flex items-center gap-2 ${tab === 'pending' ? 'active' : ''}`}
                        onClick={() => setTab('pending')}
                    >
                        Pending Approval
                        {(stats?.status?.pending ?? 0) > 0 && (
                            <span
                                className="adm-mono text-[10px] px-1.5 py-0.5 rounded-full"
                                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}
                            >
                                {stats!.status.pending}
                            </span>
                        )}
                    </button>
                    <button
                        className={`adm-tab adm-display text-sm font-semibold pb-3 flex items-center gap-2 ${tab === 'published' ? 'active' : ''}`}
                        onClick={() => setTab('published')}
                    >
                        Published
                        {stats && (
                            <span
                                className="adm-mono text-[10px] px-1.5 py-0.5 rounded-full"
                                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}
                            >
                                {stats.status.published}
                            </span>
                        )}
                    </button>
                </div>

                {/* ══ Pending tab ══════════════════════════════════════ */}
                {tab === 'pending' && (
                    <div>
                        {pendingLoading ? (
                            <div className="flex flex-wrap gap-4">
                                {Array.from({ length: 6 }).map((_, i) => <TemplateSkeleton key={i} />)}
                            </div>
                        ) : pending.length === 0 ? (
                            <div
                                className="adm-card flex flex-col items-center justify-center py-20 gap-3"
                                style={{ animation: 'fadeSlideIn 0.25s ease' }}
                            >
                                <div
                                    className="flex items-center justify-center size-14 rounded-2xl"
                                    style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}
                                >
                                    <CheckCircle2 className="size-7 text-emerald-400" />
                                </div>
                                <p className="adm-display text-base font-semibold" style={{ color: '#94a3b8' }}>All clear!</p>
                                <p className="text-sm" style={{ color: '#334155' }}>No templates awaiting approval</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {pending.map((t, i) => (
                                    <div key={t._id} className="adm-fade" style={{ animationDelay: `${i * 30}ms` }}>
                                        <PendingCard
                                            template={t}
                                            onApprove={handleApprove}
                                            onReject={handleReject}
                                            busy={actionBusy}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ══ Published tab ════════════════════════════════════ */}
                {tab === 'published' && (
                    <div>
                        {/* Filter bar */}
                        <div className="adm-card p-3 mb-5 flex flex-wrap gap-2 items-center">
                            <div className="relative flex-1 min-w-[180px]">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5"
                                    style={{ color: '#475569' }}
                                />
                                <input
                                    type="text"
                                    className="adm-input w-full pl-8 pr-3 py-2 text-sm"
                                    placeholder="Search templates…"
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setPubPage(1); }}
                                />
                                {search && (
                                    <button
                                        onClick={() => { setSearch(''); setPubPage(1); }}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </div>

                            <div className="relative">
                                <Filter
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none"
                                    style={{ color: '#475569' }}
                                />
                                <ChevronsUpDown
                                    className="absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none"
                                    style={{ color: '#475569' }}
                                />
                                <select
                                    className="adm-select pl-7 pr-6 py-2 text-sm"
                                    value={catFilter}
                                    onChange={e => { setCatFilter(e.target.value); setPubPage(1); }}
                                >
                                    <option value="">All Categories</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {(search || catFilter) && (
                                <button
                                    onClick={() => { setSearch(''); setCatFilter(''); setPubPage(1); }}
                                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs transition-colors"
                                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                                >
                                    <X className="size-3" /> Clear
                                </button>
                            )}
                        </div>

                        {/* Grid */}
                        {pubLoading ? (
                            <div className="flex flex-wrap gap-4">
                                {Array.from({ length: 8 }).map((_, i) => <TemplateSkeleton key={i} />)}
                            </div>
                        ) : published.length === 0 ? (
                            <div
                                className="adm-card flex flex-col items-center justify-center py-20 gap-3"
                                style={{ animation: 'fadeSlideIn 0.25s ease' }}
                            >
                                <FileText className="size-10" style={{ color: '#1e293b' }} />
                                <p className="text-sm" style={{ color: '#475569' }}>No published templates found</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {published.map((t, i) => (
                                    <div key={t._id} className="adm-fade" style={{ animationDelay: `${i * 25}ms` }}>
                                        <PublishedCard template={t} onDelete={handleDelete} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!pubLoading && pubPages > 1 && (
                            <div
                                className="flex items-center justify-between mt-5 px-1"
                                style={{ animation: 'fadeSlideIn 0.2s ease' }}
                            >
                                <span className="adm-mono text-xs" style={{ color: '#334155' }}>
                                    {pubTotal.toLocaleString()} total · page {pubPage} of {pubPages}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="adm-page-btn"
                                        style={{ color: '#475569' }}
                                        disabled={pubPage === 1}
                                        onClick={() => setPubPage(p => p - 1)}
                                    >
                                        <ChevronLeft className="size-4" />
                                    </button>
                                    {Array.from({ length: Math.min(pubPages, 7) }, (_, i) => {
                                        const p = pubPages <= 7 ? i + 1 : i === 0 ? 1 : i === 6 ? pubPages : pubPage - 3 + i;
                                        if (p < 1 || p > pubPages) return null;
                                        return (
                                            <button
                                                key={p}
                                                className={`adm-page-btn ${p === pubPage ? 'active' : ''}`}
                                                style={{ color: p === pubPage ? undefined : '#475569' }}
                                                onClick={() => setPubPage(p)}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                    <button
                                        className="adm-page-btn"
                                        style={{ color: '#475569' }}
                                        disabled={pubPage === pubPages}
                                        onClick={() => setPubPage(p => p + 1)}
                                    >
                                        <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
