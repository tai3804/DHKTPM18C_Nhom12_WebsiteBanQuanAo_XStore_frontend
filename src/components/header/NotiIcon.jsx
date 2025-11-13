import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function NotiIcon() {
  const themeMode = useSelector(selectThemeMode);

  return (
    <button
      className={`relative flex justify-center items-center rounded-full transition-all duration-200 cursor-pointer ${
        themeMode === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
      }`}
    >
      <Bell
        className={`w-6 h-6 transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      />
    </button>
  );
}
