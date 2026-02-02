// Super Admin Service - 학원 관리 기능
import { supabase } from '../lib';
import { Academy, DbAcademy, dbAcademyToAcademy, AcademySettings } from '../types';

// 기본 학원 설정
const defaultAcademySettings: AcademySettings = {
    dashboard_type: 'default',
    theme: {
        primary: '#3b82f6',
        logo_url: null,
    },
    features: ['basic_stats', 'ranking'],
    enabled_levels: ['middle', 'high', 'advanced'],
};

// =====================================================
// 학원 관리 (Academies)
// =====================================================

export interface AcademyListItem {
    id: string;
    academyCode: string;
    name: string;
    status: 'active' | 'suspended' | 'trial';
    studentCount: number;
    createdAt: string;
}

// 전체 학원 목록 조회
export async function getAcademyList(): Promise<AcademyListItem[]> {
    const { data: academies, error } = await supabase
        .from('academies')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !academies) {
        console.error('Failed to fetch academies:', error);
        return [];
    }

    // 각 학원의 학생 수 조회
    const academyList: AcademyListItem[] = await Promise.all(
        academies.map(async (academy: DbAcademy) => {
            const { count } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('academy_id', academy.id)
                .eq('role', 'student');

            return {
                id: academy.id,
                academyCode: academy.academy_code,
                name: academy.name,
                status: academy.status,
                studentCount: count || 0,
                createdAt: academy.created_at || '',
            };
        })
    );

    return academyList;
}

// 학원 상세 조회
export async function getAcademy(academyId: string): Promise<Academy | null> {
    const { data, error } = await supabase
        .from('academies')
        .select('*')
        .eq('id', academyId)
        .single();

    if (error || !data) {
        console.error('Failed to fetch academy:', error);
        return null;
    }

    return dbAcademyToAcademy(data as DbAcademy);
}

// 학원 등록
export interface CreateAcademyInput {
    academyCode: string;
    name: string;
    status?: 'active' | 'suspended' | 'trial';
    settings?: Partial<AcademySettings>;
}

export async function createAcademy(input: CreateAcademyInput): Promise<{ success: boolean; error?: string; academy?: Academy }> {
    // 학원 코드 중복 체크
    const { data: existing } = await supabase
        .from('academies')
        .select('id')
        .eq('academy_code', input.academyCode)
        .single();

    if (existing) {
        return { success: false, error: '이미 존재하는 학원 코드입니다.' };
    }

    const settings: AcademySettings = {
        ...defaultAcademySettings,
        ...input.settings,
    };

    const { data, error } = await supabase
        .from('academies')
        .insert({
            academy_code: input.academyCode,
            name: input.name,
            status: input.status || 'active',
            settings: settings,
        })
        .select()
        .single();

    if (error || !data) {
        console.error('Failed to create academy:', error);
        return { success: false, error: error?.message || '학원 등록에 실패했습니다.' };
    }

    return { success: true, academy: dbAcademyToAcademy(data as DbAcademy) };
}

// 학원 수정
export interface UpdateAcademyInput {
    name?: string;
    status?: 'active' | 'suspended' | 'trial';
    settings?: Partial<AcademySettings>;
}

export async function updateAcademy(academyId: string, input: UpdateAcademyInput): Promise<{ success: boolean; error?: string }> {
    const updateData: Record<string, unknown> = {};

    if (input.name) updateData.name = input.name;
    if (input.status) updateData.status = input.status;
    if (input.settings) {
        // 기존 설정과 병합
        const { data: current } = await supabase
            .from('academies')
            .select('settings')
            .eq('id', academyId)
            .single();

        updateData.settings = {
            ...(current?.settings || defaultAcademySettings),
            ...input.settings,
        };
    }

    const { error } = await supabase
        .from('academies')
        .update(updateData)
        .eq('id', academyId);

    if (error) {
        console.error('Failed to update academy:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// 학원 삭제
export async function deleteAcademy(academyId: string): Promise<{ success: boolean; error?: string }> {
    // 먼저 해당 학원의 모든 사용자 삭제
    await supabase
        .from('users')
        .delete()
        .eq('academy_id', academyId);

    const { error } = await supabase
        .from('academies')
        .delete()
        .eq('id', academyId);

    if (error) {
        console.error('Failed to delete academy:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// =====================================================
// 학원 관리자 계정 관리
// =====================================================

export interface AcademyAdminInput {
    academyId: string;
    adminId: string;  // 로그인용 ID
    studentName: string;  // 관리자 이름
}

export async function createAcademyAdmin(input: AcademyAdminInput): Promise<{ success: boolean; error?: string }> {
    // 학원 정보 조회
    const { data: academy } = await supabase
        .from('academies')
        .select('name')
        .eq('id', input.academyId)
        .single();

    if (!academy) {
        return { success: false, error: '학원을 찾을 수 없습니다.' };
    }

    // 중복 체크
    const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('academy_id', input.academyId)
        .eq('admin_id', input.adminId)
        .single();

    if (existing) {
        return { success: false, error: '이미 존재하는 관리자 ID입니다.' };
    }

    const { error } = await supabase
        .from('users')
        .insert({
            academy_id: input.academyId,
            academy_name: academy.name,
            student_name: input.studentName,
            admin_id: input.adminId,
            role: 'academy_admin',
        });

    if (error) {
        console.error('Failed to create academy admin:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// =====================================================
// 전체 통계
// =====================================================

export interface SuperAdminStats {
    totalAcademies: number;
    activeAcademies: number;
    totalStudents: number;
    totalAdmins: number;
}

export async function getSuperAdminStats(): Promise<SuperAdminStats> {
    const [academiesResult, activeResult, studentsResult, adminsResult] = await Promise.all([
        supabase.from('academies').select('*', { count: 'exact', head: true }),
        supabase.from('academies').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('users').select('*', { count: 'exact', head: true }).in('role', ['academy_admin', 'admin']),
    ]);

    return {
        totalAcademies: academiesResult.count || 0,
        activeAcademies: activeResult.count || 0,
        totalStudents: studentsResult.count || 0,
        totalAdmins: adminsResult.count || 0,
    };
}
