/**
 * Convert flat structure (internal state) to nested structure (for saving).
 * Section/subsection width is intentionally excluded — it is always derived
 * from canvas settings (margin-to-margin) and must not be persisted.
 */
export function flatToNested(elements, sections) {
    // 1. Get root-level elements (no parent section)
    const rootElements = elements.filter(el => !el.parentSection);

    // 2. Build nested sections
    const nestedSections = sections
        .filter(sec => sec.type === 'section' && !sec.parentSection)
        .map(section => {
            // Find elements that belong directly to this section (not to subsections)
            const sectionElements = elements
                .filter(el => {
                    // Element belongs to this section
                    if (el.parentSection !== section.id) return false;

                    // Make sure it's not inside a subsection
                    const belongsToSubsection = sections.some(sub =>
                        sub.parentSection === section.id && el.parentSection === sub.id
                    );
                    return !belongsToSubsection;
                })
                .map(el => ({
                    ...el,
                    // Convert to relative coordinates (relative to section)
                    x: el.x - section.x,
                    y: el.y - section.y
                }));

            // Find subsections for this section
            const subsections = sections
                .filter(sub => sub.parentSection === section.id)
                .map(subsection => {
                    // Find elements for this subsection
                    const subsectionElements = elements
                        .filter(el => el.parentSection === subsection.id)
                        .map(el => ({
                            ...el,
                            // Convert to relative coordinates (relative to subsection)
                            x: el.x - subsection.x,
                            y: el.y - subsection.y
                        }));

                    const { backgroundColor, borderColor, direction, width: _w, ...subsectionRest } = subsection;
                    return {
                        ...subsectionRest,
                        type: 'sub-section', // Rename type for nested format
                        // Convert subsection position to relative (relative to section)
                        x: subsection.x - section.x,
                        y: subsection.y - section.y,
                        elements: subsectionElements
                    };
                });

            const { backgroundColor, borderColor, direction, width: _sw, ...sectionRest } = section;
            return {
                ...sectionRest,
                elements: sectionElements,  // Add section's direct elements
                'sub-sections': subsections
            };
        });

    return { elements: rootElements, sections: nestedSections };
}


/**
 * Convert nested structure (from saved template) to flat structure (for internal state).
 * canvasSettings is used to recompute section/subsection width (not stored in JSON).
 */
export function nestedToFlat(nestedData, canvasSettings) {
    const canvasWidthPx = parseFloat(canvasSettings?.width || '210mm') * (96 / 25.4);
    const margins = canvasSettings?.margins || { left: 1, right: 1 };
    const sectionWidth = canvasWidthPx - (margins.left * 96) - (margins.right * 96);

    const elements = [...(nestedData.elements || [])];
    const sections = [];

    (nestedData.sections || []).forEach(section => {
        // Add main section with absolute coordinates and computed width
        const { 'sub-sections': subsections, elements: sectionElements, backgroundColor, borderColor, direction, ...sectionData } = section;
        sections.push({ ...sectionData, width: sectionWidth });

        // Process section's direct elements
        if (sectionElements && sectionElements.length > 0) {
            sectionElements.forEach(el => {
                elements.push({
                    ...el,
                    // Convert to absolute coordinates
                    x: el.x + section.x,
                    y: el.y + section.y,
                    parentSection: section.id
                });
            });
        }

        // Process subsections
        if (subsections && subsections.length > 0) {
            subsections.forEach(subsection => {
                const { elements: subElements, backgroundColor: _bg, borderColor: _bc, direction: _dir, ...subsectionData } = subsection;

                // Convert subsection to absolute coordinates with computed width
                sections.push({
                    ...subsectionData,
                    type: 'subsection', // Rename back to internal type
                    x: subsectionData.x + section.x,
                    y: subsectionData.y + section.y,
                    width: sectionWidth,
                    parentSection: section.id
                });

                // Convert subsection elements to absolute coordinates
                if (subElements && subElements.length > 0) {
                    subElements.forEach(el => {
                        elements.push({
                            ...el,
                            x: el.x + subsectionData.x + section.x,
                            y: el.y + subsectionData.y + section.y,
                            parentSection: subsection.id
                        });
                    });
                }
            });
        }
    });

    return { elements, sections };
}
