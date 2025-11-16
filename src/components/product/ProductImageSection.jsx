import React, { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { getImageUrl } from "../../utils/imageUrl";

export default function ProductImageSection({
  product,
  isFavourite,
  onToggleFavourite,
}) {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="space-y-4">
      {/* Ảnh chính */}
      <div
        className={`rounded-lg p-4 shadow-sm relative ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Loading overlay */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        <img
          src={
            product.image && !imageError
              ? getImageUrl(product.image)
              : "https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=No+Image"
          }
          alt={product.name}
          className={`w-full h-96 object-cover rounded-lg transition-opacity duration-300 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Favourite Heart Icon */}
        <button
          onClick={onToggleFavourite}
          className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            isFavourite
              ? "bg-red-500 text-white hover:bg-red-600"
              : isDark
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          title={isFavourite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart
            className="h-6 w-6"
            fill={isFavourite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
          />
        </button>
      </div>
    </div>
  );
}
