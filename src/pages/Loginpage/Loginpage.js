import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

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

                <button
                    type="button"
                    onClick={handleClick}
                    style={{
                        backgroundColor: '#FEE500',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '14px 0',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
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