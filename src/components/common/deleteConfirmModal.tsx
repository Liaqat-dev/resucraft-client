import React from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({
                                                 message,
                                                 onConfirm,
                                                 onCancel,
                                             }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">


                <div className="flex items-center justify-center mb-4">
                    <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
                        <AlertTriangle
                            size={28}
                            className="text-red-600 dark:text-red-400"
                        />
                    </div>
                </div>


                <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100 mb-2">
                    Confirm Deletion
                </h3>


                <p className="text-center text-gray-500 dark:text-gray-300 mb-6">
                    {message}
                </p>


                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition font-medium shadow-md hover:shadow-lg"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;