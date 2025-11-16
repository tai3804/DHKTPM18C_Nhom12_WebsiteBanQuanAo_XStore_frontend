import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { X, Star, ChevronLeft, Menu } from "lucide-react";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function CommentFilter({ onFilterChange, currentFilters = {} }) {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  const [selectedRatings, setSelectedRatings] = useState(
    currentFilters.ratings || []
  );
  const [hasMedia, setHasMedia] = useState(
    currentFilters.media === "with-media"
  );
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  // Rating options
  const ratingOptions = [
    { value: "", label: "Tất cả" },
    { value: "5", label: "5 sao" },
    { value: "4", label: "4 sao" },
    { value: "3", label: "3 sao" },
    { value: "2", label: "2 sao" },
    { value: "1", label: "1 sao" },
  ];

  // Media options
  const mediaOptions = [
    { value: "", label: "Tất cả" },
    { value: "with-media", label: "Có hình ảnh/video" },
    { value: "without-media", label: "Không có hình ảnh/video" },
  ];

  // Apply filters immediately when changed
  const applyFilters = () => {
    const filters = {
      ratings: selectedRatings,
      media: hasMedia ? "with-media" : "",
    };
    onFilterChange(filters);
  };

  // Handle rating checkbox change
  const handleRatingChange = (rating, checked) => {
    if (checked) {
      setSelectedRatings((prev) => [...prev, rating]);
    } else {
      setSelectedRatings((prev) => prev.filter((r) => r !== rating));
    }
  };

  // Handle media checkbox change
  const handleMediaChange = (checked) => {
    setHasMedia(checked);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [selectedRatings, hasMedia]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedRatings([]);
    setHasMedia(false);
  };

  // Count active filters
  const activeFiltersCount = [...selectedRatings, hasMedia].filter(
    Boolean
  ).length;

  return (
    <div className="flex gap-2">
      {/* Toggle Button - Small */}
      <button
        onClick={() => setIsFilterVisible(!isFilterVisible)}
        className={`h-10 w-10 flex items-center justify-center border rounded-lg transition-all ${
          isDark
            ? "border-gray-600 text-gray-300 hover:text-blue-400 hover:border-blue-400 hover:bg-gray-800"
            : "border-gray-300 text-gray-800 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50"
        }`}
        title={isFilterVisible ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
      >
        {isFilterVisible ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Filter Panel */}
      <div
        className={`transition-all duration-300 ${
          isFilterVisible ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"
        }`}
      >
        <div
          className={`rounded-lg border shadow-sm p-4 h-fit sticky top-4 transition-colors ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between pb-3 border-b transition-colors ${
              isDark ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <h3
              className={`font-bold flex items-center gap-2 transition-colors ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <svg
                className={`w-4 h-4 transition-colors ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Bộ lọc bình luận
            </h3>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                {activeFiltersCount}
              </span>
            )}
          </div>

          <div className="space-y-4 mt-4">
            {/* Rating Filter - Checkboxes */}
            <div className="space-y-2">
              <label
                className={`text-sm font-semibold transition-colors ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Đánh giá
              </label>
              <div className="space-y-2 pl-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <label
                    key={star}
                    className={`flex items-center gap-2 cursor-pointer transition-colors ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(star.toString())}
                      onChange={(e) =>
                        handleRatingChange(star.toString(), e.target.checked)
                      }
                      className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-blue-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <span className="text-sm flex items-center gap-1">
                      <span className="text-yellow-500">
                        {"★".repeat(star)}
                      </span>
                      <span className="text-gray-300">
                        {"★".repeat(5 - star)}
                      </span>
                      <span className="ml-1">({star} sao)</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Media Filter - Checkbox */}
            <div className="space-y-2">
              <label
                className={`flex items-center gap-2 cursor-pointer transition-colors ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <input
                  type="checkbox"
                  checked={hasMedia}
                  onChange={(e) => handleMediaChange(e.target.checked)}
                  className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-blue-400"
                      : "bg-white border-gray-300"
                  }`}
                />
                <span className="text-sm font-semibold">Có hình ảnh/video</span>
              </label>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div
              className={`mt-4 pt-3 border-t transition-colors ${
                isDark ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Đang lọc:
                  </span>
                  {selectedRatings.length > 0 && (
                    <span
                      className={`inline-flex items-center gap-1 border px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        isDark
                          ? "bg-gray-700 border-yellow-600 text-yellow-300"
                          : "bg-white border-yellow-300 text-yellow-700"
                      }`}
                    >
                      <Star className="h-3 w-3" />
                      {selectedRatings.length === 1
                        ? `${selectedRatings[0]} sao`
                        : `${selectedRatings.length} sao đã chọn`}
                      <button
                        onClick={() => setSelectedRatings([])}
                        className={`rounded-full p-0.5 transition-colors ${
                          isDark ? "hover:bg-gray-600" : "hover:bg-yellow-100"
                        }`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {hasMedia && (
                    <span
                      className={`inline-flex items-center gap-1 border px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        isDark
                          ? "bg-gray-700 border-green-600 text-green-300"
                          : "bg-white border-green-300 text-green-700"
                      }`}
                    >
                      Có hình ảnh/video
                      <button
                        onClick={() => setHasMedia(false)}
                        className={`rounded-full p-0.5 transition-colors ${
                          isDark ? "hover:bg-gray-600" : "hover:bg-green-100"
                        }`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
                <button
                  onClick={handleResetFilters}
                  className={`text-xs font-medium flex items-center gap-1 transition-colors ${
                    isDark
                      ? "text-red-400 hover:text-red-300"
                      : "text-red-600 hover:text-red-700"
                  }`}
                >
                  <X className="h-3 w-3" />
                  Xóa tất cả
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
