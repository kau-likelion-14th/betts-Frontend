import React, { useEffect, useState } from "react";
import TodoModal, { getCategoryStyle } from "./TodoModal";
import { get } from "../../Request";
import config from "../../Config";
import "../../styles/Todo.css";

const Todo = ({ todos = [], onToggleComplete, togglingId = null }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // 서버에서 받은 카테고리 목록 ([{ categoryId, categoryName }])
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

  const handleOpenEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  // Todo 추가·수정·삭제 API는 이번 과제 범위가 아니라서 아직 서버에 저장하지 않습니다.
  const handleSaveTodo = (todoData) => {
    console.info("Todo 저장은 다음 과제에서 API와 연결합니다.", todoData);
  };

  const handleDeleteTodo = (id) => {
    console.info("Todo 삭제는 다음 과제에서 API와 연결합니다.", id);
    setEditingTodo(null);
    setIsModalOpen(false);
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
                          // 체크박스 클릭이 수정 모달 열기로 번지지 않게 막습니다.
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
                          cursor: "pointer",
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
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTodo}
            onDelete={handleDeleteTodo}
            initialTodo={editingTodo}
            categories={serverCategories}
        />
      </div>
  );
};

export default Todo;