import { Outlet, NavLink } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../common/Footer";
import ChatbotAI from "./ChatbotAI";
import ChatbotStaff from "./ChatbotStaff";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
  FileText,
  Menu,
  ChevronLeft,
  Heart,
  Tag,
  HelpCircle,
  Info,
} from "lucide-react";

export default function UserLayout() {
  const themeMode = useSelector(selectThemeMode);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mặc định đóng cho mobile

  const navItems = [
    { to: "/", icon: Home, label: "Trang chủ" },
    { to: "/products", icon: ShoppingBag, label: "Sản phẩm" },
    { to: "/cart", icon: ShoppingCart, label: "Giỏ hàng" },
    { to: "/favourite", icon: Heart, label: "Yêu thích" },
    { to: "/orders", icon: FileText, label: "Đơn hàng" },
    { to: "/user", icon: User, label: "Tài khoản" },
    { to: "/sale", icon: Tag, label: "Khuyến mãi" },
    { to: "/contact", icon: HelpCircle, label: "Liên hệ" },
    { to: "/about", icon: Info, label: "Giới thiệu" },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 overflow-hidden ${
        themeMode === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        {/* Overlay cho mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Nội dung chính */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>

      <Footer />

      {/* Chatbots */}
      <ChatbotAI />
      <ChatbotStaff />
    </div>
  );
}
