// useMemo: 의존성 값이 바뀔 때만 재계산 / useState: 상태 관리
import React, { useMemo, useState } from "react";
// useLocation: 이전 페이지에서 전달된 state(친구 정보 등)를 꺼낼 때 사용
// useNavigate: 뒤로가기 등 페이지 이동에 사용
import { useLocation, useNavigate } from "react-router-dom";

import FriendCalendar from "./FriendCalendar";
import FriendTodo from "./FriendTodo.js";

import "../../styles/FriendDetailPage.css";

// 카테고리별 배경색/글자색 스타일 정의
// FriendTodo에 props로 전달되어 투두 카테고리 태그 스타일에 사용됨
const Categories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

// Date 객체를 "YYYY-MM-DD" 형식의 문자열로 변환
// dummyTodosByDate의 키와 비교할 때 사용
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// FriendList 또는 FriendSearch에서 navigate로 넘어올 때 state가 없을 경우 사용할 더미 친구 데이터
const dummyFriend = {
  followId: "1",
  name: "나나",
  tag: "1234",
  bio: "안녕하세요! 저는 나나입니다.",
  profileImage: null,
};

// 친구의 저장된 노래 더미 데이터
const dummySavedSongs = [
  {
    id: 1,
    title: "Ditto",
    artist: "NewJeans",
    imageUrl: null,
  },
];

// 날짜별 투두 더미 데이터
// 키: "YYYY-MM-DD" 형식 / 값: 해당 날짜의 투두 배열
const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, text: "프론트 보충자료 읽기", category: "공부", completed: true },
    { id: 2, text: "FriendDetailPage 주석 달기", category: "공부", completed: false },
  ],
  "2026-05-06": [
    { id: 3, text: "친구 페이지 과제 제출", category: "동아리", completed: true },
  ],
  "2026-05-10": [
    { id: 4, text: "React 복습하기", category: "공부", completed: false },
    { id: 5, text: "동아리 회의", category: "동아리", completed: false },
    { id: 6, text: "산책하기", category: "일상", completed: true },
  ],
};

// 날짜별 미완료 투두 수 더미 데이터 (캘린더 뱃지 표시용)
const dummyRemainingByDate = {
  "2026-05-04": { hasTodo: true, remaining: 1 },
  "2026-05-06": { hasTodo: true, remaining: 0 },
  "2026-05-10": { hasTodo: true, remaining: 2 },
};

function FriendDetailPage() {
  const navigate = useNavigate();

  // useLocation으로 이전 페이지(FriendList, FriendSearch)에서 전달한 state를 꺼냄
  // navigate(`/friends/${friend.id}`, { state: { friend } }) 로 전달된 값
  const location = useLocation();

  // state에 friend 객체가 있으면 사용, 없으면 더미 데이터 사용
  const passedFriend = location.state?.friend ?? null;

  // friend 상태: 화면에 표시할 친구 정보
  // savedSongs 상태: 친구의 저장 노래 목록
  const [friend] = useState(passedFriend ?? dummyFriend);
  const [savedSongs] = useState(dummySavedSongs);

  // selectedDate: 캘린더에서 선택한 날짜 → 해당 날짜의 투두를 todos에 반영
  // viewDate: 현재 캘린더에 보이는 월 (월 이동 시 업데이트)
  const [selectedDate, setSelectedDate] = useState(new Date("2026-05-04"));
  const [viewDate, setViewDate] = useState(new Date("2026-05-04"));

  const [todosByDate] = useState(dummyTodosByDate);
  const [remainingByDate] = useState(dummyRemainingByDate);

  // savedSongs 배열이 바뀔 때만 재계산
  // 배열의 첫 번째 곡을 최신 곡으로 표시 (없으면 null)
  const latestSong = useMemo(() => {
    if (!Array.isArray(savedSongs) || savedSongs.length === 0) return null;
    return savedSongs[0];
  }, [savedSongs]);

  // selectedDate가 바뀔 때마다 해당 날짜의 투두 목록을 계산
  // toDateKey로 날짜를 문자열로 변환 후 todosByDate에서 조회
  // 해당 날짜에 투두가 없으면 빈 배열([]) 반환 → FriendTodo에 빈 목록이 전달되어 안내 문구 표시
  const todos = useMemo(() => {
    const key = toDateKey(selectedDate);
    return todosByDate[key] ?? [];
  }, [selectedDate, todosByDate]);

  return (
    <div className="friend-detail-page">
      <div className="friend-detail-page__inner">
        {/* 상단 영역: 뒤로가기 버튼, 친구 프로필, 저장된 노래 */}
        <div className="friend-detail-page__top">
          {/* 뒤로가기 버튼: navigate(-1)로 브라우저 히스토리에서 이전 페이지로 이동 */}
          <button
            type="button"
            className="friend-detail-page__back"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>

          {/* 친구 프로필 영역 */}
          <div className="friend-detail-page__profile">
            <div className="friend-detail-page__avatar" aria-hidden="true">
              {/* 프로필 이미지가 있으면 <img>를, 없으면 기본 SVG 아이콘(UserIcon) 표시 */}
              {friend?.profileImage ? (
                <img
                  src={friend.profileImage}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <UserIcon />
              )}
            </div>

            <div className="friend-detail-page__profile-info">
              <div className="friend-detail-page__name-line">
                {/* friend 상태의 name 표시, 없으면 공백 */}
                <span className="friend-detail-page__name">
                  {friend?.name || " "}
                </span>
              </div>
              {/* friend 상태의 bio 표시, 없으면 기본 문구 */}
              <div className="friend-detail-page__bio">
                {friend?.bio || "한 줄 소개"}
              </div>
            </div>
          </div>

          {/* 저장된 노래 표시 영역
              latestSong이 있으면 노래 정보를, 없으면 안내 문구 표시 */}
          <div className="friend-detail-page__songs-inline">
            {latestSong ? (
              <div className="friend-detail-page__song-inline-item">
                <div className="friend-detail-page__song-inline-cover">
                  {/* 앨범 이미지가 있으면 표시, 없으면 빈 영역(회색 박스) */}
                  {latestSong?.imageUrl ? (
                    <img
                      src={latestSong.imageUrl}
                      alt={latestSong.title || "album"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) : null}
                </div>

                <div className="friend-detail-page__song-inline-info">
                  <div className="friend-detail-page__song-inline-title">
                    {latestSong?.title || "제목 없음"}
                  </div>
                  <div className="friend-detail-page__song-inline-artist">
                    {latestSong?.artist || "아티스트 정보 없음"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="friend-detail-page__songs-inline-empty">
                저장한 곡이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 본문 그리드: 캘린더(왼쪽) + 투두 목록(오른쪽) */}
        <div className="friend-detail-page__grid">
          <div className="friend-detail-page__calendar">
            {/* FriendCalendar에 날짜 변경 핸들러와 투두 데이터를 props로 전달
                onDateChange: 캘린더에서 날짜 클릭 시 selectedDate 상태 업데이트
                → selectedDate가 바뀌면 todos가 재계산되어 FriendTodo 목록이 갱신됨
                onMonthChange: 월 이동 시 viewDate 상태 업데이트 */}
            <FriendCalendar
              initialDate={selectedDate}
              onDateChange={(date) => date && setSelectedDate(date)}
              onMonthChange={(date) => {
                if (!date) return;
                setViewDate(date);
              }}
              todosByDate={todosByDate}
              remainingByDate={remainingByDate}
            />
          </div>

          <div className="friend-detail-page__todo">
            {/* FriendTodo에 선택된 날짜의 투두 목록과 카테고리 스타일을 props로 전달
                todos: selectedDate에 해당하는 투두 배열 (캘린더 날짜 클릭 시 업데이트)
                categories: 카테고리 태그의 색상 스타일 객체 */}
            <FriendTodo
              title="To do List"
              todos={todos}
              categories={Categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 프로필 이미지가 없을 때 보여주는 기본 사용자 아이콘 SVG 컴포넌트
function UserIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default FriendDetailPage;
