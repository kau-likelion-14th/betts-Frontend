import React, { useEffect, useState } from "react";
import "../../styles/TodoModal.css";
import RoutineModal, { WEEK_LABELS } from "./RoutineModal";

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

const formatShortDate = (value) => (value ? value.slice(5).replace("-", "/") : "");

const TodoModal = ({
                     isOpen,
                     onClose,
                     onSave,
                     onDelete,
                     initialTodo = null,
                     categories = [],
                     defaultStartDate = "",
                   }) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [routine, setRoutine] = useState(null);
  const [saving, setSaving] = useState(false);

  const defaultCategory = categories[0]?.categoryName || "";

  const isEditing = Boolean(initialTodo);
  const canEditRoutine = !isEditing || initialTodo?.routineEnabled === true;

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
    setSaving(false);
  }, [isOpen, initialTodo, defaultCategory]);

  if (!isOpen) return null;

  const isValid = text.trim().length > 0 && Boolean(category);

  const handleSave = async () => {
    if (!isValid || saving) return;

    setSaving(true);
    const ok = await onSave?.({
      text: text.trim(),
      category,
      routine,
    });
    setSaving(false);

    if (ok) onClose();
  };

  const handleDelete = async () => {
    if (!initialTodo) {
      onClose();
      return;
    }

    const message = initialTodo.routineEnabled
        ? "루틴 할 일은 선택한 날짜의 할 일만 삭제됩니다. 삭제할까요?"
        : "이 할 일을 삭제할까요?";

    if (!window.confirm(message)) return;

    setSaving(true);
    await onDelete?.(initialTodo.id);
    setSaving(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "todo-modal-overlay") {
      onClose();
    }
  };

  const routineSummary = routine
      ? `매주 ${WEEK_LABELS[routine.week] ?? ""} · ${formatShortDate(routine.startDate)} ~ ${formatShortDate(routine.endDate)}`
      : "";

  return (
      <>
        <div className="todo-modal-overlay" onClick={handleOverlayClick}>
          <div className="todo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="todo-modal-header">
              <button className="todo-modal-close-btn" onClick={onClose}>
                ‹
              </button>
              <h2>{isEditing ? "할 일 수정하기" : "할 일 추가하기"}</h2>
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
                  onClick={() => canEditRoutine && setIsRoutineModalOpen(true)}
                  style={{
                    cursor: canEditRoutine ? "pointer" : "not-allowed",
                    opacity: canEditRoutine ? 1 : 0.5,
                  }}
              >
              <span>
                {routine ? "루틴 수정하기" : "루틴 등록하기"}
                {routineSummary && (
                    <span style={{ marginLeft: 8, fontSize: 12, color: "#666" }}>
                    {routineSummary}
                  </span>
                )}
              </span>
                <span className="routine-link-arrow">›</span>
              </div>

              {!canEditRoutine && (
                  <p style={{ fontSize: 12, color: "#999", margin: "4px 0 0" }}>
                    일반 할 일은 루틴으로 바꿀 수 없어요.
                  </p>
              )}

              {!isEditing && routine && (
                  <button
                      type="button"
                      onClick={() => setRoutine(null)}
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        color: "#999",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                  >
                    루틴 해제
                  </button>
              )}
            </div>

            <div className="todo-modal-footer">
              <button
                  className="todo-delete-btn"
                  onClick={handleDelete}
                  disabled={saving}
              >
                {isEditing ? "삭제" : "취소"}
              </button>

              <button
                  className={`todo-save-btn ${isValid && !saving ? "active" : ""}`}
                  onClick={handleSave}
                  disabled={!isValid || saving}
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>

        <RoutineModal
            isOpen={isRoutineModalOpen}
            initialRoutine={routine}
            defaultStartDate={defaultStartDate}
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