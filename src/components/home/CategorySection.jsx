import React, { useMemo } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Shirt, Tag, Grid3x3 } from "lucide-react";

export default function CategorySection({ productTypes = [] }) {
  const navigate = useNavigate();

  // Map icon cho các loại sản phẩm
  const getCategoryIcon = (typeName) => {
    const name = typeName?.toLowerCase() || "";
    if (name.includes("áo thun") || name.includes("t-shirt")) return "👕";
    if (name.includes("áo sơ mi") || name.includes("shirt")) return "👔";
    if (name.includes("quần jeans") || name.includes("jean")) return "👖";
    if (name.includes("quần short") || name.includes("short")) return "🩳";
    if (name.includes("áo khoác") || name.includes("jacket")) return "🧥";
    if (name.includes("váy") || name.includes("dress")) return "�";
    return "👔"; // Default icon
  };

  // Tạo danh sách categories từ productTypes
  const categories = useMemo(() => {
    const dynamicCategories = productTypes.map((type) => ({
      name: type.name,
      icon: getCategoryIcon(type.name),
      desc: type.description || `Xem tất cả ${type.name}`,
      productType: type.name,
      id: type.id,
    }));

    // Thêm các category cố định - Tất cả, Hot, Sale ở đầu
    return [
      {
        name: "Tất Cả",
        icon: "🛒",
        desc: "Xem toàn bộ sản phẩm",
        productType: "all",
        id: "all",
        bgClass: "bg-white",
        borderClass: "border-gray-200 hover:border-blue-500",
        textClass: "text-gray-900",
        descClass: "text-gray-700",
      },
      {
        name: "HOT",
        icon: "🔥",
        desc: "Sản phẩm HOT nhất",
        productType: "hot",
        id: "hot",
        bgClass: "bg-white",
        borderClass: "border-gray-200 hover:border-orange-500",
        textClass: "text-orange-600",
        descClass: "text-orange-500",
        animate: true,
      },
      {
        name: "Sale",
        icon: "🏷️",
        desc: "Ưu đãi đặc biệt",
        productType: "sale",
        id: "sale",
        bgClass: "bg-white",
        borderClass: "border-gray-200 hover:border-green-500",
        textClass: "text-green-600",
        descClass: "text-green-500",
      },
      ...dynamicCategories,
    ];
  }, [productTypes]);

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
    <section className="container mx-auto px-4 py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Mua Sắm Theo Danh Mục
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Khám phá các loại trang phục và phụ kiện theo phong cách của bạn.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 mb-16">
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
                category.bgClass || "bg-white hover:bg-gray-50"
              } ${
                category.borderClass ||
                "border-gray-200 hover:border-blue-500 hover:shadow-lg"
              } ${
                category.productType === "hot" ||
                category.productType === "sale" ||
                category.productType === "all"
                  ? "hover:shadow-xl"
                  : ""
              }`}
            >
              <div
                className={`text-4xl md:text-5xl mb-3 transition-transform ${
                  category.animate
                    ? "group-hover:scale-110 animate-pulse"
                    : "group-hover:scale-110"
                }`}
              >
                {category.icon}
              </div>
              <h3
                className={`font-semibold text-sm md:text-base mb-1 ${
                  category.textClass || "text-gray-900"
                }`}
              >
                {category.name}
              </h3>
              <p
                className={`text-xs line-clamp-2 ${
                  category.descClass || "text-gray-700"
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
