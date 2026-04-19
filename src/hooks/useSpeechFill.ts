import { useCallback, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export interface UseSpeechFillReturn {
    supported: boolean;
    listening: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

export function useSpeechFill(): UseSpeechFillReturn {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition({ commands: [] });

    console.log("[useSpeechFill] supported:", browserSupportsSpeechRecognition, "| SpeechRecognition API:", !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition));

    useEffect(() => {
        const sr: any = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!sr) return;
        const instance = new sr();
        instance.onerror = (e: any) => console.error("[SpeechRecognition] onerror:", e.error, e);
        instance.onstart = () => console.log("[SpeechRecognition] started");
        instance.onend = () => console.log("[SpeechRecognition] ended");
        return () => { try { instance.abort(); } catch {} };
    }, []);

    const startListening = useCallback(() => {
        resetTranscript();
        void SpeechRecognition.startListening({ continuous: false, language: "en-US" })
            .catch((err: unknown) => console.error("[useSpeechFill] startListening error:", err));
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
