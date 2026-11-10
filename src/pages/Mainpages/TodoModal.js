import React, { useEffect, useState } from "react";
import "../../styles/TodoModal.css";
import RoutineModal from "./RoutineModal";

// 카테고리 이름별 색상 (서버 카테고리 이름 기준, 없는 이름은 기본색)
const CATEGORY_COLORS = {
  공부: "#E6F6F4",
  운동: "#FFE5E5",
  동아리: "#B6DAFF",
  일상: "#FFC8BE",
};

export const getCategoryStyle = (name) => ({
  backgroundColor: CATEGORY_COLORS[name] || "#FFF9C4",
  color: "#333",
});

const TodoModal = ({
                     isOpen,
                     onClose,
                     onSave,
                     onDelete,
                     initialTodo = null,
                     categories = [],
                   }) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [routine, setRoutine] = useState(null);

  // 서버 카테고리 중 첫 번째를 기본값으로 사용 (응답 전이면 빈 문자열)
  const defaultCategory = categories[0]?.categoryName || "";

  useEffect(() => {
    if (!isOpen) return;

    if (initialTodo) {
      setText(initialTodo.text || "");
      setCategory(initialTodo.category || defaultCategory);
      setRoutine(initialTodo.routine || null);
    } else {
      setText("");
      setCategory(defaultCategory);
      setRoutine(null);
    }
  }, [isOpen, initialTodo, defaultCategory]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = text.trim();

    if (!trimmed) return;

    const todoData = {
      id: initialTodo?.id || Date.now(),
      text: trimmed,
      category,
      completed: initialTodo?.completed || false,
      routine,
    };

    onSave(todoData);
    onClose();
  };

  const handleDelete = () => {
    if (!initialTodo) {
      onClose();
      return;
    }

    if (typeof onDelete === "function") {
      onDelete(initialTodo.id);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "todo-modal-overlay") {
      onClose();
    }
  };

  const isValid = text.trim().length > 0;

  return (
    <>
      <div className="todo-modal-overlay" onClick={handleOverlayClick}>
        <div className="todo-modal" onClick={(e) => e.stopPropagation()}>
          <div className="todo-modal-header">
            <button className="todo-modal-close-btn" onClick={onClose}>
              ‹
            </button>
            <h2>{initialTodo ? "할 일 수정하기" : "할 일 추가하기"}</h2>
          </div>

          <div className="todo-modal-body">
            <div className="todo-modal-field">
              <label>카테고리</label>

              <div className="modal-category-row">
                {categories.length === 0 ? (
                    <span>카테고리를 불러오는 중...</span>
                ) : (
                    categories.map((item) => (
                        <label key={item.categoryId} className="modal-category-item">
                      <span style={getCategoryStyle(item.categoryName)}>
                        {item.categoryName}
                      </span>
                          <input
                              type="radio"
                              name="category"
                              value={item.categoryName}
                              checked={category === item.categoryName}
                              onChange={(e) => setCategory(e.target.value)}
                          />
                        </label>
                    ))
                )}
              </div>
            </div>

            <div className="todo-modal-field">
              <label>내용</label>
              <input
                type="text"
                placeholder="내용을 입력해주세요"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div
              className="routine-link"
              onClick={() => setIsRoutineModalOpen(true)}
            >
              <span>루틴 등록하기</span>
              <span className="routine-link-arrow">›</span>
            </div>
          </div>

          <div className="todo-modal-footer">
            <button className="todo-delete-btn" onClick={handleDelete}>
              삭제
            </button>

            <button
              className={`todo-save-btn ${isValid ? "active" : ""}`}
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </div>
      </div>

      <RoutineModal
        isOpen={isRoutineModalOpen}
        initialRoutine={routine}
        onClose={() => setIsRoutineModalOpen(false)}
        onSave={(newRoutine) => {
          setRoutine(newRoutine);
          setIsRoutineModalOpen(false);
        }}
      />
    </>
  );
};

export default TodoModal;