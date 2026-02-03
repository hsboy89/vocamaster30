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
        <div className="relative min-h-screen bg-slate-950">
            {/* Blurred Background Content - Render real children in background with suppressed redirects */}
            {/* Using very slight blur (3px) and higher opacity (75%) for maximum clarity as requested */}
            <div className="absolute inset-0 filter blur-[3px] opacity-75 pointer-events-none overflow-hidden bg-slate-950">
                <BackgroundModeContext.Provider value={true}>
                    {children}
                </BackgroundModeContext.Provider>
            </div>

            {/* Login Overlay */}
            <div className="absolute inset-0 z-50 flex items-center justify-center">
                <div className="w-full max-w-md p-4">
                    <LoginPage initialTab="admin" isEmbedded={true} hideStudentTab={true} />
                </div>
            </div>
        </div>
    );
}
