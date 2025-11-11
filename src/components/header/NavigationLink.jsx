import { NavLink } from "react-router-dom";

export default function NavigationLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-4 py-2 rounded-full font-medium transition-all duration-200 ${
          isActive
            ? "bg-gray-200 text-gray-900 border border-gray-300 shadow-sm" // active - màu xám đậm hơn với border
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-transparent" // mặc định + hover
        }`
      }
    >
      {children}
    </NavLink>
  );
}
