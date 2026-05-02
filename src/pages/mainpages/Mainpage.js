import React, {useState} from "react";
import CustomCalendar from "./Calendar";
import Todo from "./Todo";
import "../../styles/Mainpage.css";

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const uid = () => Date.now() + Math.random();

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [todosByDate, setTodosByDate] = useState(() => {
    const todayKey = toDateKey(new Date());
    return {
      [todayKey]: [
        { id: uid(), text: '리액트 공부하기', category: 'study', completed: true },
        { id: uid(), text: '공부하기', category: 'study', completed: true },
        { id: uid(), text: '헬스장 가기', category: 'exercise', completed: false },
        { id: uid(), text: '동아리 회의 참석', category: 'club', completed: false },
      ]
    };
  });

  return (
    <div className="mainpage-container">
      <CustomCalendar 
        initialDate={selectedDate}
        onDateChange={setSelectedDate}
        todosByDate={todosByDate}
      />
      <Todo 
        selectedDate={selectedDate}
        todosByDate={todosByDate}
        setTodosByDate={setTodosByDate}
      />
    </div>
  );
};

export default MainPage;