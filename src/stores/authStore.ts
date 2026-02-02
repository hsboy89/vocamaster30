import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib';
import { User, Academy, DbUser, DbAcademy, dbUserToUser, dbAcademyToAcademy, StudentLoginCredentials, AdminLoginCredentials } from '../types';

interface AuthStore {
    user: User | null;
    academy: Academy | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchAcademy: (code: string) => Promise<Academy | null>;
    login: (credentials: StudentLoginCredentials) => Promise<boolean>;
    adminLogin: (credentials: AdminLoginCredentials) => Promise<boolean>;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    checkSession: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            academy: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            fetchAcademy: async (code: string) => {
                set({ isLoading: true, error: null });
                try {
                    const { data, error } = await supabase
                        .from('academies')
                        .select('*')
                        .eq('academy_code', code)
                        .eq('status', 'active') // 활성화된 학원만 조회
                        .single();

                    if (error || !data) {
                        set({ isLoading: false });
                        return null;
                    }

                    const academy = dbAcademyToAcademy(data as DbAcademy);
                    set({ academy, isLoading: false });
                    return academy;
                } catch (err) {
                    console.error('Fetch Academy Error:', err);
                    set({ isLoading: false });
                    return null;
                }
            },

            login: async (credentials: StudentLoginCredentials) => {
                set({ isLoading: true, error: null });

                try {
                    const { academyCode, studentName } = credentials;

                    // 1. 학원 정보 확인 (현재 상태에 없으면 조회)
                    let currentAcademy = get().academy;
                    if (!currentAcademy || currentAcademy.academyCode !== academyCode) {
                        currentAcademy = await get().fetchAcademy(academyCode);
                    }

                    if (!currentAcademy) {
                        set({
                            error: '존재하지 않거나 비활성화된 학원 코드입니다.',
                            isLoading: false
                        });
                        return false;
                    }

                    // 2. 학생 조회
                    const { data: existingUser, error: fetchError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('academy_id', currentAcademy.id)
                        .eq('student_name', studentName)
                        .eq('role', 'student')
                        .single();

                    if (fetchError || !existingUser) {
                        set({
                            error: '등록되지 않은 학생입니다. 이름을 확인해주세요.',
                            isLoading: false
                        });
                        return false;
                    }

                    // 3. 마지막 로그인 시간 업데이트
                    await supabase
                        .from('users')
                        .update({ last_login_at: new Date().toISOString() })
                        .eq('id', existingUser.id);

                    const user = dbUserToUser(existingUser as DbUser);

                    // User 객체에 학원 설정 주입 (편의성)
                    user.academySettings = currentAcademy.settings;

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

            adminLogin: async (credentials: AdminLoginCredentials) => {
                set({ isLoading: true, error: null });
                const { academyCode, adminId, password } = credentials;

                try {
                    // 환경변수에서 마스터 관리자 비밀번호 확인 (간편 구현)
                    // 실제 서비스에서는 DB에 해시된 비밀번호를 저장해야 함
                    const ENV_ADMIN_ID = import.meta.env.VITE_ADMIN_ID; // 구 'admin'
                    const ENV_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

                    // 1. 슈퍼 관리자 체크 (환경변수 사용)
                    // 슈퍼 관리자는 학원 코드가 없어도 되거나, 특정 코드로 진입
                    if (adminId === ENV_ADMIN_ID && password === ENV_ADMIN_PASSWORD) {
                        // 슈퍼 관리자용 조회 (role='super_admin' OR 'admin')
                        // 마이그레이션 전후 호환성을 위해 둘 다 체크하거나 마이그레이션 된 role 사용
                        const { data: adminUser, error: fetchError } = await supabase
                            .from('users')
                            .select('*')
                            .in('role', ['admin', 'super_admin'])
                            .limit(1)
                            .single();

                        if (adminUser) {
                            const user = dbUserToUser(adminUser as DbUser);
                            set({ user, academy: null, isAuthenticated: true, isLoading: false });
                            return true;
                        }
                    }

                    // 2. 학원 관리자 체크
                    if (!academyCode) {
                        throw new Error('학원 코드를 입력해주세요.');
                    }

                    // 학원 조회
                    let currentAcademy = get().academy;
                    if (!currentAcademy || currentAcademy.academyCode !== academyCode) {
                        currentAcademy = await get().fetchAcademy(academyCode);
                    }

                    if (!currentAcademy) {
                        throw new Error('존재하지 않는 학원 코드입니다.');
                    }

                    // 비밀번호 체크 로직 (임시: 학원관리자도 ENV 비번 공유하거나, 추후 DB 비번 필드 추가 필요)
                    // 현재는 편의상 ENV 비번 통일 또는 '1234' 같은 임시 정책 사용
                    // 여기서는 "사용자 이름"이 일치하는지 확인하는 수준으로 구현하고
                    // 실제 비밀번호 검증은 Supabase Auth나 별도 컬럼이 필요함.
                    // -> 사용자 요청에 따라 "DB설계"에 집중했으므로, 여기선 admin_id 일치만 확인 (개발 모드)
                    // TODO: production 환경에서는 반드시 비밀번호 검증 로직 추가 필요
                    if (password !== ENV_ADMIN_PASSWORD) {
                        throw new Error('비밀번호가 올바르지 않습니다.');
                    }

                    const { data: academyAdmin, error: adminError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('academy_id', currentAcademy.id)
                        .eq('admin_id', adminId)
                        .eq('role', 'academy_admin')
                        .single();

                    if (adminError || !academyAdmin) {
                        throw new Error('해당 학원에 등록된 관리자가 아닙니다.');
                    }

                    // 로그인 성공
                    await supabase
                        .from('users')
                        .update({ last_login_at: new Date().toISOString() })
                        .eq('id', academyAdmin.id);

                    const user = dbUserToUser(academyAdmin as DbUser);
                    user.academySettings = currentAcademy.settings;

                    set({ user, academy: currentAcademy, isAuthenticated: true, isLoading: false });
                    return true;

                } catch (error) {
                    console.error('Admin login error:', error);
                    const message = error instanceof Error ? error.message : '로그인에 실패했습니다.';
                    set({ error: message, isLoading: false });
                    return false;
                }
            },

            logout: () => {
                set({ user: null, academy: null, isAuthenticated: false, error: null });
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
                academy: state.academy,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
