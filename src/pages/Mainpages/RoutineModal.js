import React, { useEffect, useState } from "react";
import "../../styles/RoutineModal.css";

const DAYS = [
  { key: "mon", label: "월" },
  { key: "tue", label: "화" },
  { key: "wed", label: "수" },
  { key: "thu", label: "목" },
  { key: "fri", label: "금" },
  { key: "sat", label: "토" },
  { key: "sun", label: "일" },
];

const RoutineModal = ({
  isOpen,
  onClose,
  onSave,
  initialRoutine = null,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repeatDays, setRepeatDays] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialRoutine) {
      setStartDate(initialRoutine.startDate || "");
      setEndDate(initialRoutine.endDate || "");
      setRepeatDays(initialRoutine.repeatDays || []);
    } else {
      setStartDate("");
      setEndDate("");
      setRepeatDays([]);
    }
  }, [isOpen, initialRoutine]);

  if (!isOpen) return null;

  const toggleDay = (dayKey) => {
    setRepeatDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter((day) => day !== dayKey)
        : [...prev, dayKey]
    );
  };

  const handleSave = () => {
    const routineData = {
      startDate,
      endDate,
      repeatDays,
    };

    onSave(routineData);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "routine-modal-overlay") {
      onClose();
    }
  };

  return (
    <div className="routine-modal-overlay" onClick={handleOverlayClick}>
      <div className="routine-modal">
        <div className="routine-modal-header">
          <button className="routine-back-btn" onClick={onClose}>
            ‹
          </button>
          <h2>루틴 등록하기</h2>
        </div>

        <div className="routine-modal-body">
          <div className="routine-section">
            <label className="routine-label">시작 날짜</label>
            <div className="routine-date-row">
              <input
                type="date"
                className="routine-date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="routine-date-empty">
                {startDate ? "" : "없음"}
              </span>
            </div>
          </div>

          <div className="routine-section">
            <label className="routine-label">종료 날짜</label>
            <div className="routine-date-row">
              <input
                type="date"
                className="routine-date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <span className="routine-date-empty">
                {endDate ? "" : "없음"}
              </span>
            </div>
          </div>

          <div className="routine-section">
            <label className="routine-label">반복</label>

            <div className="routine-repeat-row">
              {DAYS.map((day) => {
                const selected = repeatDays.includes(day.key);

                return (
                  <label
                    key={day.key}
                    className={`routine-day-item ${selected ? "selected" : ""}`}
                  >
                    <span>{day.label}</span>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleDay(day.key)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="routine-modal-footer">
          <button className="routine-cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="routine-save-btn" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutineModal;