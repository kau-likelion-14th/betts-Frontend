import Api from "./Api";

// 응답이 JSON인지 확인합니다.
// proxy 설정이 잘못되면 서버 대신 React의 index.html이 와서 이상한 에러가 나는데,
// 그런 경우를 여기서 바로 알아챌 수 있습니다.
const validateContentType = (response) => {
    const contentType = response?.headers?.["content-type"] || "";
    if (!contentType.includes("application/json")) {
        throw new Error(`JSON 응답이 아닙니다: ${contentType || "알 수 없음"}`);
    }
};

// GET
export const get = async (endpoint, params = {}, options = {}) => {
    const response = await Api.get(endpoint, { params, ...options });
    validateContentType(response);
    return response.data;
};

// POST (JSON)
export const post = async (endpoint, data, options = {}) => {
    const response = await Api.post(endpoint, data, options);
    validateContentType(response);
    return response.data;
};

// PUT (JSON)
export const put = async (endpoint, data = {}, options = {}) => {
    const response = await Api.put(endpoint, data, options);
    validateContentType(response);
    return response.data;
};

// DELETE
export const del = async (endpoint, options = {}) => {
    const response = await Api.delete(endpoint, options);
    validateContentType(response);
    return response.data;
};

// PATCH (일반 JSON PATCH)
export const patch = async (endpoint, data = {}, options = {}) => {
    const response = await Api.patch(endpoint, data, options);
    validateContentType(response);
    return response.data;
};

// 이미지 + JSON을 함께 보내는 multipart 요청
export const uploadImageWithJson = async (
    endpoint,
    imageFile,
    jsonData,
    {
        imageField = "coverImage",
        jsonField = "readingLog",
        method = "post",
        ...options
    } = {}
) => {
    const formData = new FormData();
    if (imageFile) formData.append(imageField, imageFile);
    formData.append(jsonField, JSON.stringify(jsonData));

    const response = await Api.request({
        url: endpoint,
        method, // "post" | "put" | "patch"
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        ...options,
    });

    validateContentType(response);
    return response.data;
};

// 프로필(소개, 노래, 이미지) multipart 업로드
export const uploadProfile = async (
    endpoint,
    { intro, song, imageFile },
    {
        introField = "intro",
        songField = "song",
        imageField = "image",
        method = "put",
        ...options
    } = {}
) => {
    const formData = new FormData();

    if (intro !== undefined) formData.append(introField, intro);
    if (song !== undefined) formData.append(songField, song);

    if (imageFile) {
        // 1. 실제 파일이 있으면 파일을 담음
        formData.append(imageField, imageFile);
    } else {
        // 2. 파일이 없으면(null), 빈 파일 객체를 만들어 보냄
        formData.append(imageField, new Blob([]), "empty.png");
    }

    const response = await Api.request({
        url: endpoint,
        method,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        ...options,
    });

    validateContentType(response);
    return response.data;
};
