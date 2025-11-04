import React, { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp, ChevronLeft, Menu } from "lucide-react";

export default function ProductFilter({
  productTypes = [],
  onFilterChange,
  currentFilters = {},
  children,
}) {
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

  // Apply filters
  const handleApplyFilters = () => {
    const filters = {
      type: selectedType,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sortBy,
    };
    onFilterChange(filters);
    setIsOpen(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedType("");
    setPriceRange({ min: "", max: "" });
    setSortBy("");
    onFilterChange({});
  };

  // Quick price filter
  const handleQuickPriceFilter = (range) => {
    setPriceRange({ min: range.min, max: range.max || "" });
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
          className="h-10 w-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-800 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition-all"
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
          <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-4 space-y-4 h-fit sticky top-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
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
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
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
                <label className="text-sm font-semibold text-gray-900 cursor-pointer">
                  Danh mục
                </label>
                {showCategoryFilter ? (
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                )}
              </div>

              {showCategoryFilter && (
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
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

            <div className="border-t"></div>

            {/* Price Filter */}
            <div className="space-y-2">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowPriceFilter(!showPriceFilter)}
              >
                <label className="text-sm font-semibold text-gray-900 cursor-pointer">
                  Khoảng giá
                </label>
                {showPriceFilter ? (
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                )}
              </div>

              {showPriceFilter && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Từ"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Đến"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    />
                  </div>

                  {/* Quick price filters */}
                  <div className="space-y-1">
                    {priceRanges.map((range, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickPriceFilter(range)}
                        className="w-full text-left text-xs px-3 py-1.5 hover:bg-gray-100 rounded transition text-gray-700"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t"></div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Sắp xếp
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t space-y-2">
              <button
                onClick={handleApplyFilters}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
              >
                Áp dụng
              </button>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium"
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700">
                  Đang lọc:
                </span>
                {selectedType && (
                  <span className="inline-flex items-center gap-1 bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {selectedType}
                    <button
                      onClick={() => {
                        setSelectedType("");
                        onFilterChange({
                          type: "",
                          minPrice: priceRange.min,
                          maxPrice: priceRange.max,
                          sortBy,
                        });
                      }}
                      className="hover:bg-blue-100 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {(priceRange.min || priceRange.max) && (
                  <span className="inline-flex items-center gap-1 bg-white border border-green-300 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
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
                        onFilterChange({
                          type: selectedType,
                          minPrice: "",
                          maxPrice: "",
                          sortBy,
                        });
                      }}
                      className="hover:bg-green-100 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {sortBy && (
                  <span className="inline-flex items-center gap-1 bg-white border border-purple-300 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                    {sortOptions.find((opt) => opt.value === sortBy)?.label}
                    <button
                      onClick={() => {
                        setSortBy("");
                        onFilterChange({
                          type: selectedType,
                          minPrice: priceRange.min,
                          maxPrice: priceRange.max,
                          sortBy: "",
                        });
                      }}
                      className="hover:bg-purple-100 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
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
