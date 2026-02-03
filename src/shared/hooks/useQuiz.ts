import { useState, useCallback } from 'react';
import { Word, Level, QuizType, QuizResult } from '../types';
import * as storage from '../services/storage';

interface QuizQuestion {
    word: Word;
    options?: string[];
    correctAnswer: string;
    type: QuizType;
}

interface UseQuizReturn {
    currentQuestion: QuizQuestion | null;
    currentIndex: number;
    totalQuestions: number;
    score: number;
    wrongWords: Word[];
    isComplete: boolean;
    checkAnswer: (answer: string) => boolean;
    nextQuestion: () => void;
    startQuiz: (words: Word[], type: QuizType) => void;
    resetQuiz: () => void;
    saveResult: (level: Level, day: number) => void;
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateChoiceQuestion(word: Word, allWords: Word[]): QuizQuestion {
    const correctAnswer = word.meaning;
    const otherMeanings = allWords
        .filter((w) => w.id !== word.id)
        .map((w) => w.meaning);

    const wrongOptions = shuffleArray(otherMeanings).slice(0, 3);
    const options = shuffleArray([correctAnswer, ...wrongOptions]);

    return {
        word,
        options,
        correctAnswer,
        type: 'choice',
    };
}

function generateSpellingQuestion(word: Word): QuizQuestion {
    return {
        word,
        correctAnswer: word.word.toLowerCase(),
        type: 'spelling',
    };
}

function generateMatchingQuestion(word: Word): QuizQuestion {
    // 유의어 또는 반의어 매칭
    const isSynonymQuestion = word.synonyms.length > 0 && Math.random() > 0.5;
    const correctAnswer = isSynonymQuestion
        ? word.synonyms[0]
        : word.antonyms[0] || word.synonyms[0];

    return {
        word,
        correctAnswer: correctAnswer?.toLowerCase() || '',
        type: 'matching',
    };
}

export function useQuiz(): UseQuizReturn {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [wrongWords, setWrongWords] = useState<Word[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = questions[currentIndex] || null;
    const totalQuestions = questions.length;

    const startQuiz = useCallback((words: Word[], type: QuizType) => {
        const shuffledWords = shuffleArray(words);

        let generatedQuestions: QuizQuestion[];

        switch (type) {
            case 'choice':
                generatedQuestions = shuffledWords.map((word) =>
                    generateChoiceQuestion(word, words)
                );
                break;
            case 'spelling':
                generatedQuestions = shuffledWords.map(generateSpellingQuestion);
                break;
            case 'matching':
                generatedQuestions = shuffledWords
                    .filter((w) => w.synonyms.length > 0 || w.antonyms.length > 0)
                    .map(generateMatchingQuestion);
                break;
            default:
                generatedQuestions = [];
        }

        // 최대 20문제로 제한
        if (generatedQuestions.length > 20) {
            generatedQuestions = generatedQuestions.slice(0, 20);
        }

        setQuestions(generatedQuestions);
        setCurrentIndex(0);
        setScore(0);
        setWrongWords([]);
        setIsComplete(false);
    }, []);

    const checkAnswer = useCallback(
        (answer: string): boolean => {
            if (!currentQuestion) return false;

            const isCorrect =
                answer.toLowerCase().trim() ===
                currentQuestion.correctAnswer.toLowerCase().trim();

            if (isCorrect) {
                setScore((prev) => prev + 5);
            } else {
                setWrongWords((prev) => [...prev, currentQuestion.word]);
            }

            return isCorrect;
        },
        [currentQuestion]
    );

    const nextQuestion = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setIsComplete(true);
        }
    }, [currentIndex, questions.length]);

    const resetQuiz = useCallback(() => {
        setQuestions([]);
        setCurrentIndex(0);
        setScore(0);
        setWrongWords([]);
        setIsComplete(false);
    }, []);

    const saveResult = useCallback(
        (level: Level, day: number) => {
            // 오답 저장
            wrongWords.forEach((word) => {
                storage.addWrongAnswer(word, level, day);
            });

            // 퀴즈 결과 저장
            const result: QuizResult = {
                quizType: currentQuestion?.type || 'choice',
                level,
                day,
                totalQuestions,
                correctAnswers: score,
                wrongWordIds: wrongWords.map((w) => w.id),
                completedAt: new Date().toISOString(),
            };

            storage.saveQuizResult(result);
        },
        [wrongWords, currentQuestion?.type, totalQuestions, score]
    );

    return {
        currentQuestion,
        currentIndex,
        totalQuestions,
        score,
        wrongWords,
        isComplete,
        checkAnswer,
        nextQuestion,
        startQuiz,
        resetQuiz,
        saveResult,
    };
}

export default useQuiz;
