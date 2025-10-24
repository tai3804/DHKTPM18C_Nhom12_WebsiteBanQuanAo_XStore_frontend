import { Outlet, NavLink } from "react-router-dom";
import Header from "./Header";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUsers } from "../../slices/UserSlice";

export default function AdminLayout() {
  const dispath = useDispatch();

  useEffect(() => {
    dispath(getUsers());
  })
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

      <div className="flex flex-1">
        <aside className="bg-white border-r border-gray-200 w-36 flex flex-col">
          <nav className="flex flex-col gap-1 py-5 px-1">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Users
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Products
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 bg-gray-50 p-8">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}
