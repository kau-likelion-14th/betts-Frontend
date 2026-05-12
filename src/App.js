import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/Mainpages/Mainpages';
import LoginPage from './pages/LoginPage/Loginpage';
import FriendPage from './pages/FriendPage/FriendPage';
import FriendDetailPage from './pages/FriendPage/FriendDetailPage';
import MyPage from './pages/Mypages/Mypage';
// Routes: 경로에 따라 다른 컴포넌트를 렌더링하는 컨테이너
// Route: 특정 path와 일치할 때 보여줄 컴포넌트를 지정
// useLocation: 현재 URL 정보를 가져오는 훅
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  // useLocation()으로 현재 경로를 가져옴
  // 예: /login 페이지에서는 location.pathname === '/login' 이 true가 됨
  const location = useLocation();

  // 현재 경로가 '/login'이면 true, 아니면 false
  // 이 값으로 Header와 Footer를 조건부 렌더링함
  const isLoginPage = location.pathname === '/login';

  return (
    // className="app" → App.css의 flex 레이아웃 적용 (푸터를 항상 하단에 고정)
    <div className="app">
      {/* isLoginPage가 false일 때만 Header를 렌더링 → 로그인 페이지에서는 헤더 숨김 */}
      {!isLoginPage && <Header />}

      {/* className="main-content" → flex: 1 적용으로 푸터를 아래로 밀어냄 */}
      <div className="main-content">
        <Routes>
          {/* path="/" 에 접속하면 MainPage 컴포넌트를 화면에 렌더링 */}
          <Route path="/" element={<MainPage />} />

          {/* path="/login" 에 접속하면 LoginPage 컴포넌트를 화면에 렌더링 */}
          <Route path="/login" element={<LoginPage />} />

          {/* path="/friends" 에 접속하면 FriendPage 컴포넌트를 화면에 렌더링 */}
          <Route path="/friends" element={<FriendPage />} />

          {/* path="/friends/:id" → :id 부분이 동적으로 변함
              예: /friends/1, /friends/2 등 친구마다 다른 상세 페이지로 이동 */}
          <Route path="/friends/:id" element={<FriendDetailPage />} />

          {/* path="/mypage" 에 접속하면 MyPage 컴포넌트를 화면에 렌더링 */}
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>

      {/* isLoginPage가 false일 때만 Footer를 렌더링 → 로그인 페이지에서는 푸터 숨김 */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
