// react-calendar: 달력 UI를 제공하는 외부 라이브러리
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
import "../../styles/Calendar.css";

// Date 객체를 "YYYY-MM-DD" 형식의 문자열로 변환하는 유틸 함수
// dummyTodosByDate의 키와 비교할 때 사용
// 예: new Date("2026-05-04") → "2026-05-04"
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1, 두 자리로 맞춤
  const d = String(date.getDate()).padStart(2, "0");       // 일도 두 자리로 맞춤
  return `${y}-${m}-${d}`;
};

// 날짜별 투두 데이터 (더미)
// 실제 서비스에서는 API로 받아오는 데이터
// 키: "YYYY-MM-DD" 형식의 날짜 문자열 / 값: 해당 날짜의 투두 배열
const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, title: "프론트 보충자료 읽기", completed: true },
    { id: 2, title: "FriendCalendar 주석 달기", completed: false },
  ],
  "2026-05-06": [
    { id: 3, title: "친구 페이지 과제 제출", completed: true },
  ],
  "2026-05-10": [
    { id: 4, title: "React 복습하기", completed: false },
    { id: 5, title: "props 정리하기", completed: false },
    { id: 6, title: "useState 정리하기", completed: true },
  ],
};

export default function FriendCalendar() {
  // selectedDate: 현재 선택된 날짜를 저장하는 상태
  // 초기값은 오늘 날짜 → 캘린더에서 날짜를 클릭하면 setSelectedDate로 업데이트됨
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 캘린더에서 날짜를 클릭하면 실행되는 핸들러
  // value가 Date 객체이면 그대로 사용, 배열(범위 선택)이면 첫 번째 날짜 사용
  // setSelectedDate로 selectedDate 상태를 업데이트 → 캘린더가 새 날짜로 리렌더링됨
  const handleDateChange = (value) => {
    const next = value instanceof Date ? value : value?.[0];
    if (!next) return;
    setSelectedDate(next);
  };

  // 특정 날짜의 투두 메타 정보를 반환하는 함수
  // 캘린더의 각 날짜 타일을 렌더링할 때 호출됨
  // 반환값: hasTodos(투두 존재 여부), remaining(미완료 수), allDone(전부 완료 여부)
  const getDayMeta = (date) => {
    const key = toDateKey(date); // Date → "YYYY-MM-DD" 변환
    const list = dummyTodosByDate[key] ?? []; // 해당 날짜의 투두 목록, 없으면 빈 배열

    if (list.length === 0) {
      return { hasTodos: false, remaining: 0, allDone: false };
    }

    // filter로 completed가 false인 항목만 추려서 미완료 개수 계산
    const remaining = list.filter((todo) => !todo.completed).length;

    return {
      hasTodos: true,
      remaining,
      allDone: remaining === 0, // 미완료가 0개면 전부 완료
    };
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange}   // 날짜 클릭 시 handleDateChange 실행
        value={selectedDate}          // 현재 선택된 날짜를 캘린더에 표시
        calendarType="gregory"        // 그레고리력(일반 달력) 사용
        view="month"                  // 월 단위로 표시
        prev2Label={null}             // 연도 이동 버튼 숨김
        next2Label={null}
        showNeighboringMonth={true}   // 이전/다음 달 날짜도 표시
        // 날짜 타일의 숫자 표시 형식 지정 (기본 형식 제거, 숫자만 표시)
        formatDay={(locale, date) => String(date.getDate())}

        // tileContent: 각 날짜 타일 안에 추가 콘텐츠를 렌더링
        // 투두가 있는 날짜에만 뱃지 표시
        // allDone이면 "★", 아니면 미완료 개수(숫자)를 표시
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const { hasTodos, remaining, allDone } = getDayMeta(date);
          if (!hasTodos) return null;

          return <div className="tile-meta">{allDone ? "★" : remaining}</div>;
        }}

        // tileClassName: 각 날짜 타일에 조건부 CSS 클래스를 추가
        // 투두가 전부 완료된 날 → "tile-done" 클래스 (CSS에서 다른 스타일 적용)
        // 투두가 있지만 미완료 항목이 있는 날 → "tile-has" 클래스
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";

          const { hasTodos, allDone } = getDayMeta(date);
          if (!hasTodos) return "";

          return allDone ? "tile-done" : "tile-has";
        }}
      />
    </div>
  );
}
