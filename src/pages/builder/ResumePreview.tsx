import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { resumeService } from '@src/services/resume.service';
import Previewer from '@src/components/Previewer';

const ResumePreview = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [resume, setResume] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="min-h-screen px-6 py-8 bg-gray-50 flex flex-col items-center">
            <div className="w-full max-w-4xl flex justify-between mb-6 preview-controls">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Back to Editor
                </button>
                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700"
                >
                    <Printer className="size-4" />
                    Print
                </button>
            </div>

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
                <div className="preview-canvas bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
                    <Previewer data={resume?.data} width={800} />
                </div>
            )}

            <style>{`
                @media print {
                    @page { margin: 0; }
                    body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    body * { visibility: hidden; }
                    
                    /* Hide site topbar or extra headers if they exist */
                    header, nav, .preview-controls { display: none !important; }
                    
                    .preview-canvas, .preview-canvas * {
                        visibility: visible;
                    }
                    .preview-canvas {
                        position: absolute;
                        left: 0;
                        top: 0;
                        box-shadow: none !important;
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ResumePreview;
