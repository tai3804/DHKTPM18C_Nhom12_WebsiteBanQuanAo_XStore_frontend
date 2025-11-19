// API Configuration - Lấy từ biến môi trường .env
// export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const API_BASE_URL = "https://x-store-6in2.onrender.com";

// Helper function to build full API URL
export const getApiUrl = (endpoint) => {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

export default API_BASE_URL;
