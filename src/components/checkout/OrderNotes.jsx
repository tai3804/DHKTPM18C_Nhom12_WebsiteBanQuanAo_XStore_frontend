import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

const OrderNotes = ({ notes, onNotesChange }) => {
  const themeMode = useSelector(selectThemeMode);
  const [characterCount, setCharacterCount] = useState(notes?.length || 0);
  const maxCharacters = 500;

  const handleNotesChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setCharacterCount(value.length);
      onNotesChange(value);
    }
  };

  // Removed suggested notes functionality for cleaner interface

  return (
    <div
      className={`p-6 rounded-lg border transition-colors ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-bold mb-4 flex items-center gap-2 ${
          themeMode === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Ghi chú đơn hàng
      </h3>

      {/* Notes Input */}
      <div className="mb-4">
        <textarea
          value={notes || ""}
          onChange={handleNotesChange}
          placeholder="Nhập ghi chú cho đơn hàng của bạn (không bắt buộc)..."
          className={`w-full p-4 rounded-lg border-2 transition-colors resize-none ${
            themeMode === "dark"
              ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
              : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
          }`}
          rows={4}
          maxLength={maxCharacters}
        />

        {/* Character Counter */}
        <div className="flex justify-end items-center mt-2">
          <span
            className={`text-sm ${
              characterCount > maxCharacters * 0.9
                ? "text-red-500"
                : themeMode === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {characterCount}/{maxCharacters}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderNotes;
