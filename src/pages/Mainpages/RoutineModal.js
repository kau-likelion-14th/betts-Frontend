import React, { useEffect, useState } from "react";
import "../../styles/RoutineModal.css";

const DAYS = [
  { key: "MON", label: "월" },
  { key: "TUE", label: "화" },
  { key: "WED", label: "수" },
  { key: "THU", label: "목" },
  { key: "FRI", label: "금" },
  { key: "SAT", label: "토" },
  { key: "SUN", label: "일" },
];

export const WEEK_LABELS = DAYS.reduce((acc, day) => {
  acc[day.key] = day.label;
  return acc;
}, {});

const RoutineModal = ({
                        isOpen,
                        onClose,
                        onSave,
                        initialRoutine = null,
                        defaultStartDate = "",
                      }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [week, setWeek] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (initialRoutine) {
      setStartDate(initialRoutine.startDate || defaultStartDate);
      setEndDate(initialRoutine.endDate || "");
      setWeek(initialRoutine.week || "");
    } else {
      setStartDate(defaultStartDate);
      setEndDate("");
      setWeek("");
    }
    setError("");
  }, [isOpen, initialRoutine, defaultStartDate]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!startDate || !endDate) {
      setError("시작 날짜와 종료 날짜를 모두 선택해 주세요.");
      return;
    }
    if (startDate > endDate) {
      setError("종료 날짜는 시작 날짜보다 같거나 늦어야 해요.");
      return;
    }
    if (!week) {
      setError("반복할 요일을 하나 선택해 주세요.");
      return;
    }

    onSave({ startDate, endDate, week });
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
                    min={startDate || undefined}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <span className="routine-date-empty">
                {endDate ? "" : "없음"}
              </span>
              </div>
            </div>

            <div className="routine-section">
              <label className="routine-label">반복 (요일 하나)</label>

              <div className="routine-repeat-row">
                {DAYS.map((day) => {
                  const selected = week === day.key;

                  return (
                      <label
                          key={day.key}
                          className={`routine-day-item ${selected ? "selected" : ""}`}
                      >
                        <span>{day.label}</span>
                        <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => setWeek(selected ? "" : day.key)}
                        />
                      </label>
                  );
                })}
              </div>
            </div>

            {error && (
                <p role="alert" style={{ color: "#e5484d", fontSize: 13, marginTop: 8 }}>
                  {error}
                </p>
            )}
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