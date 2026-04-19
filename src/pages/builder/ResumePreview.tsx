import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { resumeService } from '@src/services/resume.service';
import Previewer from '@src/components/Previewer';

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const MAX_W = 800;

const ResumePreview = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [resume, setResume] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);

    // Callback ref — fires when the element mounts/unmounts, not just on first render
    const [containerW, setContainerW] = useState(0);
    const roRef = useRef<ResizeObserver | null>(null);
    const containerRef = useCallback((el: HTMLDivElement | null) => {
        roRef.current?.disconnect();
        if (el) {
            roRef.current = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
            roRef.current.observe(el);
        }
    }, []);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                if (id) {
                    const data = await resumeService.get(id);
                    setResume(data);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchResume();
    }, [id]);

    const baseW = Math.min(containerW || MAX_W, MAX_W);
    const previewerW = Math.round(baseW * zoom);

    const zoomIdx = ZOOM_STEPS.indexOf(zoom);
    const canZoomIn  = zoomIdx < ZOOM_STEPS.length - 1;
    const canZoomOut = zoomIdx > 0;

    return (
        <div className="min-h-screen px-6 py-8 bg-gray-50 flex flex-col items-center">

            {/* ── Controls ── */}
            <div className="w-full max-w-[800px] flex items-center justify-between mb-6 preview-controls">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Back
                </button>

                <div className="flex items-center gap-2">
                    {/* Zoom controls */}
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-1.5 py-1 shadow-sm">
                        <button
                            onClick={() => setZoom(ZOOM_STEPS[zoomIdx - 1])}
                            disabled={!canZoomOut}
                            title="Zoom out"
                            className="p-1 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ZoomOut className="size-3.5" />
                        </button>
                        <button
                            onClick={() => setZoom(1)}
                            title="Reset zoom"
                            className="px-1.5 text-[11px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors min-w-[38px] text-center"
                        >
                            {Math.round(zoom * 100)}%
                        </button>
                        <button
                            onClick={() => setZoom(ZOOM_STEPS[zoomIdx + 1])}
                            disabled={!canZoomIn}
                            title="Zoom in"
                            className="p-1 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ZoomIn className="size-3.5" />
                        </button>
                        <div className="w-px h-4 bg-gray-200 mx-0.5" />
                        <button
                            onClick={() => setZoom(1)}
                            title="Fit to screen"
                            className="p-1 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                            <Maximize2 className="size-3.5" />
                        </button>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700"
                    >
                        <Printer className="size-4" />
                        Print
                    </button>
                </div>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-96 gap-3 pt-20">
                    <div className="size-10 rounded-full border-4 border-gray-200 border-t-primary-500 animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">Loading preview…</p>
                </div>
            ) : error ? (
                <div className="w-full max-w-sm mt-16 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-800 font-semibold text-sm mb-2">Failed to load resume</p>
                    <p className="text-red-500 text-xs">{error}</p>
                </div>
            ) : (
                // Outer div: caps width + allows horizontal scroll when zoomed in
                <div ref={containerRef} className="w-full max-w-[800px] overflow-x-auto">
                    <div className="preview-canvas bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200" style={{ width: previewerW }}>
                        <Previewer data={resume?.data} width={previewerW} />
                    </div>
                </div>
            )}

            <style>{`
                @media print {
                    @page { margin: 0; }
                    body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    body * { visibility: hidden; }
                    header, nav, .preview-controls { display: none !important; }
                    .preview-canvas, .preview-canvas * { visibility: visible; }
                    .preview-canvas {
                        position: absolute;
                        left: 0; top: 0;
                        box-shadow: none !important;
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ResumePreview;
