// API Configuration - Lấy từ biến môi trường .env
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to build full API URL
export const getApiUrl = (endpoint) => {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

export default API_BASE_URL;
