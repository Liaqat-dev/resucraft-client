import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from './TemplateCard.js';
import { Plus, RefreshCw, FileText, LayoutTemplate } from 'lucide-react';

const TemplatesGallery = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:5000/api/templates');
            if (!response.ok) throw new Error('Failed to fetch templates');
            const data = await response.json();
            setTemplates(data.templates || []);
        } catch (err) {
            console.error('Error fetching templates:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadTemplate = async (template) => {
        setLoadingId(template._id);
        try {
            const response = await fetch(`http://localhost:5000/api/templates/${template._id}`);
            if (!response.ok) throw new Error('Failed to fetch template');
            const freshTemplate = await response.json();
            localStorage.setItem('templateToLoad', JSON.stringify(freshTemplate));
        } catch (err) {
            console.error('Error fetching template:', err);
            // Fallback to cached data
            localStorage.setItem('templateToLoad', JSON.stringify(template));
        } finally {
            setLoadingId(null);
        }
        navigate('/builder');
    };

    const handleDeleteTemplate = async (templateId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/templates/${templateId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete template');
            fetchTemplates();
            alert('✅ Template deleted successfully!');
        } catch (err) {
            console.error('Error deleting template:', err);
            alert('❌ Failed to delete template');
        }
    };

    return (
        <div className="min-h-screen  px-6 py-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="flex items-center justify-center size-9 rounded-lg bg-primary-500/10">
                                <LayoutTemplate className="size-5 text-primary-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                My Templates
                            </h1>
                        </div>
                        <p className="text-sm text-gray-500 pl-11">
                            {loading ? 'Loading…' : `${templates.length} template${templates.length !== 1 ? 's' : ''} saved`}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/builder')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                    >
                        <Plus className="size-4" />
                        New Template
                    </button>
                </div>
                <div className="h-px bg-gradient-to-r from-primary-200 via-gray-200 to-transparent" />
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center min-h-96 gap-3">
                        <div className="size-10 rounded-full border-4 border-gray-200 border-t-primary-500 animate-spin" />
                        <p className="text-sm text-gray-400 font-medium">Loading templates…</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="max-w-sm mx-auto mt-16 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <div className="size-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <p className="text-red-800 font-semibold text-sm mb-1">Failed to load templates</p>
                        <p className="text-red-500 text-xs mb-4">{error}</p>
                        <button
                            onClick={fetchTemplates}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors duration-150"
                        >
                            <RefreshCw className="size-3.5" />
                            Try again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && templates.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-96  border-2 border-dashed border-gray-200 rounded-2xl py-16 px-8 text-center">
                        <div className="size-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-5 shadow-sm">
                            <FileText className="size-8 text-primary-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">No templates yet</h2>
                        <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
                            Start building your first resume template and it will appear here.
                        </p>
                        <button
                            onClick={() => navigate('/builder')}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                        >
                            <Plus className="size-4" />
                            Create Template
                        </button>
                    </div>
                )}

                {/* Templates Grid */}
                {!loading && !error && templates.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {templates.map(template => (
                            <TemplateCard
                                key={template._id}
                                template={template}
                                onLoad={handleLoadTemplate}
                                onDelete={handleDeleteTemplate}
                                isLoading={loadingId === template._id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplatesGallery;
