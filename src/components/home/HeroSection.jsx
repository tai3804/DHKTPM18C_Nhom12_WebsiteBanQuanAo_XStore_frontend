import React from "react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl tracking-tight font-bold text-gray-900">
              Khẳng định Phong cách
              <span className="block text-blue-600">Thời trang Của Bạn</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-md mx-auto lg:mx-0">
              Khám phá bộ sưu tập thời trang mới nhất, đa dạng phong cách và
              chất liệu cao cấp tại X-Store.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-blue-600 text-white hover:bg-blue-700 h-10 px-8 rounded-md">
                Mua Ngay
              </button>
              <button className="h-10 px-8 border border-gray-300 rounded-md hover:bg-gray-50">
                Xem Bộ Sưu Tập
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
              {/* <img
                src="https://via.placeholder.com/600x450/cccccc/969696?text=Fashion+Banner"
                alt="Fashion banner"
                className="w-full h-full object-cover"
              /> */}
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
              <p className="text-sm font-medium text-gray-900">
                Bộ Sưu Tập Mới
              </p>
              <p className="text-xs text-gray-500">Đã Lên Kệ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
