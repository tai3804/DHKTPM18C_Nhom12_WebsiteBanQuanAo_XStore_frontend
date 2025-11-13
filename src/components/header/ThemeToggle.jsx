import { Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectThemeMode, toggleTheme } from "../../slices/ThemeSlice";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector(selectThemeMode);
  const isDark = mode === "dark";

  const handleToggle = () => {
    console.log("ThemeToggle - Current mode:", mode);
    console.log("ThemeToggle - Dispatching toggle");
    dispatch(toggleTheme());
    console.log(
      "ThemeToggle - After dispatch, new mode should be:",
      !isDark ? "dark" : "light"
    );
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-200 ${
        isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
      }`}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
      ) : (
        <Sun className="h-5 w-5 text-amber-500 hover:text-amber-600 transition-colors" />
      )}
    </button>
  );
}
