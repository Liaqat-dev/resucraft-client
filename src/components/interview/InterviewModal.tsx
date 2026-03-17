import { useEffect, useRef } from 'react';
import { X, Mic, MicOff, PhoneOff, Loader2, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useInterviewSession, type FeedbackData, type SessionStatus } from '@hooks/useInterviewSession';

// ── Score Badge ───────────────────────────────────────────────────────────────

function ScoreBadge({ label, score }: { label: string; score: number }) {
    const color =
        score >= 8 ? 'bg-green-100 text-green-700 border-green-200'
        : score >= 5 ? 'bg-amber-100 text-amber-700 border-amber-200'
        : 'bg-red-100 text-red-700 border-red-200';

    return (
        <div className={`flex flex-col items-center rounded-xl border p-3 ${color}`}>
            <span className="text-2xl font-bold">{score}<span className="text-sm font-normal">/10</span></span>
            <span className="text-xs font-medium mt-0.5 text-center">{label}</span>
        </div>
    );
}

// ── Feedback Panel ────────────────────────────────────────────────────────────

function FeedbackPanel({ feedback, onClose }: { feedback: FeedbackData; onClose: () => void }) {
    return (
        <div className="flex flex-col h-full overflow-y-auto p-6 gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Interview Feedback</h3>
                    <p className="text-sm text-gray-500 mt-0.5">AI-generated assessment of your performance</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                    <X className="size-4" />
                </button>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ScoreBadge label="Overall" score={feedback.overallScore} />
                <ScoreBadge label="Communication" score={feedback.communicationScore} />
                <ScoreBadge label="Technical" score={feedback.technicalScore} />
                <ScoreBadge label="Relevance" score={feedback.relevanceScore} />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-1.5">Summary</p>
                <p className="text-sm text-gray-600 leading-relaxed">{feedback.summary}</p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="size-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-700">Strengths</span>
                    </div>
                    <ul className="space-y-1.5">
                        {feedback.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-1.5 size-1.5 rounded-full bg-green-400 flex-shrink-0" />
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 mb-2">
                        <TrendingUp className="size-4 text-amber-500" />
                        <span className="text-sm font-semibold text-gray-700">Areas to Improve</span>
                    </div>
                    <ul className="space-y-1.5">
                        {feedback.improvements.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-1.5 size-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
                Close
            </button>
        </div>
    );
}

// ── Status Header ─────────────────────────────────────────────────────────────

function statusLabel(status: SessionStatus, isMicActive: boolean): { text: string; color: string } {
    switch (status) {
        case 'connecting': return { text: 'Connecting to AI interviewer…', color: 'text-amber-600' };
        case 'ready':      return { text: 'Starting microphone…', color: 'text-amber-600' };
        case 'interviewing': return {
            text: isMicActive ? 'Interview in progress — speak clearly' : 'Processing…',
            color: 'text-green-600',
        };
        case 'ending':     return { text: 'Compiling feedback…', color: 'text-amber-600' };
        case 'done':       return { text: 'Interview complete', color: 'text-green-600' };
        case 'error':      return { text: 'Connection error', color: 'text-red-600' };
        default:           return { text: 'Ready to start', color: 'text-gray-500' };
    }
}

// ── Main Modal ────────────────────────────────────────────────────────────────

interface InterviewModalProps {
    jobDescription: string;
    onClose: () => void;
}

export default function InterviewModal({ jobDescription, onClose }: InterviewModalProps) {
    const { status, transcript, feedback, error, isMicActive, startSession, endInterview, closeSession } =
        useInterviewSession();

    const transcriptEndRef = useRef<HTMLDivElement>(null);

    // Auto-start when modal opens
    useEffect(() => {
        startSession(jobDescription);
        return () => closeSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Scroll transcript to bottom
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    const handleClose = () => {
        closeSession();
        onClose();
    };

    const isActive = status === 'interviewing' || status === 'ready';
    const isConnecting = status === 'connecting' || status === 'ready';
    const label = statusLabel(status, isMicActive);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* ── Feedback view ── */}
                {status === 'done' && feedback ? (
                    <FeedbackPanel feedback={feedback} onClose={handleClose} />
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                {isConnecting ? (
                                    <Loader2 className="size-4 text-amber-500 animate-spin" />
                                ) : (
                                    <div className={`size-2.5 rounded-full ${isMicActive ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`} />
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">AI Mock Interview</p>
                                    <p className={`text-xs font-medium ${label.color}`}>{label.text}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mx-5 mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                                <AlertTriangle className="size-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Transcript */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
                            {transcript.length === 0 && !error && status === 'interviewing' && (
                                <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-400">
                                    <div className="flex gap-1 items-end h-6">
                                        <span className="w-1.5 bg-green-400 rounded-full animate-bounce" style={{ height: '60%', animationDelay: '0ms' }} />
                                        <span className="w-1.5 bg-green-400 rounded-full animate-bounce" style={{ height: '100%', animationDelay: '150ms' }} />
                                        <span className="w-1.5 bg-green-400 rounded-full animate-bounce" style={{ height: '40%', animationDelay: '300ms' }} />
                                    </div>
                                    <p className="text-sm">AI is speaking — listen for your first question</p>
                                </div>
                            )}
                            {transcript.length === 0 && !error && (status === 'connecting' || status === 'ready') && (
                                <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-400">
                                    <Loader2 className="size-6 animate-spin" />
                                    <p className="text-sm">Connecting to interviewer…</p>
                                </div>
                            )}
                            {transcript.map((entry, i) => (
                                <div
                                    key={i}
                                    className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                            entry.speaker === 'ai'
                                                ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                                : 'bg-primary-500 text-white rounded-tr-sm'
                                        }`}
                                    >
                                        {entry.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={transcriptEndRef} />
                        </div>

                        {/* Footer Controls */}
                        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                {isMicActive ? (
                                    <>
                                        <Mic className="size-3.5 text-green-500" />
                                        <span className="text-green-600 font-medium">Mic active</span>
                                    </>
                                ) : (
                                    <>
                                        <MicOff className="size-3.5" />
                                        <span>Mic off</span>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {status === 'ending' && (
                                    <div className="flex items-center gap-1.5 text-xs text-amber-600">
                                        <Loader2 className="size-3.5 animate-spin" />
                                        Generating feedback…
                                    </div>
                                )}
                                {isActive && (
                                    <button
                                        onClick={endInterview}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
                                    >
                                        <PhoneOff className="size-4" />
                                        End Interview
                                    </button>
                                )}
                                {(status === 'error' || status === 'done') && (
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
