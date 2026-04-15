import { useState } from 'react';
import { flatToNested, nestedToFlat } from '../utils/transformUtils';
import { CANVAS_SIZES } from '../constants';
import { templateService } from '../../../services/template.service';

export function useTemplateActions({
    elements, sections, templateName, templateCategory, canvasSize, customWidth, customHeight, margins, templateId,
    setElements, setSections, setTemplateName, setTemplateCategory, setTemplateId, setCanvasSize, setCustomWidth, setCustomHeight, setMargins, setSelectedIds
}) {
    const [isSaving, setIsSaving] = useState(false);

    const exportToPDF = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/pdf/generate-pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    elements,
                    sections,
                    canvasSize: { width: customWidth, height: customHeight },
                    margins: margins,
                    fileName: templateName.replace(/\s+/g, '-').toLowerCase()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${templateName}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            alert('✅ PDF exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            alert('❌ Failed to export PDF. Make sure the backend server is running on http://localhost:5000');
        }
    };

    const saveTemplate = async () => {
        setIsSaving(true);

        // Transform to nested structure with relative positioning
        const { elements: nestedElements, sections: nestedSections } =
            flatToNested(elements, sections);

        const templateData = {
            name: templateName,
            category: templateCategory || 'Other',
            data: {
                elements: nestedElements,
                sections: nestedSections,
                canvasSettings: {
                    size: canvasSize,
                    width: customWidth,
                    height: customHeight,
                    margins: margins,
                    backgroundColor: 'white'
                }
            },
            createdAt: new Date().toISOString()
        };

        try {
            const result = await templateService.save(templateData);
            setTemplateId(result.id);
            console.log(`✅ Template saved successfully!\nID: ${result.id}`);
        } catch (error) {
            console.error('Save error:', error);
            const localTemplateId = 'template-' + Date.now();
            localStorage.setItem(localTemplateId, JSON.stringify(templateData));
            localStorage.setItem('lastTemplateId', localTemplateId);
            alert(`✅ Template saved to browser storage!\nID: ${localTemplateId}\n\n(Backend not available - using localStorage)`);
        }

        setIsSaving(false);
    };

    const updateTemplate = async () => {
        if (!templateId) return;
        setIsSaving(true);

        const { elements: nestedElements, sections: nestedSections } =
            flatToNested(elements, sections);

        const templateData = {
            name: templateName,
            category: templateCategory || 'Other',
            data: {
                elements: nestedElements,
                sections: nestedSections,
                canvasSettings: {
                    size: canvasSize,
                    width: customWidth,
                    height: customHeight,
                    margins: margins,
                    backgroundColor: 'white'
                }
            }
        };

        try {
            await templateService.update(templateId, templateData);
            console.log(`✅ Template updated successfully!`);
        } catch (error) {
            console.error('Update error:', error);
            alert('❌ Failed to update template. ' + error.message);
        }

        setIsSaving(false);
    };

    const loadTemplate = async (loadId) => {
        try {
            const templateData = await templateService.get(loadId);

            if (templateData) {

                const settings = templateData.data.canvasSettings;

                // Transform from nested to flat structure, injecting computed widths
                const { elements: flatElements, sections: flatSections } =
                    nestedToFlat(templateData.data, settings);

                setElements(flatElements);
                setSections(flatSections);
                setTemplateName(templateData.name);
                if (setTemplateCategory) setTemplateCategory(templateData.category || 'Other');
                setTemplateId(templateData.id || loadId);
                setCanvasSize(settings?.size || 'A4');
                setCustomWidth(settings?.width || CANVAS_SIZES[settings?.size || 'A4'].width);
                setCustomHeight(settings?.height || CANVAS_SIZES[settings?.size || 'A4'].height);
                if (settings?.margins) setMargins(settings.margins);
                setSelectedIds([]);
            }
        } catch (error) {
            console.error('Load error:', error);
            // Fallback to localStorage
            const localId = loadId || localStorage.getItem('lastTemplateId');
            if (localId) {
                const templateData = JSON.parse(localStorage.getItem(localId));

                const settings = templateData.data.canvasSettings;

                // Transform from nested to flat structure, injecting computed widths
                const { elements: flatElements, sections: flatSections } =
                    nestedToFlat(templateData.data, settings);

                setElements(flatElements);
                setSections(flatSections);
                setTemplateName(templateData.name);
                setCanvasSize(settings?.size || 'A4');
                setCustomWidth(settings?.width || CANVAS_SIZES[settings?.size || 'A4'].width);
                setCustomHeight(settings?.height || CANVAS_SIZES[settings?.size || 'A4'].height);
                if (settings?.margins) setMargins(settings.margins);
                setSelectedIds([]);
                alert(`✅ Template loaded from browser storage!`);
            } else {
                alert('❌ No saved template found');
            }
        }
    };

    const getTemplateJSON = () => {
        // Transform to nested structure with relative positioning
        const { elements: nestedElements, sections: nestedSections } =
            flatToNested(elements, sections);

        const templateData = {
            name: templateName,
            data: {
                elements: nestedElements,
                sections: nestedSections,
                canvasSettings: {
                    size: canvasSize,
                    width: customWidth,
                    height: customHeight,
                    margins: margins,
                    backgroundColor: 'white'
                }
            },
            createdAt: new Date().toISOString()
        };

        const jsonString = JSON.stringify(templateData, null, 2);
        console.log('Template JSON:', jsonString);

        navigator.clipboard.writeText(jsonString).then(() => {
            alert('📋 Template JSON copied to clipboard!');
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('❌ Failed to copy to clipboard');
        });
    };

    return { isSaving, exportToPDF, saveTemplate, updateTemplate, loadTemplate, getTemplateJSON };
}
