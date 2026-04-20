import  { useState, useRef, useEffect } from 'react';
import { FloatingInput, FloatingSelect, FloatingTextarea } from '@src/components/common/FloatingInput.tsx';

const fontFamilyOptions = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New',
    'Verdana', 'Trebuchet MS', 'Garamond', 'Palatino', 'Calibri', 'Cambria'
];

const fontWeightOptions = [
    { value: '300', label: 'Light (300)' },
    { value: 'normal', label: 'Normal (400)' },
    { value: '500', label: 'Medium (500)' },
    { value: '600', label: 'Semi-Bold (600)' },
    { value: 'bold', label: 'Bold (700)' },
    { value: '800', label: 'Extra Bold (800)' },
];

/* ─── Icons ─── */

const IconClose = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6 18" /><path d="M6 6l12 12" />
    </svg>
);

const IconTrash = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IconPalette = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" /><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" /><circle cx="6.5" cy="12" r="0.5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </svg>
);

const IconChevron = ({ open }) => (
    <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const IconType = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
    </svg>
);

const IconLayout = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
    </svg>
);

const IconAlignLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
    </svg>
);

const IconAlignCenter = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" />
    </svg>
);

const IconAlignRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" />
    </svg>
);

const IconAlignJustify = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="21" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" />
    </svg>
);

const IconDivider = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="7" y2="6" /><line x1="17" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="7" y2="18" /><line x1="17" y1="18" x2="21" y2="18" />
    </svg>
);

const IconSpacing = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <line x1="9" y1="4" x2="9" y2="20" strokeDasharray="2 2" />
        <line x1="15" y1="4" x2="15" y2="20" strokeDasharray="2 2" />
        <line x1="4" y1="9" x2="20" y2="9" strokeDasharray="2 2" />
        <line x1="4" y1="15" x2="20" y2="15" strokeDasharray="2 2" />
    </svg>
);

const alignIcons = {
    left: IconAlignLeft,
    center: IconAlignCenter,
    right: IconAlignRight,
    justify: IconAlignJustify,
};

/* ─── Drawer Global Styles ─── */

const DRAWER_STYLES = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0.5; }
        to   { transform: translateX(0);    opacity: 1; }
    }
    .drawer-scrollbar::-webkit-scrollbar { width: 4px; }
    .drawer-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .drawer-scrollbar::-webkit-scrollbar-thumb { background: var(--rc-border); border-radius: 10px; }
    .drawer-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--rc-text-muted); }

    .dr-accordion {
        border: 1px solid var(--rc-border);
        border-radius: 10px;
        overflow: hidden;
    }
    .dr-accordion-btn {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        text-align: left;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        border: none;
        cursor: pointer;
        transition: background 0.15s;
        background: var(--rc-bg-alt);
        color: var(--rc-text-sub);
    }
    .dr-accordion-btn:hover {
        background: color-mix(in srgb, var(--rc-accent) 6%, var(--rc-bg-alt));
    }
    .dr-accordion-content {
        background: var(--rc-card);
    }
    .dr-label {
        color: var(--rc-text-muted);
    }
    .dr-text {
        color: var(--rc-text);
    }
    .dr-text-sub {
        color: var(--rc-text-sub);
    }
    .dr-val-badge {
        background: var(--rc-bg-alt);
        border: 1px solid var(--rc-border);
        color: var(--rc-text);
    }
    .dr-range {
        background: var(--rc-border) !important;
    }
    .dr-range::-webkit-slider-thumb {
        background: var(--rc-accent) !important;
        box-shadow: 0 1px 4px color-mix(in srgb, var(--rc-accent) 40%, transparent) !important;
    }
    .dr-range::-moz-range-thumb {
        background: var(--rc-accent) !important;
    }
    .dr-toggle-active {
        background: color-mix(in srgb, var(--rc-accent) 10%, transparent) !important;
        border-color: color-mix(in srgb, var(--rc-accent) 38%, transparent) !important;
        color: var(--rc-accent) !important;
    }
    .dr-toggle-inactive {
        background: var(--rc-bg-alt) !important;
        border-color: var(--rc-border) !important;
        color: var(--rc-text-sub) !important;
    }
    .dr-toggle-inactive:hover {
        border-color: color-mix(in srgb, var(--rc-accent) 35%, var(--rc-border)) !important;
        color: var(--rc-text) !important;
    }
    .dr-align-active {
        background: color-mix(in srgb, var(--rc-accent) 10%, transparent) !important;
        border-color: color-mix(in srgb, var(--rc-accent) 38%, transparent) !important;
        color: var(--rc-accent) !important;
    }
    .dr-align-inactive {
        background: var(--rc-bg-alt) !important;
        border-color: var(--rc-border) !important;
        color: var(--rc-text-muted) !important;
    }
    .dr-align-inactive:hover {
        background: var(--rc-card) !important;
        color: var(--rc-text-sub) !important;
    }
    .dr-switch-on  { background-color: var(--rc-accent) !important; }
    .dr-switch-off { background-color: color-mix(in srgb, var(--rc-border) 80%, transparent) !important; }
    .dr-close-btn {
        color: var(--rc-text-muted);
        transition: all 0.15s;
        border-radius: 8px;
    }
    .dr-close-btn:hover {
        color: var(--rc-text);
        background: var(--rc-bg-alt);
    }
    .dr-done-btn {
        color: var(--rc-text-sub);
        background: var(--rc-bg-alt);
        border: 1px solid var(--rc-border);
        transition: all 0.15s;
    }
    .dr-done-btn:hover {
        background: var(--rc-card);
        border-color: color-mix(in srgb, var(--rc-border) 80%, var(--rc-text-muted));
    }
    .dr-header-info {
        background: color-mix(in srgb, var(--rc-accent) 7%, var(--rc-bg-alt));
        border: 1px solid color-mix(in srgb, var(--rc-accent) 22%, transparent);
        color: var(--rc-accent);
    }
    .dr-hex-label {
        font-family: ui-monospace, 'Cascadia Code', monospace;
        color: var(--rc-text-muted);
    }
`;

/* ─── Accordion Section ─── */

const AccordionSection = ({ icon: Icon, title, defaultOpen = true, children }) => {
    const [open, setOpen] = useState(defaultOpen);
    const contentRef = useRef(null);
    const [height, setHeight] = useState(defaultOpen ? 'auto' : '0px');

    useEffect(() => {
        if (open) {
            const h = contentRef.current?.scrollHeight;
            setHeight(`${h}px`);
            const timer = setTimeout(() => setHeight('auto'), 200);
            return () => clearTimeout(timer);
        } else {
            const h = contentRef.current?.scrollHeight;
            setHeight(`${h}px`);
            requestAnimationFrame(() => setHeight('0px'));
        }
    }, [open]);

    return (
        <div className="dr-accordion">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="dr-accordion-btn"
            >
                {Icon && <Icon />}
                <span className="flex-1">{title}</span>
                <IconChevron open={open} />
            </button>
            <div
                ref={contentRef}
                className="dr-accordion-content"
                style={{ height, overflow: 'hidden', transition: 'height 0.2s ease' }}
            >
                <div className="px-4 pb-4 pt-3 space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

/* ─── Main Drawer ─── */

const EditDrawer = ({
    isOpen,
    editingElement,
    selectedHeaderSectionId,
    sections,
    onClose,
    onUpdateElement,
    onUpdateSection,
    onDelete
}) => {
    const selectedHeaderSection = selectedHeaderSectionId ? sections?.find(s => s.id === selectedHeaderSectionId) : null;

    if (!isOpen || (!editingElement && !selectedHeaderSection)) return null;

    const handleChange = (field, value) => {
        if (editingElement.isSection) {
            onUpdateSection(editingElement.id, { [field]: value });
        } else {
            onUpdateElement(editingElement.id, { [field]: value });
        }
    };

    const getTitle = () => {
        if (selectedHeaderSection) return 'Section Header';
        if (editingElement?.isSection) return editingElement.type === 'subsection' ? 'Subsection' : 'Section';
        return 'Element';
    };

    const getBadge = () => {
        if (selectedHeaderSection) return { text: 'STYLE', color: 'bg-violet-100 text-violet-700' };
        if (editingElement?.isSection) return { text: editingElement.type === 'subsection' ? 'SUB' : 'SEC', color: 'bg-emerald-100 text-emerald-700' };
        if (editingElement?.type === 'line-break') return { text: 'LINE', color: 'bg-amber-100 text-amber-700' };
        if (editingElement?.type === 'bullets') return { text: 'BULLETS', color: 'bg-sky-100 text-sky-700' };
        return { text: editingElement?.type?.toUpperCase() || 'EL', color: 'bg-blue-100 text-blue-700' };
    };

    const badge = getBadge();

    return (
        <>
            <style>{DRAWER_STYLES}</style>

            {/* Drawer Panel */}
            <div
                className="fixed bottom-0 right-0 w-[420px] h-[93%] z-[1000] flex flex-col animate-[slideIn_0.28s_cubic-bezier(0.16,1,0.3,1)]"
                style={{
                    background: 'var(--rc-card)',
                    color: 'var(--rc-text)',
                    boxShadow: '-8px 0 32px rgba(0,0,0,0.12), -1px 0 0 var(--rc-border)',
                }}
            >
                {/* ── Header ── */}
                <div
                    className="flex items-center gap-3 px-5 py-4"
                    style={{ borderBottom: '1px solid var(--rc-border)' }}
                >
                    <div
                        className="flex items-center justify-center w-9 h-9 rounded-lg text-white flex-shrink-0"
                        style={{
                            background: `linear-gradient(135deg, var(--rc-accent), var(--rc-accent-dark))`,
                            boxShadow: `0 2px 8px color-mix(in srgb, var(--rc-accent) 38%, transparent)`,
                        }}
                    >
                        {selectedHeaderSection ? <IconPalette /> : <IconEdit />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="dr-text text-[15px] font-bold truncate">
                                Edit {getTitle()}
                            </h3>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${badge.color}`}>
                                {badge.text}
                            </span>
                        </div>
                        <p className="dr-label text-[11px] mt-0.5 truncate">
                            {editingElement?.name || selectedHeaderSection?.title || 'Customize properties'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="dr-close-btn flex items-center justify-center w-8 h-8"
                    >
                        <IconClose />
                    </button>
                </div>

                {/* ── Scrollable Content ── */}
                <div className="flex-1 overflow-y-auto drawer-scrollbar px-4 py-4 space-y-2.5">
                    {selectedHeaderSection ? (
                        <HeaderFields section={selectedHeaderSection} onChange={(field, value) => onUpdateSection(selectedHeaderSection.id, { [field]: value })} />
                    ) : !editingElement.isSection ? (
                        editingElement.type === 'line-break'
                            ? <LineBreakFields element={editingElement} onChange={handleChange} />
                            : editingElement.type === 'bullets'
                                ? <BulletsFields element={editingElement} onChange={handleChange} />
                                : <ElementFields element={editingElement} onChange={handleChange} />
                    ) : (
                        <SectionFields section={editingElement} onChange={handleChange} />
                    )}
                </div>

                {/* ── Footer ── */}
                <div
                    className="flex items-center gap-2.5 px-5 py-3.5"
                    style={{ borderTop: '1px solid var(--rc-border)' }}
                >
                    <button
                        onClick={onClose}
                        className="dr-done-btn flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold"
                    >
                        Done
                    </button>
                    <button
                        onClick={() => { onDelete(); onClose(); }}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all duration-150"
                    >
                        <IconTrash />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </>
    );
};

/* ─── Element Fields ─── */

const ElementFields = ({ element, onChange }) => (
    <>
        <AccordionSection icon={IconEdit} title="Content" defaultOpen>
            <FloatingInput
                label="Element Name"
                value={element.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
            />
            <FloatingTextarea
                label="AI Description"
                value={element.ai_description || ''}
                onChange={(e) => onChange('ai_description', e.target.value)}
                rows={2}
            />
            <FloatingTextarea
                label="Content"
                value={element.content || ''}
                onChange={(e) => onChange('content', e.target.value)}
                rows={3}
            />
            {/*{element.type === 'list-item' && (*/}
            {/*    <FloatingSelect*/}
            {/*        label="Bullet Type"*/}
            {/*        value={element.bulletType || 'disc'}*/}
            {/*        onChange={(e) => onChange('bulletType', e.target.value)}*/}
            {/*        options={[*/}
            {/*            { value: 'disc', label: 'Disc' },*/}
            {/*            { value: 'circle', label: 'Circle' },*/}
            {/*            { value: 'square', label: 'Square' },*/}
            {/*            { value: 'numbered', label: 'Numbered' },*/}
            {/*            { value: 'roman', label: 'Roman' },*/}
            {/*        ]}*/}
            {/*    />*/}
            {/*)}*/}
            {/*<FloatingTextarea*/}
            {/*    label="Description (optional)"*/}
            {/*    value={element.description || ''}*/}
            {/*    onChange={(e) => onChange('description', e.target.value)}*/}
            {/*    rows={2}*/}
            {/*/>*/}
        </AccordionSection>

        <AccordionSection icon={IconType} title="Typography" defaultOpen={false}>
            <AlignmentButtons
                value={element.textAlign || 'left'}
                onChange={(val) => onChange('textAlign', val)}
                options={[
                    { value: 'left', title: 'Left' },
                    { value: 'center', title: 'Center' },
                    { value: 'right', title: 'Right' },
                    { value: 'justify', title: 'Justify' }
                ]}
            />
            <FloatingSelect
                label="Font Family"
                value={element.fontFamily || 'Arial'}
                onChange={(e) => onChange('fontFamily', e.target.value)}
                options={fontFamilyOptions}
            />
            <div className="grid grid-cols-2 gap-3">
                <SliderField
                    label="Font Size"
                    value={element.fontSize || 16}
                    min={8} max={72} unit="px"
                    onChange={(v) => onChange('fontSize', parseInt(v))}
                />
                <FloatingSelect
                    label="Font Weight"
                    value={element.fontWeight || 'normal'}
                    onChange={(e) => onChange('fontWeight', e.target.value)}
                    options={fontWeightOptions}
                />
            </div>
            <ToggleButton
                active={element.underline}
                onClick={() => onChange('underline', !element.underline)}
                label="U"
                underline
                description="Underline"
            />
            <div className="grid grid-cols-2 gap-3">
                <SliderField
                    label="Line Height"
                    value={element.lineHeight || 1.5}
                    min={0.8} max={3} step={0.1}
                    onChange={(v) => onChange('lineHeight', parseFloat(v))}
                />
                <SliderField
                    label="Letter Spacing"
                    value={element.letterSpacing || 0}
                    min={-5} max={20} step={0.5} unit="px"
                    onChange={(v) => onChange('letterSpacing', parseFloat(v))}
                />
            </div>
        </AccordionSection>

        <AccordionSection icon={IconPalette} title="Color" defaultOpen={false}>
            <ColorSwatches
                value={element.color || '#000000'}
                onChange={(val) => onChange('color', val)}
            />
        </AccordionSection>
    </>
);

/* ─── Bullets Fields ─── */

const IconBulletsDrawer = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/>
        <line x1="8" y1="6" x2="21" y2="6" />
        <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/>
        <line x1="8" y1="12" x2="21" y2="12" />
        <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/>
        <line x1="8" y1="18" x2="15" y2="18" />
    </svg>
);

const IconGridCols = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
        <line x1="15" y1="3" x2="15" y2="21"/>
    </svg>
);

const BulletsFields = ({ element, onChange }) => {
    const items = element.bulletItems || [];

    const updateItem = (index, value) => {
        const updated = [...items];
        updated[index] = value;
        onChange('bulletItems', updated);
    };

    const addItem = () => {
        onChange('bulletItems', [...items, `Item ${items.length + 1}`]);
    };

    const removeItem = (index) => {
        const updated = items.filter((_, i) => i !== index);
        onChange('bulletItems', updated);
    };

    return (
        <>
            <AccordionSection icon={IconBulletsDrawer} title="Bullets" defaultOpen>
                <FloatingInput
                    label="Element Name"
                    value={element.name || ''}
                    onChange={(e) => onChange('name', e.target.value)}
                />
                <FloatingTextarea
                    label="AI Description"
                    value={element.ai_description || ''}
                    onChange={(e) => onChange('ai_description', e.target.value)}
                    rows={2}
                />

                <FloatingSelect
                    label="Bullet Style"
                    value={element.bulletStyle || 'disc'}
                    onChange={(e) => onChange('bulletStyle', e.target.value)}
                    options={[
                        { value: 'disc', label: '• Disc' },
                        { value: 'circle', label: '○ Circle' },
                        { value: 'square', label: '■ Square' },
                        { value: 'dash', label: '– Dash' },
                        { value: 'numbered', label: '1. Numbered' },
                        { value: 'roman', label: 'i. Roman' },
                        { value: 'none', label: 'None' },
                    ]}
                />

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="dr-label text-[11px] font-semibold uppercase tracking-wide">Columns</label>
                        <span className="dr-val-badge text-[12px] font-bold tabular-nums px-1.5 py-0.5 rounded-md">
                            {element.columns || 1}
                        </span>
                    </div>
                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map(col => (
                            <button
                                key={col}
                                type="button"
                                onClick={() => onChange('columns', col)}
                                className={`flex-1 flex items-center justify-center py-2 rounded-lg border text-[13px] font-semibold transition-all duration-150 ${(element.columns || 1) === col ? 'dr-align-active' : 'dr-align-inactive'}`}
                            >
                                {col}
                            </button>
                        ))}
                    </div>
                </div>
            </AccordionSection>

            <AccordionSection icon={IconGridCols} title="Items" defaultOpen>
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="dr-label text-[11px] font-bold tabular-nums w-5 text-center flex-shrink-0">{index + 1}</span>
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => updateItem(index, e.target.value)}
                                className="flex-1 px-2.5 py-1.5 text-[12px] rounded-lg border outline-none transition-all"
                                style={{
                                    background: 'var(--rc-bg-alt)',
                                    border: '1px solid var(--rc-border)',
                                    color: 'var(--rc-text)',
                                }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--rc-accent)'; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--rc-border)'; }}
                            />
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="flex items-center justify-center w-6 h-6 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0"
                                title="Remove item"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addItem}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[12px] font-semibold transition-all duration-150"
                        style={{
                            background: 'var(--rc-bg-alt)',
                            border: '1px dashed var(--rc-border)',
                            color: 'var(--rc-text-sub)',
                        }}
                        onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--rc-accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--rc-accent)'; }}
                        onMouseOut={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--rc-border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--rc-text-sub)'; }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Item
                    </button>
                </div>
            </AccordionSection>

            <AccordionSection icon={IconType} title="Typography" defaultOpen={false}>
                <FloatingSelect
                    label="Font Family"
                    value={element.fontFamily || 'Times New Roman'}
                    onChange={(e) => onChange('fontFamily', e.target.value)}
                    options={fontFamilyOptions}
                />
                <div className="grid grid-cols-2 gap-3">
                    <SliderField
                        label="Font Size"
                        value={element.fontSize || 12}
                        min={8} max={48} unit="px"
                        onChange={(v) => onChange('fontSize', parseInt(v))}
                    />
                    <FloatingSelect
                        label="Font Weight"
                        value={element.fontWeight || 'normal'}
                        onChange={(e) => onChange('fontWeight', e.target.value)}
                        options={fontWeightOptions}
                    />
                </div>
                <SliderField
                    label="Line Height"
                    value={element.lineHeight || 1.5}
                    min={0.8} max={3} step={0.1}
                    onChange={(v) => onChange('lineHeight', parseFloat(v))}
                />
            </AccordionSection>

            <AccordionSection icon={IconPalette} title="Color" defaultOpen={false}>
                <ColorSwatches
                    value={element.color || '#000000'}
                    onChange={(val) => onChange('color', val)}
                />
            </AccordionSection>
        </>
    );
};

/* ─── Line Break Fields ─── */

const LineBreakFields = ({ element, onChange }) => (
    <>
        <AccordionSection icon={IconDivider} title="Line Break" defaultOpen>
            {/*<FloatingInput*/}
            {/*    label="Element Name"*/}
            {/*    value={element.name || ''}*/}
            {/*    onChange={(e) => onChange('name', e.target.value)}*/}
            {/*/>*/}
            <FloatingTextarea
                label="AI Description"
                value={element.ai_description || ''}
                onChange={(e) => onChange('ai_description', e.target.value)}
                rows={2}
            />
            <SliderField
                label="Thickness"
                value={element.lineBreakThickness || 1}
                min={1} max={10} unit="px"
                onChange={(v) => onChange('lineBreakThickness', parseInt(v))}
            />
            <SliderField
                label="Width"
                value={element.lineBreakWidthPercent || 100}
                min={10} max={100} unit="%"
                onChange={(v) => onChange('lineBreakWidthPercent', parseInt(v))}
            />
            <FloatingSelect
                label="Line Style"
                value={element.lineBreakStyle || 'solid'}
                onChange={(e) => onChange('lineBreakStyle', e.target.value)}
                options={[
                    { value: 'solid', label: 'Solid' },
                    { value: 'dashed', label: 'Dashed' },
                    { value: 'dotted', label: 'Dotted' },
                    { value: 'double', label: 'Double' },
                ]}
            />
        </AccordionSection>

        <AccordionSection icon={IconPalette} title="Color" defaultOpen>
            <ColorSwatches
                value={element.lineBreakColor || '#d1d5db'}
                onChange={(val) => onChange('lineBreakColor', val)}
            />
        </AccordionSection>
    </>
);

/* ─── Header Fields ─── */

const HeaderFields = ({ section, onChange }) => (
    <>
        <div className="dr-header-info flex items-center gap-2.5 px-3.5 py-3 rounded-lg">
            <IconPalette />
            <p className="m-0 text-[12px] font-medium">
                Styling header for <span className="font-bold">"{section.title || 'Section'}"</span>
            </p>
        </div>

        <AccordionSection icon={IconType} title="Typography" defaultOpen>
            <FloatingSelect
                label="Font Family"
                value={section.headerFontFamily || 'Arial'}
                onChange={(e) => onChange('headerFontFamily', e.target.value)}
                options={fontFamilyOptions}
            />
            <div className="grid grid-cols-2 gap-3">
                <SliderField
                    label="Font Size"
                    value={section.headerFontSize || 18}
                    min={12} max={48} unit="px"
                    onChange={(v) => onChange('headerFontSize', parseInt(v))}
                />
                <FloatingSelect
                    label="Font Weight"
                    value={section.headerFontWeight || '700'}
                    onChange={(e) => onChange('headerFontWeight', e.target.value)}
                    options={fontWeightOptions}
                />
            </div>
            <ToggleButton
                active={section.headerUnderline}
                onClick={() => onChange('headerUnderline', !section.headerUnderline)}
                label="U" underline description="Underline"
            />
            <AlignmentButtons
                value={section.headerTextAlign || 'left'}
                onChange={(val) => onChange('headerTextAlign', val)}
                options={[
                    { value: 'left', title: 'Left' },
                    { value: 'center', title: 'Center' },
                    { value: 'right', title: 'Right' }
                ]}
            />
            <div className="grid grid-cols-2 gap-3">
                <SliderField
                    label="Line Height"
                    value={section.headerLineHeight || 1.2}
                    min={0.8} max={2.5} step={0.1}
                    onChange={(v) => onChange('headerLineHeight', parseFloat(v))}
                />
                <SliderField
                    label="Letter Spacing"
                    value={section.headerLetterSpacing || 0}
                    min={-5} max={20} step={0.5} unit="px"
                    onChange={(v) => onChange('headerLetterSpacing', parseFloat(v))}
                />
            </div>
        </AccordionSection>

        <AccordionSection icon={IconPalette} title="Color" defaultOpen>
            <ColorSwatches
                value={section.headerColor || '#000000'}
                onChange={(val) => onChange('headerColor', val)}
            />
        </AccordionSection>
    </>
);

/* ─── Section Fields ─── */

const SectionFields = ({ section, onChange }) => {
    const isSubsection = section.type === 'subsection';

    return (
        <>
            <AccordionSection icon={IconLayout} title="General" defaultOpen>
                {!isSubsection && (
                    <FloatingInput
                        label="Section Title"
                        value={section.title || ''}
                        onChange={(e) => onChange('title', e.target.value)}
                    />
                )}
                <FloatingTextarea
                    label="AI Description"
                    value={section.ai_description || ''}
                    onChange={(e) => onChange('ai_description', e.target.value)}
                    rows={2}
                />
                {!isSubsection && (
                    <SwitchField
                        label="Show Header"
                        checked={section.headerVisible !== false}
                        onChange={(val) => onChange('headerVisible', val)}
                    />
                )}
            </AccordionSection>

            <AccordionSection icon={IconSpacing} title="Spacing" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-3">
                    <SliderField
                        label="Padding X"
                        value={section.px ?? 0}
                        min={0} max={60} unit="px"
                        onChange={(v) => onChange('px', parseInt(v))}
                    />
                    <SliderField
                        label="Padding Y"
                        value={section.py ?? 0}
                        min={0} max={60} unit="px"
                        onChange={(v) => onChange('py', parseInt(v))}
                    />
                    <SliderField
                        label="Margin X"
                        value={section.mx ?? 0}
                        min={0} max={60} unit="px"
                        onChange={(v) => onChange('mx', parseInt(v))}
                    />
                    <SliderField
                        label="Margin Y"
                        value={section.my ?? 0}
                        min={0} max={60} unit="px"
                        onChange={(v) => onChange('my', parseInt(v))}
                    />
                </div>
            </AccordionSection>

            {!isSubsection && section.headerVisible !== false && (
                <>
                    <AccordionSection icon={IconType} title="Header Typography" defaultOpen={false}>
                        <FloatingSelect
                            label="Font Family"
                            value={section.headerFontFamily || 'Arial'}
                            onChange={(e) => onChange('headerFontFamily', e.target.value)}
                            options={fontFamilyOptions}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <SliderField
                                label="Font Size"
                                value={section.headerFontSize || 18}
                                min={12} max={48} unit="px"
                                onChange={(v) => onChange('headerFontSize', parseInt(v))}
                            />
                            <FloatingSelect
                                label="Font Weight"
                                value={section.headerFontWeight || '700'}
                                onChange={(e) => onChange('headerFontWeight', e.target.value)}
                                options={fontWeightOptions}
                            />
                        </div>
                        <ToggleButton
                            active={section.headerUnderline}
                            onClick={() => onChange('headerUnderline', !section.headerUnderline)}
                            label="U" underline description="Underline"
                        />
                        <AlignmentButtons
                            value={section.headerTextAlign || 'left'}
                            onChange={(val) => onChange('headerTextAlign', val)}
                            options={[
                                { value: 'left', title: 'Left' },
                                { value: 'center', title: 'Center' },
                                { value: 'right', title: 'Right' }
                            ]}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <SliderField
                                label="Line Height"
                                value={section.headerLineHeight || 1.2}
                                min={0.8} max={2.5} step={0.1}
                                onChange={(v) => onChange('headerLineHeight', parseFloat(v))}
                            />
                            <SliderField
                                label="Letter Spacing"
                                value={section.headerLetterSpacing || 0}
                                min={-5} max={20} step={0.5} unit="px"
                                onChange={(v) => onChange('headerLetterSpacing', parseFloat(v))}
                            />
                        </div>
                    </AccordionSection>

                    <AccordionSection icon={IconPalette} title="Header Color" defaultOpen={false}>
                        <ColorSwatches
                            value={section.headerColor || '#000000'}
                            onChange={(val) => onChange('headerColor', val)}
                        />
                    </AccordionSection>
                </>
            )}
        </>
    );
};

/* ─── Shared Small Components ─── */

const SliderField = ({ label, value, min, max, step = 1, unit = '', onChange }) => (
    <div>
        <div className="flex items-center justify-between mb-1.5">
            <label className="dr-label text-[11px] font-semibold uppercase tracking-wide">{label}</label>
            <span className="dr-val-badge text-[12px] font-bold tabular-nums px-1.5 py-0.5 rounded-md">
                {value}{unit}
            </span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="dr-range w-full h-1.5 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
                [&::-webkit-slider-thumb]:hover:scale-110
                [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
        />
    </div>
);

const ToggleButton = ({ active, onClick, label, underline, description }) => (
    <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold border transition-all duration-150 ${active ? 'dr-toggle-active' : 'dr-toggle-inactive'}`}
    >
        <span className={underline ? 'underline' : ''}>{label}</span>
        {description && <span className="text-[11px] font-medium opacity-60">{description}</span>}
    </button>
);

const AlignmentButtons = ({ value, onChange, options }) => (
    <div className="flex gap-1.5">
        {options.map((opt) => {
            const Icon = alignIcons[opt.value];
            const isActive = value === opt.value;
            return (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    title={opt.title}
                    className={`flex-1 flex items-center justify-center py-2.5 rounded-lg border transition-all duration-150 ${isActive ? 'dr-align-active' : 'dr-align-inactive'}`}
                >
                    {Icon ? <Icon /> : opt.title}
                </button>
            );
        })}
    </div>
);

const SwitchField = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-1">
        <span className="dr-text text-[13px] font-medium">{label}</span>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative w-10 h-[22px] rounded-full border-none cursor-pointer transition-colors duration-200 p-0 flex-shrink-0 ${checked ? 'dr-switch-on' : 'dr-switch-off'}`}
        >
            <span
                className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-200 shadow-sm"
                style={{ left: checked ? '20px' : '2px' }}
            />
        </button>
    </div>
);

const presetColors = [
    '#000000', '#1e293b', '#475569', '#94a3b8',
    '#1e40af', '#2563eb', '#3b82f6', '#60a5fa',
    '#065f46', '#059669', '#10b981', '#34d399',
    '#92400e', '#d97706', '#f59e0b', '#fbbf24',
    '#991b1b', '#dc2626', '#ef4444', '#f87171',
    '#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa',
];

const ColorSwatches = ({ value, onChange }) => (
    <div>
        <div className="flex items-center gap-3 mb-3">
            <div
                className="w-8 h-8 rounded-lg border-2 border-white shadow-md ring-1"
                style={{ backgroundColor: value, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', outline: '1px solid var(--rc-border)' }}
            />
            <span className="dr-hex-label text-[12px] font-semibold uppercase">{value}</span>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
            {presetColors.map((color) => {
                const isActive = value === color;
                return (
                    <button
                        key={color}
                        type="button"
                        onClick={() => onChange(color)}
                        title={color}
                        className={`
                            w-full aspect-square rounded-lg border-2 cursor-pointer transition-all duration-150 p-0
                            hover:scale-110 hover:z-10
                            ${isActive
                                ? 'scale-110 z-10'
                                : 'border-transparent hover:border-white/40'
                            }
                        `}
                        style={{
                            backgroundColor: color,
                            borderColor: isActive ? 'var(--rc-accent)' : undefined,
                            boxShadow: isActive ? `0 0 0 2px color-mix(in srgb, var(--rc-accent) 30%, transparent)` : undefined,
                        }}
                    >
                        {isActive && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isLightColor(color) ? '#000' : '#fff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                    </button>
                );
            })}
        </div>
    </div>
);

function isLightColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

export default EditDrawer;
