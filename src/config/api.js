// API Configuration - Lấy từ biến môi trường .env
const envApiUrl = import.meta.env.VITE_API_URL;

// Fallback to localhost if env variable is not set
export const API_BASE_URL = envApiUrl;

// Debug log
console.log("🔍 Environment VITE_API_URL:", envApiUrl);
console.log("🔍 Using API_BASE_URL:", API_BASE_URL);

// export const API_BASE_URL = "https://x-store-6in2.onrender.com";

// Helper function to build full API URL
export const getApiUrl = (endpoint) => {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

export default API_BASE_URL;
