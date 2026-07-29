import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true,
});

// Add request interceptor to attach authentication token
api.interceptors.request.use(
    (config) => {
        const auth = localStorage.getItem("auth");
        if (auth) {
            try {
                const authData = JSON.parse(auth);
                // Try different possible token key names
                const rawToken = authData.jwtToken || authData.token || authData.accessToken || authData;
                const token = typeof rawToken === "string" && rawToken.includes("=")
                    ? rawToken.split(";")[0].split("=").pop()
                    : rawToken;
                
                if (token && typeof token === "string") {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                console.error("Error parsing auth from localStorage:", e);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
