import React from "react";
import { Mic, MicOff } from "lucide-react";

interface Props {
    listening: boolean;
    onStart: () => void;
    onStop: () => void;
    disabled?: boolean;
    title?: string;
    className?: string;
}

/**
 * Small mic icon button for per-field speech input.
 * Pulses red while listening, neutral when idle.
 */
const MicButton: React.FC<Props> = ({
    listening,
    onStart,
    onStop,
    disabled,
    title,
    className = "",
}) => (
    <button
        type="button"
        onClick={listening ? onStop : onStart}
        disabled={disabled}
        title={title ?? (listening ? "Stop listening" : "Speak to fill this field")}
        className={[
            "shrink-0 p-1.5 rounded-md border transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed",
            listening
                ? "border-red-400 text-red-500 bg-red-50 dark:bg-red-500/10 animate-pulse"
                : "border-gray-200 dark:border-dark-700 text-gray-400 dark:text-dark-500 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 bg-white dark:bg-dark-900",
            className,
        ].join(" ")}
    >
        {listening ? <MicOff size={13} /> : <Mic size={13} />}
    </button>
);

export default MicButton;
