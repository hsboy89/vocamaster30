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
            {/* Blurred Background Content - Render a static skeleton instead of real children to avoid ProtectedRoute redirects */}
            <div className="absolute inset-0 filter blur-md opacity-30 pointer-events-none overflow-hidden bg-slate-900 p-8">
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-800/50 rounded-2xl border border-white/5"></div>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-6 h-[500px]">
                    <div className="col-span-2 bg-slate-800/50 rounded-2xl border border-white/5"></div>
                    <div className="bg-slate-800/50 rounded-2xl border border-white/5"></div>
                </div>
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
