import { useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

const WS_BASE = (import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL ?? 'http://localhost:5000')
    .replace(/\/api$/, '')
    .replace('http', 'ws');
const WS_URL = `${WS_BASE}/ws/interview`;

// How loud (0–1 float32) before we consider the user speaking
const SPEECH_THRESHOLD = 0.012;
// How many silent frames to keep isSpeaking=true after speech drops below threshold
const SPEAKING_HOLD_FRAMES = 8;

export type SessionStatus = 'idle' | 'connecting' | 'ready' | 'interviewing' | 'ending' | 'done' | 'error';

export interface TranscriptEntry {
    speaker: 'ai' | 'user';
    text: string;
}

export interface FeedbackData {
    overallScore: number;
    communicationScore: number;
    technicalScore: number;
    relevanceScore: number;
    strengths: string[];
    improvements: string[];
    summary: string;
}

export function useInterviewSession() {
    const [status, setStatus] = useState<SessionStatus>('idle');
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [feedback, setFeedback] = useState<FeedbackData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isMicActive, setIsMicActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const silentGainRef = useRef<GainNode | null>(null);
    const nextPlayTimeRef = useRef(0);

    // Mute / VAD refs — read inside onaudioprocess without causing stale closures
    const isMutedRef = useRef(false);
    const isSpeakingRef = useRef(false);
    const speakingCounterRef = useRef(0);

    const accessToken = useSelector((s: any) => s.auth?.accessToken);

    // ── Playback ─────────────────────────────────────────────────────────────
    const playAudioChunk = useCallback(async (base64: string, mimeType: string) => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        if (ctx.state === 'suspended') await ctx.resume();

        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        const int16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;

        const sampleRate = parseInt(mimeType?.match(/rate=(\d+)/)?.[1] ?? '24000');
        const buffer = ctx.createBuffer(1, float32.length, sampleRate);
        buffer.getChannelData(0).set(float32);

        const startTime = Math.max(ctx.currentTime, nextPlayTimeRef.current);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(startTime);
        nextPlayTimeRef.current = startTime + buffer.duration;
    }, []);

    // ── Microphone ───────────────────────────────────────────────────────────
    const startMicrophone = useCallback(async () => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        streamRef.current = stream;

        const source = ctx.createMediaStreamSource(stream);
        sourceRef.current = source;

        const TARGET_RATE = 16000;
        const inputRate = ctx.sampleRate;
        const ratio = inputRate / TARGET_RATE;

        // ScriptProcessorNode: deprecated but universally supported
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0);

            // ── VAD: RMS with hysteresis ──────────────────────────────────
            let sumSq = 0;
            for (let i = 0; i < input.length; i++) sumSq += input[i] * input[i];
            const rms = Math.sqrt(sumSq / input.length);

            if (rms > SPEECH_THRESHOLD) {
                speakingCounterRef.current = SPEAKING_HOLD_FRAMES;
            } else if (speakingCounterRef.current > 0) {
                speakingCounterRef.current--;
            }
            const speaking = speakingCounterRef.current > 0;
            if (speaking !== isSpeakingRef.current) {
                isSpeakingRef.current = speaking;
                setIsSpeaking(speaking);
            }

            // ── Send audio (skip when muted or WS closed) ─────────────────
            const ws = wsRef.current;
            if (isMutedRef.current || !ws || ws.readyState !== WebSocket.OPEN) return;

            const outputLen = Math.floor(input.length / ratio);
            const downsampled = new Float32Array(outputLen);
            for (let i = 0; i < outputLen; i++) downsampled[i] = input[Math.floor(i * ratio)];

            const int16 = new Int16Array(outputLen);
            for (let i = 0; i < outputLen; i++) {
                int16[i] = Math.max(-32768, Math.min(32767, Math.round(downsampled[i] * 32767)));
            }

            const bytes = new Uint8Array(int16.buffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);

            ws.send(JSON.stringify({ type: 'audio_chunk', data: btoa(binary) }));
        };

        // Connect through silent gain so onaudioprocess fires without echo
        const silentGain = ctx.createGain();
        silentGain.gain.value = 0;
        silentGainRef.current = silentGain;

        source.connect(processor);
        processor.connect(silentGain);
        silentGain.connect(ctx.destination);

        setIsMicActive(true);
    }, []);

    const stopMicrophone = useCallback(() => {
        processorRef.current?.disconnect();
        sourceRef.current?.disconnect();
        silentGainRef.current?.disconnect();
        streamRef.current?.getTracks().forEach((t) => t.stop());
        processorRef.current = null;
        sourceRef.current = null;
        silentGainRef.current = null;
        streamRef.current = null;
        isSpeakingRef.current = false;
        speakingCounterRef.current = 0;
        setIsMicActive(false);
        setIsSpeaking(false);
    }, []);

    // ── Mute toggle ───────────────────────────────────────────────────────────
    // Keeps the mic stream alive (no re-permission prompt on unmute).
    // onaudioprocess simply skips sending when muted.
    const toggleMute = useCallback(() => {
        const next = !isMutedRef.current;
        isMutedRef.current = next;
        setIsMuted(next);
        if (next) {
            // Immediately clear speaking indicator when muting
            isSpeakingRef.current = false;
            speakingCounterRef.current = 0;
            setIsSpeaking(false);
        }
    }, []);

    // ── Session ───────────────────────────────────────────────────────────────
    const startSession = useCallback((jobDescription: string, candidateProfile?: string) => {
        setStatus('connecting');
        setTranscript([]);
        setFeedback(null);
        setError(null);
        setIsMuted(false);
        setIsSpeaking(false);
        isMutedRef.current = false;
        isSpeakingRef.current = false;
        speakingCounterRef.current = 0;

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        nextPlayTimeRef.current = 0;

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: 'start_session',
                jobDescription,
                candidateProfile: candidateProfile ?? '',
                token: accessToken,
            }));
        };

        ws.onmessage = (event) => {
            let msg: any;
            try { msg = JSON.parse(event.data); } catch { return; }

            switch (msg.type) {
                case 'session_ready':
                    setStatus('ready');
                    startMicrophone().then(() => setStatus('interviewing'));
                    break;

                case 'audio_chunk':
                    void playAudioChunk(msg.data, msg.mimeType);
                    break;

                case 'transcript':
                    setTranscript((prev) => [...prev, { speaker: msg.speaker, text: msg.text }]);
                    break;

                case 'feedback':
                    setFeedback(msg.data);
                    setStatus('done');
                    stopMicrophone();
                    break;

                case 'ending':
                    setStatus('ending');
                    stopMicrophone();
                    break;

                case 'turn_complete':
                    break;

                case 'error':
                    setError(msg.message);
                    setStatus('error');
                    stopMicrophone();
                    break;

                case 'session_ended':
                    setStatus('done');
                    stopMicrophone();
                    break;
            }
        };

        ws.onerror = () => {
            setError('Connection failed. Check that the server is running and GEMINI_API_KEY is set.');
            setStatus('error');
        };

        ws.onclose = () => {};
    }, [accessToken, startMicrophone, stopMicrophone, playAudioChunk]);

    const endInterview = useCallback(() => {
        setStatus('ending');
        stopMicrophone();
        wsRef.current?.send(JSON.stringify({ type: 'end_interview' }));
    }, [stopMicrophone]);

    const closeSession = useCallback(() => {
        stopMicrophone();
        wsRef.current?.close();
        wsRef.current = null;
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        isMutedRef.current = false;
        setStatus('idle');
        setTranscript([]);
        setFeedback(null);
        setError(null);
        setIsMuted(false);
        setIsSpeaking(false);
    }, [stopMicrophone]);

    return {
        status,
        transcript,
        feedback,
        error,
        isMicActive,
        isMuted,
        isSpeaking,
        toggleMute,
        startSession,
        endInterview,
        closeSession,
    };
}