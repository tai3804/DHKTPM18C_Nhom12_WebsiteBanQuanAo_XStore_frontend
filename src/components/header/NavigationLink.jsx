import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function NavigationLink({ to, children }) {
  const themeMode = useSelector(selectThemeMode);

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-4 py-2 rounded-full font-medium transition-all duration-200 ${
          isActive
            ? themeMode === "dark"
              ? "bg-gray-800 text-white border border-gray-700 shadow-sm"
              : "bg-gray-100 text-gray-900 border border-gray-300 shadow-sm"
            : themeMode === "dark"
            ? "text-gray-300 hover:text-white hover:bg-gray-800 border border-transparent"
            : "text-gray-700 hover:text-gray-800 hover:bg-gray-100 border border-transparent"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
