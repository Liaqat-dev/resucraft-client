import {Plus} from "lucide-react";

export const BlankCard = ({ onClick }: { onClick: () => void }) => (
    <div className="group cursor-pointer" onClick={onClick}>
        <div className="relative w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-dark-800 ring-2 ring-dashed ring-gray-200 dark:ring-dark-600 group-hover:ring-primary-400 dark:group-hover:ring-primary-500 transition-all duration-200 flex items-center justify-center"
             style={{ aspectRatio: '210 / 297' }}>
            <div className="flex flex-col items-center gap-2.5">
                <div className="size-11 rounded-full bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 flex items-center justify-center shadow-sm group-hover:bg-primary-50 group-hover:border-primary-200 transition-colors">
                    <Plus className="size-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
            </div>
        </div>
        <div className="mt-2.5 px-0.5">
            <p className="text-[13px] font-semibold text-gray-700 dark:text-dark-300 truncate">Blank resume</p>
            <p className="text-[11px] text-gray-400 dark:text-dark-500 mt-0.5">Start from scratch</p>
        </div>
    </div>
);