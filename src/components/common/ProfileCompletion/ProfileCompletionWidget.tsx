import React, { useState } from 'react';
import { useProfileCompletion } from '@hooks/useProfileCompletion';
import ProfileCompletionModal from './ProfileCompletionModal';

function getTone(pct: number) {
    if (pct >= 100) return { bar: 'bg-green-500', text: 'text-green-600 dark:text-green-400', label: 'Complete!' };
    if (pct >= 71)  return { bar: 'bg-blue-500',  text: 'text-blue-600 dark:text-blue-400',   label: 'Almost there' };
    if (pct >= 41)  return { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', label: 'In progress' };
    return           { bar: 'bg-red-400',   text: 'text-red-500 dark:text-red-400',     label: 'Just started' };
}

const ProfileCompletionWidget: React.FC = () => {
    const { percentage, sections, completedCount, totalCount } = useProfileCompletion();
    const [modalOpen, setModalOpen] = useState(false);
    const tone = getTone(percentage);

    if (percentage === 100) return null;

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className="w-full text-left group focus:outline-none"
                title="View profile completion details"
            >
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-dark-400 group-hover:text-gray-700 dark:group-hover:text-dark-200 transition-colors">
                        Profile completion
                    </span>
                    <span className={`text-xs font-bold ${tone.text}`}>{percentage}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-dark-800 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${tone.bar}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="mt-1 text-[11px] text-gray-400 dark:text-dark-500 group-hover:text-gray-500 dark:group-hover:text-dark-400 transition-colors">
                    {completedCount}/{totalCount} sections · {tone.label}
                </p>
            </button>

            <ProfileCompletionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                percentage={percentage}
                sections={sections}
                completedCount={completedCount}
                totalCount={totalCount}
            />
        </>
    );
};

export default ProfileCompletionWidget;
