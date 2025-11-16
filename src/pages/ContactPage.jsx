import React from "react";
import { useSelector } from "react-redux";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { selectThemeMode } from "../slices/ThemeSlice";

export default function ContactPage() {
  const themeMode = useSelector(selectThemeMode);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        themeMode === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <main className="grow">
        {/* Contact Info & Form */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {/* Contact Information */}
              <div className="space-y-10">
                <div>
                  <h2
                    className={`text-3xl font-light tracking-wide mb-8 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Thông Tin Liên Hệ
                  </h2>
                  <p
                    className={`font-light leading-relaxed transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-sm transition-colors duration-300 ${
                        themeMode === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <MapPin
                        className={`h-5 w-5 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-900"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-medium mb-1 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-900"
                        }`}
                      >
                        Địa chỉ
                      </h3>
                      <p
                        className={`font-light transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        123 Fashion Ave, Quận 1, TP.HCM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-sm transition-colors duration-300 ${
                        themeMode === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <Phone
                        className={`h-5 w-5 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-900"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-medium mb-1 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-900"
                        }`}
                      >
                        Điện thoại
                      </h3>
                      <p
                        className={`font-light transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        0123 456 789
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-sm transition-colors duration-300 ${
                        themeMode === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <Mail
                        className={`h-5 w-5 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-900"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-medium mb-1 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-900"
                        }`}
                      >
                        Email
                      </h3>
                      <p
                        className={`font-light transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        support@xstore.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-sm transition-colors duration-300 ${
                        themeMode === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <Clock
                        className={`h-5 w-5 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-900"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-medium mb-1 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-900"
                        }`}
                      >
                        Giờ làm việc
                      </h3>
                      <p
                        className={`font-light transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        Thứ 2 - Chủ nhật: 8:00 - 20:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div
                className={`p-10 rounded-sm transition-colors duration-300 ${
                  themeMode === "dark" ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <h2
                  className={`text-3xl font-light tracking-wide mb-8 transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Gửi Tin Nhắn
                </h2>
                <form className="space-y-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 tracking-wide transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      TÊN CỦA BẠN
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-sm focus:outline-none transition-colors duration-300 ${
                        themeMode === "dark"
                          ? "bg-gray-700 border-gray-600 focus:border-gray-400 text-gray-100"
                          : "bg-white border-gray-300 focus:border-gray-900 text-gray-900"
                      }`}
                      placeholder="Nhập tên của bạn"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 tracking-wide transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      EMAIL
                    </label>
                    <input
                      type="email"
                      className={`w-full px-4 py-3 border rounded-sm focus:outline-none transition-colors duration-300 ${
                        themeMode === "dark"
                          ? "bg-gray-700 border-gray-600 focus:border-gray-400 text-gray-100"
                          : "bg-white border-gray-300 focus:border-gray-900 text-gray-900"
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 tracking-wide transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      NỘI DUNG
                    </label>
                    <textarea
                      rows="5"
                      className={`w-full px-4 py-3 border rounded-sm focus:outline-none resize-none transition-colors duration-300 ${
                        themeMode === "dark"
                          ? "bg-gray-700 border-gray-600 focus:border-gray-400 text-gray-100"
                          : "bg-white border-gray-300 focus:border-gray-900 text-gray-900"
                      }`}
                      placeholder="Bạn cần hỗ trợ gì?"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-4 rounded-sm font-medium tracking-wider transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    GỬI TIN NHẮN
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
