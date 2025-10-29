import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/header/Header";
import FeaturedProducts from "../components/home/FeaturedProducts";

export default function ContactPage() {
  const products = useSelector((state) => state.product.products);
  return (
    <div className="bg-[#FFF7F0] min-h-screen">
      <Header />
      <section className="mt-24 flex flex-col items-center py-8 min-h-[80vh]">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-green-400 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mb-8 text-base md:text-lg font-medium">
          Kết nối với X-Store Front để nhận tư vấn, hỗ trợ và giải đáp mọi thắc
          mắc về sản phẩm, dịch vụ và đơn hàng của bạn!
        </p>
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info Card */}
          <div className="flex flex-col gap-4 justify-center items-center md:items-start bg-white/80 rounded-2xl shadow-xl border border-blue-100 p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-100 text-blue-600 rounded-full p-2">
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 20h5v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2h5" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className="text-lg font-bold text-blue-700">
                X-Store Front
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-600 rounded-full p-2">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7.5" />
                  <path d="M16 3v4" />
                  <path d="M8 3v4" />
                  <path d="M3 10h18" />
                  <path d="M17 17l2 2 4-4" />
                </svg>
              </span>
              <span className="text-gray-700">
                123 Đường ABC, Quận 1, TP.HCM
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-600 rounded-full p-2">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <a
                href="tel:0123456789"
                className="text-blue-500 hover:underline font-semibold transition"
              >
                0123 456 789
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-600 rounded-full p-2">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16v16H4z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              </span>
              <a
                href="mailto:support@xstore.com"
                className="text-blue-500 hover:underline font-semibold transition"
              >
                support@xstore.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-100 text-yellow-600 rounded-full p-2">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </span>
              <span className="text-gray-700">8:00 - 20:00 (T2 - CN)</span>
            </div>
            <div className="mt-4 bg-gradient-to-r from-blue-100 via-cyan-100 to-green-100 rounded-lg px-4 py-2 text-center text-sm text-gray-600 font-medium shadow">
              Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn về sản phẩm, đơn hàng, bảo
              hành và các thắc mắc khác.
            </div>
          </div>
          {/* Contact Form */}
          <form className="bg-white/90 shadow-xl rounded-2xl border border-cyan-100 px-10 py-8 w-full flex flex-col gap-5 hover:shadow-2xl transition">
            <div className="mb-2">
              <label
                className="block text-gray-700 font-semibold mb-1"
                htmlFor="name"
              >
                Tên của bạn
              </label>
              <input
                id="name"
                type="text"
                className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                placeholder="Nhập tên của bạn"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 font-semibold mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                placeholder="you@email.com"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 font-semibold mb-1"
                htmlFor="message"
              >
                Nội dung
              </label>
              <textarea
                id="message"
                rows="4"
                className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                placeholder="Bạn cần hỗ trợ gì?"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-bold py-2 rounded-lg mt-2 shadow-lg transition text-lg"
            >
              Gửi liên hệ
            </button>
          </form>
        </div>
      </section>
      <FeaturedProducts products={products} />
    </div>
  );
}
