import React from 'react';
import { motion } from 'motion/react';

export default function CategorySection({ onNavigate }) {
    const categories = [
        { name: 'Áo', icon: '👕', desc: 'Áo thun, sơ mi...', page: 'shirts' },
        { name: 'Quần', icon: '👖', desc: 'Quần jeans, kaki...', page: 'pants' },
        { name: 'Váy', icon: '👗', desc: 'Váy ngắn, midi...', page: 'skirts' },
        { name: 'Đầm', icon: '💃', desc: 'Đầm dự tiệc, công sở...', page: 'dresses' },
        { name: 'Áo Khoác', icon: '🧥', desc: 'Jacket, blazer...', page: 'jackets' },
        { name: 'Phụ Kiện', icon: '✨', desc: 'Túi, nón...', page: 'accessories' },
        { name: 'Sale', icon: '🏷️', desc: 'Ưu đãi đặc biệt', page: 'sale' },
        { name: 'Tất Cả', icon: '🛒', desc: 'Xem toàn bộ sản phẩm', page: 'products' }
    ];

    return (
        <section className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold mb-4 text-gray-900">Mua Sắm Theo Danh Mục</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Khám phá các loại trang phục và phụ kiện theo phong cách của bạn.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 mb-16">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="group cursor-pointer"
                        onClick={() => onNavigate?.(category.page)} // Gọi hàm điều hướng khi click
                    >
                        <div className="bg-white hover:bg-gray-50 rounded-lg p-4 text-center transition-all duration-300 border border-gray-200 hover:shadow-md aspect-square flex flex-col justify-center items-center">
                            <div className="text-3xl md:text-4xl mb-2">{category.icon}</div>
                            <h3 className="font-medium text-sm md:text-base mb-1 text-gray-900">{category.name}</h3>
                            <p className="text-xs text-gray-500 hidden sm:block">{category.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}