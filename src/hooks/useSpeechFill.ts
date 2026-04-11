import { useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export interface UseSpeechFillReturn {
    supported: boolean;
    listening: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

/**
 * Thin wrapper around react-speech-recognition.
 *
 * Usage in a component:
 *   const { supported, listening, transcript, startListening, stopListening, resetTranscript } = useSpeechFill();
 *   const [activeField, setActiveField] = useState<string | null>(null);
 *
 *   // When mic stops → apply transcript to whichever field was active
 *   useEffect(() => {
 *     if (!listening && activeField && transcript) {
 *       applyTranscriptToField(activeField, transcript);
 *       setActiveField(null);
 *       resetTranscript();
 *     }
 *   }, [listening]);
 */
export function useSpeechFill(): UseSpeechFillReturn {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    const startListening = useCallback(() => {
        resetTranscript();
        void SpeechRecognition.startListening({ continuous: false, language: "en-US" });
    }, [resetTranscript]);

    const stopListening = useCallback(() => {
        void SpeechRecognition.stopListening();
    }, []);

    return {
        supported: browserSupportsSpeechRecognition,
        listening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
    };
}
