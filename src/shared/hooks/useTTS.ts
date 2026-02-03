import { useCallback, useEffect, useRef } from 'react';

interface UseTTSReturn {
    speak: (text: string, lang?: string) => void;
    stop: () => void;
    isSpeaking: () => boolean;
}

export function useTTS(): UseTTSReturn {
    const voicesLoaded = useRef(false);

    // Ensure voices are loaded
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                voicesLoaded.current = true;
            }
        };

        // Load immediately if available
        loadVoices();

        // Also listen for voiceschanged event (async loading in some browsers)
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        };
    }, []);

    const speak = useCallback((text: string, lang: string = 'en-US') => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9; // 약간 느리게
        utterance.pitch = 1;
        utterance.volume = 1;

        // Get voices and select English voice
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(
            (voice) => voice.lang.startsWith('en') && voice.name.includes('Google')
        ) || voices.find((voice) => voice.lang.startsWith('en'));

        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        // Workaround for Chrome bug where speech doesn't work after cancel
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 10);
    }, []);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
    }, []);

    const isSpeaking = useCallback(() => {
        return window.speechSynthesis.speaking;
    }, []);

    return { speak, stop, isSpeaking };
}

export default useTTS;

