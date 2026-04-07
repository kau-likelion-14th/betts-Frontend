import React, { useMemo, useState } from "react";
import TodoModal from "./TodoModal";
import "../../styles/Todo.css";

const Todo = ({ selectedDate, todosByDate, setTodosByDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const dateKey = useMemo(() => {
    return selectedDate.toISOString().split("T")[0];
  }, [selectedDate]);

  const todos = todosByDate[dateKey] || [];

  const handleOpenAddModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSaveTodo = (todoData) => {
    const currentTodos = todosByDate[dateKey] || [];

    const exists = currentTodos.some((todo) => todo.id === todoData.id);

    let updatedTodos;

    if (exists) {
      updatedTodos = currentTodos.map((todo) =>
        todo.id === todoData.id ? todoData : todo
      );
    } else {
      updatedTodos = [...currentTodos, todoData];
    }

    setTodosByDate({
      ...todosByDate,
      [dateKey]: updatedTodos,
    });
  };

  const handleToggleCheck = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    setTodosByDate({
      ...todosByDate,
      [dateKey]: updatedTodos,
    });
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    setTodosByDate({
      ...todosByDate,
      [dateKey]: updatedTodos,
    });

    setEditingTodo(null);
    setIsModalOpen(false);
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "study":
        return "공부";
      case "exercise":
        return "운동";
      case "club":
        return "동아리";
      default:
        return category;
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <div className="todo-title">To do List</div>
        <div className="todo-header-btns">
          <span onClick={handleOpenAddModal}>＋</span>
        </div>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="todo-empty"> </div>
        ) : (
          todos.map((todo) => (
            <div className="todo-item" key={todo.id}>
              <div
                className={`checkbox ${todo.completed ? "checked" : ""}`}
                onClick={() => handleToggleCheck(todo.id)}
              />

              <div
                className="todo-text"
                onClick={() => handleOpenEditModal(todo)}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  opacity: todo.completed ? 0.5 : 1,
                  cursor: "pointer",
                }}
              >
                {todo.text}
              </div>

              <div className={`todo-category cat-${todo.category}`}>
                {getCategoryLabel(todo.category)}
              </div>
            </div>
          ))
        )}
      </div>

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTodo}
        onDelete={handleDeleteTodo}
        initialTodo={editingTodo}
      />
    </div>
  );
};

export default Todo;