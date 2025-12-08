import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getUsers } from "../../slices/UserSlice";
import { getProducts, getAllProductVariants } from "../../slices/ProductSlice";
import { getDiscounts } from "../../slices/DiscountSlice";
import { fetchAllOrders } from "../../slices/OrderSlice";
import { getProductTypes } from "../../slices/ProductTypeSlice";
import { getStocks } from "../../slices/StockSlice";
import { getProductSales } from "../../slices/ProductSalesSlice";
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
  Warehouse,
  CreditCard,
  MessageCircle,
  FileText,
} from "lucide-react";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);
  const themeMode = useSelector(selectThemeMode);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openProducts, setOpenProducts] = useState(false);

  const location = useLocation();

  // ✅ Check admin permission
  useEffect(() => {
    if (!user || !token) {
      toast.error("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    // Check if user has admin role
    const isAdmin = user.role === "ADMIN" || user.account?.role === "ADMIN";
    if (!isAdmin) {
      toast.error("Bạn không có quyền truy cập trang quản trị!");
      navigate("/");
      return;
    }
  }, [user, token, navigate]);

  // ✅ PRELOAD TẤT CẢ DỮ LIỆU ADMIN NGẦM (không chặn UI)
  useEffect(() => {
    const preloadAllAdminData = async () => {
      if (!token || !user) return;

      try {
        console.log("🚀 Starting admin data preload in background...");

        // Load tất cả dữ liệu song song trong background
        // Note: Products, Stocks, ProductSales are already loaded in App.jsx
        await Promise.all([
          // dispatch(getProducts({})),
          // dispatch(getAllProductVariants()),
          dispatch(getProductTypes()),
          dispatch(getUsers(token)),
          // dispatch(getStocks()), // Already loaded in App.jsx
          dispatch(getDiscounts(token)),
          dispatch(fetchAllOrders(token)),
          // dispatch(getProductSales()), // Already loaded in App.jsx
        ]);

        console.log("✅ Admin data preloaded successfully");
        toast.success("Đã tải dữ liệu quản trị!", { autoClose: 2000 });
      } catch (error) {
        console.error("❌ Error preloading admin data:", error);
        toast.error("Có lỗi khi tải dữ liệu quản trị!");
      }
    };

    preloadAllAdminData();
  }, [dispatch, token, user]);

  // Khi sidebar thu gọn thì dropdown luôn đóng
  useEffect(() => {
    if (!sidebarOpen) setOpenProducts(false);
  }, [sidebarOpen]);

  const isChatPage = location.pathname === "/admin/chat";

  return (
    <div
      className={`min-h-screen flex flex-col pt-16 transition-colors duration-300 overflow-hidden ${
        themeMode === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`border-r transition-all duration-300 flex flex-col fixed ${
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

            {/* Kho hàng */}
            <NavLink
              to="/admin/stocks"
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
              <Warehouse size={18} />
              {sidebarOpen && <span>Kho hàng</span>}
            </NavLink>

            {/* Giảm giá */}
            <NavLink
              to="/admin/discounts"
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
              <Tag size={18} />
              {sidebarOpen && <span>Giảm giá</span>}
            </NavLink>

            {/* Khuyến mãi sản phẩm */}
            <NavLink
              to="/admin/product-sales"
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
              <Tag size={18} />
              {sidebarOpen && <span>Khuyến mãi sản phẩm</span>}
            </NavLink>

            {/* Đơn hàng */}
            <NavLink
              to="/admin/orders"
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
              <CreditCard size={18} />
              {sidebarOpen && <span>Đơn hàng</span>}
            </NavLink>

            {/* Yêu cầu khách hàng */}
            <NavLink
              to="/admin/requests"
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
              <FileText size={18} />
              {sidebarOpen && <span>Yêu cầu khách hàng</span>}
            </NavLink>

            {/* Chat */}
            <NavLink
              to="/admin/chat"
              className={({ isActive }) =>
                `flex flex-1 h-full items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : themeMode === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <MessageCircle size={18} />
              {sidebarOpen && <span>Chat</span>}
            </NavLink>
          </nav>
        </aside>

        {/* Nội dung chính */}
        <main
          style={{ marginLeft: sidebarOpen ? "12rem" : "4rem" }}
          className={`flex-1 h-full overflow-hidden  ${
            isChatPage ? "" : "p-8"
          } transition-colors duration-300 ${
            themeMode === "dark" ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
