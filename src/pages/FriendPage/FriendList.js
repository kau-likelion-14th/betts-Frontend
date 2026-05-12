// useNavigate: 버튼 클릭 등 이벤트 발생 시 특정 경로로 이동시켜주는 훅
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/icon/delete.png";
import "../../styles/FriendList.css";

// FriendList 컴포넌트
// props로 받는 값:
//   title       - 섹션 제목 (기본값: "팔로우 목록")
//   friends     - 화면에 렌더링할 친구 목록 배열 (FriendPage에서 followList 상태값을 전달받음)
//   onClickRemove - 삭제 버튼 클릭 시 FriendPage에서 내려준 핸들러 함수
//   emptyText   - 목록이 비었을 때 보여줄 문구
function FriendList(
  {
    title = "팔로우 목록",
    friends = [],
    onClickRemove,
    emptyText = "팔로우하는 친구가 없습니다.",
  }
) {
  // navigate 함수를 사용해 원하는 경로로 이동
  const navigate = useNavigate();

  // 친구 항목 클릭 시 해당 친구의 상세 페이지로 이동하는 함수
  // friend.id를 URL에 포함시켜 /friends/1, /friends/2 처럼 친구마다 다른 경로로 이동
  // state로 friend 객체를 함께 전달 → FriendDetailPage에서 location.state.friend로 꺼내 씀
  const goFriendDetail = (friend) => {
    navigate(`/friends/${friend.id}`, { state: { friend } });
  };

  return (
    <section className="friend-list">
      {/* props로 받은 title을 제목으로 표시 */}
      <h2 className="friend-list__title">{title}</h2>

      {/* friends 배열이 비어있으면 emptyText를 표시, 있으면 목록을 렌더링 */}
      {friends.length === 0 ? (
        <div className="friend-list__empty">{emptyText}</div>
      ) : (
        // friends 배열을 map으로 순회하며 각 친구마다 <li> 항목을 생성
        // key={friend.id}: React가 각 항목을 구별할 수 있도록 고유 id를 key로 지정
        <ul className="friend-list__items">
          {friends.map((friend) => (
            <li key={friend.id} className="friend-list__item">
              {/* 친구 정보 영역 클릭 시 goFriendDetail 함수 실행 → 상세 페이지로 이동 */}
              <div
                className="friend-list__left"
                role="button"
                tabIndex={0}
                onClick={() => {
                  goFriendDetail(friend);
                }}
                >

                {/* 프로필 이미지가 있으면 <img>를, 없으면 기본 SVG 아이콘(UserIcon)을 표시 */}
                <div className="friend-avatar" aria-hidden="true">
                  {friend.profileImageUrl ? (
                    <img
                      className="friend-avatar__img"
                      src={friend.profileImageUrl}
                      alt="프로필 사진"
                      />
                  ) : (
                    <UserIcon/>
                  )}
                </div>

                <div className="friend-info">
                  <div className = "friend-info__top">
                    {/* 친구 이름과 태그를 나란히 표시 */}
                    <span className="friend-info__name">{friend.name}</span>
                    <span className="friend-info__tag">#{friend.tag}</span>
                  </div>

                  {/* bio가 있으면 소개글을 표시, 없으면 "소개글이 없습니다." 표시 */}
                  {friend.bio ?(
                    <div className="friend-info__bio">{friend.bio}</div>
                  ) : (
                    <div className="friend-info__empty">소개글이 없습니다.</div>
                  )}
                </div>
              </div>

              {/* 삭제 버튼
                  e.stopPropagation(): 삭제 버튼 클릭 이벤트가 부모(친구 정보 영역)까지
                  전파되지 않도록 막음 → 상세 페이지로 이동하지 않고 삭제만 실행됨
                  onClickRemove?.(friend): FriendPage에서 내려준 함수를 실행
                  → FriendPage의 selectedFriend 상태가 현재 친구로 설정되고 모달이 열림 */}
              <button
                className="friend-remove-btn"
                type="button"
                aria-label="삭제"
                onClick={(e)=>{
                  e.stopPropagation();
                  onClickRemove?.(friend);
                }}
                >
                  <img className="friend-remove-icon" src={deleteIcon} alt="삭제 아이콘" />
                </button>
            </li>
          ))}
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

export default FriendList;
