import React, { useRef, useEffect, useCallback } from 'react';
import ResizeHandle from './ResizeHandle.js';

function CanvasElement({ element, isSelected, onMouseDown, isDragging, onContentChange, onResizeMouseDown, isSingleSelection, onAutoResize }) {
    const contentRef = useRef(null);

    const measureAndResize = useCallback(() => {
        if (!contentRef.current || !onAutoResize) return;
        if (element.type === 'line-break') return;

        const el = contentRef.current;
        const prevHeight = el.style.height;
        el.style.height = 'auto';
        const padding = 8;
        const border = 3;
        const naturalHeight = el.scrollHeight + padding + border;
        el.style.height = prevHeight;

        if (Math.abs(naturalHeight - element.height) > 1) {
            onAutoResize(element.id, naturalHeight);
        }
    }, [element.id, element.height, element.type, onAutoResize]);

    // Sync content from props (Drawer edits) when not focused
    useEffect(() => {
        if (!contentRef.current) return;
        if (document.activeElement === contentRef.current) return;
        const displayed = contentRef.current.innerText;
        if (displayed !== element.content) {
            contentRef.current.innerText = element.content;
        }
        requestAnimationFrame(measureAndResize);
    }, [element.content, measureAndResize]);

    const getBulletSymbol = (bulletType) => {
        switch (bulletType) {
            case 'disc':     return '\u2022';
            case 'circle':   return '\u25CB';
            case 'square':   return '\u25A0';
            case 'numbered': return '1.';
            case 'roman':    return 'i.';
            default:         return '\u2022';
        }
    };

    // ── Line Break Rendering ──
    if (element.type === 'line-break') {
        const thickness      = element.lineBreakThickness || 1;
        const color          = element.lineBreakColor || '#d1d5db';
        const style          = element.lineBreakStyle || 'solid';
        const widthPercent   = element.lineBreakWidthPercent || 100;

        return (
            <div
                onMouseDown={(e) => onMouseDown(e, element.id)}
                style={{
                    position: 'absolute',
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    cursor: isDragging ? 'grabbing' : 'move',
                    padding: '0',
                    border: isSelected
                        ? '1.5px solid var(--rc-accent, #3b82f6)'
                        : '1px dashed rgba(59, 130, 246, 0.15)',
                    borderRadius: '2px',
                    boxSizing: 'border-box',
                    userSelect: 'none',
                    backgroundColor: isSelected ? 'color-mix(in srgb, var(--rc-accent, #3b82f6) 3%, transparent)' : 'transparent',
                    boxShadow: isSelected ? '0 0 0 3px color-mix(in srgb, var(--rc-accent, #3b82f6) 12%, transparent)' : 'none',
                    zIndex: isSelected ? 100 : 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: isSelected ? 'none' : 'border-color 0.15s, box-shadow 0.15s'
                }}
            >
                <div
                    style={{
                        width: `${widthPercent}%`,
                        height: 0,
                        borderTop: `${thickness}px ${style} ${color}`,
                    }}
                />
                {isSelected && isSingleSelection && (
                    <>
                        {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(pos => (
                            <ResizeHandle
                                key={pos}
                                position={pos}
                                onMouseDown={(e) => onResizeMouseDown(e, element.id, pos, false)}
                            />
                        ))}
                    </>
                )}
            </div>
        );
    }

    // ── Text / List Item Rendering ──
    return (
        <div
            onMouseDown={(e) => onMouseDown(e, element.id)}
            style={{
                position: 'absolute',
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                fontSize: element.fontSize,
                fontWeight: element.fontWeight,
                fontFamily: element.fontFamily,
                color: element.color || '#000000',
                textAlign: element.textAlign || 'left',
                lineHeight: element.lineHeight || 1.5,
                letterSpacing: element.letterSpacing != null ? `${element.letterSpacing}px` : undefined,
                textDecoration: element.underline ? 'underline' : 'none',
                cursor: isDragging ? 'grabbing' : 'move',
                padding: '4px',
                border: isSelected
                    ? '1.5px solid var(--rc-accent, #3b82f6)'
                    : '1px dashed rgba(59, 130, 246, 0.25)',
                borderRadius: '2px',
                boxSizing: 'border-box',
                userSelect: 'none',
                backgroundColor: isSelected ? 'color-mix(in srgb, var(--rc-accent, #3b82f6) 3%, transparent)' : 'transparent',
                boxShadow: isSelected ? '0 0 0 3px color-mix(in srgb, var(--rc-accent, #3b82f6) 12%, transparent)' : 'none',
                zIndex: isSelected ? 100 : 10,
                display: 'flex',
                alignItems: element.type === 'list-item' ? 'flex-start' : 'center',
                transition: isSelected ? 'none' : 'border-color 0.15s, box-shadow 0.15s'
            }}
        >
            {element.type === 'list-item' && element.bulletType && (
                <span style={{
                    marginRight: '8px',
                    flexShrink: 0,
                    marginTop: '2px',
                    opacity: 0.7
                }}>
                    {getBulletSymbol(element.bulletType)}
                </span>
            )}
            <div
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                onInput={measureAndResize}
                onBlur={(e) => {
                    const newContent = e.target.innerText;
                    onContentChange(element.id, newContent);
                    measureAndResize();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                    outline: 'none',
                    cursor: 'text',
                    width: '100%',
                    overflow: 'visible',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap'
                }}
            >
                {element.type === 'list-item' && element.bulletType
                    ? element.content.replace(/^[\u2022\u25CB\u25A0]\s*/, '').replace(/^\d+\.\s*/, '').replace(/^[ivxlcdm]+\.\s*/i, '')
                    : element.content}
            </div>
            {isSelected && isSingleSelection && (
                <>
                    {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(pos => (
                        <ResizeHandle
                            key={pos}
                            position={pos}
                            onMouseDown={(e) => onResizeMouseDown(e, element.id, pos, false)}
                        />
                    ))}
                </>
            )}
        </div>
    );
}

export default CanvasElement;
