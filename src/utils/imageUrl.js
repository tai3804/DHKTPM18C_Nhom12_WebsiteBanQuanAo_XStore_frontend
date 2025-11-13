// utils/imageUrl.js
import { API_BASE_URL } from "../config/api";

/**
 * ✅ Build full image URL with proper encoding
 * @param {string} imagePath - Relative path from backend (e.g., "/uploads/products/file.png")
 * @returns {string} - Full URL (e.g., "http://localhost:8080/uploads/products/file.png")
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return null;
  }

  // If already has protocol, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Combine API_BASE_URL with image path
  const fullUrl = `${API_BASE_URL}${imagePath}`;
  
  return fullUrl;
};

/**
 * ✅ URL encode path components to handle special characters and spaces
 * @param {string} imagePath - Relative path from backend
 * @returns {string} - URL encoded path
 */
export const getImageUrlEncoded = (imagePath) => {
  if (!imagePath) {
    return null;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Split path, encode each part, then rejoin
  // Example: "/uploads/products/file name.jpg" → "/uploads/products/file%20name.jpg"
  const parts = imagePath.split("/");
  const encodedParts = parts.map((part) => encodeURIComponent(part));
  const encodedPath = encodedParts.join("/");

  const fullUrl = `${API_BASE_URL}${encodedPath}`;
  
  return fullUrl;
};

/**
 * ✅ Build image URL with fallback
 * @param {string} imagePath - Relative path from backend
 * @param {string} fallback - Fallback image URL or path
 * @returns {string} - Full URL or fallback
 */
export const getImageUrlOrFallback = (imagePath, fallback = "/placeholder-image.jpg") => {
  return imagePath ? getImageUrl(imagePath) : fallback;
};
