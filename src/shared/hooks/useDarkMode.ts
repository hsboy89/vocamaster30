import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vocamaster-dark-mode';

export function useDarkMode() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        // 초기값: localStorage에서 불러오기
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
            return stored === 'true';
        }
        // 시스템 설정 확인
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // 다크 모드 상태가 바뀔 때마다 DOM과 localStorage 업데이트
    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem(STORAGE_KEY, String(isDark));
    }, [isDark]);

    // 시스템 테마 변경 감지
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === null) {
                setIsDark(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggle = useCallback(() => {
        setIsDark((prev) => !prev);
    }, []);

    return { isDark, toggle };
}

export default useDarkMode;
