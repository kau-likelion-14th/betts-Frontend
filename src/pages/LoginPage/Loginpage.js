import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../../Config';

const CALLBACK_PATH = '/login/oauth2/code/kakao';

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const onceRef = useRef(false);
    const [error, setError] = useState('');

    const isCallback = location.pathname === CALLBACK_PATH;

    // 이미 로그인했다면 로그인 화면 대신 메인으로 보냅니다.
    useEffect(() => {
        if (!isCallback && localStorage.getItem('accessToken')) {
            navigate('/', { replace: true });
        }
    }, [isCallback, navigate]);

    // 카카오가 돌려준 인가 코드로 백엔드 로그인을 요청합니다.
    useEffect(() => {
        if (!isCallback) return;

        const params = new URLSearchParams(location.search);

        if (params.get('error')) {
            setError('카카오 로그인이 취소되었거나 실패했습니다.');
            return;
        }

        const code = params.get('code');
        if (!code) {
            setError('인가 코드가 없습니다. 카카오 로그인을 다시 시도해 주세요.');
            return;
        }

        // 인가 코드는 한 번만 사용할 수 있으므로 중복 요청을 막습니다.
        if (onceRef.current) return;

        const expectedState = sessionStorage.getItem('kakaoOAuthState');
        if (!expectedState || params.get('state') !== expectedState) {
            setError('로그인 요청을 확인할 수 없습니다. 다시 시도해 주세요.');
            return;
        }

        onceRef.current = true;
        sessionStorage.removeItem('kakaoOAuthState');

        axios
            .post(config.AUTH.KAKAO, { code }, { withCredentials: true })
            .then(({ data }) => {
                const result = data?.result;

                if (data?.isSuccess === false || !result?.accessToken) {
                    throw new Error(data?.message || '로그인 실패');
                }

                const { accessToken, ...user } = result;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('user', JSON.stringify(user));
                window.dispatchEvent(new Event('auth:changed'));

                navigate('/', { replace: true });
            })
            .catch(() => {
                setError('로그인에 실패했습니다. 다시 시도해 주세요.');
            });
    }, [isCallback, location.search, navigate]);

    // 카카오 로그인 화면으로 이동합니다.
    const handleClick = () => {
        const restKey = process.env.REACT_APP_KAKAO_REST_API_KEY;
        const redirectUri = `${window.location.origin}${CALLBACK_PATH}`;

        if (!restKey) {
            setError('카카오 로그인 환경변수를 확인해 주세요.');
            return;
        }

        const state = window.crypto.randomUUID();
        sessionStorage.setItem('kakaoOAuthState', state);

        const params = new URLSearchParams({
            client_id: restKey,
            redirect_uri: redirectUri,
            response_type: 'code',
            state,
        });

        window.location.href = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
    };

    const isProcessing = isCallback && !error;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#1a1a2e'
        }}>
            <section style={{
                background: 'white',
                borderRadius: '20px',
                padding: '60px 48px',
                textAlign: 'center',
                width: '340px'
            }}>
                <div style={{ fontSize: '52px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-2px' }}>
                    <span style={{ color: '#FF6B00' }}>L</span>
                    <span style={{ color: '#222' }}>T</span>
                    <span style={{ color: '#0A84FF' }}>E</span>
                </div>

                <div style={{ fontSize: '13px', letterSpacing: '3px', color: '#888', marginBottom: '48px' }}>
                    <span style={{ color: '#FF6B00' }}>L</span>ION&nbsp;
                    <span style={{ color: '#222' }}>T</span>O-DO&nbsp;
                    <span style={{ color: '#0A84FF' }}>E</span>VERYDAY
                </div>

                {error && (
                    <p role="alert" style={{ color: '#e5484d', fontSize: '13px', marginBottom: '16px' }}>
                        {error}
                    </p>
                )}

                {isProcessing && (
                    <p role="status" style={{ fontSize: '13px', marginBottom: '16px' }}>
                        로그인 처리 중...
                    </p>
                )}

                <button
                    type="button"
                    onClick={handleClick}
                    disabled={isProcessing}
                    style={{
                        backgroundColor: '#FEE500',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '14px 0',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: isProcessing ? 'default' : 'pointer',
                        opacity: isProcessing ? 0.6 : 1,
                        width: '100%',
                        color: '#191919'
                    }}
                >
                    카카오로 시작하기
                </button>

                <footer style={{ marginTop: '36px', fontSize: '11px', color: '#bbb' }}>
                    © LIKELION KAU. All rights reserved
                </footer>
            </section>
        </div>
    );
}

export default LoginPage;
