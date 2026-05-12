import React from "react";

import "../../styles/Todo.css";
import "../../styles/FriendTodo.css";

// 표시할 투두 더미 데이터
// 실제 서비스에서는 API 또는 상위 컴포넌트에서 props로 전달받는 데이터
const dummyTodos = [
  { id: 1, text: "프론트 보충자료 읽기", category: "공부", completed: true },
  { id: 2, text: "FriendTodo 구현하기", category: "공부", completed: false },
  { id: 3, text: "동아리 회의", category: "동아리", completed: false },
];

// 카테고리별 배경색/글자색 스타일 정의
// todo-category 태그의 style 속성에 직접 적용됨
const dummyCategories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

// FriendTodo 컴포넌트
// props로 받는 값:
//   title - 섹션 제목 (기본값: "To do List")
const FriendTodo = ({ title = "To do List" }) => {
  // 더미 데이터를 그대로 사용 (추후 props로 교체 가능)
  const todos = dummyTodos;
  const categories = dummyCategories;

  return (
    <div className="friend-todo">
      <div className="todo-container">
        <div className="todo-header">
          {/* props로 받은 title을 제목으로 표시 */}
          <div className="todo-title">{title}</div>
        </div>

        <div className="todo-list">
          {/* todos 배열이 비어있으면 안내 문구 표시
              비어있지 않으면 map으로 순회하며 각 투두 항목을 렌더링 */}
          {todos.length === 0 ? (
            <div className="friend-todo__empty">등록된 투두가 없습니다.</div>
          ) : (
            // map: todos 배열의 각 요소(t)를 하나씩 꺼내 <div>로 변환
            // key={t.id}: React가 목록의 각 항목을 구별할 수 있도록 고유값 지정
            todos.map((t) => (
              // t.completed가 true이면 "done" 클래스 추가 → CSS에서 취소선 등 스타일 적용
              <div key={t.id} className={`todo-item ${t.completed ? "done" : ""}`}>
                {/* t.completed가 true이면 "checked" 클래스 추가 → 체크박스 채워진 스타일 */}
                <div className={`checkbox ${t.completed ? "checked" : ""}`} />
                <div className="todo-text">{t.text}</div>
                {/* categories 객체에서 t.category 키로 스타일 값을 꺼내 인라인 스타일로 적용
                    해당 카테고리가 없으면 undefined → 기본 스타일 유지 */}
                <div
                  className="todo-category"
                  style={categories[t.category] ?? undefined}
                >
                  {t.category}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendTodo;
