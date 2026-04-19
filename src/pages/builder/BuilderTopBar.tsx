import React from 'react';

/* ─── Icons ─── */

const IconSave = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);

const IconUpdate = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
);
const IconEye = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconPDF = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const IconPublish = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <polyline points="5 12 12 5 19 12" />
        <path d="M5 19h14" />
    </svg>
);

const IconClock = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconCheck = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconDraft = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" strokeDasharray="4 2" />
    </svg>
);

const IconChevron = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

/* ─── Status Badge ─── */

type TemplateVisibility = 'private' | 'public';
type TemplateStatus = 'draft' | 'pending' | 'published';

const StatusBadge = ({ status }: { status: TemplateStatus }) => {
    if (status === 'published') {
        return (
            <span className="btb-badge-published flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0">
                <IconCheck /> Published
            </span>
        );
    }
    if (status === 'pending') {
        return (
            <span className="btb-badge-pending flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0">
                <IconClock /> Pending
            </span>
        );
    }
    return (
        <span className="btb-badge-draft flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0">
            <IconDraft /> Draft
        </span>
    );
};

/* ─── Inline Input ─── */

interface InlineInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    width?: string;
}

const InlineInput = ({ value, onChange, placeholder = '', width = '160px' }: InlineInputProps) => (
    <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="btb-input"
        style={{ width }}
    />
);

/* ─── Inline Select ─── */

interface InlineSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    width?: string;
}

const InlineSelect = ({ value, onChange, options, width = '110px' }: InlineSelectProps) => (
    <div className="btb-select-wrap" style={{ width }}>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="btb-select"
        >
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
        <span className="btb-select-chevron pointer-events-none">
            <IconChevron />
        </span>
    </div>
);

/* ─── Top Bar Button ─── */

interface TopBarButtonProps {
    onClick: () => void;
    disabled?: boolean;
    icon: React.ReactNode;
    label: string;
    variant?: 'primary' | 'secondary' | 'success' | 'amber';
    loading?: boolean;
}

const TopBarButton = ({ onClick, disabled, icon, label, variant = 'primary', loading }: TopBarButtonProps) => (
    <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`btb-btn btb-btn-${variant} flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold
            transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
            hover:-translate-y-[1px] active:translate-y-0`}
    >
        <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
            {icon}
        </span>
        {loading ? `${label.split(' ')[0]}ing...` : label}
    </button>
);

/* ─── Spinner ─── */

const Spinner = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        className="animate-spin" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
);

/* ─── Main Component ─── */

const TEMPLATE_CATEGORIES = ['Modern', 'Classic', 'Creative', 'Minimal', 'Professional', 'Other'];

interface CanvasSizeMap {
    [key: string]: { width: string; height: string; label: string };
}

interface BuilderTopBarProps {
    templateName: string;
    onTemplateNameChange: (val: string) => void;
    templateCategory: string;
    onTemplateCategoryChange: (val: string) => void;
    canvasSize: string;
    onCanvasSizeChange: (val: string) => void;
    canvasSizes: CanvasSizeMap;
    templateId: string | null;
    templateVisibility: TemplateVisibility;
    templateStatus: TemplateStatus;
    isSaving: boolean;
    isExporting: boolean;
    isPublishing: boolean;
    onSave: () => void;
    onUpdate: () => void;
    onExportPDF: () => void;
    onPublish: () => void;
    onPreview?: () => void;
    mode?: 'template' | 'resume';
}

const BuilderTopBar = ({
    templateName,
    onTemplateNameChange,
    templateCategory,
    onTemplateCategoryChange,
    canvasSize,
    onCanvasSizeChange,
    canvasSizes,
    templateId,
    templateStatus,
    isSaving,
    isExporting,
    isPublishing,
    onSave,
    onUpdate,
    onExportPDF,
    onPublish,
    onPreview,
    mode = 'template',
}: BuilderTopBarProps) => {
    const isPublished = templateStatus === 'published';
    const isPending = templateStatus === 'pending';

    const pageSizeOptions = Object.entries(canvasSizes).map(([key, size]) => ({
        value: key,
        label: size.label,
    }));

    const categoryOptions = TEMPLATE_CATEGORIES.map(c => ({ value: c, label: c }));

    return (
        <>
            <style>{`
                .btb-bar {
                    background: color-mix(in srgb, var(--rc-card, #fff) 94%, transparent);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    border-bottom: 1px solid var(--rc-border, rgba(0,0,0,0.09));
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                }
                .btb-divider {
                    width: 1px;
                    height: 20px;
                    background: var(--rc-border, rgba(0,0,0,0.12));
                    flex-shrink: 0;
                }

                /* Inline input */
                .btb-input {
                    height: 30px;
                    padding: 0 10px;
                    border-radius: 7px;
                    border: 1px solid var(--rc-border, rgba(0,0,0,0.12));
                    background: var(--rc-bg-alt, rgba(0,0,0,0.04));
                    color: var(--rc-text, #111);
                    font-size: 12px;
                    font-weight: 500;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .btb-input::placeholder { color: var(--rc-text-muted, #9ca3af); }
                .btb-input:focus {
                    border-color: color-mix(in srgb, var(--rc-accent, #3b82f6) 60%, transparent);
                    box-shadow: 0 0 0 2.5px color-mix(in srgb, var(--rc-accent, #3b82f6) 16%, transparent);
                }

                /* Inline select */
                .btb-select-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .btb-select {
                    height: 30px;
                    width: 100%;
                    padding: 0 26px 0 10px;
                    border-radius: 7px;
                    border: 1px solid var(--rc-border, rgba(0,0,0,0.12));
                    background: var(--rc-bg-alt, rgba(0,0,0,0.04));
                    color: var(--rc-text, #111);
                    font-size: 12px;
                    font-weight: 500;
                    appearance: none;
                    -webkit-appearance: none;
                    outline: none;
                    cursor: pointer;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .btb-select:focus {
                    border-color: color-mix(in srgb, var(--rc-accent, #3b82f6) 60%, transparent);
                    box-shadow: 0 0 0 2.5px color-mix(in srgb, var(--rc-accent, #3b82f6) 16%, transparent);
                }
                .btb-select-chevron {
                    position: absolute;
                    right: 8px;
                    color: var(--rc-text-muted, #9ca3af);
                    display: flex;
                    align-items: center;
                }


                [data-mode="dark"] .btb-badge-pending { color: #fbbf24; }
                [data-mode="dark"] .btb-badge-published { color: #34d399; }

                /* Buttons */
                .btb-btn { cursor: pointer; white-space: nowrap; }

                .btb-btn-primary {
                    background: linear-gradient(135deg, var(--rc-accent, #3b82f6), var(--rc-accent-dark, #1d4ed8));
                    color: white;
                    box-shadow: 0 2px 8px color-mix(in srgb, var(--rc-accent, #3b82f6) 35%, transparent);
                }
                .btb-btn-primary:hover:not(:disabled) {
                    filter: brightness(1.08);
                    box-shadow: 0 4px 14px color-mix(in srgb, var(--rc-accent, #3b82f6) 45%, transparent);
                }
                .btb-btn-amber {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                    box-shadow: 0 2px 8px rgba(245,158,11,0.3);
                }
                .btb-btn-amber:hover:not(:disabled) {
                    filter: brightness(1.08);
                    box-shadow: 0 4px 14px rgba(245,158,11,0.4);
                }
                .btb-btn-secondary {
                    background: var(--rc-bg-alt, rgba(0,0,0,0.06));
                    color: var(--rc-text, #111);
                    border: 1px solid var(--rc-border, rgba(0,0,0,0.12));
                }
                .btb-btn-secondary:hover:not(:disabled) {
                    background: var(--rc-card, #fff);
                    border-color: color-mix(in srgb, var(--rc-accent, #3b82f6) 40%, var(--rc-border));
                }
                .btb-btn-success {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    box-shadow: 0 2px 8px rgba(16,185,129,0.3);
                }
                .btb-btn-success:hover:not(:disabled) {
                    filter: brightness(1.08);
                    box-shadow: 0 4px 14px rgba(16,185,129,0.4);
                }
            `}</style>

            <div
                className="btb-bar fixed left-0 right-0 z-[99] flex items-center gap-2.5 px-4"
                style={{ top: '4.6875rem', height: '48px' }}
            >
                {/* Left group: name + status badge */}
                <InlineInput
                    value={templateName}
                    onChange={onTemplateNameChange}
                    placeholder={mode === 'resume' ? 'Resume name' : 'Template name'}
                    width="170px"
                />
                <div className="btb-divider" />

                {/* Category */}
                <InlineSelect
                    value={templateCategory || 'Other'}
                    onChange={onTemplateCategoryChange}
                    options={categoryOptions}
                    width="90px"
                />

                <div className="btb-divider" />

                {/* Page size */}
                <InlineSelect
                    value={canvasSize}
                    onChange={onCanvasSizeChange}
                    options={pageSizeOptions}
                    width="140px"
                />

                {/* Spacer */}
                <div className="flex-1" />

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    {!templateId ? (
                        <TopBarButton
                            onClick={onSave}
                            disabled={isSaving}
                            loading={isSaving}
                            icon={isSaving ? <Spinner /> : <IconSave />}
                            label="Save"
                            variant="primary"
                        />
                    ) : (
                        <TopBarButton
                            onClick={onUpdate}
                            disabled={isSaving}
                            loading={isSaving}
                            icon={isSaving ? <Spinner /> : <IconUpdate />}
                            label="Update"
                            variant="amber"
                        />
                    )}

                    <div className="btb-divider" />

                    <TopBarButton
                        onClick={onExportPDF}
                        disabled={isExporting}
                        loading={isExporting}
                        icon={isExporting ? <Spinner /> : <IconPDF />}
                        label="Export PDF"
                        variant="secondary"
                    />

                    {mode === 'resume' && templateId && (
                        <>
                            <div className="btb-divider" />
                            <TopBarButton
                                onClick={onPreview || (() => {})}
                                disabled={!templateId}
                                icon={<IconEye />}
                                label="Preview"
                                variant="secondary"
                            />
                        </>
                    )}

                    {mode === 'template' && (
                        <>
                            <div className="btb-divider" />
                            {isPublished ? (
                                <TopBarButton onClick={() => {}} disabled icon={<IconCheck />} label="Published" variant="success" />
                            ) : isPending ? (
                                <TopBarButton onClick={() => {}} disabled icon={<IconClock />} label="Pending Review" variant="success" />
                            ) : (
                                <TopBarButton
                                    onClick={onPublish}
                                    disabled={isPublishing || !templateId}
                                    loading={isPublishing}
                                    icon={isPublishing ? <Spinner /> : <IconPublish />}
                                    label="Publish"
                                    variant="success"
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default BuilderTopBar;
