import React from "react";
import "./App.css";
import Header from "./components/header";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/mainpages/Mainpage";
import MyPage from "./pages/Mypage/Mainpage";
import LoginPage from "./pages/Loginpage/Loginpage";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;