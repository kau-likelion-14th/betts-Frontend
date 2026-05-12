import React, { useEffect, useState } from "react";
import "../../styles/TodoModal.css";
import RoutineModal from "./RoutineModal";

const TodoModal = ({ isOpen, onClose, onSave, onDelete, initialTodo = null }) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("study");
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [routine, setRoutine] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    if (initialTodo) {
      setText(initialTodo.text || "");
      setCategory(initialTodo.category || "study");
      setRoutine(initialTodo.routine || null);
    } else {
      setText("");
      setCategory("study");
      setRoutine(null);
    }
  }, [isOpen, initialTodo]);

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
                <label className="modal-category-item study">
                  <span>공부</span>
                  <input
                    type="radio"
                    name="category"
                    value="study"
                    checked={category === "study"}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </label>

                <label className="modal-category-item exercise">
                  <span>운동</span>
                  <input
                    type="radio"
                    name="category"
                    value="exercise"
                    checked={category === "exercise"}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </label>

                <label className="modal-category-item club">
                  <span>동아리</span>
                  <input
                    type="radio"
                    name="category"
                    value="club"
                    checked={category === "club"}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </label>
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