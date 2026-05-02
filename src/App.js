import React from "react";
import "./App.css";
import Header from "./components/header";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import MainPage from "./Pages/Mainpages/Mainpage";   
import MyPage from "./Pages/Mypages/Mypage";
import LoginPage from "./Pages/Loginpage/Loginpage"; 
import FriendPage from "./Pages/FriendPage/FriendPage"; 

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/friends" element={<FriendPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;