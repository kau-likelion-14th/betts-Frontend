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
        PROFILE: (id) => `/api/follow/${id}`,
        CALENDAR: (id) => `/api/follow/${id}/calendar`,
        TODOS: (id) => `/api/follow/${id}/todos`,
    },
};

export default config;