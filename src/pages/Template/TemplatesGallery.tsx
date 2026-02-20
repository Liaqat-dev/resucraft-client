import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from './TemplateCard.js';

const TemplatesGallery = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5000/api/templates');

            if (!response.ok) {
                throw new Error('Failed to fetch templates');
            }

            const data = await response.json();
            setTemplates(data.templates || []);
        } catch (err) {
            console.error('Error fetching templates:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadTemplate = (template) => {
        // Store template data in localStorage for the builder to load
        localStorage.setItem('templateToLoad', JSON.stringify(template));
        // Navigate to builder (home page)
        navigate('/');
    };

    const handleDeleteTemplate = async (templateId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/templates/${templateId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete template');
            }

            // Refresh templates list
            fetchTemplates();
            alert('✅ Template deleted successfully!');
        } catch (err) {
            console.error('Error deleting template:', err);
            alert('❌ Failed to delete template');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f3f4f6',
            padding: '24px'
        }}>
            {/* Header */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                marginBottom: '32px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: 0
                    }}>
                        My Templates
                    </h1>

                    <button
                        onClick={() => navigate('/builder')}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                        + New Template
                    </button>
                </div>

                <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: 0
                }}>
                    {templates.length} template{templates.length !== 1 ? 's' : ''} saved
                </p>
            </div>

            {/* Content */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {/* Loading State */}
                {loading && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px'
                    }}>
                        <div style={{
                            fontSize: '18px',
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                border: '3px solid #e5e7eb',
                                borderTop: '3px solid #3b82f6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            Loading templates...
                        </div>
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        padding: '16px',
                        color: '#991b1b',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: '0 0 12px 0', fontWeight: '600' }}>
                            ❌ Error loading templates
                        </p>
                        <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
                            {error}
                        </p>
                        <button
                            onClick={fetchTemplates}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && templates.length === 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        border: '2px dashed #d1d5db',
                        borderRadius: '12px',
                        padding: '64px 32px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '64px',
                            marginBottom: '16px'
                        }}>
                            📄
                        </div>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#111827',
                            margin: '0 0 8px 0'
                        }}>
                            No templates yet
                        </h2>
                        <p style={{
                            fontSize: '16px',
                            color: '#6b7280',
                            margin: '0 0 24px 0'
                        }}>
                            Create your first resume template to get started
                        </p>
                        <button
                            onClick={() => navigate('/builder')}
                            style={{
                                padding: '12px 32px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                        >
                            Create Template
                        </button>
                    </div>
                )}

                {/* Templates Grid */}
                {!loading && !error && templates.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '24px'
                    }}>
                        {templates.map(template => (
                            <TemplateCard
                                key={template._id}
                                template={template}
                                onLoad={handleLoadTemplate}
                                onDelete={handleDeleteTemplate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplatesGallery;
