import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, Sparkles, AlertTriangle, ArrowLeft, UserCheck } from 'lucide-react';
import { useProfileCompletion } from '@hooks/useProfileCompletion';
import { generateResume } from '@src/services/ai.service';

// ── Template preview renderer (same logic as TemplateCard) ──────────────────

const nestedToFlat = (nestedData: any) => {
    const elements: any[] = [...(nestedData.elements || [])];
    const sections: any[] = [];

    (nestedData.sections || []).forEach((section: any) => {
        const { 'sub-sections': subsections, elements: sectionElements, backgroundColor, borderColor, direction, ...sectionData } = section;
        sections.push(sectionData);

        (sectionElements || []).forEach((el: any) => {
            elements.push({ ...el, x: el.x + section.x, y: el.y + section.y, parentSection: section.id });
        });

        (subsections || []).forEach((ss: any) => {
            const { elements: subEls, backgroundColor: _bg, borderColor: _bc, direction: _dir, ...ssData } = ss;
            sections.push({ ...ssData, type: 'subsection', x: ssData.x + section.x, y: ssData.y + section.y, parentSection: section.id });
            (subEls || []).forEach((el: any) => {
                elements.push({ ...el, x: el.x + ssData.x + section.x, y: el.y + ssData.y + section.y, parentSection: ss.id });
            });
        });
    });

    return { elements, sections };
};

const TemplateRenderer = ({ data, scale }: { data: any; scale: number }) => {
    const { elements, sections } = nestedToFlat(data || {});

    const renderContent = (el: any) => {
        if (el.type === 'line-break') {
            return (
                <div style={{
                    width: `${el.lineBreakWidthPercent || 100}%`,
                    height: 0,
                    borderTop: `${Math.max(1, (el.lineBreakThickness || 1) * scale)}px ${el.lineBreakStyle || 'solid'} ${el.lineBreakColor || '#d1d5db'}`,
                }} />
            );
        }
        return el.content;
    };

    const elStyle = (el: any) => ({
        position: 'absolute' as const,
        left: `${el.x * scale}px`,
        top: `${el.y * scale}px`,
        width: `${el.width * scale}px`,
        height: `${el.height * scale}px`,
        ...(el.type === 'line-break' ? {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        } : {
            fontSize: `${(el.fontSize || 16) * scale}px`,
            fontWeight: el.fontWeight || 'normal',
            fontFamily: el.fontFamily || 'Arial',
            color: el.color || '#000000',
            textAlign: (el.textAlign || 'left') as any,
            lineHeight: el.lineHeight || 1.5,
            overflow: 'hidden',
            whiteSpace: 'pre-wrap' as const,
            wordWrap: 'break-word' as const,
        }),
    });

    return (
        <>
            {sections.filter((s: any) => !s.parentSection).map((section: any) => {
                const subsections = sections.filter((s: any) => s.parentSection === section.id);
                return (
                    <div key={section.id} style={{ position: 'absolute', left: `${section.x * scale}px`, top: `${section.y * scale}px`, width: `${section.width * scale}px`, height: `${section.height * scale}px`, boxSizing: 'border-box' }}>
                        {section.title && section.headerVisible !== false && (
                            <div style={{ fontSize: `${(section.headerFontSize || 18) * scale}px`, fontWeight: section.headerFontWeight || '700', fontFamily: section.headerFontFamily || 'Arial', color: section.headerColor || '#1f2937', marginBottom: `${1 * scale}px` }}>
                                {section.title}
                            </div>
                        )}
                        {subsections.map((ss: any) => (
                            <div key={ss.id} style={{ position: 'absolute', left: `${(ss.x - section.x) * scale}px`, top: `${(ss.y - section.y) * scale}px`, width: `${ss.width * scale}px`, height: `${ss.height * scale}px` }}>
                                {elements.filter((el: any) => el.parentSection === ss.id).map((el: any) => (
                                    <div key={el.id} style={{ ...elStyle(el), left: `${(el.x - ss.x) * scale}px`, top: `${(el.y - ss.y) * scale}px` }}>
                                        {renderContent(el)}
                                    </div>
                                ))}
                            </div>
                        ))}
                        {elements.filter((el: any) => el.parentSection === section.id && !subsections.some((ss: any) => ss.id === el.parentSection)).map((el: any) => (
                            <div key={el.id} style={{ ...elStyle(el), left: `${(el.x - section.x) * scale}px`, top: `${(el.y - section.y) * scale}px` }}>
                                {renderContent(el)}
                            </div>
                        ))}
                    </div>
                );
            })}
            {elements.filter((el: any) => !el.parentSection).map((el: any) => (
                <div key={el.id} style={elStyle(el)}>{renderContent(el)}</div>
            ))}
        </>
    );
};

// ── Main Page ────────────────────────────────────────────────────────────────

const PROFILE_THRESHOLD = 50;

const TemplatePreview = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { percentage, isProfileReady } = useProfileCompletion();

    const [template, setTemplate] = useState<any>(null);
    const [loadingTemplate, setLoadingTemplate] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [jobDescription, setJobDescription] = useState('');
    const [generating, setGenerating] = useState(false);
    const [genError, setGenError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/templates/${id}`);
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
    }, [id]);

    const handleGenerate = async () => {
        if (!id || !jobDescription.trim() || jobDescription.trim().length < 20) return;
        setGenerating(true);
        setGenError(null);
        try {
            const result = await generateResume(id, jobDescription.trim());
            localStorage.setItem('templateToLoad', JSON.stringify(result.filledTemplate));
            navigate('/builder');
        } catch (err: any) {
            const msg = err?.response?.data?.message || err.message || 'Generation failed';
            setGenError(msg);
        } finally {
            setGenerating(false);
        }
    };

    // Compute canvas scale for preview
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;
    const previewWidth = 480;
    const canvasWidth = template?.data?.canvasSettings?.width
        ? parseFloat(template.data.canvasSettings.width) * 96 / 25.4
        : A4_WIDTH_MM * 96 / 25.4;
    const canvasHeight = template?.data?.canvasSettings?.height
        ? parseFloat(template.data.canvasSettings.height) * 96 / 25.4
        : A4_HEIGHT_MM * 96 / 25.4;
    const scale = previewWidth / canvasWidth;
    const previewHeight = canvasHeight * scale;

    const profileReady = isProfileReady(PROFILE_THRESHOLD);
    const jobDescOk = jobDescription.trim().length >= 20;

    return (
        <div className="min-h-screen px-6 py-8">
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
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* Template Preview */}
                        <div className="flex-shrink-0">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">{template?.name}</h2>
                            <div
                                className="relative bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200"
                                style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
                            >
                                <TemplateRenderer data={template?.data} scale={scale} />
                            </div>
                        </div>

                        {/* Action Panel */}
                        <div className="flex-1 min-w-0 lg:max-w-md">
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
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplatePreview;
