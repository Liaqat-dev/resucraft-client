import { useState, useEffect } from 'react';

export function useSelectionDrawer({ selectedIds, setSelectedIds, elements, sections }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingElement, setEditingElement] = useState(null);
    const [selectedHeaderSectionId, setSelectedHeaderSectionId] = useState(null);

    // Open drawer when single element is selected
    useEffect(() => {
        if (selectedIds.length === 1) {
            const selectedId = selectedIds[0];
            const element = elements.find(el => el.id === selectedId);
            const section = sections.find(sec => sec.id === selectedId);

            // Clear header selection so element drawer takes priority
            setSelectedHeaderSectionId(null);

            if (element) {
                setEditingElement({ ...element, isSection: false });
                setIsDrawerOpen(true);
            } else if (section) {
                setEditingElement({ ...section, isSection: true });
                setIsDrawerOpen(true);
            }
        } else {
            setIsDrawerOpen(false);
            setEditingElement(null);
        }
    }, [selectedIds, elements, sections]);

    const handleHeaderClick = (sectionId) => {
        setSelectedHeaderSectionId(sectionId);
        setSelectedIds([]); // Clear element selection
        setEditingElement(null); // Clear element editing
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setEditingElement(null);
        setSelectedHeaderSectionId(null);
        setSelectedIds([]);
    };

    return {
        isDrawerOpen,
        editingElement,
        selectedHeaderSectionId,
        setEditingElement,
        handleHeaderClick,
        closeDrawer
    };
}
