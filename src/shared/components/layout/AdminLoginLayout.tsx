import { ReactNode } from 'react';
import { useAuthStore } from '../../../stores';
import { LoginPage } from '../auth/LoginPage';

interface AdminLoginLayoutProps {
    children: ReactNode;
}

export function AdminLoginLayout({ children }: AdminLoginLayoutProps) {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="relative min-h-screen bg-slate-900">
            {/* Blurred Background Content */}
            <div className="absolute inset-0 filter blur-md opacity-50 pointer-events-none overflow-hidden">
                {children}
            </div>

            {/* Login Overlay */}
            <div className="absolute inset-0 z-50 flex items-center justify-center">
                <div className="w-full max-w-md p-4">
                    <LoginPage initialTab="admin" />
                </div>
            </div>
        </div>
    );
}
