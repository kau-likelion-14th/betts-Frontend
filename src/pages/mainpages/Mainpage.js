import React from "react";
import "../../styles/Mainpage.css";
import Calendar from "react-calendar";
import CustomCalendar from "./Calendar";

const Mainpage = () => {
    return(
        <div className = "mainpage-container">
            <CustomCalendar/>
        </div>
        
    );
};

export default Mainpage;


