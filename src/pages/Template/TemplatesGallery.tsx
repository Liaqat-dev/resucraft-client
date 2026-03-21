import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from './TemplateCard.js';
import { Plus, RefreshCw, FileText, LayoutTemplate, Search, X } from 'lucide-react';

const CATEGORIES = ['All', 'Modern', 'Classic', 'Creative', 'Minimal', 'Professional', 'Other'];

const TemplatesGallery = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

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

    // Client-side filtering
    const filtered = templates.filter(t => {
        const matchCat = activeCategory === 'All' || (t.category || 'Other') === activeCategory;
        const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    // Count per category for badges
    const countFor = (cat: string) =>
        cat === 'All' ? templates.length : templates.filter(t => (t.category || 'Other') === cat).length;

    return (
        <div className="min-h-screen px-6 py-8">
            {/* ── Header ── */}
            <div className="max-w-7xl mx-auto mb-6">
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

            {/* ── Search + Filters ── */}
            {!loading && !error && templates.length > 0 && (
                <div className="max-w-7xl mx-auto mb-6 space-y-3">
                    {/* Search bar */}
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search templates…"
                            className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 text-gray-800 placeholder-gray-400 transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Category chips */}
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => {
                            const count = countFor(cat);
                            if (count === 0 && cat !== 'All') return null;
                            const active = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                                        active
                                            ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                                    }`}
                                >
                                    {cat}
                                    <span className={`text-[10px] font-bold px-1 py-0.5 rounded-full ${
                                        active ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Content ── */}
            <div className="max-w-7xl mx-auto">

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center min-h-96 gap-3">
                        <div className="size-10 rounded-full border-4 border-gray-200 border-t-primary-500 animate-spin" />
                        <p className="text-sm text-gray-400 font-medium">Loading templates…</p>
                    </div>
                )}

                {/* Error */}
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

                {/* Empty — no templates at all */}
                {!loading && !error && templates.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-96 border-2 border-dashed border-gray-200 rounded-2xl py-16 px-8 text-center">
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

                {/* Empty — filter/search has no matches */}
                {!loading && !error && templates.length > 0 && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="size-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <Search className="size-6 text-gray-400" />
                        </div>
                        <p className="text-gray-700 font-semibold text-sm mb-1">No templates found</p>
                        <p className="text-gray-400 text-xs">
                            {search ? `No results for "${search}"` : `No templates in "${activeCategory}"`}
                        </p>
                        <button
                            onClick={() => { setSearch(''); setActiveCategory('All'); }}
                            className="mt-4 text-xs font-semibold text-primary-500 hover:text-primary-600 underline underline-offset-2"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && filtered.length > 0 && (
                    <>
                        <p className="text-xs text-gray-400 mb-4">
                            Showing {filtered.length} of {templates.length} template{templates.length !== 1 ? 's' : ''}
                            {activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
                            {search ? ` matching "${search}"` : ''}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filtered.map(template => (
                                <TemplateCard
                                    key={template._id}
                                    template={template}
                                    onLoad={handleLoadTemplate}
                                    onDelete={handleDeleteTemplate}
                                    isLoading={loadingId === template._id}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TemplatesGallery;
