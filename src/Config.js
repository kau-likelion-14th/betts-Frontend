const config = {
    API_URL: "",

    AUTH: {
        KAKAO: "/api/auth/kakao",
        REISSUE: "/api/auth/reissue",
        LOGOUT: "/api/auth/logout",
        WITHDRAW: "/api/auth/withdraw",
    },

    FOLLOW: {
        FOLLOWINGS: "/api/follow/followings",
        DELETE: "/api/follow",
        SEARCH: "/api/follow/search",
        CREATE: "/api/follow",
        // 친구 상세 페이지
        PROFILE: (id) => `/api/follow/${id}`,
        CALENDAR: (id) => `/api/follow/${id}/calendar`,
        TODOS: (id) => `/api/follow/${id}/todos`,
    },

    PROFILE: {
        GET: "/api/profile",
        PUT: "/api/profile",
        DELETE: "/api/profile",
        INTRO: "/api/profile/intro",
    },

    YOUTUBE: {
        SEARCH: "/api/youtube/search",
        SAVE: "/api/youtube/save",
        ME: "/api/youtube/me",
        DELETE: (songId) => `/api/youtube/save/${songId}`,
    },
};

export default config;