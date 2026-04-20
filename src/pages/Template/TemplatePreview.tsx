import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, Sparkles, AlertTriangle, ArrowLeft, UserCheck, Mic } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useProfileCompletion } from '@hooks/useProfileCompletion';
import { generateResume } from '@src/services/ai.service';
import { fetchFullProfile } from '@src/slices/profile/thunk.ts';
import InterviewModal from '@src/components/interview/InterviewModal';
import Previewer from '@src/components/Previewer';
import type { AppDispatch } from '@src/slices/store.ts';

// ── Main Page ────────────────────────────────────────────────────────────────

const PROFILE_THRESHOLD = 50;

const TemplatePreview = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { percentage, isProfileReady } = useProfileCompletion();

    const [template, setTemplate] = useState<any>(null);
    const [loadingTemplate, setLoadingTemplate] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [jobDescription, setJobDescription] = useState('');
    const [generating, setGenerating] = useState(false);
    const [genError, setGenError] = useState<string | null>(null);
    const [showInterview, setShowInterview] = useState(false);

    useEffect(() => {
        dispatch(fetchFullProfile());

        const fetchTemplate = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/templates/${id}`);
                if (!res.ok) throw new Error('Failed to fetch template');
                const data = await res.json();
                setTemplate(data);
            } catch (err: any) {
                setFetchError(err.message);
            } finally {
                setLoadingTemplate(false);
            }
        };
        if (id) fetchTemplate();
    }, [id, dispatch]);

    const handleGenerate = async () => {
        if (!id || !jobDescription.trim() || jobDescription.trim().length < 20) return;
        setGenerating(true);
        setGenError(null);
        try {
            const result = await generateResume(id, jobDescription.trim());
            localStorage.setItem('templateToLoad', JSON.stringify(result.filledTemplate));
            navigate(`/edit/${result.resume._id}`);
        } catch (err: any) {
            const msg = err?.response?.data?.message || err.message || 'Generation failed';
            setGenError(msg);
        } finally {
            setGenerating(false);
        }
    };
    const [previewWidth, setPreviewWidth] = useState(() => Math.min(495, window.innerWidth - 60));
    useEffect(() => {
        const onResize = () => setPreviewWidth(Math.min(495, window.innerWidth - 60));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const profileReady = isProfileReady(PROFILE_THRESHOLD);
    const jobDescOk = jobDescription.trim().length >= 20;

    return (
        <div className="min-h-screen px-3 py-4">
            <div className="max-w-7xl mx-auto">

                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Back to Gallery
                </button>

                {loadingTemplate ? (
                    <div className="flex flex-col items-center justify-center min-h-96 gap-3">
                        <div className="size-10 rounded-full border-4 border-gray-200 border-t-primary-500 animate-spin" />
                        <p className="text-sm text-gray-400 font-medium">Loading template…</p>
                    </div>
                ) : fetchError ? (
                    <div className="max-w-sm mx-auto mt-16 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-800 font-semibold text-sm mb-2">Failed to load template</p>
                        <p className="text-red-500 text-xs">{fetchError}</p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row  gap-4 flex-wrap items-center">

                        {/* Template Preview */}
                        <div className="flex-shrink-0">
                            <Previewer data={template?.data} width={previewWidth} />
                        </div>

                        {/* Action Panel */}
                        <div className="flex-1 min-w-0 max-w-[500px]">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Sparkles className="size-5 text-primary-500" />
                                        Create AI-Tailored Resume
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Paste the job description and we'll fill this template with content tailored to the role.
                                    </p>
                                </div>

                                {/* Profile Completeness */}
                                <div className={`rounded-lg p-4 ${profileReady ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <UserCheck className={`size-4 ${profileReady ? 'text-green-600' : 'text-amber-600'}`} />
                                            <span className={`text-sm font-semibold ${profileReady ? 'text-green-700' : 'text-amber-700'}`}>
                                                Profile Completion
                                            </span>
                                        </div>
                                        <span className={`text-sm font-bold ${profileReady ? 'text-green-700' : 'text-amber-700'}`}>
                                            {percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/60 rounded-full h-2 mb-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${profileReady ? 'bg-green-500' : 'bg-amber-400'}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    {!profileReady && (
                                        <p className="text-xs text-amber-700 mt-1">
                                            Your profile needs to be at least {PROFILE_THRESHOLD}% complete.{' '}
                                            <Link to="/profile" className="underline font-semibold">
                                                Complete Profile
                                            </Link>
                                        </p>
                                    )}
                                </div>

                                {/* Job Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Job Description <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the job posting or describe the role you're applying for…"
                                        rows={8}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition"
                                    />
                                    <p className={`text-xs mt-1 ${jobDescOk ? 'text-gray-400' : 'text-amber-500'}`}>
                                        {jobDescription.trim().length} / 20 characters minimum
                                    </p>
                                </div>

                                {/* Error */}
                                {genError && (
                                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                                        <AlertTriangle className="size-4 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700">{genError}</p>
                                    </div>
                                )}

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={!profileReady || !jobDescOk || generating}
                                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-all duration-150 active:scale-[0.98]"
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Generating Resume…
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="size-4" />
                                            Generate Resume
                                        </>
                                    )}
                                </button>

                                {generating && (
                                    <p className="text-xs text-center text-gray-400">
                                        AI is tailoring your resume — this may take 10–20 seconds…
                                    </p>
                                )}

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="bg-white px-2 text-gray-400">or</span>
                                    </div>
                                </div>

                                {/* Practice Interview Button */}
                                <button
                                    onClick={() => setShowInterview(true)}
                                    disabled={!jobDescOk}
                                    className="w-full inline-flex items-center justify-center gap-2 py-3 border-2 border-primary-500 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed text-primary-600 font-semibold text-sm rounded-lg transition-all duration-150 active:scale-[0.98]"
                                >
                                    <Mic className="size-4" />
                                    Practice Interview
                                </button>
                                {!jobDescOk && (
                                    <p className="text-xs text-center text-gray-400 -mt-2">
                                        Add a job description above to enable the interview
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Interview Modal */}
            {showInterview && (
                <InterviewModal
                    jobDescription={jobDescription}
                    onClose={() => setShowInterview(false)}
                />
            )}
        </div>
    );
};

export default TemplatePreview;
