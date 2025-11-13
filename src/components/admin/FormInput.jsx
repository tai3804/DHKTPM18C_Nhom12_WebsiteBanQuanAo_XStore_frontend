import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  const themeMode = useSelector(selectThemeMode);
  return (
    <div className="flex flex-col">
      {label && (
        <label
          className={`text-sm mb-1 transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </label>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 outline-none transition-all duration-300 ${
          themeMode === "dark"
            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            : "bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
        }`}
      />
    </div>
  );
}
