import { useState, useEffect, useCallback } from 'react';
import { Level, StudyStatus, UserProgress } from '../types';
import * as storage from '../services/storage';

interface UseProgressReturn {
    progress: UserProgress[];
    getStatus: (level: Level, day: number) => StudyStatus;
    setStatus: (level: Level, day: number, status: StudyStatus) => void;
    addMemorizedWord: (level: Level, day: number, wordId: string, totalWords?: number) => void;
    removeMemorizedWord: (level: Level, day: number, wordId: string) => void;
    getCompletionRate: (level: Level) => number;
    isLoading: boolean;
}

export function useProgress(): UseProgressReturn {
    const [progress, setProgress] = useState<UserProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 초기 로드
    useEffect(() => {
        const loaded = storage.getAllProgress();
        setProgress(loaded);
        setIsLoading(false);
    }, []);

    const getStatus = useCallback(
        (level: Level, day: number): StudyStatus => {
            const found = progress.find((p) => p.level === level && p.day === day);
            return found?.status || 'not-started';
        },
        [progress]
    );

    const setStatus = useCallback(
        (level: Level, day: number, status: StudyStatus) => {
            const existing = progress.find((p) => p.level === level && p.day === day);
            storage.setProgress(level, day, status, existing?.memorizedWords || []);

            setProgress((prev) => {
                const newProgress = prev.filter((p) => !(p.level === level && p.day === day));
                newProgress.push({
                    level,
                    day,
                    status,
                    memorizedWords: existing?.memorizedWords || [],
                    lastStudied: new Date().toISOString(),
                });
                return newProgress;
            });
        },
        [progress]
    );

    const addMemorizedWord = useCallback(
        (level: Level, day: number, wordId: string, totalWords?: number) => {
            const existing = progress.find((p) => p.level === level && p.day === day);
            const currentMemorized = existing?.memorizedWords || [];

            if (!currentMemorized.includes(wordId)) {
                const newMemorized = [...currentMemorized, wordId];

                // 모든 단어를 외웠는지 확인하여 상태 업데이트
                let newStatus: StudyStatus = existing?.status || 'in-progress';
                if (totalWords && newMemorized.length >= totalWords) {
                    newStatus = 'completed';
                }

                storage.setProgress(level, day, newStatus, newMemorized);

                setProgress((prev) => {
                    const newProgress = prev.filter((p) => !(p.level === level && p.day === day));
                    newProgress.push({
                        level,
                        day,
                        status: newStatus,
                        memorizedWords: newMemorized,
                        lastStudied: new Date().toISOString(),
                    });
                    return newProgress;
                });
            }
        },
        [progress]
    );

    const removeMemorizedWord = useCallback(
        (level: Level, day: number, wordId: string) => {
            const existing = progress.find((p) => p.level === level && p.day === day);
            if (existing) {
                const newMemorized = existing.memorizedWords.filter(id => id !== wordId);
                const newStatus: StudyStatus = 'in-progress';

                storage.setProgress(level, day, newStatus, newMemorized);

                setProgress((prev) => {
                    const newProgress = prev.filter((p) => !(p.level === level && p.day === day));
                    newProgress.push({
                        level,
                        day,
                        status: newStatus,
                        memorizedWords: newMemorized,
                        lastStudied: new Date().toISOString(),
                    });
                    return newProgress;
                });
            }
        },
        [progress]
    );

    const getCompletionRate = useCallback(
        (level: Level): number => {
            const levelProgress = progress.filter((p) => p.level === level);
            const completed = levelProgress.filter((p) => p.status === 'completed').length;
            return Math.round((completed / 30) * 100);
        },
        [progress]
    );

    return {
        progress,
        getStatus,
        setStatus,
        addMemorizedWord,
        removeMemorizedWord,
        getCompletionRate,
        isLoading,
    };
}

export default useProgress;
