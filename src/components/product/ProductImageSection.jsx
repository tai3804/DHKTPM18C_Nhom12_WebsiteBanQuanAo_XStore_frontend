import React from "react";
import { Heart } from "lucide-react";
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

  return (
    <div className="space-y-4">
      {/* Ảnh chính */}
      <div
        className={`rounded-lg p-4 shadow-sm relative ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <img
          src={
            product.image
              ? getImageUrl(product.image)
              : "/placeholder-image.jpg"
          }
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
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
