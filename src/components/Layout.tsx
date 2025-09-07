import React, { useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const menuItems = [
    { text: 'AI 에이전트', path: '/agent' },
    { text: '내 템플릿', path: '/my-templates' },
    { text: '로그인', path: '/login' },
];

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    // [추가] 마우스 위치에 따른 배경 효과를 위한 상태
    const [lightPosition, setLightPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setLightPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <Box
            onMouseMove={handleMouseMove}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden', // 페이지 스크롤 방지
                position: 'relative', // 자식 요소의 absolute 포지셔닝을 위해
                // [변경] 전체 페이지에 그라데이션 배경 적용
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
        >
            {/* [추가] 마우스를 따라다니는 조명 효과 */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '800px',
                    height: '800px',
                    background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 60%)`,
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    transform: `translate(${lightPosition.x - 400}px, ${lightPosition.y - 400}px)`,
                    transition: 'transform 0.2s ease-out',
                    zIndex: 0,
                }}
            />

            <AppBar
                position="static"
                sx={{
                    // [변경] 유리 질감의 반투명 AppBar
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    zIndex: 2, // 콘텐츠 위에 있도록 zIndex 설정
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#0f172a', fontWeight: 'bold' }}>
                        Jober
                    </Typography>
                    <Box>
                        {menuItems.map((item) => (
                            <Button
                                key={item.text}
                                component={Link}
                                to={item.path}
                                sx={{ color: '#334155', fontWeight: 500 }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    display: 'flex',
                    zIndex: 1, // 조명 효과 위에 콘텐츠가 오도록 설정
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
