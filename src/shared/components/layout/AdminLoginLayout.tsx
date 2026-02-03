import { ReactNode } from 'react';
import { useAuthStore } from '../../../stores';
import { LoginPage } from '../auth/LoginPage';
import BackgroundModeContext from '../auth/BackgroundModeContext';

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
            {/* Blurred Background Content - Render real children in background with suppressed redirects */}
            <div className="absolute inset-0 filter blur-lg opacity-40 pointer-events-none overflow-hidden bg-slate-900">
                <BackgroundModeContext.Provider value={true}>
                    {children}
                </BackgroundModeContext.Provider>
            </div>

            {/* Login Overlay */}
            <div className="absolute inset-0 z-50 flex items-center justify-center">
                <div className="w-full max-w-md p-4">
                    <LoginPage initialTab="admin" isEmbedded={true} />
                </div>
            </div>
        </div>
    );
}
