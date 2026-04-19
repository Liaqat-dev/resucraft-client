import { useState, useRef, useEffect } from 'react';
import ResizeHandle from './ResizeHandle';

/* ─── Icons ─── */

const IconPlus = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconText = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
    </svg>
);

const IconList = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" />
    </svg>
);

const IconLayout = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
    </svg>
);

const IconMinus = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconBullets = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/>
        <line x1="8" y1="6" x2="21" y2="6" />
        <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/>
        <line x1="8" y1="12" x2="21" y2="12" />
        <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/>
        <line x1="8" y1="18" x2="15" y2="18" />
    </svg>
);

const IconInbox = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
    </svg>
);

/* ─── Main Section Component ─── */

const CanvasSection = ({
    section,
    childCount,
    isSelected,
    isDragging,
    isBeingDragged,
    isReordering,
    isSingleSelection,
    onMouseDown,
    onTitleChange,
    onContentTypeChange,
    onAddContent,
    onAddSubsection,
    onResizeMouseDown,
    onHeaderClick
}) => {
    const isSubsection = section.type === 'subsection';
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const handleAddText = (e) => {
        e.stopPropagation();
        onContentTypeChange(section.id, 'text');
        onAddContent({ ...section, contentType: 'text' });
        setMenuOpen(false);
    };


    const handleAddLineBreak = (e) => {
        e.stopPropagation();
        onContentTypeChange(section.id, 'line-break');
        onAddContent({ ...section, contentType: 'line-break' });
        setMenuOpen(false);
    };

    const handleAddBullets = (e) => {
        e.stopPropagation();
        onContentTypeChange(section.id, 'bullets');
        onAddContent({ ...section, contentType: 'bullets' });
        setMenuOpen(false);
    };

    const handleAddSubsection = (e) => {
        e.stopPropagation();
        onAddSubsection(section.id);
        setMenuOpen(false);
    };

    return (
        <div
            onMouseDown={(e) => onMouseDown(e, section.id)}
            style={{
                position: 'absolute',
                left: section.x,
                top: section.y,
                width: section.width,
                height: section.height,
                backgroundColor: isSelected
                    ? 'color-mix(in srgb, var(--rc-accent, #3b82f6) 3%, rgba(249,250,251,0.5))'
                    : 'rgba(249, 250, 251, 0.5)',
                border: isSelected
                    ? '1.5px solid var(--rc-accent, #3b82f6)'
                    : `1px ${isSubsection ? 'dashed' : 'dotted'} rgba(209,213,219,0.8)`,
                borderRadius: isSubsection ? '4px' : '3px',
                cursor: isDragging ? 'grabbing' : 'move',
                boxSizing: 'border-box',
                paddingLeft: `${(section.px ?? 0) + (isSubsection ? 2 : 1)}px`,
                paddingRight: `${(section.px ?? 0) + (isSubsection ? 2 : 1)}px`,
                paddingTop: `${(section.py ?? 0) + 2}px`,
                paddingBottom: `${(section.py ?? 0) + (isSubsection ? 2 : 1)}px`,
                marginLeft: `${section.mx ?? 0}px`,
                marginRight: `${section.mx ?? 0}px`,
                marginTop: `${section.my ?? 0}px`,
                marginBottom: `${section.my ?? 0}px`,
                boxShadow: isBeingDragged
                    ? '0 8px 32px rgba(0,0,0,0.18)'
                    : isSelected
                        ? '0 0 0 3px color-mix(in srgb, var(--rc-accent, #3b82f6) 14%, transparent)'
                        : 'none',
                zIndex: isBeingDragged ? 100 : isSelected ? 10 : 1,
                opacity: isBeingDragged ? 0.92 : 1,
                transition: isBeingDragged
                    ? 'none'
                    : isReordering
                        ? 'top 0.12s cubic-bezier(0.4,0,0.2,1), box-shadow 0.15s'
                        : 'border 0.15s, box-shadow 0.15s, background-color 0.15s'
            }}
        >
            {/* ── Main Section Header ── */}
            {!isSubsection && section.headerVisible !== false && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '6px',
                    gap: '8px'
                }}>
                    {/* Editable Title */}
                    <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onTitleChange(section.id, e.target.innerText)}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onHeaderClick) onHeaderClick(section.id);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        style={{
                            outline: 'none',
                            cursor: 'text',
                            fontSize: `${section.headerFontSize || 16}px`,
                            fontWeight: section.headerFontWeight || 'bold',
                            fontFamily: section.headerFontFamily || 'Times New Roman',
                            color: section.headerColor || '#1f2937',
                            textAlign: section.headerTextAlign || 'left',
                            lineHeight: section.headerLineHeight || 1.2,
                            letterSpacing: section.headerLetterSpacing != null ? `${section.headerLetterSpacing}px` : undefined,
                            textDecoration: section.headerUnderline ? 'underline' : 'none',
                            minWidth: '100px',
                            flex: 1,
                            padding: '2px 4px',
                            borderRadius: '4px',
                            transition: 'background 0.15s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--rc-accent, #3b82f6) 5%, transparent)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        {section.title}
                    </div>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
                        {childCount > 0 && (
                            <span style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                color: '#6b7280',
                                padding: '2px 6px',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '4px',
                                lineHeight: '1.4'
                            }}>
                                {childCount}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ── Subsection Header ── */}
            {isSubsection && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                    paddingBottom: '4px',
                    borderBottom: '1px dashed rgba(209,213,219,0.7)',
                    gap: '6px'
                }}>
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Subsection
                    </span>
                    {childCount > 0 && (
                        <span style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#9ca3af',
                            padding: '1px 5px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '3px'
                        }}>
                            {childCount}
                        </span>
                    )}
                </div>
            )}

            {/* ── Empty State ── */}
            {childCount === 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    color: '#c4c9d2',
                    marginTop: isSubsection ? '16px' : '32px',
                    padding: isSubsection ? '12px' : '20px',
                    borderRadius: '8px',
                    border: '1.5px dashed rgba(209,213,219,0.7)',
                    backgroundColor: 'rgba(250,251,252,0.6)'
                }}>
                    <IconInbox />
                    <span style={{
                        fontSize: isSubsection ? '10px' : '11px',
                        fontWeight: 500,
                        letterSpacing: '0.3px'
                    }}>
                        Click + to add content
                    </span>
                </div>
            )}

            {/* ── Floating Add Button ── */}
            {isSelected && (
                <div
                    ref={menuRef}
                    style={{
                        position: 'absolute',
                        bottom: isSubsection ? 8 : 10,
                        right: isSubsection ? 8 : 10,
                        zIndex: 200000
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(prev => !prev);
                        }}
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: 'var(--rc-accent, #3b82f6)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 10px color-mix(in srgb, var(--rc-accent, #3b82f6) 40%, transparent)',
                            transition: 'transform 0.2s, filter 0.15s, border-radius 0.2s',
                            transform: menuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.12)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
                    >
                        <IconPlus />
                    </button>

                    {/* ── Popover Menu ── */}
                    {menuOpen && (
                        <div style={{
                            zIndex:9999999,
                            position: 'absolute',
                            bottom: 38,
                            left:0 ,
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.04)',
                            overflow: 'hidden',
                            minWidth: 170,
                            animation: 'popIn 0.15s cubic-bezier(0.16,1,0.3,1)'
                        }}>
                            <style>{`
                                @keyframes popIn {
                                    from { opacity: 0; transform: translateY(6px) scale(0.96); }
                                    to   { opacity: 1; transform: translateY(0) scale(1); }
                                }
                            `}</style>

                            <div style={{ padding: '4px' }}>
                                <MenuItem
                                    icon={<IconText />}
                                    label="Add Text"
                                    onClick={handleAddText}
                                    color="#3b82f6"
                                    bg="#eff6ff"
                                />
                                <MenuItem
                                    icon={<IconMinus />}
                                    label="Add Line Break"
                                    onClick={handleAddLineBreak}
                                    color="#f59e0b"
                                    bg="#fffbeb"
                                />
                                <MenuItem
                                    icon={<IconBullets />}
                                    label="Add Bullets"
                                    onClick={handleAddBullets}
                                    color="#0ea5e9"
                                    bg="#f0f9ff"
                                />
                                {!isSubsection && (
                                    <>
                                        <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '2px 8px' }} />
                                        <MenuItem
                                            icon={<IconLayout />}
                                            label="Add Subsection"
                                            onClick={handleAddSubsection}
                                            color="#059669"
                                            bg="#ecfdf5"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Resize Handles ── */}
            {isSelected && isSingleSelection && (
                <>
                    {['n', 's'].map(pos => (
                        <ResizeHandle
                            key={pos}
                            position={pos}
                            onMouseDown={(e) => onResizeMouseDown(e, section.id, pos, true)}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

/* ─── Menu Item ─── */

const MenuItem = ({ icon, label, onClick, color, bg }) => (
    <button
        onClick={onClick}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
            zIndex: 9999999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '6px 8px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            color: '#374151',
            textAlign: 'left',
            transition: 'background-color 0.12s'
        }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
        <span style={{
            width: 26,
            zIndex: 9999999,
            height: 26,
            borderRadius: '7px',
            backgroundColor: bg,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
        }}>
            {icon}
        </span>
        {label}
    </button>
);

export default CanvasSection;
