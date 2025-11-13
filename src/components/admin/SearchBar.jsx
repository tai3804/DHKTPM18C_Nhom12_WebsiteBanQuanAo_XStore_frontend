import React from "react";
import { Search, X } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function SearchBar({
  searchQuery,
  onSearchChange,
  placeholder = "Tìm kiếm...",
  onClear,
}) {
  const themeMode = useSelector(selectThemeMode);

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 w-64 ${
        themeMode === "dark"
          ? "bg-gray-700 border-gray-600 focus-within:border-gray-500"
          : "bg-white border-gray-300 focus-within:border-gray-400"
      }`}
    >
      <Search
        size={16}
        className={`transition-colors duration-300 shrink-0 ${
          themeMode === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent outline-none text-xs transition-colors duration-300 placeholder-gray-400 ${
          themeMode === "dark"
            ? "text-gray-100 placeholder-gray-500"
            : "text-gray-900 placeholder-gray-400"
        }`}
      />
      {searchQuery && (
        <button
          onClick={onClear}
          className={`p-0.5 rounded transition-colors duration-300 ${
            themeMode === "dark"
              ? "text-gray-400 hover:text-gray-200 hover:bg-gray-600"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
          title="Xóa tìm kiếm"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
