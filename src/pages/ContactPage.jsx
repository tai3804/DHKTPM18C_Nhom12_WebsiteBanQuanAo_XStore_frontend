import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="grow">
        {/* Contact Info & Form */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {/* Contact Information */}
              <div className="space-y-10">
                <div>
                  <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-8">
                    Thông Tin Liên Hệ
                  </h2>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-sm">
                      <MapPin className="h-5 w-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        Địa chỉ
                      </h3>
                      <p className="text-gray-600 font-light">
                        123 Fashion Ave, Quận 1, TP.HCM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-sm">
                      <Phone className="h-5 w-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        Điện thoại
                      </h3>
                      <p className="text-gray-600 font-light">0123 456 789</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-sm">
                      <Mail className="h-5 w-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600 font-light">
                        support@xstore.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-sm">
                      <Clock className="h-5 w-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        Giờ làm việc
                      </h3>
                      <p className="text-gray-600 font-light">
                        Thứ 2 - Chủ nhật: 8:00 - 20:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 p-10 rounded-sm">
                <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-8">
                  Gửi Tin Nhắn
                </h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 tracking-wide">
                      TÊN CỦA BẠN
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-gray-900 transition-colors"
                      placeholder="Nhập tên của bạn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 tracking-wide">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-gray-900 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 tracking-wide">
                      NỘI DUNG
                    </label>
                    <textarea
                      rows="5"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-gray-900 transition-colors resize-none"
                      placeholder="Bạn cần hỗ trợ gì?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-4 rounded-sm hover:bg-gray-800 transition-colors font-medium tracking-wider"
                  >
                    GỬI TIN NHẮN
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
