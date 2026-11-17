import React, { useEffect, useState } from "react";
import TodoModal, { getCategoryStyle } from "./TodoModal";
import { get } from "../../Request";
import config from "../../Config";
import "../../styles/Todo.css";

const Todo = ({
                todos = [],
                selectedDateKey,
                togglingId = null,
                onToggleComplete,
                onLoadTodoDetail,
                onCreateTodo,
                onUpdateTodo,
                onDeleteTodo,
              }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loadingDetailId, setLoadingDetailId] = useState(null);

  const [serverCategories, setServerCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get(config.CATEGORIES.GET);
        setServerCategories(Array.isArray(response?.result) ? response.result : []);
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (todo) => {
    if (loadingDetailId !== null) return;
    setLoadingDetailId(todo.id);

    const detail = await onLoadTodoDetail?.(todo.id);
    setLoadingDetailId(null);

    if (!detail) return;

    setEditingTodo({
      id: todo.id,
      completed: todo.completed,
      text: detail.description ?? todo.text,
      category: detail.categoryName ?? todo.category,
      routineEnabled: detail.routineEnabled === true,
      routine: detail.routineEnabled
          ? {
            startDate: detail.startDate ?? "",
            endDate: detail.endDate ?? "",
            week: detail.week ?? "",
          }
          : null,
    });
    setIsModalOpen(true);
  };

  const handleSaveTodo = async (todoData) => {
    if (editingTodo) {
      return (await onUpdateTodo?.(editingTodo.id, todoData)) === true;
    }
    return (await onCreateTodo?.(todoData)) === true;
  };

  const handleDeleteTodo = async (id) => {
    const ok = (await onDeleteTodo?.(id)) === true;
    if (ok) {
      setEditingTodo(null);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
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
                        onClick={(e) => {
                          e.stopPropagation();
                          if (togglingId === null) onToggleComplete?.(todo);
                        }}
                        style={{ cursor: togglingId === null ? "pointer" : "wait" }}
                    />

                    <div
                        className="todo-text"
                        onClick={() => handleOpenEditModal(todo)}
                        style={{
                          textDecoration: todo.completed ? "line-through" : "none",
                          opacity: todo.completed ? 0.5 : 1,
                          cursor: loadingDetailId === todo.id ? "wait" : "pointer",
                        }}
                    >
                      {todo.text}
                    </div>

                    <div className="todo-category" style={getCategoryStyle(todo.category)}>
                      {todo.category}
                    </div>
                  </div>
              ))
          )}
        </div>

        <TodoModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveTodo}
            onDelete={handleDeleteTodo}
            initialTodo={editingTodo}
            categories={serverCategories}
            defaultStartDate={selectedDateKey}
        />
      </div>
  );
};

export default Todo;