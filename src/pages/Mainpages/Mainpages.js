import React, { useEffect, useState } from "react";
import CustomCalendar from "./Calendar";
import Todo from "./Todo";
import { get, post, put, patch, del } from "../../Request";
import config from "../../Config";
import "../../styles/Mainpage.css";

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const toTodoRequestBody = ({ text, category, routine }) => ({
  categoryName: category,
  description: text,
  routineEnabled: Boolean(routine),
  startDate: routine?.startDate || null,
  endDate: routine?.endDate || null,
  week: routine?.week || null,
});

const getErrorMessage = (error, fallback) =>
    error?.response?.data?.message ?? fallback;

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [viewDate, setViewDate] = useState(() => new Date());

  const [todos, setTodos] = useState([]);
  const [remainingByDate, setRemainingByDate] = useState({});

  const [refreshKey, setRefreshKey] = useState(0);
  const [togglingId, setTogglingId] = useState(null);

  const dateKey = toDateKey(selectedDate);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;

  const refresh = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    let active = true;

    const fetchCalendar = async () => {
      try {
        const response = await get(config.CALENDAR.GET, { year, month });
        const days = Array.isArray(response?.result?.days)
            ? response.result.days
            : [];

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

  useEffect(() => {
    let active = true;

    const fetchTodos = async () => {
      try {
        const response = await get(config.TODOS.LIST, { date: dateKey });
        const list = Array.isArray(response?.result) ? response.result : [];

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

      refresh();
    } catch (error) {
      console.error("완료 상태 변경 실패:", error);
      alert(getErrorMessage(error, "완료 상태 변경에 실패했습니다. 다시 시도해 주세요."));
    } finally {
      setTogglingId(null);
    }
  };

  const handleLoadTodoDetail = async (todoId) => {
    try {
      const response = await get(config.TODOS.DETAIL(todoId));

      if (response?.isSuccess === false || !response?.result) {
        throw new Error("상세 조회 실패");
      }

      return response.result;
    } catch (error) {
      console.error("Todo 상세 조회 실패:", error);
      alert(getErrorMessage(error, "할 일 정보를 불러오지 못했습니다."));
      return null;
    }
  };

  const handleCreateTodo = async (todoData) => {
    try {
      const response = await post(
          config.TODOS.CREATE,
          toTodoRequestBody(todoData),
          { params: { date: dateKey } }
      );

      if (response?.isSuccess === false) {
        throw new Error("Todo 생성 실패");
      }

      refresh();
      return true;
    } catch (error) {
      console.error("Todo 생성 실패:", error);
      alert(getErrorMessage(error, "할 일 추가에 실패했습니다. 다시 시도해 주세요."));
      return false;
    }
  };

  const handleUpdateTodo = async (todoId, todoData) => {
    try {
      const response = await put(
          config.TODOS.UPDATE(todoId),
          toTodoRequestBody(todoData)
      );

      if (response?.isSuccess === false) {
        throw new Error("Todo 수정 실패");
      }

      refresh();
      return true;
    } catch (error) {
      console.error("Todo 수정 실패:", error);
      alert(getErrorMessage(error, "할 일 수정에 실패했습니다. 다시 시도해 주세요."));
      return false;
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await del(config.TODOS.DELETE(todoId, dateKey));

      if (response?.isSuccess === false) {
        throw new Error("Todo 삭제 실패");
      }

      refresh();
      return true;
    } catch (error) {
      console.error("Todo 삭제 실패:", error);
      alert(getErrorMessage(error, "할 일 삭제에 실패했습니다. 다시 시도해 주세요."));
      return false;
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
            selectedDateKey={dateKey}
            togglingId={togglingId}
            onToggleComplete={handleToggleComplete}
            onLoadTodoDetail={handleLoadTodoDetail}
            onCreateTodo={handleCreateTodo}
            onUpdateTodo={handleUpdateTodo}
            onDeleteTodo={handleDeleteTodo}
        />
      </div>
  );
};

export default MainPage;