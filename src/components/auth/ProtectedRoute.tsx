import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    allowedRoles = ['student', 'admin'],
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to={redirectTo} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // 권한이 없으면 메인 페이지로 리다이렉트
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
