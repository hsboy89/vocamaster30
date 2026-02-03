import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores';
import { UserRole } from '../../types';
import { useBackgroundMode } from './BackgroundModeContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    allowedRoles = ['student', 'academy_admin', 'super_admin', 'admin'],
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuthStore();
    const isBackground = useBackgroundMode();

    if (!isAuthenticated || !user) {
        if (isBackground) return <>{children}</>;
        return <Navigate to={redirectTo} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // 권한이 없으면 메인 페이지로 리다이렉트
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
