import {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import TemplateCard from './TemplateCard.js';
import ResumeCard from './ResumeCard.tsx';
import {ChevronRight, FileText, Globe, LayoutTemplate, RefreshCw, Search, X, Pencil, Trash2, User2, Clock} from 'lucide-react';
import {templateService} from '@src/services/template.service';
import {resumeService} from '@src/services/resume.service';
import {authService} from '@src/services/authService';
import DeleteToast from '@src/components/custom/toast/deleteToast';
import {useAuth} from "@hooks/useAuth.ts";
import {BlankCard} from "@pages/Template/BlankCard.tsx";
import {Modal} from "@src/components/custom/modal/modal";
import Previewer from "@src/components/Previewer";
import {timeAgoTemplates as timeAgo} from "@src/utils/url_helper.ts";
import { getTemplateReviews, ReviewStats } from '@src/services/reviewService';
import { Star } from 'lucide-react';

const CATEGORIES = ['All', 'Modern', 'Classic', 'Creative', 'Minimal', 'Professional', 'Other'];

const STATUS_TABS = [
    {key: 'all', label: 'All', dot: ''},
    {key: 'draft', label: 'Draft', dot: 'bg-amber-400'},
    {key: 'pending', label: 'Pending', dot: 'bg-blue-400'},
    {key: 'published', label: 'Published', dot: 'bg-emerald-400'},
] as const;
type MyStatus = typeof STATUS_TABS[number]['key'];

/* ── Section header ─────────────────────────────────────────────── */
const SectionHeader = ({
                           icon,
                           title,
                           count,
                           action,
                       }: {
    icon: React.ReactNode;
    title: string;
    count?: number;
    action?: { label: string; onClick: () => void };
}) => (<>
        <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
                .section-header-mono   { font-family: 'JetBrains Mono', monospace; }
                `}</style>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-gray-100 dark:bg-dark-800 flex items-center justify-center">
                    {icon}
                </div>
                <h2 className="text-[16px] md:text-[22px] section-header-mono font-bold text-gray-900 dark:text-dark-100 tracking-tight">
                    {title}
                </h2>
                {count !== undefined && (
                    <span
                        className="text-[8px] md:text-[11px] section-header-mono font-semibold text-gray-400 dark:text-dark-500 bg-gray-100 dark:bg-dark-800 px-1.5 py-0.5 rounded-full">
                    {count}
                </span>
                )}
            </div>
            {action && (
                <button
                    onClick={action.onClick}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                >
                    {action.label}
                    <ChevronRight className="size-3.5"/>
                </button>
            )}
        </div>
    </>
);


/* ── Main component ─────────────────────────────────────────────── */
const TemplatesGallery = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, isAuthenticated} = useAuth();
    const [previewWidth, setPreviewWidth] = useState(() => Math.min(495, window.innerWidth - 100));

    const [myTemplates, setMyTemplates] = useState<any[]>([]);
    const [communityTemplates, setCommunityTemplates] = useState<any[]>([]);
    const [resumes, setResumes] = useState<any[]>([]);
    const [loadingMine, setLoadingMine] = useState(true);
    const [loadingAll, setLoadingAll] = useState(true);
    const [loadingResumes, setLoadingResumes] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [myTemplateError, setMyTemplateError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [myStatus, setMyStatus] = useState<MyStatus>('all');

    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [ownerInfo, setOwnerInfo] = useState<{user_name: string, userprofile: string | null} | null>(null);
    const [loadingOwner, setLoadingOwner] = useState(false);
    const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);

    useEffect(() => {
        if (selectedTemplate) {
            if (selectedTemplate.userId) fetchOwnerInfo(selectedTemplate.userId);
            if (selectedTemplate._id) fetchReviewStats(selectedTemplate._id);
        } else {
            setOwnerInfo(null);
            setReviewStats(null);
        }
    }, [selectedTemplate]);

    const fetchReviewStats = async (templateId: string) => {
        setLoadingStats(true);
        try {
            const data = await getTemplateReviews(templateId, 1, 1);
            setReviewStats({
                averageRating: data.averageRating,
                totalReviews: data.totalReviews
            });
        } catch (err) {
            console.error("Error fetching review stats:", err);
        } finally {
            setLoadingStats(false);
        }
    };

    const fetchOwnerInfo = async (userId: string) => {
        setLoadingOwner(true);
        try {
            const data = await authService.getUserInfo(userId);
            if (data.success) {
                setOwnerInfo(data.user);
            }
        } catch (err) {
            console.error("Error fetching owner info:", err);
            setOwnerInfo(null);
        } finally {
            setLoadingOwner(false);
        }
    };

    const handleTemplateClick = (template: any) => {
        setSelectedTemplate(template);
        setIsPreviewOpen(true);
    };

    useEffect(() => {
        const onResize = () => setPreviewWidth(Math.min(495, window.innerWidth - 60));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handleUseTemplate = async (template: any) => {
        if (!isAuthenticated) {
            navigate('/auth/sign-in', { state: { from: location.pathname } });
            return;
        }
        try {
            // const newResumeData = {
            //     name: `My ${template.name}`,
            //     data: template.data,
            //     category: template.category,
            // };
            // const result = await resumeService.save(newResumeData);
            navigate(`/templates/${template._id}/preview`);
        } catch (err) {
            console.error("Error using template:", err);
        }
    };


    useEffect(() => {
        fetchAll();
    }, []);
    useEffect(() => {
        setMyTemplateError(null);
        fetchMine();
        fetchResumes();
    }, [isAuthenticated]);

    const fetchMine = async () => {
        setLoadingMine(true);
        if (isAuthenticated) {
            try {
                const data = await templateService.list();
                setMyTemplates(data.templates || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoadingMine(false);
            }
        }
    }

    const fetchResumes = async () => {
        if (!isAuthenticated) {
            setLoadingResumes(false);
            return;
        }
        setLoadingResumes(true);
        try {
            const data = await resumeService.list();
            setResumes(Array.isArray(data) ? data : []);
        } catch {
            setResumes([]);
        } finally {
            setLoadingResumes(false);
        }
    };

    const handleDeleteResume = async (resumeId: string) => {
        try {
            await resumeService.remove(resumeId);
            setResumes(prev => prev.filter(r => (r._id ?? r.id) !== resumeId));
            DeleteToast('Resume deleted');
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAll = async () => {
        setError(null);

        /* all templates → filter out current user's */
        setLoadingAll(true);
        try {
            const data = await templateService.listAll();
            const all: any[] = data.templates || [];
            const userId = user?._id;
            setCommunityTemplates(
                userId ? all.filter(t => String(t.userId) !== String(userId)) : all
            );
        } catch {
            /* community section silently fails */
        } finally {
            setLoadingAll(false);
        }
    };

    const handleDelete = async (templateId: string) => {
        try {
            await templateService.remove(templateId);
            setMyTemplates(prev => prev.filter(t => t._id !== templateId));
            DeleteToast('Template deleted');
        } catch (err) {
            console.error(err);
        }
    };

    /* ── Derived data ── */
    const isFiltering = search !== '' || activeCategory !== 'All';

    const applyFilter = (list: any[]) =>
        list.filter(t => {
            const matchCat = activeCategory === 'All' || (t.category || 'Other') === activeCategory;
            const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });

    const filteredMine = applyFilter(myTemplates);
    const filteredCommunity = applyFilter(communityTemplates);

    const countFor = (cat: string) => {
        const combined = [...myTemplates, ...communityTemplates];
        return cat === 'All' ? combined.length : combined.filter(t => (t.category || 'Other') === cat).length;
    };

    /** Count for My Templates status tabs */
    const myStatusCount = (key: MyStatus) =>
        key === 'all' ? myTemplates.length : myTemplates.filter(t => (t.status || 'draft') === key).length;

    /** Templates visible in My Templates section, filtered by status */
    const myFiltered = myStatus === 'all'
        ? myTemplates
        : myTemplates.filter(t => (t.status || 'draft') === myStatus);

    const loading = loadingMine && loadingAll && loadingResumes;

    /* ── Grid helper ── */
    const Grid = ({children}: { children: React.ReactNode }) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {children}
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-dark-900">
            <div className="max-w-5xl mx-auto px-6 pt-10 pb-16">

                {/* ── Search bar ── */}
                <div className="relative mb-5">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 size-[18px] text-gray-400 pointer-events-none"/>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search all templates…"
                        className="w-full pl-11 pr-10 py-3.5 text-[15px] bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400 text-gray-900 dark:text-dark-100 placeholder-gray-400 transition"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <X className="size-4"/>
                        </button>
                    )}
                </div>

                {/* ── Category tabs ── */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8" style={{scrollbarWidth: 'none'}}>
                    {CATEGORIES.map(cat => {
                        const count = countFor(cat);
                        if (count === 0 && cat !== 'All') return null;
                        const active = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 ${active
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                                    : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-dark-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                                }`}
                            >
                                {cat}
                                {active && (
                                    <span className="ml-1.5 text-[11px] opacity-60">{count}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-36 gap-4">
                        <div className="relative size-10">
                            <div className="size-10 rounded-full border-[3px] border-gray-100 dark:border-dark-700"/>
                            <div
                                className="absolute inset-0 size-10 rounded-full border-[3px] border-transparent border-t-primary-500 animate-spin"/>
                        </div>
                        <p className="text-[13px] text-gray-400 dark:text-dark-500">Loading templates…</p>
                    </div>
                )}

                {/* ── Error ── */}
                {error && !loading && (
                    <div className="flex flex-col items-center py-24 text-center gap-4">
                        <div
                            className="size-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                            <svg className="size-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                 strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 9v3.75m0 3.75h.008M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-dark-100">Failed to load templates</p>
                            <p className="text-sm text-gray-400 mt-0.5">{error}</p>
                        </div>
                        <button onClick={fetchAll}
                                className="inline-flex items-center gap-1.5 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">
                            <RefreshCw className="size-3.5"/>
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* ── FILTERED: flat search results ── */}
                        {isFiltering && (
                            <div>
                                {filteredMine.length === 0 && filteredCommunity.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-28 text-center">
                                        <div
                                            className="size-14 rounded-full bg-gray-100 dark:bg-dark-800 flex items-center justify-center mb-4">
                                            <Search className="size-5 text-gray-400"/>
                                        </div>
                                        <p className="font-bold text-gray-800 dark:text-dark-200 mb-1">No matches
                                            found</p>
                                        <p className="text-[13px] text-gray-400 dark:text-dark-500 mb-4">
                                            {search ? `Nothing matches "${search}"` : `No templates in "${activeCategory}"`}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSearch('');
                                                setActiveCategory('All');
                                            }}
                                            className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-10">
                                        {filteredMine.length > 0 && (
                                            <div>
                                                <SectionHeader
                                                    icon={<LayoutTemplate
                                                        className="size-3.5 text-gray-500 dark:text-dark-400"/>}
                                                    title="My Templates"
                                                    count={filteredMine.length}
                                                />
                                                <Grid>
                                                    {filteredMine.map(t => (
                                                        <TemplateCard key={t._id} template={t} onDelete={handleDelete} onClick={handleTemplateClick} isOwn/>
                                                    ))}
                                                </Grid>
                                            </div>
                                        )}
                                        {filteredCommunity.length > 0 && (
                                            <div>
                                                <SectionHeader
                                                    icon={<Globe
                                                        className="size-3.5 text-gray-500 dark:text-dark-400"/>}
                                                    title="Community Templates"
                                                    count={filteredCommunity.length}
                                                />
                                                <Grid>
                                                    {filteredCommunity.map(t => (
                                                        <TemplateCard key={t._id} template={t} isOwn={false} onClick={handleTemplateClick}/>
                                                    ))}
                                                </Grid>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── NOT FILTERED: three sections ── */}
                        {!isFiltering && (
                            <div className="space-y-12">

                                {/* 1. My Resumes */}
                                {isAuthenticated && (loadingResumes || resumes.length > 0) && (
                                    <section>
                                        <SectionHeader
                                            icon={<FileText className="size-3.5 text-gray-500 dark:text-dark-400"/>}
                                            title="My Resumes"
                                            count={loadingResumes ? undefined : resumes.length}
                                            // action={{label: 'New resume', onClick: () => navigate('/edit/new')}}
                                        />
                                        {loadingResumes ? (
                                            <div className="flex items-center gap-3 py-8 text-gray-400 dark:text-dark-500">
                                                <div className="size-5 rounded-full border-2 border-gray-200 border-t-indigo-500 animate-spin"/>
                                                <span className="text-[13px]">Loading resumes…</span>
                                            </div>
                                        ) : (
                                            <Grid>
                                                {resumes.map(r => (
                                                    <ResumeCard
                                                        key={r._id ?? r.id}
                                                        resume={r}
                                                        onDelete={handleDeleteResume}
                                                    />
                                                ))}
                                            </Grid>
                                        )}
                                    </section>
                                )}

                                {/* 2. My Templates */}
                                <section>
                                    <SectionHeader
                                        icon={<LayoutTemplate className="size-3.5  text-gray-500 dark:text-dark-400"/>}
                                        title="My Templates"
                                        count={myTemplates.length}
                                        action={{label: 'Create new', onClick: () => navigate('/builder')}}
                                    />
                                    {/* ── Status filter tabs ── */}
                                    {myTemplates.length > 0 && (
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5"
                                             style={{scrollbarWidth: 'none'}}>
                                            {STATUS_TABS.map(tab => {
                                                const cnt = myStatusCount(tab.key);
                                                if (cnt === 0 && tab.key !== 'all') return null;
                                                const active = myStatus === tab.key;
                                                return (
                                                    <button
                                                        key={tab.key}
                                                        onClick={() => setMyStatus(tab.key)}
                                                        className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 ${
                                                            active
                                                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                                                                : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-dark-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                                                        }`}
                                                    >
                                                        {tab.dot && (
                                                            <span
                                                                className={`size-2 rounded-full shrink-0 ${tab.dot} ${active ? 'opacity-90' : 'opacity-60'}`}/>
                                                        )}
                                                        {tab.label}
                                                        <span
                                                            className={`text-[11px] ${active ? 'opacity-60' : 'opacity-50'}`}>{cnt}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <Grid>
                                        {/* Blank card always first */}
                                        <BlankCard onClick={() => navigate('/builder')}/>

                                        {isAuthenticated && myFiltered.map(t => (
                                            <TemplateCard key={t._id} template={t} onDelete={handleDelete} onClick={handleTemplateClick} isOwn/>
                                        ))}
                                    </Grid>

                                    {myTemplates.length === 0 && (
                                        <p className="text-[13px] text-gray-400 dark:text-dark-500 mt-4 pl-1">
                                            You haven't created any templates yet — start with a blank resume above.
                                        </p>
                                    )}
                                    {myTemplates.length > 0 && myFiltered.length === 0 && (
                                        <p className="text-[13px] text-gray-400 dark:text-dark-500 mt-4 pl-1">
                                            No {myStatus} templates yet.
                                            <button
                                                onClick={() => setMyStatus('all')}
                                                className="ml-2 text-primary-500 hover:text-primary-600 font-semibold transition-colors"
                                            >
                                                Clear
                                            </button>
                                        </p>
                                    )}
                                </section>

                                {/* 3. All Templates (community) */}
                                {(loadingAll || communityTemplates.length > 0) && (
                                    <section>
                                        <SectionHeader
                                            icon={<Globe className="size-3.5 text-gray-500 dark:text-dark-400"/>}
                                            title="All Templates"
                                            count={loadingAll ? undefined : communityTemplates.length}
                                        />

                                        {loadingAll ? (
                                            <div
                                                className="flex items-center gap-3 py-8 text-gray-400 dark:text-dark-500">
                                                <div
                                                    className="size-5 rounded-full border-2 border-gray-200 border-t-primary-500 animate-spin"/>
                                                <span className="text-[13px]">Loading community templates…</span>
                                            </div>
                                        ) : (
                                            <Grid>
                                                {communityTemplates.map(t => (
                                                    <TemplateCard key={t._id} template={t} isOwn={false} onClick={handleTemplateClick}/>
                                                ))}
                                            </Grid>
                                        )}
                                    </section>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Modal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                size="modal-2xl"
                title="Template Preview"
                content={
                    selectedTemplate && (
                        <div className="flex flex-col lg:flex-row gap-8 p-2 min-h-[500px]">
                            {/* Left Column: Preview */}
                            {/*<div className="lg:w-2/3 bg-gray-50 dark:bg-dark-800 rounded-xl p-8 flex justify-center items-start overflow-y-auto max-h-[70vh] border border-gray-100 dark:border-dark-700 shadow-inner">*/}
                            {/*    <ResponsivePreviewer data={selectedTemplate.data} />*/}
                            {/*</div>*/}
                            <Previewer data={selectedTemplate.data} width={previewWidth}/>

                            {/* Right Column: Details & Action */}
                            <div className="lg:w-1/3 flex flex-col justify-between py-4">
                                <div>
                                    <h2 className="text-lg font-extrabold text-gray-900 dark:text-dark-100 mb-2 tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        {selectedTemplate.name}
                                    </h2>
                                    
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`size-3.5 ${reviewStats && star <= Math.round(reviewStats.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        {loadingStats ? (
                                            <span className="text-[10px] text-gray-400 animate-pulse">Loading ratings...</span>
                                        ) : reviewStats && reviewStats.totalReviews > 0 ? (
                                            <span className="text-[11px] font-bold text-gray-500">
                                                {reviewStats.averageRating} ({reviewStats.totalReviews})
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-medium text-gray-400">No reviews</span>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700">
                                            <div className="size-10 rounded-full bg-gray-200 dark:bg-dark-700 overflow-hidden flex-shrink-0">
                                                {ownerInfo?.userprofile ? (
                                                    <img src={ownerInfo.userprofile} alt={ownerInfo.user_name} className="size-full object-cover" />
                                                ) : (
                                                    <div className="size-full flex items-center justify-center text-gray-400">
                                                        <User2 className="size-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold text-gray-400 dark:text-dark-500 uppercase tracking-wider">Created By</p>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-dark-300 truncate">
                                                    {loadingOwner ? 'Loading...' : ownerInfo?.user_name || 'Unknown User'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-500 dark:text-dark-400 px-1">
                                            <Clock className="size-3.5" />
                                            <span className="text-[12px] font-medium">
                                                Last updated {timeAgo(selectedTemplate.updatedAt)}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-bold text-gray-400 dark:text-dark-500 uppercase tracking-wider">Category</label>
                                            <p className="text-[15px] font-semibold text-gray-700 dark:text-dark-300">
                                                {selectedTemplate.category || 'Other'}
                                            </p>
                                        </div>
                                        {selectedTemplate.description && (
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-400 dark:text-dark-500 uppercase tracking-wider">Description</label>
                                                <p className="text-sm text-gray-600 dark:text-dark-400 leading-relaxed">
                                                    {selectedTemplate.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-8 space-y-3">
                                    {user?._id === selectedTemplate.userId && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/builder/${selectedTemplate._id}`)}
                                                className="flex-1 py-4 bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                            >
                                                <Pencil className="size-5" />
                                                Edit template
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this template?')) {
                                                        handleDelete(selectedTemplate._id);
                                                        setIsPreviewOpen(false);
                                                    }
                                                }}
                                                className="px-4 py-4 bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-500 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                                title="Delete Template"
                                            >
                                                <Trash2 className="size-5" />
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleUseTemplate(selectedTemplate)}
                                        className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <LayoutTemplate className="size-5" />
                                        Use this template
                                    </button>
                                    <p className="text-center text-[11px] text-gray-400 dark:text-dark-500 mt-4">
                                        This will create a new resume based on this layout.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }
            />
        </div>
    );
};

export default TemplatesGallery;
