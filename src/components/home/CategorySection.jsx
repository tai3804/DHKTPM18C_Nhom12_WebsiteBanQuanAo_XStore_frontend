import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingBag, Flame, Tag, Watch } from "lucide-react";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function CategorySection() {
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);

  // Danh sách 4 categories với background images
  const categories = [
    {
      name: "Tất Cả",
      desc: "Khám phá toàn bộ sản phẩm",
      productType: "all",
      id: "all",
      bgImage:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80",
    },
    {
      name: "Đồ Nam",
      desc: "Thời trang nam hiện đại",
      productType: "nam",
      id: "do-nam",
      bgImage:
        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
    },
    {
      name: "Đồ Nữ",
      desc: "Thời trang nữ thanh lịch",
      productType: "nu",
      id: "do-nu",
      bgImage:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    },
    {
      name: "Phụ Kiện",
      desc: "Hoàn thiện phong cách",
      productType: "phu-kien",
      id: "phu-kien",
      bgImage:
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
    },
  ];

  const handleCategoryClick = (productType) => {
    if (productType === "all") {
      navigate("/products");
    } else {
      // Navigate với query parameter
      navigate(`/products?type=${encodeURIComponent(productType)}`);
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
        {categories.map((category, index) => (
          <motion.div
            key={category.id || category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group cursor-pointer"
            onClick={() => handleCategoryClick(category.productType)}
          >
            <div className="relative rounded-xl overflow-hidden aspect-[4/5] shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
              {/* Background Image with Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${category.bgImage})`,
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                  {category.name}
                </h3>
                <p className="text-sm md:text-base text-white/90 mb-4 transform transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                  {category.desc}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold transform transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <span>Khám phá ngay</span>
                  <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
