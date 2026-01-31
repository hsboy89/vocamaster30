import { useCallback } from 'react';

interface UseTTSReturn {
    speak: (text: string, lang?: string) => void;
    stop: () => void;
    isSpeaking: () => boolean;
}

export function useTTS(): UseTTSReturn {
    const speak = useCallback((text: string, lang: string = 'en-US') => {
        // 이전 음성 중지
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9; // 약간 느리게
        utterance.pitch = 1;
        utterance.volume = 1;

        // 영어 보이스 선택 시도
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(
            (voice) => voice.lang.startsWith('en') && voice.name.includes('Google')
        ) || voices.find((voice) => voice.lang.startsWith('en'));

        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        window.speechSynthesis.speak(utterance);
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
