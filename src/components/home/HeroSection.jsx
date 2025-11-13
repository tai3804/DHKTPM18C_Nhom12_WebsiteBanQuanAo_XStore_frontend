import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingBag, Sparkles } from "lucide-react";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function HeroSection() {
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);

  const handleShopNow = () => {
    navigate("/products");
  };

  const handleViewCollection = () => {
    navigate("/sale");
  };

  return (
    <section
      className={`relative overflow-hidden transition-colors duration-300 ${
        themeMode === "dark"
          ? "bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-linear-to-br from-blue-50 via-white to-indigo-50"
      }`}
    >
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                themeMode === "dark"
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Bộ sưu tập mới 2025
            </div>

            <h1
              className={`text-4xl lg:text-6xl tracking-tight font-bold transition-colors duration-300 ${
                themeMode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Khẳng định Phong cách
              <span
                className={`block mt-2 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Thời trang Của Bạn
              </span>
            </h1>

            <p
              className={`text-xl max-w-md mx-auto lg:mx-0 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Khám phá bộ sưu tập thời trang mới nhất, đa dạng phong cách và
              chất liệu cao cấp tại X-Store.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleShopNow}
                className={`h-12 px-8 rounded-lg font-medium transition-all hover:shadow-lg flex items-center justify-center gap-2 group text-white ${
                  themeMode === "dark"
                    ? "bg-blue-700 hover:bg-blue-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Mua Ngay
              </button>
              <button
                onClick={handleViewCollection}
                className={`h-12 px-8 border-2 rounded-lg font-medium transition-all ${
                  themeMode === "dark"
                    ? "text-gray-200 border-gray-600 hover:bg-gray-700"
                    : "text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                Xem Ưu Đãi
              </button>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-3 gap-6 pt-8 border-t transition-colors duration-300 ${
                themeMode === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div>
                <p
                  className={`text-2xl font-bold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  500+
                </p>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Sản phẩm
                </p>
              </div>
              <div>
                <p
                  className={`text-2xl font-bold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  1000+
                </p>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Khách hàng
                </p>
              </div>
              <div>
                <p
                  className={`text-2xl font-bold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  50+
                </p>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Danh mục
                </p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-2xl">
              <img
                src="/slider.jpeg"
                alt="Fashion banner"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl animate-bounce">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                🔥 Bộ Sưu Tập Mới
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-400">
                Đã Lên Kệ
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 -left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute bottom-10 -right-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
