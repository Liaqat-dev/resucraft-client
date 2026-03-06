import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, X, Sparkles } from 'lucide-react';
import { CompletionSection } from '@hooks/useProfileCompletion';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    percentage: number;
    sections: CompletionSection[];
    completedCount: number;
    totalCount: number;
}

function getTone(pct: number) {
    if (pct >= 100) return { color: 'text-green-600 dark:text-green-400', bar: 'bg-green-500', badge: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400', message: 'Profile complete!' };
    if (pct >= 71)  return { color: 'text-blue-600 dark:text-blue-400',  bar: 'bg-blue-500',  badge: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',   message: 'Almost there — keep going!' };
    if (pct >= 41)  return { color: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500', badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400', message: 'Good progress — keep it up!' };
    return           { color: 'text-red-600 dark:text-red-400',   bar: 'bg-red-500',   badge: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400',      message: 'Get started — complete your profile' };
}

const ProfileCompletionModal: React.FC<Props> = ({
    isOpen,
    onClose,
    percentage,
    sections,
    completedCount,
    totalCount,
}) => {
    const navigate = useNavigate();
    const tone = getTone(percentage);

    const handleGoTo = (path: string) => {
        onClose();
        navigate(path);
    };

    if (!isOpen) return null;

    const coreSections = sections.filter((s) => !s.isOptional);
    const optionalSections = sections.filter((s) => s.isOptional);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md bg-white dark:bg-dark-900 rounded-xl shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-dark-800">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                                Profile Completion
                            </h2>
                            <p className={`text-xs mt-0.5 ${tone.color}`}>{tone.message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-dark-500 dark:hover:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-500 dark:text-dark-400">
                                {completedCount} of {totalCount} sections complete
                            </span>
                            <span className={`text-sm font-bold ${tone.color}`}>{percentage}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 dark:bg-dark-800 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${tone.bar}`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Body — scrollable */}
                <div className="overflow-y-auto max-h-[60vh] px-5 py-3 space-y-1">
                    {/* Core sections */}
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-dark-500 mb-2">
                        Required
                    </p>
                    {coreSections.map((s) => (
                        <SectionRow key={s.id} section={s} onGoTo={handleGoTo} />
                    ))}

                    {/* Optional sections */}
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-dark-500 mt-4 mb-2 pt-3 border-t border-gray-100 dark:border-dark-800">
                        Optional <span className="normal-case font-normal">(bonus points)</span>
                    </p>
                    {optionalSections.map((s) => (
                        <SectionRow key={s.id} section={s} onGoTo={handleGoTo} optional />
                    ))}
                </div>

                {/* Footer */}
                {percentage === 100 && (
                    <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-800 flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Sparkles size={14} />
                        <span className="text-xs font-medium">Your profile is fully complete. Great work!</span>
                    </div>
                )}
            </div>
        </div>
    );
};

interface SectionRowProps {
    section: CompletionSection;
    onGoTo: (path: string) => void;
    optional?: boolean;
}

const SectionRow: React.FC<SectionRowProps> = ({ section, onGoTo, optional }) => (
    <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            section.isComplete
                ? 'bg-transparent'
                : optional
                ? 'border border-dashed border-gray-200 dark:border-dark-700'
                : 'border border-gray-200 dark:border-dark-700'
        }`}
    >
        <span className="shrink-0">
            {section.isComplete ? (
                <CheckCircle2 size={16} className="text-green-500" />
            ) : (
                <Circle size={16} className="text-gray-300 dark:text-dark-600" />
            )}
        </span>

        <div className="flex-1 min-w-0">
            <p
                className={`text-sm font-medium leading-tight ${
                    section.isComplete
                        ? 'text-gray-600 dark:text-dark-300 line-through decoration-gray-300 dark:decoration-dark-600'
                        : 'text-gray-700 dark:text-dark-200'
                }`}
            >
                {section.label}
            </p>
            {!section.isComplete && (
                <p className="text-xs text-gray-400 dark:text-dark-500 mt-0.5 truncate">
                    {section.hint}
                </p>
            )}
        </div>

        <span className="shrink-0 text-xs font-medium text-gray-400 dark:text-dark-500">
            +{section.weight}%
        </span>

        {!section.isComplete && (
            <button
                onClick={() => onGoTo(section.tabPath)}
                className="shrink-0 flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
                Go <ArrowRight size={11} />
            </button>
        )}
    </div>
);

export default ProfileCompletionModal;
