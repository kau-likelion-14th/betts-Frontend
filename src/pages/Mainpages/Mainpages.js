import React, { useEffect, useState } from "react";
import CustomCalendar from "./Calendar";
import Todo from "./Todo";
import { get, patch } from "../../Request";
import config from "../../Config";
import "../../styles/Mainpage.css";

// Date 객체를 "YYYY-MM-DD" 문자열로 변환합니다.
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const MainPage = () => {
  // 선택한 날짜 (Todo 목록 조회 기준)
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  // 캘린더에 보이는 달 (캘린더 조회 기준)
  const [viewDate, setViewDate] = useState(() => new Date());

  // 서버에서 받은 데이터
  const [todos, setTodos] = useState([]);
  const [remainingByDate, setRemainingByDate] = useState({});

  // 완료 상태 변경 후 Todo 목록과 캘린더를 다시 조회하기 위한 값
  const [refreshKey, setRefreshKey] = useState(0);
  // 완료 상태 변경 요청 중인 Todo id (중복 클릭 방지)
  const [togglingId, setTogglingId] = useState(null);

  const dateKey = toDateKey(selectedDate);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1; // getMonth()는 0부터 시작

  // 캘린더 조회: 달이 바뀌거나 refreshKey가 바뀌면 다시 조회
  useEffect(() => {
    let active = true;

    const fetchCalendar = async () => {
      try {
        const response = await get(config.CALENDAR.GET, { year, month });
        const days = Array.isArray(response?.result?.days)
            ? response.result.days
            : [];

        // { "2026-11-07": 2, "2026-11-08": 0 } 형태로 변환
        // Todo가 없는 날짜(hasTodo: false)는 넣지 않아서 0과 구분합니다.
        const next = {};
        days.forEach((day) => {
          if (day.hasTodo) {
            next[day.date] = day.remaining;
          }
        });

        if (active) setRemainingByDate(next);
      } catch (error) {
        console.error("캘린더 조회 실패:", error);
        if (active) setRemainingByDate({});
      }
    };

    fetchCalendar();
    return () => {
      active = false;
    };
  }, [year, month, refreshKey]);

  // 날짜별 Todo 조회: 날짜가 바뀌거나 refreshKey가 바뀌면 다시 조회
  useEffect(() => {
    let active = true;

    const fetchTodos = async () => {
      try {
        const response = await get(config.TODOS.LIST, { date: dateKey });
        const list = Array.isArray(response?.result) ? response.result : [];

        // 서버 필드명을 화면에서 쓰는 이름으로 변환
        const mapped = list.map((todo) => ({
          id: todo.todoId,
          text: todo.description,
          category: todo.categoryName,
          completed: todo.completed,
        }));

        if (active) setTodos(mapped);
      } catch (error) {
        console.error("Todo 조회 실패:", error);
        if (active) setTodos([]);
      }
    };

    fetchTodos();
    return () => {
      active = false;
    };
  }, [dateKey, refreshKey]);

  // 체크박스 클릭: 서버에 완료 상태 변경 요청 → 성공하면 다시 조회
  const handleToggleComplete = async (todo) => {
    if (togglingId !== null) return;
    setTogglingId(todo.id);

    try {
      const response = await patch(
          config.TODOS.TOGGLE_COMPLETE(todo.id, dateKey),
          { completed: !todo.completed }
      );

      if (response?.isSuccess === false) {
        throw new Error("완료 상태 변경 실패");
      }

      // 성공했을 때만 Todo 목록과 캘린더를 다시 조회합니다.
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      // 실패하면 화면 상태를 바꾸지 않습니다.
      console.error("완료 상태 변경 실패:", error);
      alert("완료 상태 변경에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
      <div className="mainpage-container">
        <CustomCalendar
            initialDate={selectedDate}
            onDateChange={setSelectedDate}
            onMonthChange={setViewDate}
            remainingByDate={remainingByDate}
        />
        <Todo
            todos={todos}
            onToggleComplete={handleToggleComplete}
            togglingId={togglingId}
        />
      </div>
  );
};

export default MainPage;