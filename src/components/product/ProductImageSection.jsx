import React, { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { getImageUrl } from "../../utils/imageUrl";

export default function ProductImageSection({
  product,
  selectedColor,
  selectedInfo,
  infos,
  isFavourite,
  onToggleFavourite,
  onColorSelect,
}) {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Lấy ảnh chính: ưu tiên ảnh của selectedInfo, nếu không có thì dùng ảnh product
  const mainImage = selectedInfo?.image || product.image;

  // Lấy danh sách tất cả các màu có ảnh
  const allColorInfos = infos?.filter((info) => info.image) || [];

  // Lấy danh sách ảnh duy nhất theo màu
  const uniqueColorImages = allColorInfos.reduce((acc, info) => {
    if (!acc.some((item) => item.colorName === info.colorName)) {
      acc.push(info);
    }
    return acc;
  }, []);

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
      <div className="rounded-lg p-4 relative">
        {/* Loading overlay */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        <img
          src={
            mainImage && !imageError
              ? getImageUrl(mainImage)
              : "https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=No+Image"
          }
          alt={product.name}
          className={`w-full aspect-square object-cover rounded-lg transition-opacity duration-300 ${
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

      {/* Ảnh các màu khác */}
      {uniqueColorImages.length > 0 && (
        <div className="mt-4">
          <h4
            className={`text-sm font-medium mb-3 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Các màu:
          </h4>
          <div className="flex gap-3 flex-wrap pb-2">
            {uniqueColorImages.map((info, index) => (
              <div
                key={`${info.colorName}-${index}`}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer hover:border-blue-500 transition-colors ${
                  selectedColor === info.colorName
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200"
                }`}
                title={info.colorName}
                onClick={() => onColorSelect && onColorSelect(info.colorName)}
              >
                <img
                  src={getImageUrl(info.image)}
                  alt={info.colorName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=No+Img";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
