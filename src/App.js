import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/Mainpages/Mainpages';
import LoginPage from './pages/LoginPage/Loginpage';
import FriendPage from './pages/FriendPage/FriendPage';
import FriendDetailPage from './pages/FriendPage/FriendDetailPage';
import MyPage from './pages/Mypages/Mypage';
import ProtectedRoute from './routes/ProtectRoute';
// Routes: 경로에 따라 다른 컴포넌트를 렌더링하는 컨테이너
// Route: 특정 path와 일치할 때 보여줄 컴포넌트를 지정
// useLocation: 현재 URL 정보를 가져오는 훅
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  // 로그인 화면과 카카오 콜백 화면에서는 헤더·푸터를 숨깁니다.
  const isLoginPage =
    location.pathname === '/login' ||
    location.pathname === '/login/oauth2/code/kakao';

  return (
    // className="app" → App.css의 flex 레이아웃 적용 (푸터를 항상 하단에 고정)
    <div className="app">
      {!isLoginPage && <Header />}

      <div className="main-content">
        <Routes>
          {/* 로그인 페이지가 카카오 콜백까지 처리합니다. */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/oauth2/code/kakao" element={<LoginPage />} />

          {/* 로그인한 사용자만 들어갈 수 있는 페이지 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/friends" element={<FriendPage />} />
            {/* :id 부분이 동적으로 변함 (예: /friends/1) */}
            <Route path="/friends/:id" element={<FriendDetailPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
        </Routes>
      </div>

      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
