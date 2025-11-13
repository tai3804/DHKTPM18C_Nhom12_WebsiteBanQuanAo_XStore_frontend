import React from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function BenefitsSection() {
  const themeMode = useSelector(selectThemeMode);

  const benefits = [
    {
      title: "Chất Lượng Cao Cấp",
      description:
        "Sản phẩm được làm từ chất liệu tốt nhất, bền đẹp theo thời gian.",
      icon: "⭐",
    },
    {
      title: "Giao Hàng Nhanh",
      description: "Giao hàng nhanh chóng và đáng tin cậy trên toàn quốc.",
      icon: "🚚",
    },
    {
      title: "Thiết Kế Độc Đáo",
      description: "Luôn cập nhật những xu hướng thời trang mới nhất.",
      icon: "🎨",
    },
  ];

  return (
    <section
      className={`transition-colors duration-300 py-16 ${
        themeMode === "dark"
          ? "bg-linear-to-b from-gray-900 to-gray-800"
          : "bg-linear-to-b from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Tại Sao Chọn X-Store?
          </h2>
          <p
            className={`transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Trải nghiệm mua sắm tốt nhất với chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`text-center p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border ${
                themeMode === "dark"
                  ? "bg-gray-800 hover:shadow-lg border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3
                className={`font-semibold mb-3 text-lg transition-colors duration-300 ${
                  themeMode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {benefit.title}
              </h3>
              <p
                className={`text-sm leading-relaxed transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
