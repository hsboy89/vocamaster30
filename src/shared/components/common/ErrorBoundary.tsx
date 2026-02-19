import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * 전역 에러 바운더리 — 앱이 완전히 멈추는 것을 방지합니다.
 * React 렌더링 중 에러 발생 시 에러 복구 화면을 표시합니다.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('💥 ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        // 세션 데이터 완전 초기화
        localStorage.removeItem('vocamaster-auth');
        sessionStorage.removeItem('vocamaster-auth');
        this.setState({ hasError: false, error: null });
        window.location.href = '/student';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8fafc',
                    fontFamily: 'Inter, sans-serif',
                    padding: '1rem',
                }}>
                    <div style={{
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center',
                        background: 'white',
                        borderRadius: '1rem',
                        padding: '2.5rem',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                            앱에 문제가 발생했습니다
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            세션 충돌이 감지되었습니다.<br />
                            아래 버튼을 눌러 초기화하세요.
                        </p>
                        <button
                            onClick={this.handleReset}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                fontWeight: 600,
                                fontSize: '1rem',
                                cursor: 'pointer',
                            }}
                        >
                            🔄 초기화 후 재시작
                        </button>
                        <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '1rem' }}>
                            {this.state.error?.message}
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
