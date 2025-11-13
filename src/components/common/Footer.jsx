import React from "react";
import { useSelector } from "react-redux";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function Footer() {
  const themeMode = useSelector(selectThemeMode);
  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        themeMode === "dark"
          ? "bg-gray-950 border-gray-900"
          : "bg-gray-100 border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold transition-colors ${
                themeMode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              X-Store
            </h3>
            <p
              className={`text-sm transition-colors ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Nâng tầm phong cách của bạn với những thiết kế thời trang độc đáo
              và chất lượng.
            </p>
            <div className="flex space-x-2">
              <button
                className={`p-2 rounded-md transition-colors ${
                  themeMode === "dark"
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-200"
                }`}
              >
                <Facebook
                  className={`h-4 w-4 transition-colors ${
                    themeMode === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                />
              </button>
              <button
                className={`p-2 rounded-md transition-colors ${
                  themeMode === "dark"
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-200"
                }`}
              >
                <Twitter
                  className={`h-4 w-4 transition-colors ${
                    themeMode === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                />
              </button>
              <button
                className={`p-2 rounded-md transition-colors ${
                  themeMode === "dark"
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-200"
                }`}
              >
                <Instagram
                  className={`h-4 w-4 transition-colors ${
                    themeMode === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4
              className={`font-semibold transition-colors ${
                themeMode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Liên Kết Nhanh
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { text: "Về Chúng Tôi", href: "/about" },
                { text: "Bộ Sưu Tập", href: "/products" },
                { text: "Hot", href: "/hot" },
                { text: "Liên Hệ", href: "/contact" },
              ].map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className={`block transition-colors ${
                    themeMode === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4
              className={`font-semibold transition-colors ${
                themeMode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Chăm Sóc Khách Hàng
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { text: "Hướng Dẫn Mua Hàng", href: "/shopping-guide" },
                { text: "Chính Sách Đổi Trả", href: "/refund-policy" },
                { text: "Câu Hỏi Thường Gặp", href: "/faq" },
                { text: "Chính Sách Bảo Mật", href: "/privacy-policy" },
              ].map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className={`block transition-colors ${
                    themeMode === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4
              className={`font-semibold transition-colors ${
                themeMode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Kết Nối Với Chúng Tôi
            </h4>
            <p
              className={`text-sm transition-colors ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt.
            </p>
            <div className="space-y-2">
              <input
                placeholder="Nhập email của bạn"
                className={`w-full p-2 border rounded-md focus:outline-none transition-colors ${
                  themeMode === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400"
                }`}
              />
              <button
                className={`w-full p-2 rounded-md text-sm font-medium transition-colors ${
                  themeMode === "dark"
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Đăng Ký
              </button>
            </div>
            <div
              className={`space-y-2 text-sm pt-2 transition-colors ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>0123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@xstore.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Fashion Ave, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>
        <hr
          className={`my-8 transition-colors ${
            themeMode === "dark" ? "border-gray-800" : "border-gray-300"
          }`}
        />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className={`text-sm transition-colors ${
              themeMode === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            © 2025 X-Store. Đã đăng ký bản quyền.
          </p>
          <div
            className={`flex gap-6 text-sm transition-colors ${
              themeMode === "dark"
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <a
              href="/privacy-policy"
              className="hover:text-inherit transition-colors"
            >
              Chính Sách Riêng Tư
            </a>
            <a
              href="/terms-of-service"
              className="hover:text-inherit transition-colors"
            >
              Điều Khoản Dịch Vụ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
