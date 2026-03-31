import React from "react";
import "./App.css";
import Header from "./components/header";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mainpage from "./pages/mainpages/Mainpage";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
       <Routes>
         <Route path = "/" element = {<Mainpage />}/>
       </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;