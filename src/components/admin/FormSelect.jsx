// Component Select chung
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
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
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-300 ${
          themeMode === "dark"
            ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            : "bg-white border-gray-200 text-gray-700 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
        }`}
      >
        <option value="">-- Vui lòng chọn --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
