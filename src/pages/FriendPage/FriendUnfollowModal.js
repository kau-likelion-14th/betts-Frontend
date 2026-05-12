// useEffect: 컴포넌트가 렌더링된 후 또는 특정 값이 바뀔 때 실행되는 훅
import React, { useEffect } from "react";
import "../../styles/FriendUnfollowModal.css";

// FriendUnfollowModal 컴포넌트
// props로 받는 값:
//   isOpen    - 모달이 열려있는지 여부 (true/false) → FriendPage의 isModalOpen 상태값
//   friend    - 삭제 대상 친구 객체 → FriendPage의 selectedFriend 상태값
//   onConfirm - "예" 버튼 클릭 시 실행할 함수 → FriendPage의 handleConfirmRemove
//   onClose   - "아니오" 버튼 또는 바깥 클릭 시 실행할 함수 → FriendPage의 handleCloseModal
function FriendUnfollowModal({ isOpen, friend, onConfirm, onClose }) {

  // isOpen이나 onClose가 바뀔 때마다 실행
  // 모달이 열린 상태(isOpen === true)에서만 키보드 이벤트 리스너를 등록
  // Escape 키를 누르면 onClose 실행 → FriendPage의 isModalOpen이 false로 바뀌어 모달이 닫힘
  useEffect(() => {
    if (!isOpen) return; // 모달이 닫혀있으면 리스너 등록 안 함

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    // 문서 전체에 keydown 이벤트 리스너 등록
    document.addEventListener("keydown", handleKeyDown);

    // cleanup 함수: 모달이 닫히거나 컴포넌트가 언마운트될 때 리스너를 제거
    // 제거하지 않으면 리스너가 계속 쌓여 메모리 누수가 발생할 수 있음
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // isOpen이 false이면 아무것도 렌더링하지 않음 → 모달이 화면에서 사라짐
  if (!isOpen) return null;

  // friend 객체에서 이름과 태그를 꺼냄
  // friend가 null일 경우를 대비해 옵셔널 체이닝(??) 사용
  const displayName = friend?.name ?? "";
  const displayTag = friend?.tag ? `#${friend.tag}` : "";

  // 오버레이(배경) 클릭 시 모달 닫기
  // e.target === e.currentTarget: 오버레이 자체를 클릭했을 때만 실행
  // 모달 내부 콘텐츠를 클릭하면 실행되지 않음
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    // 오버레이 클릭 시 handleOverlayClick 실행 → 모달 닫힘
    <div className="friend-unfollow-modal__overlay" onClick={handleOverlayClick}>
      <div
        className="friend-unfollow-modal__content"
        role="dialog"
        aria-modal="true"
      >
        {/* 삭제 대상 친구의 이름과 태그를 보여주는 확인 메시지 */}
        <p className="friend-unfollow-modal__text">
          <span className="friend-unfollow-modal__name">{displayName}</span>{" "}
          <span className="friend-unfollow-modal__tag">{displayTag}</span>
          님을 팔로우 목록에서
          <br />
          삭제하시겠습니까?
        </p>

        <div className="friend-unfollow-modal__actions">
          {/* "예" 클릭 시 onConfirm 실행 → FriendPage의 handleConfirmRemove 호출
              → followList에서 selectedFriend를 제거하여 팔로우 목록이 갱신되고 모달이 닫힘 */}
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--yes"
            onClick={onConfirm}
          >
            예
          </button>

          {/* "아니오" 클릭 시 onClose 실행 → FriendPage의 handleCloseModal 호출
              → isModalOpen이 false가 되어 모달이 닫히고 selectedFriend가 초기화됨 */}
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--no"
            onClick={onClose}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendUnfollowModal;
