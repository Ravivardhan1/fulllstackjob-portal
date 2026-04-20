const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

const buildApiUrl = (path = "") => `${API_BASE_URL}${path}`;

export { API_BASE_URL, API_ORIGIN, buildApiUrl };
