import React from 'react';

/* ─── types ─────────────────────────────────────────────────────────── */
export interface StatCardItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    /** Tailwind text-color class, e.g. 'text-sky-400' */
    color: string;
    /** Tailwind bg class, e.g. 'bg-sky-400/10' */
    bg: string;
}

interface StatCardProps {
    item: StatCardItem;
    value: number;
    /** animation delay in ms */
    delay?: number;
    onClick?: () => void;
}

/* ─── single card ───────────────────────────────────────────────────── */
export function StatCard({item, value, delay = 0, onClick}: StatCardProps) {
    return (
        <div
            className={`adm-card adm-stat-card p-3 flex gap-2 ${onClick ? 'cursor-pointer' : ''}`}
            style={{animation: `admStatIn 0.2s ease ${delay}ms both`}}
            onClick={onClick}
        >
            <div className={`inline-flex items-center justify-center size-10 rounded-lg  ${item.bg}`}>
                <span className={`${item.color}`}>{item.icon}</span>
            </div>
            <div>
                <p className="adm-mono text-md font-bold text-gray-800 dark:text-slate-200 adm-counter">
                    {value.toLocaleString()}
                </p>
                <p className="text-xs mt-0.5 text-gray-500 dark:text-slate-500">{item.label}</p>
            </div>
        </div>
    );
}

/* ─── skeleton ──────────────────────────────────────────────────────── */
export function StatCardSkeleton() {
    return (
        <div className="adm-card adm-stat-card p-3 flex gap-2">
            <div className="size-8 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse mb-2.5"/>
            <div>
                <div className="h-6 w-10 rounded-md bg-black/5 dark:bg-white/5 animate-pulse mb-1"/>
                <div className="h-3 w-16 rounded bg-black/5 dark:bg-white/5 animate-pulse"/>
            </div>
        </div>
    );
}

/* ─── grid wrapper ──────────────────────────────────────────────────── */
interface StatCardGridProps {
    items: StatCardItem[];
    values: Record<string, number>;
    loading?: boolean;
    columns?: number;
    onCardClick?: (key: string) => void;
}

export function StatCardGrid({
                                 items,
                                 values,
                                 loading = false,
                                 columns,
                                 onCardClick,
                             }: StatCardGridProps) {
    const cols = columns ?? items.length;
    const gridClass =
        cols <= 3 ? 'grid-cols-2 sm:grid-cols-3' :
            cols <= 4 ? 'grid-cols-2 sm:grid-cols-4' :
                'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';

    return (
        <>
            <style>{`
                @keyframes admStatIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .adm-stat-card {
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                }
                .adm-stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(0,0,0,0.08);
                }
                .adm-counter {
                    animation: admStatIn 0.4s ease both;
                }
                .adm-card {
                    background: linear-gradient(145deg, rgba(0,0,0,0.02) 0%, rgba(255,255,255,0.03) 100%);
                    border: 1px solid rgba(0,0,0,0.08);
                    border-radius: 8px;
                }
                .dark .adm-card {
                    background: linear-gradient(145deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0.04) 100%);
                    border-color: rgba(255,255,255,0.06);
                }
                .adm-mono    { font-family: 'JetBrains Mono', monospace; }
                .adm-display { font-family: 'Syne', sans-serif; }
            `}</style>
            <div className={`grid ${gridClass} gap-3 mb-6`}>
                {loading
                    ? Array.from({length: items.length}).map((_, i) => <StatCardSkeleton key={i}/>)
                    : items.map((s, i) => (
                        <StatCard
                            key={s.key}
                            item={s}
                            value={values[s.key] ?? 0}
                            delay={i * 50}
                            onClick={onCardClick ? () => onCardClick(s.key) : undefined}
                        />
                    ))
                }
            </div>
        </>
    );
}
