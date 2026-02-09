// Authentication Types for VocaMaster30 (Multi-Tenant SaaS)

// 사용자 역할: 학생, 학원관리자, 슈퍼관리자
// 'admin'은 레거시 호환용 (기존 DB 데이터)
export type UserRole = 'student' | 'academy_admin' | 'super_admin' | 'admin';

// =====================================================
// Academy (학원) 관련 타입
// =====================================================
export interface AcademySettings {
    dashboard_type: 'default' | 'advanced' | 'simple';
    theme: {
        primary: string;
        logo_url?: string | null;
    };
    features: string[];  // 예: ['basic_stats', 'ranking', 'assignment', 'tts_auto']
    enabled_levels: ('middle' | 'high' | 'advanced')[];
}

export interface Academy {
    id: string;
    academyCode: string;        // 로그인 시 입력하는 코드
    name: string;               // 학원 정식 명칭
    settings: AcademySettings;
    status: 'active' | 'suspended' | 'trial';
    trialEndsAt?: string;
    createdAt?: string;
}

export interface DbAcademy {
    id: string;
    academy_code: string;
    name: string;
    settings: AcademySettings;
    status: 'active' | 'suspended' | 'trial';
    trial_ends_at?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

// =====================================================
// User (사용자) 관련 타입
// =====================================================
export interface User {
    id: string;
    academyId?: string;           // 소속 학원 ID
    academyName?: string;         // [호환용] 학원명
    studentName: string;          // 사용자 이름
    role: UserRole;
    adminId?: string;             // 관리자용 로그인 ID
    email?: string;
    createdAt?: string;
    lastLoginAt?: string;

    // 학생 인적사항 추가
    school?: string;
    phone?: string;
    grade?: string;
    targetUniversity?: string;

    // 런타임에 로드되는 학원 설정 (로그인 시 불러옴)
    academySettings?: AcademySettings;
}

export interface AuthState {
    user: User | null;
    academy: Academy | null;      // 현재 로그인된 학원 정보
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// 학생 로그인: 학원코드 + 이름
export interface StudentLoginCredentials {
    academyCode: string;
    studentName: string;
    password?: string; // 기존 학생 호환성을 위해 우선 옵셔널, UI에서는 필수 처리
}

// 관리자 로그인: 학원코드 + 관리자ID + 비밀번호
export interface AdminLoginCredentials {
    academyCode?: string;         // 학원관리자는 필수, 슈퍼관리자는 생략 가능
    adminId: string;
    password: string;
}

// [호환용] 기존 로그인 방식
export interface LoginCredentials {
    academyName: string;
    studentName: string;
}

// =====================================================
// Supabase 테이블 타입 (snake_case)
// =====================================================
export interface DbUser {
    id: string;
    academy_id?: string;
    academy_name?: string;
    student_name: string;
    role: UserRole;
    admin_id?: string;
    password_hash?: string; // 학원 관리자 비밀번호
    email?: string;
    created_at?: string;
    last_login_at?: string;
    school?: string;
    phone?: string;
    grade?: string;
    target_university?: string;
}

// =====================================================
// 변환 함수
// =====================================================
export function dbUserToUser(dbUser: DbUser): User {
    return {
        id: dbUser.id,
        academyId: dbUser.academy_id,
        academyName: dbUser.academy_name,
        studentName: dbUser.student_name,
        role: dbUser.role,
        adminId: dbUser.admin_id,
        email: dbUser.email,
        createdAt: dbUser.created_at,
        lastLoginAt: dbUser.last_login_at,
        school: dbUser.school,
        phone: dbUser.phone,
        grade: dbUser.grade,
        targetUniversity: dbUser.target_university,
    };
}

export function dbAcademyToAcademy(dbAcademy: DbAcademy): Academy {
    return {
        id: dbAcademy.id,
        academyCode: dbAcademy.academy_code,
        name: dbAcademy.name,
        settings: dbAcademy.settings,
        status: dbAcademy.status,
        trialEndsAt: dbAcademy.trial_ends_at,
        createdAt: dbAcademy.created_at,
    };
}

