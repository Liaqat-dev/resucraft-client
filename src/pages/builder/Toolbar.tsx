import React, { useState } from 'react';
import { FloatingInput, FloatingNumber, FloatingSelect } from '@src/components/common/FloatingInput.tsx';

/* ─── Icons ─── */

const IconFile = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
);

const IconSave = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
);

const IconUpload = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const IconDownload = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const IconRefresh = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
);

const IconCopy = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
);

const IconPlus = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconGrid = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);

const IconZoomIn = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

const IconLink = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
);

const IconUnlink = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.84 12.25l1.72-1.71a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M5.16 11.75l-1.72 1.71a5 5 0 007.07 7.07l1.72-1.71" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const IconMargin = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><rect x="7" y="7" width="10" height="10" rx="1" strokeDasharray="3 2" />
    </svg>
);

const IconMouse = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 00-5 5v10a5 5 0 0010 0V7a5 5 0 00-5-5z" /><line x1="12" y1="6" x2="12" y2="10" />
    </svg>
);

const IconCheck = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/* ─── Section Wrapper ─── */

const PanelSection = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-3 ${className}`}>
        {children}
    </div>
);

const SectionLabel = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-1.5 mb-2.5">
        {Icon && <span className="text-gray-400"><Icon /></span>}
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{children}</span>
    </div>
);

/* ─── Main Toolbar ─── */

const Toolbar = ({
    templateName,
    onTemplateNameChange,
    onAddSection,
    onSave,
    onUpdate,
    templateId,
    onLoad,
    onCopyJSON,
    selectedCount,
    isSaving,
    canvasSize,
    onCanvasSizeChange,
    canvasSizes,
    customWidth,
    customHeight,
    onCustomWidthChange,
    onCustomHeightChange,
    margins,
    onMarginsChange,
    scale,
    onScaleChange,
    showGrid,
    onToggleGrid,
    gridSize
}) => {
    const [linkMargins, setLinkMargins] = useState(false);

    const handleMarginChange = (side, value) => {
        const numVal = Number(value) || 0;
        if (linkMargins) {
            onMarginsChange({ top: numVal, right: numVal, bottom: numVal, left: numVal });
        } else {
            onMarginsChange({ ...margins, [side]: numVal });
        }
    };

    const pageSizeOptions = Object.entries(canvasSizes).map(([key, size]) => ({
        value: key,
        label: size.label
    }));

    return (
        <div className="fixed top-4 left-4 flex flex-col gap-2 z-[100] w-[252px] max-h-[calc(100vh-32px)] overflow-y-auto overflow-x-hidden toolbar-scroll">
            <style>{`
                .toolbar-scroll::-webkit-scrollbar { width: 4px; }
                .toolbar-scroll::-webkit-scrollbar-track { background: transparent; }
                .toolbar-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
                .toolbar-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
            `}</style>

            {/* ── Template Name ── */}
            <PanelSection>
                <SectionLabel icon={IconFile}>Template</SectionLabel>
                <FloatingInput
                    label="Template Name"
                    value={templateName}
                    onChange={(e) => onTemplateNameChange(e.target.value)}
                />
            </PanelSection>

            {/* ── Page Size ── */}
            <PanelSection>
                <SectionLabel icon={IconFile}>Page Size</SectionLabel>
                <div className="space-y-2">
                    <FloatingSelect
                        label="Page Size"
                        value={canvasSize}
                        onChange={(e) => onCanvasSizeChange(e.target.value)}
                        options={pageSizeOptions}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <FloatingInput
                            label="Width"
                            value={customWidth}
                            onChange={(e) => onCustomWidthChange(e.target.value)}
                        />
                        <FloatingInput
                            label="Height"
                            value={customHeight}
                            onChange={(e) => onCustomHeightChange(e.target.value)}
                        />
                    </div>
                </div>
            </PanelSection>

            {/* ── Margins ── */}
            <PanelSection>
                <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-400"><IconMargin /></span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Margins (in)</span>
                    </div>
                    <button
                        onClick={() => setLinkMargins(prev => !prev)}
                        title={linkMargins ? 'Unlink margins' : 'Link all margins'}
                        className={`flex items-center justify-center w-7 h-7 rounded-md border transition-all duration-150 ${
                            linkMargins
                                ? 'border-blue-300 bg-blue-50 text-blue-500'
                                : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {linkMargins ? <IconLink /> : <IconUnlink />}
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {['top', 'right', 'bottom', 'left'].map(side => (
                        <FloatingNumber
                            key={side}
                            label={side.charAt(0).toUpperCase() + side.slice(1)}
                            value={margins[side]}
                            onChange={(e) => handleMarginChange(side, e.target.value)}
                            min={0}
                            max={5}
                            step={0.1}
                        />
                    ))}
                </div>
            </PanelSection>

            {/* ── Zoom & Grid ── */}
            <PanelSection>
                <SectionLabel icon={IconZoomIn}>View</SectionLabel>

                {/* Zoom */}
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-gray-500">Zoom</span>
                        <span className="text-[11px] font-bold text-gray-800 tabular-nums bg-gray-100 px-1.5 py-0.5 rounded">
                            {Math.round(scale * 100)}%
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.05"
                            value={scale}
                            onChange={(e) => onScaleChange(Number(e.target.value))}
                            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-md
                                [&::-webkit-slider-thumb]:shadow-blue-500/25 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                                [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                                [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full
                                [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                        />
                        {scale !== 1 && (
                            <button
                                onClick={() => onScaleChange(1)}
                                title="Reset to 100%"
                                className="flex items-center justify-center w-6 h-6 rounded-md border border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600 transition-all duration-150"
                            >
                                <IconRefresh />
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid toggle */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-400"><IconGrid /></span>
                        <span className="text-[11px] font-semibold text-gray-500">Grid Lines</span>
                    </div>
                    <ToggleSwitch checked={showGrid} onChange={onToggleGrid} />
                </div>
            </PanelSection>

            {/* ── Quick Guide ── */}
            <PanelSection className="!bg-gradient-to-br !from-slate-50 !to-gray-50 !border-gray-200/60">
                <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-gray-400"><IconMouse /></span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shortcuts</span>
                </div>
                <div className="space-y-1">
                    {[
                        ['Click', 'Edit drawer'],
                        ['Double-click', 'Add text'],
                        ['Shift+Click', 'Multi-select'],
                        ['Drag corners', 'Resize'],
                        ['Del / Backspace', 'Remove'],
                    ].map(([key, desc]) => (
                        <div key={key} className="flex items-center justify-between text-[11px]">
                            <span className="font-mono font-semibold text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200 text-[10px]">{key}</span>
                            <span className="text-gray-400">{desc}</span>
                        </div>
                    ))}
                </div>
            </PanelSection>

            {/* ── Add Section ── */}
            <button
                onClick={onAddSection}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold text-white
                    bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600
                    shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30
                    transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0"
            >
                <IconPlus />
                Add Section
            </button>

            {/* ── Actions ── */}
            <PanelSection>
                <SectionLabel icon={IconSave}>Actions</SectionLabel>
                <div className="space-y-1.5">
                    <ActionButton
                        onClick={onSave}
                        disabled={isSaving}
                        icon={<IconSave />}
                        label={isSaving ? 'Saving...' : 'Save Template'}
                        variant="blue"
                    />

                    {templateId && (
                        <ActionButton
                            onClick={onUpdate}
                            disabled={isSaving}
                            icon={<IconUpload />}
                            label={isSaving ? 'Updating...' : 'Update Template'}
                            variant="amber"
                        />
                    )}

                    <ActionButton
                        onClick={() => onLoad(null)}
                        icon={<IconDownload />}
                        label="Load Template"
                        variant="violet"
                    />

                    <ActionButton
                        onClick={onCopyJSON}
                        icon={<IconCopy />}
                        label="Copy JSON"
                        variant="slate"
                    />
                </div>
            </PanelSection>

            {/* ── Selection Count ── */}
            {selectedCount > 0 && (
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white">
                        <IconCheck />
                    </div>
                    <span className="text-[13px] font-bold">{selectedCount} selected</span>
                </div>
            )}
        </div>
    );
};

/* ─── Action Button ─── */

const variantStyles = {
    blue: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 hover:shadow-blue-500/30',
    amber: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 hover:shadow-amber-500/30',
    violet: 'bg-violet-500 hover:bg-violet-600 shadow-violet-500/20 hover:shadow-violet-500/30',
    slate: 'bg-slate-500 hover:bg-slate-600 shadow-slate-500/20 hover:shadow-slate-500/30',
};

const ActionButton = ({ onClick, disabled, icon, label, variant = 'blue' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[12px] font-semibold text-white
            shadow-md transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
            hover:-translate-y-[0.5px] active:translate-y-0
            ${variantStyles[variant]}
        `}
    >
        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-white/20 flex-shrink-0">
            {icon}
        </span>
        {label}
    </button>
);

/* ─── Toggle Switch ─── */

const ToggleSwitch = ({ checked, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`
            relative w-9 h-5 rounded-full border-none cursor-pointer transition-colors duration-200 p-0 flex-shrink-0
            ${checked ? 'bg-blue-500' : 'bg-gray-300'}
        `}
    >
        <span
            className="absolute top-[2px] w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm"
            style={{ left: checked ? '18px' : '2px' }}
        />
    </button>
);

export default Toolbar;
