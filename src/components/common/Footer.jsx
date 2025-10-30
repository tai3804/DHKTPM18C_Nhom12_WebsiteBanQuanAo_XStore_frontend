import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t border-gray-200">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">X-Store</h3>
                        <p className="text-sm text-gray-600">
                            Nâng tầm phong cách của bạn với những thiết kế thời trang độc đáo và chất lượng.
                        </p>
                        <div className="flex space-x-2">
                            <button className="p-2 rounded-md hover:bg-gray-200"><Facebook className="h-4 w-4 text-gray-600" /></button>
                            <button className="p-2 rounded-md hover:bg-gray-200"><Twitter className="h-4 w-4 text-gray-600" /></button>
                            <button className="p-2 rounded-md hover:bg-gray-200"><Instagram className="h-4 w-4 text-gray-600" /></button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Liên Kết Nhanh</h4>
                        <div className="space-y-2 text-sm">
                            {[
                                { text: 'Về Chúng Tôi', href: '/contact' },
                                { text: 'Bộ Sưu Tập', href: '/products' },
                                { text: 'Blog Thời Trang', href: '/blog' },
                                { text: 'Liên Hệ', href: '/contact' }
                            ].map(link => (
                                <a key={link.text} href={link.href} className="block text-gray-600 hover:text-blue-600 transition-colors">
                                    {link.text}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Chăm Sóc Khách Hàng</h4>
                        <div className="space-y-2 text-sm">
                            {['Hướng Dẫn Mua Hàng', 'Chính Sách Đổi Trả', 'Câu Hỏi Thường Gặp', 'Chính Sách Bảo Mật'].map(link => (
                                <a key={link} href="\#" className="block text-gray-600 hover:text-blue-600 transition-colors">
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Kết Nối Với Chúng Tôi</h4>
                        <p className="text-sm text-gray-600">
                            Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt.
                        </p>
                        <div className="space-y-2">
                            <input placeholder="Nhập email của bạn" className="w-full p-2 border rounded-md" />
                            <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 text-sm">
                                Đăng Ký
                            </button>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 pt-2">
                            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>0123 456 789</span></div>
                            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>support@xstore.com</span></div>
                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>123 Fashion Ave, TP.HCM</span></div>
                        </div>
                    </div>
                </div>
                <hr className="my-8 border-gray-200" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © 2025 X-Store. Đã đăng ký bản quyền.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-blue-600 transition-colors">Chính Sách Riêng Tư</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Điều Khoản Dịch Vụ</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}