import React from 'react';
import { motion } from 'motion/react';

export default function BenefitsSection() {
    const benefits = [
        { title: 'Chất Lượng Cao Cấp', description: 'Sản phẩm được làm từ chất liệu tốt nhất, bền đẹp theo thời gian.', icon: '⭐' },
        { title: 'Giao Hàng Nhanh', description: 'Giao hàng nhanh chóng và đáng tin cậy trên toàn quốc.', icon: '🚚' },
        { title: 'Thiết Kế Độc Đáo', description: 'Luôn cập nhật những xu hướng thời trang mới nhất.', icon: '🎨' }
    ];

    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900">Tại Sao Chọn X-Store?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="text-center p-6 bg-white rounded-lg shadow"
                        >
                            <div className="text-4xl mb-4">{benefit.icon}</div>
                            <h3 className="font-medium mb-2 text-lg text-gray-900">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}