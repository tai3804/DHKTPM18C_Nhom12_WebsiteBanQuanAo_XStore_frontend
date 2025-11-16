import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { X, ChevronDown, ChevronUp, ChevronLeft, Menu } from "lucide-react";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function ProductFilter({
  productTypes = [],
  onFilterChange,
  currentFilters = {},
  children,
}) {
  const themeMode = useSelector(selectThemeMode);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [selectedType, setSelectedType] = useState(currentFilters.type || "");
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice || "",
    max: currentFilters.maxPrice || "",
  });
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || "");
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [showCategoryFilter, setShowCategoryFilter] = useState(true);

  // Price ranges
  const priceRanges = [
    { label: "Dưới 100,000đ", min: 0, max: 100000 },
    { label: "100,000đ - 300,000đ", min: 100000, max: 300000 },
    { label: "300,000đ - 500,000đ", min: 300000, max: 500000 },
    { label: "500,000đ - 1,000,000đ", min: 500000, max: 1000000 },
    { label: "Trên 1,000,000đ", min: 1000000, max: null },
  ];

  // Sort options
  const sortOptions = [
    { value: "", label: "Mặc định" },
    { value: "price-asc", label: "Giá: Thấp đến Cao" },
    { value: "price-desc", label: "Giá: Cao đến Thấp" },
    { value: "name-asc", label: "Tên: A-Z" },
    { value: "name-desc", label: "Tên: Z-A" },
    { value: "newest", label: "Mới nhất" },
  ];

  // Apply filters immediately when changed
  const applyFilters = () => {
    const filters = {
      type: selectedType,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sortBy,
    };
    onFilterChange(filters);
  };

  // Handle category change
  const handleCategoryChange = (value) => {
    setSelectedType(value);
  };

  // Handle price range change
  const handlePriceChange = (field, value) => {
    setPriceRange({ ...priceRange, [field]: value });
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [selectedType, priceRange, sortBy]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedType("");
    setPriceRange({ min: "", max: "" });
    setSortBy("");
  };

  // Quick price filter
  const handleQuickPriceFilter = (range) => {
    const newPriceRange = { min: range.min, max: range.max || "" };
    setPriceRange(newPriceRange);
  };

  // Count active filters
  const activeFiltersCount = [
    selectedType,
    priceRange.min || priceRange.max,
    sortBy,
  ].filter(Boolean).length;

  return (
    <div className="flex gap-6">
      {/* Filter Sidebar - Left */}
      <div className="flex shrink-0">
        {/* Toggle Button - Small */}
        <button
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className={`h-10 w-10 flex items-center justify-center border rounded-lg transition-all ${
            themeMode === "dark"
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
          className={`transition-all duration-300 ml-2 ${
            isFilterVisible
              ? "w-64 opacity-100"
              : "w-0 opacity-0 overflow-hidden"
          }`}
        >
          <div
            className={`rounded-lg border shadow-sm p-4 space-y-4 h-fit sticky top-4 transition-colors ${
              themeMode === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between pb-3 border-b transition-colors ${
                themeMode === "dark" ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <h3
                className={`font-bold flex items-center gap-2 transition-colors ${
                  themeMode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <svg
                  className={`w-4 h-4 transition-colors ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-700"
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
                Bộ lọc
              </h3>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {activeFiltersCount}
                </span>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              >
                <label
                  className={`text-sm font-semibold cursor-pointer transition-colors ${
                    themeMode === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Danh mục
                </label>
                {showCategoryFilter ? (
                  <ChevronUp
                    className={`h-4 w-4 transition-colors ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                ) : (
                  <ChevronDown
                    className={`h-4 w-4 transition-colors ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                )}
              </div>

              {showCategoryFilter && (
                <select
                  value={selectedType}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${
                    themeMode === "dark"
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="">Tất cả</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div
              className={`border-t transition-colors ${
                themeMode === "dark" ? "border-gray-700" : "border-gray-300"
              }`}
            ></div>

            {/* Price Filter */}
            <div className="space-y-2">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowPriceFilter(!showPriceFilter)}
              >
                <label
                  className={`text-sm font-semibold cursor-pointer transition-colors ${
                    themeMode === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Khoảng giá
                </label>
                {showPriceFilter ? (
                  <ChevronUp
                    className={`h-4 w-4 transition-colors ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                ) : (
                  <ChevronDown
                    className={`h-4 w-4 transition-colors ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                )}
              </div>

              {showPriceFilter && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Từ"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange("min", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${
                        themeMode === "dark"
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
                    <input
                      type="number"
                      placeholder="Đến"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange("max", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${
                        themeMode === "dark"
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Quick price filters */}
                  <div className="space-y-1">
                    {priceRanges.map((range, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickPriceFilter(range)}
                        className={`w-full text-left text-xs px-3 py-1.5 rounded transition ${
                          themeMode === "dark"
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className={`border-t transition-colors ${
                themeMode === "dark" ? "border-gray-700" : "border-gray-300"
              }`}
            ></div>

            {/* Sort By */}
            <div className="space-y-2">
              <label
                className={`text-sm font-semibold transition-colors ${
                  themeMode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Sắp xếp
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${
                  themeMode === "dark"
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div
              className={`pt-3 border-t space-y-2 transition-colors ${
                themeMode === "dark" ? "border-gray-700" : "border-gray-300"
              }`}
            >
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className={`w-full border px-4 py-2 rounded-md transition text-sm font-medium ${
                    themeMode === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Center */}
      <div className="flex-1 min-w-0">
        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div
            className={`border rounded-lg p-3 mb-4 transition-colors ${
              themeMode === "dark"
                ? "bg-gray-800 border-blue-700"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-sm font-medium transition-colors ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Đang lọc:
                </span>
                {selectedType && (
                  <span
                    className={`inline-flex items-center gap-1 border px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      themeMode === "dark"
                        ? "bg-gray-700 border-blue-600 text-blue-300"
                        : "bg-white border-blue-300 text-blue-700"
                    }`}
                  >
                    {selectedType}
                    <button
                      onClick={() => {
                        setSelectedType("");
                      }}
                      className={`rounded-full p-0.5 transition-colors ${
                        themeMode === "dark"
                          ? "hover:bg-gray-600"
                          : "hover:bg-blue-100"
                      }`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {(priceRange.min || priceRange.max) && (
                  <span
                    className={`inline-flex items-center gap-1 border px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      themeMode === "dark"
                        ? "bg-gray-700 border-green-600 text-green-300"
                        : "bg-white border-green-300 text-green-700"
                    }`}
                  >
                    {priceRange.min
                      ? `${parseInt(priceRange.min).toLocaleString()}đ`
                      : "0đ"}{" "}
                    -{" "}
                    {priceRange.max
                      ? `${parseInt(priceRange.max).toLocaleString()}đ`
                      : "∞"}
                    <button
                      onClick={() => {
                        setPriceRange({ min: "", max: "" });
                      }}
                      className={`rounded-full p-0.5 transition-colors ${
                        themeMode === "dark"
                          ? "hover:bg-gray-600"
                          : "hover:bg-green-100"
                      }`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {sortBy && (
                  <span
                    className={`inline-flex items-center gap-1 border px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      themeMode === "dark"
                        ? "bg-gray-700 border-purple-600 text-purple-300"
                        : "bg-white border-purple-300 text-purple-700"
                    }`}
                  >
                    {sortOptions.find((opt) => opt.value === sortBy)?.label}
                    <button
                      onClick={() => {
                        setSortBy("");
                      }}
                      className={`rounded-full p-0.5 transition-colors ${
                        themeMode === "dark"
                          ? "hover:bg-gray-600"
                          : "hover:bg-purple-100"
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
                  themeMode === "dark"
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

        {/* Products will be rendered here by parent component */}
        {children}
      </div>
    </div>
  );
}
