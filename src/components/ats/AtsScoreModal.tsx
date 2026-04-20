import { useState } from 'react';
import { X, Lightbulb, CheckCircle2, XCircle, BarChart2, Loader2 } from 'lucide-react';
import { scoreResume } from '@services/ats.service';
import type { AtsResult, AtsCategory } from '@services/ats.service';

// ── Helpers ───────────────────────────────────────────────────────────────────

function gradeColor(grade: string) {
    switch (grade) {
        case 'A': return { ring: '#22c55e', text: 'text-green-600', bg: 'bg-green-50' };
        case 'B': return { ring: '#14b8a6', text: 'text-teal-600', bg: 'bg-teal-50' };
        case 'C': return { ring: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50' };
        default:  return { ring: '#ef4444', text: 'text-red-600', bg: 'bg-red-50' };
    }
}

function scoreBarColor(pct: number) {
    if (pct >= 0.75) return 'bg-green-500';
    if (pct >= 0.5)  return 'bg-amber-400';
    return 'bg-red-400';
}

// ── Circular Gauge ────────────────────────────────────────────────────────────

function CircularGauge({ score, grade }: { score: number; grade: string }) {
    const colors = gradeColor(grade);
    const r = 52;
    const cx = 64;
    const cy = 64;
    const circ = 2 * Math.PI * r;
    const dashOffset = circ * (1 - score / 100);

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width="128" height="128" viewBox="0 0 128 128">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={colors.ring}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={dashOffset}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
                <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
                    fontSize="26" fontWeight="700" fill="#111827">
                    {score}
                </text>
                <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle"
                    fontSize="11" fill="#6b7280">
                    / 100
                </text>
            </svg>
            <span className={`px-3 py-0.5 rounded-full text-sm font-bold ${colors.bg} ${colors.text}`}>
                Grade {grade}
            </span>
        </div>
    );
}

// ── Category Row ──────────────────────────────────────────────────────────────

function CategoryRow({ cat }: { cat: AtsCategory }) {
    const pct = cat.max > 0 ? cat.score / cat.max : 0;
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">{cat.label}</span>
                <span className="text-gray-500 font-medium">{cat.score} / {cat.max}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-500 ${scoreBarColor(pct)}`}
                    style={{ width: `${Math.round(pct * 100)}%` }}
                />
            </div>
            <ul className="flex flex-wrap gap-1.5">
                {cat.details.map((d, i) => {
                    const isGood = !d.toLowerCase().includes('missing') &&
                                   !d.toLowerCase().includes('not ') &&
                                   !d.toLowerCase().includes('no ');
                    return (
                        <li key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium
                            ${isGood ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {d}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// ── Keywords Panel ────────────────────────────────────────────────────────────

function KeywordsPanel({ matched, missing }: { matched: string[]; missing: string[] }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <div>
                <p className="text-xs font-semibold text-green-700 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Matched ({matched.length})
                </p>
                <div className="flex flex-wrap gap-1">
                    {matched.map(k => (
                        <span key={k} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{k}</span>
                    ))}
                    {matched.length === 0 && <span className="text-xs text-gray-400">None</span>}
                </div>
            </div>
            <div>
                <p className="text-xs font-semibold text-red-600 mb-1.5 flex items-center gap-1">
                    <XCircle className="size-3.5" /> Missing ({missing.length})
                </p>
                <div className="flex flex-wrap gap-1">
                    {missing.map(k => (
                        <span key={k} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{k}</span>
                    ))}
                    {missing.length === 0 && <span className="text-xs text-gray-400">None</span>}
                </div>
            </div>
        </div>
    );
}

// ── Main Modal ────────────────────────────────────────────────────────────────

interface Props {
    resumeData: object;
    onClose: () => void;
}

type ModalState = 'input' | 'loading' | 'result';

export default function AtsScoreModal({ resumeData, onClose }: Props) {
    const [state, setState] = useState<ModalState>('input');
    const [jd, setJd] = useState('');
    const [result, setResult] = useState<AtsResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScore = async () => {
        setState('loading');
        setError(null);
        try {
            const data = await scoreResume(resumeData, jd.trim());
            setResult(data);
            setState('result');
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || 'Scoring failed');
            setState('input');
        }
    };

    const handleRescore = () => {
        setResult(null);
        setState('input');
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <BarChart2 className="size-4 text-indigo-600" />
                        ATS Compatibility Score
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                    {/* ── INPUT STATE ── */}
                    {(state === 'input' || state === 'loading') && (
                        <>
                            <p className="text-sm text-gray-500">
                                Analyse your resume against ATS criteria. Paste a job description to also check keyword match (optional).
                            </p>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Job Description{' '}
                                    <span className="font-normal text-gray-400 text-xs">— optional, enables keyword scoring (+25 pts)</span>
                                </label>
                                <textarea
                                    value={jd}
                                    onChange={(e) => setJd(e.target.value)}
                                    placeholder="Paste the job posting here to get keyword match analysis…"
                                    rows={7}
                                    disabled={state === 'loading'}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition disabled:opacity-50"
                                />
                            </div>

                            {error && (
                                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                    {error}
                                </p>
                            )}
                        </>
                    )}

                    {/* ── LOADING STATE ── */}
                    {state === 'loading' && (
                        <div className="flex flex-col items-center gap-3 py-6">
                            <Loader2 className="size-8 animate-spin text-indigo-500" />
                            <p className="text-sm text-gray-500">Analysing your resume…</p>
                        </div>
                    )}

                    {/* ── RESULT STATE ── */}
                    {state === 'result' && result && (
                        <>
                            {/* Gauge */}
                            <div className="flex justify-center">
                                <CircularGauge score={result.totalScore} grade={result.grade} />
                            </div>

                            {!result.hasJD && (
                                <p className="text-xs text-center text-gray-400 -mt-2">
                                    No job description provided — keyword matching not included.{' '}
                                    <button onClick={handleRescore} className="underline text-indigo-500">Re-score with JD</button>
                                </p>
                            )}

                            {/* Categories */}
                            <div className="space-y-5">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Breakdown</h3>
                                {Object.values(result.breakdown).map((cat, i) => (
                                    <CategoryRow key={i} cat={cat} />
                                ))}
                            </div>

                            {/* Keywords */}
                            {result.hasJD && result.breakdown.keywords && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Keywords</h3>
                                    <KeywordsPanel
                                        matched={result.breakdown.keywords.matched ?? []}
                                        missing={result.breakdown.keywords.missing ?? []}
                                    />
                                </div>
                            )}

                            {/* Suggestions */}
                            {result.suggestions.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                        <Lightbulb className="size-3.5 text-amber-500" />
                                        Suggestions
                                    </h3>
                                    <ul className="space-y-2">
                                        {result.suggestions.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                                                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                                                <span className="text-xs text-amber-800">{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
                    {state === 'result' ? (
                        <>
                            <button
                                onClick={handleRescore}
                                className="flex-1 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-semibold transition-colors"
                            >
                                Re-score
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleScore}
                                disabled={state === 'loading'}
                                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
                            >
                                {state === 'loading' ? (
                                    <><Loader2 className="size-4 animate-spin" /> Analysing…</>
                                ) : (
                                    <><BarChart2 className="size-4" /> Analyse Resume</>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
