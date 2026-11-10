import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/Calendar.css";

// Date 객체를 "YYYY-MM-DD" 문자열로 변환 (remainingByDate의 키와 비교용)
const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const CustomCalendar = ({
                            initialDate,
                            onDateChange,
                            onMonthChange,
                            remainingByDate = {},
                        }) => {
    // 날짜 하나의 Todo 존재 여부, 남은 개수, 전부 완료 여부
    const getDayMeta = (date) => {
        const key = toDateKey(date);

        // 키가 없으면 Todo가 없는 날 (remaining 0과 구분)
        if (!Object.prototype.hasOwnProperty.call(remainingByDate, key)) {
            return { hasTodos: false, remaining: 0, allDone: false };
        }

        const remaining = remainingByDate[key];
        return { hasTodos: true, remaining, allDone: remaining === 0 };
    };

    return (
        <div className="calendar-container">
            <Calendar
                // 날짜 클릭 → 부모의 selectedDate 변경
                onChange={(value) =>
                    onDateChange?.(value instanceof Date ? value : value?.[0])
                }
                // 이전/다음 달 이동 → 부모의 viewDate 변경 → 캘린더 다시 조회
                onActiveStartDateChange={({ activeStartDate }) =>
                    activeStartDate && onMonthChange?.(activeStartDate)
                }
                value={initialDate}
                calendarType="gregory"
                view="month"
                prev2Label={null}
                next2Label={null}
                showNeighboringMonth={true}
                formatDay={(locale, date) => String(date.getDate())}
                // 남은 Todo가 있으면 개수, 모두 완료했으면 ★
                tileContent={({ date, view }) => {
                    if (view !== "month") return null;

                    const { hasTodos, remaining, allDone } = getDayMeta(date);
                    if (!hasTodos) return null;

                    return <div className="tile-meta">{allDone ? "★" : remaining}</div>;
                }}
                tileClassName={({ date, view }) => {
                    if (view !== "month") return "";

                    const { hasTodos, allDone } = getDayMeta(date);
                    if (!hasTodos) return "";

                    return allDone ? "tile-done" : "tile-has";
                }}
            />
        </div>
    );
};

export default CustomCalendar;