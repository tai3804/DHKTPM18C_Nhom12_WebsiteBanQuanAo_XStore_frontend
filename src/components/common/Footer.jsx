import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">X-Store</h3>
            <p className="text-sm text-gray-400">
              Nâng tầm phong cách của bạn với những thiết kế thời trang độc đáo
              và chất lượng.
            </p>
            <div className="flex space-x-2">
              <button className="p-2 rounded-md hover:bg-gray-800 transition-colors">
                <Facebook className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-800 transition-colors">
                <Twitter className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-800 transition-colors">
                <Instagram className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Liên Kết Nhanh</h4>
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
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Chăm Sóc Khách Hàng</h4>
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
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Kết Nối Với Chúng Tôi</h4>
            <p className="text-sm text-gray-400">
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt.
            </p>
            <div className="space-y-2">
              <input
                placeholder="Nhập email của bạn"
                className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-gray-600 focus:outline-none"
              />
              <button className="w-full bg-white text-gray-900 p-2 rounded-md hover:bg-gray-100 text-sm font-medium transition-colors">
                Đăng Ký
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-400 pt-2">
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
        <hr className="my-8 border-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2025 X-Store. Đã đăng ký bản quyền.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Chính Sách Riêng Tư
            </a>
            <a
              href="/terms-of-service"
              className="hover:text-white transition-colors"
            >
              Điều Khoản Dịch Vụ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
