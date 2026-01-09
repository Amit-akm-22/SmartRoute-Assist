const getBackendUrl = () => {
    // If we're on localhost, use the local backend
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "http://localhost:3001/api/v1";
    }
    return import.meta.env.VITE_API_URL || "https://smartroute-assist.onrender.com/api/v1";
};

export const BACKEND_URL = getBackendUrl();
export default BACKEND_URL;
