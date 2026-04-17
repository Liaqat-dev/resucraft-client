import {useCallback, useEffect, useState} from 'react';
import {
    Archive,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    Filter,
    Inbox,
    Mail,
    MailOpen,
    MessageSquare,
    RefreshCw,
    Reply,
    Search,
    Send,
    Trash2,
    X,
    XCircle,
} from 'lucide-react';
import {ContactMessage, contactService, ContactStats} from '@src/services/contact.service';
import {StatCardGrid} from "@pages/dashboard/components/StatCard.tsx";

/* ─── helpers ───────────────────────────────────────────────────────── */
function timeAgo(iso: string) {
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

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

/* ─── status meta ───────────────────────────────────────────────────── */
const STATUS_META: Record<ContactMessage['status'], { label: string; cls: string }> = {
    unread: {label: 'Unread', cls: 'bg-amber-500/15   text-amber-500   border-amber-500/30'},
    read: {label: 'Read', cls: 'bg-slate-500/10   text-slate-500   border-slate-500/20'},
    replied: {label: 'Replied', cls: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'},
    archived: {label: 'Archived', cls: 'bg-violet-500/15  text-violet-500  border-violet-500/30'},
};

const TOPIC_META: Record<string, { cls: string }> = {
    'General Inquiry': {cls: 'bg-sky-500/10     text-sky-600'},
    'Technical Support': {cls: 'bg-red-500/10     text-red-600'},
    'Account & Billing': {cls: 'bg-amber-500/10   text-amber-600'},
    'Feature Request': {cls: 'bg-violet-500/10  text-violet-600'},
    'Template Marketplace': {cls: 'bg-emerald-500/10 text-emerald-600'},
    'Partnership': {cls: 'bg-pink-500/10    text-pink-600'},
    'Other': {cls: 'bg-slate-500/10   text-slate-500'},
};

/* ─── stat cards config ─────────────────────────────────────────────── */
const STAT_ITEMS = [
    {key: 'total', label: 'Total', icon: <Inbox className="size-4"/>, color: 'text-sky-500', bg: 'bg-sky-500/10'},
    {key: 'unread', label: 'Unread', icon: <Mail className="size-4"/>, color: 'text-amber-500', bg: 'bg-amber-500/10'},
    {
        key: 'replied',
        label: 'Replied',
        icon: <Reply className="size-4"/>,
        color: 'text-emerald-600',
        bg: 'bg-emerald-500/10'
    },
    {
        key: 'archived',
        label: 'Archived',
        icon: <Archive className="size-4"/>,
        color: 'text-violet-500',
        bg: 'bg-violet-500/10'
    },
];


function RowSkeleton() {
    return (
        <div className="flex items-start gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-white/[0.04]">
            <div className="size-8 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse shrink-0 mt-0.5"/>
            <div className="flex-1 min-w-0">
                <div className="h-3.5 w-32 rounded bg-black/5 dark:bg-white/5 animate-pulse mb-2"/>
                <div className="h-2.5 w-28 rounded bg-black/5 dark:bg-white/5 animate-pulse mb-1.5"/>
                <div className="h-2.5 w-full rounded bg-black/5 dark:bg-white/5 animate-pulse"/>
            </div>
            <div className="h-5 w-16 rounded-full bg-black/5 dark:bg-white/5 animate-pulse shrink-0"/>
        </div>
    );
}

/* ─── Reply modal ───────────────────────────────────────────────────── */
function ReplyModal({
                        message, onSend, onCancel, sending,
                    }: {
    message: ContactMessage;
    onSend: (text: string) => void;
    onCancel: () => void;
    sending: boolean;
}) {
    const [text, setText] = useState('');
    const topicMeta = TOPIC_META[message.topic] ?? TOPIC_META['Other'];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel}/>
            <div
                className="relative w-full max-w-lg rounded-2xl shadow-2xl"
                style={{
                    background: 'linear-gradient(135deg, #1a1f2e 0%, #141824 100%)',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4"
                     style={{borderBottom: '1px solid rgba(255,255,255,0.07)'}}>
                    <div className="flex items-center justify-center size-9 rounded-xl bg-amber-500/15 shrink-0">
                        <Reply className="size-4 text-amber-400"/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-100 truncate">Reply to {message.name}</p>
                        <p className="adm-mono text-xs text-slate-500 truncate">{message.email}</p>
                    </div>
                    <button onClick={onCancel} className="text-slate-600 hover:text-slate-400 transition-colors">
                        <X className="size-4"/>
                    </button>
                </div>

                {/* Original snippet */}
                <div className="px-5 py-3" style={{borderBottom: '1px solid rgba(255,255,255,0.04)'}}>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Topic</span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${topicMeta.cls}`}>
                            {message.topic}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{message.message}</p>
                </div>

                {/* Textarea */}
                <div className="px-5 py-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-2">Your
                        Reply</label>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        rows={5}
                        placeholder="Write your reply here…"
                        className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-all"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.09)',
                            color: '#cbd5e1',
                        }}
                        onFocus={e => {
                            e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.08)';
                        }}
                        onBlur={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                    <p className="adm-mono text-[10px] text-slate-600 mt-1.5">
                        Will be emailed to <span className="text-slate-500">{message.email}</span>
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 px-5 pb-5">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl text-sm text-slate-400 transition-colors"
                        style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)'}}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!text.trim() || sending}
                        onClick={() => onSend(text)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-amber-400 text-amber-900 hover:bg-amber-300"
                    >
                        {sending
                            ? <><RefreshCw className="size-3.5 animate-spin"/> Sending…</>
                            : <><Send className="size-3.5"/> Send Reply</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Detail panel ──────────────────────────────────────────────────── */
function DetailPanel({message, onClose, onReply, onArchive, onDelete}: {
    message: ContactMessage;
    onClose: () => void;
    onReply: () => void;
    onArchive: () => void;
    onDelete: () => void;
}) {
    const meta = STATUS_META[message.status];
    const topicMeta = TOPIC_META[message.topic] ?? TOPIC_META['Other'];

    return (
        <div className="flex flex-col h-full" style={{animation: 'admFadeIn 0.18s ease'}}>
            {/* Header */}
            <div
                className="flex items-center gap-2 px-4 py-3.5 shrink-0 border-b border-gray-100 dark:border-white/[0.06]">
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                    <ChevronLeft className="size-4"/>
                </button>
                <span
                    className="adm-display text-sm font-semibold text-gray-800 dark:text-slate-200 flex-1 min-w-0 truncate">
                    {message.topic}
                </span>
                <span className={`adm-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${meta.cls}`}>
                    {meta.label}
                </span>
            </div>

            {/* Sender info */}
            <div
                className="flex items-center gap-3 px-4 py-3.5 shrink-0 border-b border-gray-100 dark:border-white/[0.04]">
                <div
                    className="size-10 rounded-xl flex items-center justify-center text-base font-bold shrink-0 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {message.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{message.name}</p>
                    <p className="adm-mono text-xs text-gray-500 dark:text-slate-500 truncate">{message.email}</p>
                </div>
                <div className="text-right shrink-0">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${topicMeta.cls}`}>
                        {message.topic}
                    </span>
                    <p className="adm-mono text-[10px] text-gray-400 dark:text-slate-600 mt-1">{formatDate(message.createdAt)}</p>
                </div>
            </div>

            {/* Message body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-slate-400">
                    {message.message}
                </p>
            </div>

            {/* Actions */}
            <div
                className="flex items-center gap-2 px-4 py-3.5 shrink-0 border-t border-gray-100 dark:border-white/[0.06]">
                <button
                    onClick={onReply}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-amber-900 transition-colors"
                >
                    <Reply className="size-3.5"/> Reply
                </button>
                <button
                    onClick={onArchive}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/20 transition-colors"
                >
                    <Archive className="size-3.5"/> Archive
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-colors ml-auto"
                >
                    <Trash2 className="size-3.5"/> Delete
                </button>
            </div>
        </div>
    );
}

/* ─── Main component ────────────────────────────────────────────────── */
const PAGE_SIZE = 12;

export default function Messages() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [stats, setStats] = useState<ContactStats | null>(null);
    const [selected, setSelected] = useState<ContactMessage | null>(null);
    const [replyTarget, setReplyTarget] = useState<ContactMessage | null>(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    /* ── toast ── */
    const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
        setToast({msg, type});
        setTimeout(() => setToast(null), 3500);
    };

    /* ── fetch ── */
    const fetchData = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const [listData, statsData] = await Promise.all([
                contactService.list({status: statusFilter || undefined, page, limit: PAGE_SIZE}),
                contactService.getStats(),
            ]);
            setMessages(listData.messages);
            setTotal(listData.total);
            setPages(listData.pages);
            setStats(statsData);
            if (showRefreshing) showToast('Refreshed');
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Failed to load messages');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [statusFilter, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /* ── client-side search ── */
    const filtered = search
        ? messages.filter(m =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase()) ||
            m.topic.toLowerCase().includes(search.toLowerCase()) ||
            m.message.toLowerCase().includes(search.toLowerCase())
        )
        : messages;

    /* ── open (auto-marks read) ── */
    const openMessage = async (msg: ContactMessage) => {
        setSelected(msg);
        if (msg.status === 'unread') {
            try {
                const updated = await contactService.getOne(msg._id);
                setMessages(prev => prev.map(m => m._id === msg._id ? updated : m));
                setSelected(updated);
                setStats(s => s ? {...s, unread: Math.max(0, s.unread - 1)} : s);
            } catch { /* non-fatal */
            }
        }
    };

    const handleArchive = async (msg: ContactMessage) => {
        try {
            const updated = await contactService.updateStatus(msg._id, 'archived');
            setMessages(prev => prev.map(m => m._id === msg._id ? updated : m));
            if (selected?._id === msg._id) setSelected(updated);
            showToast('Message archived');
        } catch (e: any) {
            showToast(e?.response?.data?.message || 'Archive failed', 'err');
        }
    };

    const handleDelete = async (msg: ContactMessage) => {
        try {
            await contactService.remove(msg._id);
            setMessages(prev => prev.filter(m => m._id !== msg._id));
            if (selected?._id === msg._id) setSelected(null);
            showToast('Message deleted');
            setTotal(t => t - 1);
        } catch (e: any) {
            showToast(e?.response?.data?.message || 'Delete failed', 'err');
        }
    };

    const handleReply = async (text: string) => {
        if (!replyTarget) return;
        setSending(true);
        try {
            const res = await contactService.reply(replyTarget._id, text);
            setMessages(prev => prev.map(m => m._id === replyTarget._id ? res.contact : m));
            if (selected?._id === replyTarget._id) setSelected(res.contact);
            setStats(s => s ? {...s, replied: s.replied + 1} : s);
            showToast(`Reply sent to ${replyTarget.email}`);
        } catch (e: any) {
            showToast(e?.response?.data?.message || 'Failed to send reply', 'err');
        } finally {
            setSending(false);
            setReplyTarget(null);
        }
    };

    const statValues: Record<string, number> = {
        total: stats?.total ?? 0,
        unread: stats?.unread ?? 0,
        replied: stats?.replied ?? 0,
        archived: stats?.archived ?? 0,
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

                .adm-page    { font-family: system-ui, sans-serif; }
                .adm-mono    { font-family: 'JetBrains Mono', monospace; }
                .adm-display { font-family: 'Syne', sans-serif; }

                .adm-card {
                    background: linear-gradient(145deg, rgba(0,0,0,0.02) 0%, rgba(255,255,255,0.03) 100%);
                    border: 1px solid rgba(0,0,0,0.08);
                    border-radius: 16px;
                    backdrop-filter: blur(4px);
                }
                .dark .adm-card {
                    background: linear-gradient(145deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0.04) 100%);
                    border-color: rgba(255,255,255,0.06);
                }

                .adm-stat-card { transition: transform 0.15s ease, box-shadow 0.15s ease; cursor: pointer; }
                .adm-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.08); }

                .adm-main-panel {
                    background: white;
                    border: 1px solid rgba(0,0,0,0.08);
                    border-radius: 16px;
                    overflow: hidden;
                }
                .dark .adm-main-panel {
                    background: linear-gradient(145deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0.04) 100%);
                    border-color: rgba(255,255,255,0.06);
                }

                .adm-filter-bar {
                    background: rgba(0,0,0,0.02);
                    border-bottom: 1px solid rgba(0,0,0,0.07);
                }
                .dark .adm-filter-bar {
                    background: rgba(255,255,255,0.01);
                    border-bottom-color: rgba(255,255,255,0.05);
                }

                .adm-row { cursor: pointer; transition: background 0.1s ease; }
                .adm-row:hover { background: rgba(0,0,0,0.025); }
                .dark .adm-row:hover { background: rgba(255,255,255,0.025); }

                .adm-row-border { border-bottom: 1px solid rgba(0,0,0,0.06); }
                .dark .adm-row-border { border-bottom-color: rgba(255,255,255,0.04); }

                .adm-input {
                    background: rgba(0,0,0,0.04);
                    border: 1px solid rgba(0,0,0,0.1);
                    color: #374151;
                    border-radius: 10px; outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .adm-input:focus {
                    border-color: rgba(99,102,241,0.5);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
                }
                .adm-input::placeholder { color: #9ca3af; }
                .dark .adm-input {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(255,255,255,0.07);
                    color: #cbd5e1;
                }
                .dark .adm-input::placeholder { color: #475569; }

                .adm-select {
                    background: rgba(0,0,0,0.04);
                    border: 1px solid rgba(0,0,0,0.1);
                    color: #6b7280;
                    border-radius: 10px; outline: none;
                    cursor: pointer; appearance: none;
                    transition: border-color 0.2s;
                }
                .adm-select:focus { border-color: rgba(99,102,241,0.5); }
                .adm-select option { background: white; color: #111827; }
                .dark .adm-select {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(255,255,255,0.07);
                    color: #94a3b8;
                }
                .dark .adm-select option { background: #1a1f2e; color: #cbd5e1; }

                .adm-divider { border-color: rgba(0,0,0,0.07); }
                .dark .adm-divider { border-color: rgba(255,255,255,0.05); }

                .adm-page-btn {
                    display: flex; align-items: center; justify-content: center;
                    width: 32px; height: 32px; border-radius: 8px; font-size: 13px;
                    transition: background 0.15s, color 0.15s; border: 1px solid transparent;
                    background: none; cursor: pointer; color: #6b7280;
                }
                .adm-page-btn:hover:not(:disabled) { background: rgba(0,0,0,0.06); color: #111827; }
                .dark .adm-page-btn:hover:not(:disabled) { background: rgba(255,255,255,0.06); color: #e2e8f0; }
                .adm-page-btn.active {
                    background: rgba(99,102,241,0.12);
                    border-color: rgba(99,102,241,0.35);
                    color: #6366f1; font-weight: 700;
                }
                .dark .adm-page-btn.active { color: #a5b4fc; background: rgba(99,102,241,0.2); }
                .adm-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

                .toast-ok  { background: linear-gradient(135deg,#064e3b,#065f46); border: 1px solid rgba(16,185,129,0.3); }
                .toast-err { background: linear-gradient(135deg,#450a0a,#7f1d1d); border: 1px solid rgba(239,68,68,0.3); }

                @keyframes admFadeIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .adm-row { animation: admFadeIn 0.18s ease both; }
            `}</style>

            <div className="adm-page min-h-full text-gray-800 dark:text-slate-300">

                {/* ── Toast ── */}
                {toast && (
                    <div
                        className={`fixed top-6 right-6 z-[300] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium ${toast.type === 'ok' ? 'toast-ok text-emerald-200' : 'toast-err text-red-200'}`}
                        style={{animation: 'admFadeIn 0.25s ease'}}
                    >
                        {toast.type === 'ok' ? <CheckCircle2 className="size-4 shrink-0"/> :
                            <XCircle className="size-4 shrink-0"/>}
                        {toast.msg}
                    </div>
                )}

                {/* ── Reply modal ── */}
                {replyTarget && (
                    <ReplyModal message={replyTarget} onSend={handleReply} onCancel={() => setReplyTarget(null)}
                                sending={sending}/>
                )}

                {/* ── Page header ── */}
                <div className="mb-6 flex items-end gap-4 flex-wrap">
                    <div>
                        <p className="adm-mono text-[10px] uppercase tracking-[0.2em] mb-1 text-indigo-500 dark:text-indigo-400">
                            Admin / Messages
                        </p>
                        <h1 className="adm-display text-2xl font-bold text-gray-900 dark:text-slate-100"
                            style={{letterSpacing: '-0.02em'}}>
                            Customer Support
                        </h1>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        {stats && stats.unread > 0 && (
                            <div
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400">
                                <span className="size-1.5 rounded-full bg-amber-500 inline-block"
                                      style={{animation: 'admFadeIn 2s ease-in-out infinite alternate'}}/>
                                {stats.unread} unread
                            </div>
                        )}
                        {stats && (
                            <span
                                className="adm-mono text-xs px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 text-gray-500 dark:text-slate-500">
                                {stats.total.toLocaleString()} total
                            </span>
                        )}
                        <button
                            onClick={() => fetchData(true)}
                            disabled={refreshing}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 text-gray-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <RefreshCw className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`}/>
                            Refresh
                        </button>
                    </div>
                </div>
                <StatCardGrid items={STAT_ITEMS} values={statValues} loading={loading} onCardClick={key => {
                    setStatusFilter(key === 'total' ? '' : key);
                    setPage(1);
                    setSelected(null);
                }}/>


                {/* ── Error ── */}
                {error && (
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-sm bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                        <XCircle className="size-4 shrink-0"/>
                        {error}
                        <button onClick={() => fetchData()}
                                className="ml-auto text-xs underline underline-offset-2 opacity-70 hover:opacity-100">Retry
                        </button>
                    </div>
                )}

                {/* ── Main panel ── */}
                <div
                    className="adm-main-panel"
                    style={{display: 'grid', gridTemplateColumns: selected ? '1fr 1.4fr' : '1fr', minHeight: 520}}
                >
                    {/* ── Left: list ── */}
                    <div className="flex flex-col"
                         style={{borderRight: selected ? '1px solid rgba(0,0,0,0.07)' : 'none'}}>

                        {/* Filters */}
                        <div className="adm-filter-bar flex flex-wrap gap-2 p-3">
                            <div className="relative flex-1 min-w-[160px]">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 dark:text-slate-600 pointer-events-none"/>
                                <input
                                    type="text"
                                    className="adm-input w-full pl-8 pr-3 py-2 text-sm"
                                    placeholder="Search messages…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button onClick={() => setSearch('')}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-600 dark:hover:text-slate-400">
                                        <X className="size-3.5"/>
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Filter
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none text-gray-400 dark:text-slate-600"/>
                                <ChevronsUpDown
                                    className="absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none text-gray-400 dark:text-slate-600"/>
                                <select
                                    className="adm-select pl-7 pr-6 py-2 text-sm"
                                    value={statusFilter}
                                    onChange={e => {
                                        setStatusFilter(e.target.value);
                                        setPage(1);
                                        setSelected(null);
                                    }}
                                >
                                    <option value="">All Status</option>
                                    <option value="unread">Unread</option>
                                    <option value="read">Read</option>
                                    <option value="replied">Replied</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            {(statusFilter || search) && (
                                <button
                                    onClick={() => {
                                        setStatusFilter('');
                                        setSearch('');
                                        setPage(1);
                                        setSelected(null);
                                    }}
                                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/15 transition-colors"
                                >
                                    <X className="size-3"/> Clear
                                </button>
                            )}
                        </div>

                        {/* Count bar */}
                        <div
                            className="flex items-center justify-between px-4 py-2 border-b border-black/[0.05] dark:border-white/[0.04]">
                            <span className="adm-mono text-[11px] text-gray-400 dark:text-slate-600">
                                {filtered.length} of {total} messages
                            </span>
                            {statusFilter && STATUS_META[statusFilter as ContactMessage['status']] && (
                                <span
                                    className={`adm-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_META[statusFilter as ContactMessage['status']].cls}`}>
                                    {STATUS_META[statusFilter as ContactMessage['status']].label}
                                </span>
                            )}
                        </div>

                        {/* Rows */}
                        <div className="flex-1 overflow-y-auto">
                            {loading
                                ? Array.from({length: 6}).map((_, i) => <RowSkeleton key={i}/>)
                                : filtered.length === 0
                                    ? (
                                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                                            <MessageSquare className="size-10 text-gray-200 dark:text-slate-800"/>
                                            <p className="text-sm text-gray-400 dark:text-slate-600">
                                                {search ? 'No messages match your search' : 'No messages in this category'}
                                            </p>
                                        </div>
                                    )
                                    : filtered.map((msg, i) => {
                                        const meta = STATUS_META[msg.status];
                                        const topicMeta = TOPIC_META[msg.topic] ?? TOPIC_META['Other'];
                                        const isSelected = selected?._id === msg._id;
                                        const isUnread = msg.status === 'unread';

                                        return (
                                            <div
                                                key={msg._id}
                                                className={`adm-row adm-row-border flex items-start gap-3 px-4 py-3.5`}
                                                onClick={() => openMessage(msg)}
                                                style={{
                                                    animationDelay: `${i * 20}ms`,
                                                    borderLeft: isSelected
                                                        ? '3px solid #6366f1'
                                                        : isUnread
                                                            ? '3px solid #f59e0b'
                                                            : '3px solid transparent',
                                                    background: isSelected ? 'rgba(99,102,241,0.05)' : undefined,
                                                }}
                                            >
                                                {/* Avatar */}
                                                <div
                                                    className={`size-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${isUnread
                                                        ? 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                                                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                                                    }`}
                                                >
                                                    {msg.name.charAt(0).toUpperCase()}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                                                        <span
                                                            className={`text-sm truncate ${isUnread ? 'font-semibold text-gray-900 dark:text-slate-100' : 'font-medium text-gray-600 dark:text-slate-400'}`}>
                                                            {msg.name}
                                                        </span>
                                                        <span
                                                            className="adm-mono text-[10px] text-gray-400 dark:text-slate-600 shrink-0">
                                                            {timeAgo(msg.createdAt)}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5 ${topicMeta.cls}`}>
                                                        {msg.topic}
                                                    </span>
                                                    <p className="text-xs text-gray-400 dark:text-slate-600 leading-relaxed line-clamp-2">
                                                        {msg.message}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`adm-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${meta.cls}`}>
                                                    {meta.label}
                                                </span>
                                            </div>
                                        );
                                    })
                            }
                        </div>

                        {/* Pagination */}
                        {pages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t adm-divider">
                                <span
                                    className="adm-mono text-xs text-gray-400 dark:text-slate-600">Page {page} / {pages}</span>
                                <div className="flex items-center gap-1">
                                    <button className="adm-page-btn" disabled={page <= 1} onClick={() => {
                                        setPage(p => p - 1);
                                        setSelected(null);
                                    }}>
                                        <ChevronLeft className="size-4"/>
                                    </button>
                                    {Array.from({length: Math.min(pages, 5)}, (_, i) => {
                                        const p = i + 1;
                                        return (
                                            <button key={p} className={`adm-page-btn ${page === p ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setPage(p);
                                                        setSelected(null);
                                                    }}>
                                                {p}
                                            </button>
                                        );
                                    })}
                                    <button className="adm-page-btn" disabled={page >= pages} onClick={() => {
                                        setPage(p => p + 1);
                                        setSelected(null);
                                    }}>
                                        <ChevronRight className="size-4"/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right: detail panel ── */}
                    {selected && (
                        <DetailPanel
                            message={selected}
                            onClose={() => setSelected(null)}
                            onReply={() => setReplyTarget(selected)}
                            onArchive={() => handleArchive(selected)}
                            onDelete={() => handleDelete(selected)}
                        />
                    )}
                </div>

                {/* ── Empty full-page state ── */}
                {!loading && !error && messages.length === 0 && !statusFilter && !search && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div
                            className="size-16 rounded-2xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20">
                            <MailOpen className="size-7 text-indigo-500"/>
                        </div>
                        <p className="font-semibold text-gray-500 dark:text-slate-500">No messages yet</p>
                        <p className="text-sm text-gray-400 dark:text-slate-600">Contact messages from users will appear
                            here.</p>
                    </div>
                )}
            </div>
        </>
    );
}
