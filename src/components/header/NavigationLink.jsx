import { NavLink } from "react-router-dom"

export default function NavigationLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-4 py-2 rounded-full font-medium transition-all duration-200 ${
          isActive
            ? "bg-blue-100 text-blue-700" // active
            : "text-gray-700 hover:text-blue-700 hover:bg-blue-50" // mặc định + hover
        }`
      }
    >
      {children}
    </NavLink>
  )
}
