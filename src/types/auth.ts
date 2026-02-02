// Authentication Types for VocaMaster30

export type UserRole = 'student' | 'admin';

export interface User {
    id: string;
    academyName: string;      // 학원명
    studentName: string;      // 학생 이름
    role: UserRole;
    email?: string;           // 관리자용
    createdAt?: string;
    lastLoginAt?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    academyName: string;
    studentName: string;
}

export interface AdminLoginCredentials {
    email: string;
    password: string;
}

// Supabase 테이블 타입 (snake_case)
export interface DbUser {
    id: string;
    academy_name: string;
    student_name: string;
    role: UserRole;
    email?: string;
    created_at?: string;
    last_login_at?: string;
}

// DB → App 변환 함수
export function dbUserToUser(dbUser: DbUser): User {
    return {
        id: dbUser.id,
        academyName: dbUser.academy_name,
        studentName: dbUser.student_name,
        role: dbUser.role,
        email: dbUser.email,
        createdAt: dbUser.created_at,
        lastLoginAt: dbUser.last_login_at,
    };
}
