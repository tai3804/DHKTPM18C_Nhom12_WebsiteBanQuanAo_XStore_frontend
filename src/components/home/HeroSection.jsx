import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Sparkles } from "lucide-react";

export default function HeroSection() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/products");
  };

  const handleViewCollection = () => {
    navigate("/sale");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Bộ sưu tập mới 2025
            </div>

            <h1 className="text-4xl lg:text-6xl tracking-tight font-bold text-gray-900">
              Khẳng định Phong cách
              <span className="block text-blue-600 mt-2">
                Thời trang Của Bạn
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-md mx-auto lg:mx-0">
              Khám phá bộ sưu tập thời trang mới nhất, đa dạng phong cách và
              chất liệu cao cấp tại X-Store.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleShopNow}
                className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-lg font-medium transition-all hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Mua Ngay
              </button>
              <button
                onClick={handleViewCollection}
                className="text-gray-800 h-12 px-8 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all hover:border-gray-400"
              >
                Xem Ưu Đãi
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-700">Sản phẩm</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1000+</p>
                <p className="text-sm text-gray-700">Khách hàng</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">50+</p>
                <p className="text-sm text-gray-700">Danh mục</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-gray-200 shadow-2xl">
              <img
                src="/slider.jpeg"
                alt="Fashion banner"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white border border-gray-200 rounded-xl p-6 shadow-xl animate-bounce">
              <p className="text-sm font-semibold text-gray-900">
                🔥 Bộ Sưu Tập Mới
              </p>
              <p className="text-xs text-gray-700">Đã Lên Kệ</p>
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
