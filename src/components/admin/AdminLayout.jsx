import { Outlet, NavLink } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../slices/UserSlice";
import { getProducts } from "../../slices/ProductSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Tag,
  Menu,
  ChevronLeft,
  Box,
  Grid,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const products = useSelector((state) => state.product.products);
  const themeMode = useSelector(selectThemeMode);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openProducts, setOpenProducts] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!users || users.length === 0) await dispatch(getUsers()).unwrap();
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu admin:", err);
      }
    };
    fetchData();
  }, [dispatch, users, products]);

  // Khi sidebar thu gọn thì dropdown luôn đóng
  useEffect(() => {
    if (!sidebarOpen) setOpenProducts(false);
  }, [sidebarOpen]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        themeMode === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`border-r transition-all duration-300 flex flex-col relative ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Nút thu gọn/mở rộng */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`absolute left-2 top-2 px-4 py-3 cursor-pointer rounded-md transition ${
              themeMode === "dark"
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>

          <nav
            className={`flex transition-all duration-300 ${
              sidebarOpen ? "w-48" : "w-16"
            } flex-col py-5 px-2 mt-8 ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {/* Bảng điều khiển */}
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : themeMode === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <LayoutDashboard size={18} />
              {sidebarOpen && <span>Bảng điều khiển</span>}
            </NavLink>

            {/* Người dùng */}
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : themeMode === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <Users size={18} />
              {sidebarOpen && <span>Người dùng</span>}
            </NavLink>

            {/* Sản phẩm */}
            <div className="relative group">
              <button
                onClick={() => sidebarOpen && setOpenProducts(!openProducts)}
                className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:cursor-pointer ${
                  themeMode === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} />
                  {sidebarOpen && <span>Sản phẩm</span>}
                </div>
                {sidebarOpen &&
                  (openProducts ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  ))}
              </button>

              {/* Dropdown khi sidebar mở */}
              {sidebarOpen && openProducts && (
                <div className="flex flex-col ml-6 mt-1 gap-1">
                  <NavLink
                    to="/admin/products"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-gray-900 text-white shadow-sm"
                          : themeMode === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <Box size={16} />
                    <span>Danh sách sản phẩm</span>
                  </NavLink>

                  <NavLink
                    to="/admin/product-types"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-gray-900 text-white shadow-sm"
                          : themeMode === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <Grid size={16} />
                    <span>Loại sản phẩm</span>
                  </NavLink>
                </div>
              )}

              {/* Popup khi sidebar thu gọn */}
              {!sidebarOpen && (
                <div
                  className={`absolute top-0 left-full ml-2 w-12 flex flex-col gap-1 shadow-lg rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 ${
                    themeMode === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <NavLink
                    to="/admin/products"
                    className="flex items-center justify-center p-2 rounded-md transition"
                    title="Danh sách sản phẩm"
                  >
                    <Box size={18} />
                  </NavLink>
                  <NavLink
                    to="/admin/product-types"
                    className="flex items-center justify-center p-2 rounded-md transition"
                    title="Loại sản phẩm"
                  >
                    <Grid size={18} />
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* Nội dung chính */}
        <main
          className={`flex-1 p-8 transition-colors duration-300 ${
            themeMode === "dark" ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
