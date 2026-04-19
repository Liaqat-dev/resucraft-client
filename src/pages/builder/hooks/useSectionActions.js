export function useSectionActions({
    sections, elements, margins, customWidth,
    setSections, setElements, setSelectedIds, updateSection
}) {
    const addSection = () => {
        // Compute x and width so the section touches left/right margins from inside
        const canvasWidthPx = parseFloat(customWidth) * (96 / 25.4);
        const marginLeftPx = margins.left * 96;
        const marginRightPx = margins.right * 96;
        const marginTopPx = margins.top * 96;

        // Place new section below all existing top-level sections
        const GAP = 8;
        const topLevelSections = sections
            .filter(s => !s.parentSection && s.type !== 'subsection')
            .sort((a, b) => (a.y + a.height) - (b.y + b.height));
        const newY = topLevelSections.length > 0
            ? topLevelSections[topLevelSections.length - 1].y +
              topLevelSections[topLevelSections.length - 1].height + GAP
            : marginTopPx;

        const newSection = {
            id: 'section-' + Date.now(),
            type: 'section',
            title: 'New Section',
            ai_description: 'Section for organizing related content',
            x: marginLeftPx,
            y: newY,
            width: canvasWidthPx - marginLeftPx - marginRightPx,
            height: 200,
            contentType: 'text',
            autoResize: true,
            headerVisible: true,
            subsections: [],
            // Header text styling properties
            headerFontSize: 18,
            headerFontWeight: '700',
            headerFontFamily: 'Times New Roman',
            headerColor: '#000000',
            headerTextAlign: 'left',
            headerLineHeight: 1.0
        };
        setSections(prev => [...prev, newSection]);
        setSelectedIds([newSection.id]);
    };

    const addSubsection = (parentSectionId) => {
        const parentSection = sections.find(s => s.id === parentSectionId);
        if (!parentSection) return;

        const existingSubsections = sections.filter(s => s.parentSection === parentSectionId);
        const subNumber = existingSubsections.length + 1;

        let nextY = parentSection.y + 50;
        if (existingSubsections.length > 0) {
            const lastSub = existingSubsections[existingSubsections.length - 1];
            nextY = lastSub.y + lastSub.height + 15;
        }

        const newSubsection = {
            id: 'subsection-' + Date.now(),
            type: 'subsection',
            ai_description: `Subsection ${subNumber} within ${parentSection.title}`,
            x: parentSection.x,
            y: nextY,
            width: parentSection.width,
            height: 120,
            contentType: 'text',
            autoResize: true,
            parentSection: parentSectionId
        };

        setSections(prev => [...prev, newSubsection]);
        setSelectedIds([newSubsection.id]);

        // Auto-resize parent if needed
        const newHeight = (nextY - parentSection.y) + newSubsection.height + 20;
        if (newHeight > parentSection.height) {
            updateSection(parentSectionId, { height: newHeight });
        }
    };

    const addContentToSection = (section) => {
        const children = elements.filter(el => el.parentSection === section.id);
        const childSections = sections.filter(s => s.parentSection === section.id);

        let nextX = section.x + 20;
        let nextY = section.y + (section.type === 'subsection' ? 15 : 50);

        if (childSections.length > 0) {
            const lastChild = childSections[childSections.length - 1];
            nextY = lastChild.y + lastChild.height + 10;
        } else if (children.length > 0) {
            const lastChild = children[children.length - 1];
            nextY = lastChild.y + lastChild.height + 8;
        }

        if (section.contentType === 'text') {
            const newElement = {
                id: Date.now().toString(),
                type: 'text',
                content: 'New text',
                ai_description: 'Text content',
                x: nextX,
                y: nextY,
                width: Math.min(300, section.width - 40),
                height: 40,
                fontSize: 12,
                fontWeight: 'normal',
                fontFamily: 'Times New Roman',
                color: '#000000',
                textAlign: 'left',
                lineHeight: 1.5,
                parentSection: section.id
            };
            setElements(prev => [...prev, newElement]);
            setSelectedIds([newElement.id]);

            // Auto-resize parent
            const requiredHeight = (nextY - section.y) + newElement.height + 20;
            if (requiredHeight > section.height) {
                updateSection(section.id, { height: requiredHeight });
            }

        } else if (section.contentType === 'line-break') {
            const newElement = {
                id: Date.now().toString(),
                type: 'line-break',
                content: '',
                ai_description: 'Horizontal line break / divider',
                x: nextX,
                y: nextY,
                width: Math.min(section.width - 40, 500),
                height: 10,
                lineBreakThickness: 1,
                lineBreakColor: '#d1d5db',
                lineBreakStyle: 'solid',
                lineBreakWidthPercent: 100,
                parentSection: section.id
            };
            setElements(prev => [...prev, newElement]);
            setSelectedIds([newElement.id]);

            const requiredHeight = (nextY - section.y) + newElement.height + 20;
            if (requiredHeight > section.height) {
                updateSection(section.id, { height: requiredHeight });
            }

        } else if (section.contentType === 'list-items') {
            const itemNumber = children.length + 1;
            const newElement = {
                id: Date.now().toString(),
                type: 'list-item',
                content: `• Item ${itemNumber}`,
                ai_description: `List item ${itemNumber}`,
                x: nextX,
                y: nextY,
                width: Math.min(section.width - 40, 500),
                height: 30,
                fontSize: 12,
                fontWeight: 'normal',
                fontFamily: 'Times New Roman',
                color: '#000000',
                textAlign: 'left',
                lineHeight: 0.9,
                bulletType: 'disc',
                parentSection: section.id
            };
            setElements(prev => [...prev, newElement]);
            setSelectedIds([newElement.id]);

            // Auto-resize parent
            const requiredHeight = (nextY - section.y) + newElement.height + 20;
            if (requiredHeight > section.height) {
                updateSection(section.id, { height: requiredHeight });
            }

        } else if (section.contentType === 'bullets') {
            const newElement = {
                id: Date.now().toString(),
                type: 'bullets',
                ai_description: 'Bullet list block',
                bulletItems: ['Item 1', 'Item 2', 'Item 3'],
                bulletStyle: 'disc',
                columns: 1,
                x: nextX,
                y: nextY,
                width: Math.min(section.width - 40, 500),
                height: 80,
                fontSize: 12,
                fontWeight: 'normal',
                fontFamily: 'Times New Roman',
                color: '#000000',
                lineHeight: 1.5,
                parentSection: section.id
            };
            setElements(prev => [...prev, newElement]);
            setSelectedIds([newElement.id]);

            const requiredHeight = (nextY - section.y) + newElement.height + 20;
            if (requiredHeight > section.height) {
                updateSection(section.id, { height: requiredHeight });
            }
        }
    };

    return { addSection, addSubsection, addContentToSection };
}
