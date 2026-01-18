// src/config/api.js
const envApiUrl = import.meta.env.VITE_API_URL;

// Nếu không tìm thấy biến môi trường, hãy đặt một giá trị mặc định để tránh bị undefined
export const API_BASE_URL = envApiUrl; 

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};