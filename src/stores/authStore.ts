import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib';
import { User, DbUser, dbUserToUser, LoginCredentials } from '../types';

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginCredentials) => Promise<boolean>;
    adminLogin: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    checkSession: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials: LoginCredentials) => {
                set({ isLoading: true, error: null });

                try {
                    const { academyName, studentName } = credentials;

                    // 등록된 학생인지 확인 (관리자가 미리 등록한 학생만 로그인 가능)
                    const { data: existingUser, error: fetchError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('academy_name', academyName)
                        .eq('student_name', studentName)
                        .eq('role', 'student')
                        .single();

                    if (fetchError || !existingUser) {
                        // 등록되지 않은 학생
                        set({
                            error: '등록되지 않은 학생입니다. 관리자에게 문의하세요.',
                            isLoading: false
                        });
                        return false;
                    }

                    // 마지막 로그인 시간 업데이트
                    await supabase
                        .from('users')
                        .update({ last_login_at: new Date().toISOString() })
                        .eq('id', existingUser.id);

                    const user = dbUserToUser(existingUser as DbUser);
                    set({ user, isAuthenticated: true, isLoading: false });
                    return true;

                } catch (error) {
                    console.error('Login error:', error);
                    set({
                        error: '로그인에 실패했습니다. 다시 시도해주세요.',
                        isLoading: false
                    });
                    return false;
                }
            },

            adminLogin: async (adminId: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    // 환경변수에서 관리자 ID/비밀번호 가져오기
                    const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;
                    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

                    if (!ADMIN_ID || !ADMIN_PASSWORD) {
                        throw new Error('관리자 계정 정보가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
                    }

                    if (adminId !== ADMIN_ID || password !== ADMIN_PASSWORD) {
                        throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
                    }

                    // 관리자 계정 조회 (role = admin인 계정)
                    const { data: adminUser, error: fetchError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('role', 'admin')
                        .single();

                    if (fetchError || !adminUser) {
                        throw new Error('관리자 계정이 DB에 없습니다. Supabase에서 생성해주세요.');
                    }

                    // 마지막 로그인 시간 업데이트
                    await supabase
                        .from('users')
                        .update({ last_login_at: new Date().toISOString() })
                        .eq('id', adminUser.id);

                    const user = dbUserToUser(adminUser as DbUser);
                    set({ user, isAuthenticated: true, isLoading: false });
                    return true;

                } catch (error) {
                    console.error('Admin login error:', error);
                    const message = error instanceof Error ? error.message : '로그인에 실패했습니다.';
                    set({ error: message, isLoading: false });
                    return false;
                }
            },

            logout: () => {
                set({ user: null, isAuthenticated: false, error: null });
            },

            setLoading: (loading: boolean) => set({ isLoading: loading }),
            setError: (error: string | null) => set({ error }),

            checkSession: () => {
                // persist middleware가 자동으로 세션 복원
                const { user } = get();
                if (user) {
                    set({ isAuthenticated: true });
                }
            },
        }),
        {
            name: 'vocamaster-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
