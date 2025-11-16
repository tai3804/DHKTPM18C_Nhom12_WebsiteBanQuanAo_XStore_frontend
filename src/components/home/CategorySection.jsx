import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingBag, Flame, Tag, Watch } from "lucide-react";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function CategorySection() {
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);

  // Danh sách 4 categories cố định
  const categories = [
    {
      name: "Tất Cả",
      icon: ShoppingBag,
      desc: "Xem toàn bộ sản phẩm",
      productType: "all",
      id: "all",
    },
    {
      name: "HOT",
      icon: Flame,
      desc: "Sản phẩm HOT nhất",
      productType: "hot",
      id: "hot",
      animate: true,
    },
    {
      name: "Sale",
      icon: Tag,
      desc: "Ưu đãi đặc biệt",
      productType: "sale",
      id: "sale",
    },
    {
      name: "Phụ Kiện",
      icon: Watch,
      desc: "Phụ kiện thời trang",
      productType: "phu-kien",
      id: "phu-kien",
    },
  ];

  const handleCategoryClick = (productType) => {
    if (productType === "all") {
      navigate("/products");
    } else if (productType === "sale") {
      navigate("/sale");
    } else if (productType === "hot") {
      navigate("/hot");
    } else {
      // Navigate với query parameter
      navigate(`/products?category=${encodeURIComponent(productType)}`);
    }
  };

  return (
    <section
      className={`container mx-auto px-4 py-16 transition-colors duration-300 ${
        themeMode === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="text-center mb-12">
        <h2
          className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
            themeMode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Mua Sắm Theo Danh Mục
        </h2>
        <p
          className={`max-w-2xl mx-auto transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-700"
          }`}
        >
          Khám phá các loại trang phục và phụ kiện theo phong cách của bạn.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
        {categories.map((category, index) => (
          <motion.div
            key={category.id || category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group cursor-pointer"
            onClick={() => handleCategoryClick(category.productType)}
          >
            <div
              className={`rounded-lg p-6 text-center transition-all duration-300 border aspect-square flex flex-col justify-center items-center ${
                category.productType === "hot"
                  ? themeMode === "dark"
                    ? "bg-gray-800 border-gray-700 hover:border-orange-400 hover:bg-gray-700"
                    : "bg-white border-gray-200 hover:border-orange-500 hover:bg-gray-50"
                  : category.productType === "sale"
                  ? themeMode === "dark"
                    ? "bg-gray-800 border-gray-700 hover:border-green-400 hover:bg-gray-700"
                    : "bg-white border-gray-200 hover:border-green-500 hover:bg-gray-50"
                  : themeMode === "dark"
                  ? "bg-gray-800 border-gray-700 hover:border-blue-400 hover:bg-gray-700"
                  : "bg-white border-gray-200 hover:border-blue-500 hover:bg-gray-50"
              } ${
                category.productType === "hot" ||
                category.productType === "sale" ||
                category.productType === "all"
                  ? "hover:shadow-xl"
                  : "hover:shadow-lg"
              }`}
            >
              <div
                className={`mb-3 transition-transform ${
                  category.animate
                    ? "group-hover:scale-110 animate-pulse"
                    : "group-hover:scale-110"
                }`}
              >
                <category.icon
                  size={48}
                  className={`transition-colors duration-300 ${
                    category.productType === "hot"
                      ? themeMode === "dark"
                        ? "text-orange-400"
                        : "text-orange-600"
                      : category.productType === "sale"
                      ? themeMode === "dark"
                        ? "text-green-400"
                        : "text-green-600"
                      : themeMode === "dark"
                      ? "text-blue-400"
                      : "text-blue-600"
                  }`}
                />
              </div>
              <h3
                className={`font-semibold text-sm md:text-base mb-1 transition-colors duration-300 ${
                  category.productType === "hot"
                    ? themeMode === "dark"
                      ? "text-orange-400"
                      : "text-orange-600"
                    : category.productType === "sale"
                    ? themeMode === "dark"
                      ? "text-green-400"
                      : "text-green-600"
                    : themeMode === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {category.name}
              </h3>
              <p
                className={`text-xs line-clamp-2 transition-colors duration-300 ${
                  category.productType === "hot"
                    ? themeMode === "dark"
                      ? "text-orange-300"
                      : "text-orange-500"
                    : category.productType === "sale"
                    ? themeMode === "dark"
                      ? "text-green-300"
                      : "text-green-500"
                    : themeMode === "dark"
                    ? "text-gray-400"
                    : "text-gray-700"
                }`}
              >
                {category.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
