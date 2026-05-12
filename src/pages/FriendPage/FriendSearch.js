// useMemo: 값을 계산할 때 의존성 배열의 값이 바뀔 때만 재계산 → 불필요한 연산 방지
// useState: 컴포넌트 내부에서 변하는 값(상태)을 관리
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FriendSearch.css";
import searchIcon from "../../assets/icon/search.png";

// 검색 대상이 되는 더미 유저 목록
// 실제 서비스에서는 API로 받아오는 데이터
const dummyUsers = [
    {
        id: "1",
        userId: 1,
        name: "나나",
        tag: "1234",
        bio: "안녕하세요! 저는 나나입니다.",
        profileImageUrl: null,
    },
    {
        id: "2",
        userId: 2,
        name: "얀",
        tag: "2342",
        bio: "^^",
        profileImageUrl: null,
    },
    {
        id: "3",
        userId: 3,
        name: "지말",
        tag: "1214",
        bio: "ㅎㅎ",
        profileImageUrl: null,
    },
    {
        id: "4",
        userId: 4,
        name: "코다",
        tag: "1223",
        bio: ";ㅁ;",
        profileImageUrl: null,
    },
    {
        id: "5",
        userId: 5,
        name: "딜런",
        tag: "1777",
        bio: ".",
        profileImageUrl: null,
    },
];

// FriendSearch 컴포넌트
// props로 받는 값:
//   title        - 섹션 제목 (기본값: "팔로우 요청")
//   placeholder  - 검색창 안내 문구
//   onFollow     - 팔로우 버튼 클릭 시 FriendPage에서 내려준 핸들러 함수
//   followingList - 현재 팔로우 중인 친구 목록 (이미 팔로우한 유저 구분에 사용)
function FriendSearch({
  title = "팔로우 요청",
  placeholder = "이름/태그로 검색",
  onFollow,
  followingList = [],
}) {
  const navigate = useNavigate();

  // query: 검색창에 입력한 텍스트를 저장하는 상태
  // 초기값은 빈 문자열 → 입력할 때마다 setQuery로 업데이트되어 results가 재계산됨
  const [query, setQuery] = useState("");

  // followingList 배열을 Set으로 변환하여 id 중복 확인을 빠르게 처리
  // followingList가 바뀔 때만 재계산됨
  // 예: followingList = [{id:"1"}, {id:"3"}] → followingIdSet = Set{"1", "3"}
  const followingIdSet = useMemo(() => {
    return new Set(followingList.map((x) => x.id));
  }, [followingList]);

  // query가 바뀔 때마다 dummyUsers 중 검색어에 맞는 유저를 필터링
  // query가 빈 문자열이면 빈 배열 반환 → 검색 결과 없음
  // 이름, 태그, "이름#태그" 형식 중 하나라도 포함되면 결과에 포함
  const results = useMemo(() => {
    const q = query.trim();

    if (!q) return [];

    // filter: 조건을 만족하는 유저만 추려서 새 배열로 반환
    return dummyUsers.filter((user) => {
      return (
        user.name.includes(q) ||
        user.tag.includes(q) ||
        `${user.name}#${user.tag}`.includes(q)
      );
    });
  }, [query]);

  // 검색 결과에서 유저를 클릭하면 해당 유저의 상세 페이지로 이동
  // friend.id를 URL에 포함 → /friends/1, /friends/2 등 유저마다 다른 경로
  // state로 friend 객체 전달 → FriendDetailPage에서 location.state.friend로 꺼내 씀
  const goFriendDetail = (friend) => {
    navigate(`/friends/${friend.id}`, { state: { friend } });
  };

  return (
    <section className="friend-search">
      <h2 className="friend-search__title">{title}</h2>

      <div className="friend-search__input-box">
        <span className="friend-search__icon" aria-hidden="true">
          <img
            src={searchIcon}
            alt="검색"
            className="friend-search__icon-img"
          />
        </span>

        {/* onChange: 입력값이 바뀔 때마다 query 상태를 업데이트
            → query가 바뀌면 results가 재계산되어 검색 결과 목록이 새로 렌더링됨 */}
        <input
          className="friend-search__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      {/* 검색어가 없으면 아무것도 표시 안 함
          검색어가 있고 결과가 없으면 "검색 결과가 없습니다." 표시
          결과가 있으면 유저 목록 렌더링 */}
      {query.trim() === "" ? null : results.length === 0 ? (
        <div className="friend-search__empty">검색 결과가 없습니다.</div>
      ) : (
        // results 배열을 map으로 순회하며 각 유저 항목을 렌더링
        <ul className="friend-search__list">
          {results.map((user) => {
            // followingIdSet에 이 유저의 id가 있으면 이미 팔로우 중 → 버튼 비활성화
            const isFollowing = followingIdSet.has(user.id);

            return (
              <li key={user.id} className="friend-search__item">
                {/* 유저 정보 영역 클릭 시 goFriendDetail 실행 → 상세 페이지로 이동
                    onKeyDown: 키보드 Enter/Space로도 이동 가능하게 접근성 처리 */}
                <div
                  className="friend-search__left"
                  role="button"
                  tabIndex={0}
                  onClick={() => goFriendDetail(user)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") goFriendDetail(user);
                  }}
                >
                  {/* 프로필 이미지가 있으면 <img>를, 없으면 기본 SVG 아이콘을 표시 */}
                  <div className="friend-avatar" aria-hidden="true">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt=""
                        className="friend-avatar__img"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>

                  <div className="friend-info">
                    <div className="friend-info__top">
                      <span className="friend-info__name">{user.name}</span>
                      <span className="friend-info__tag">#{user.tag}</span>
                    </div>
                    <div className="friend-info__bio">
                      {user.bio || "한 줄 소개"}
                    </div>
                  </div>
                </div>

                {/* 팔로우 버튼
                    isFollowing이 true이면 "팔로잉" 텍스트 + 비활성화(disabled)
                    isFollowing이 false이면 "팔로우" 텍스트 + 클릭 가능
                    e.stopPropagation(): 버튼 클릭이 부모 div(상세 페이지 이동)까지 전파되지 않도록 막음
                    onFollow?.(user): FriendPage에서 내려준 함수를 실행
                    → FriendPage의 followList 상태에 이 유저가 추가되어 팔로우 목록이 갱신됨 */}
                <button
                  type="button"
                  className={`friend-follow-btn ${
                    isFollowing ? "is-disabled" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFollow?.(user);
                  }}
                  disabled={isFollowing}
                >
                  {isFollowing ? "팔로잉" : "팔로우"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// 프로필 이미지가 없을 때 보여주는 기본 사용자 아이콘 SVG 컴포넌트
function UserIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default FriendSearch;
