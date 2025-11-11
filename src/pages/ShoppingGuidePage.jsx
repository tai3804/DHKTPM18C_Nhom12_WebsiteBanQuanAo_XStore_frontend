import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import { ShoppingBag, Search, CreditCard, Package } from "lucide-react";

export default function ShoppingGuidePage() {
  const steps = [
    {
      icon: Search,
      title: "Bước 1: Tìm Kiếm Sản Phẩm",
      description:
        "Duyệt qua các danh mục hoặc sử dụng thanh tìm kiếm để tìm sản phẩm yêu thích.",
      details: [
        "Sử dụng bộ lọc theo giá, màu sắc, size để tìm sản phẩm phù hợp",
        "Xem chi tiết sản phẩm, hình ảnh và đánh giá từ khách hàng khác",
        "So sánh các sản phẩm tương tự để chọn được sản phẩm tốt nhất",
        "Kiểm tra thông tin về chất liệu, xuất xứ và hướng dẫn bảo quản",
      ],
    },
    {
      icon: ShoppingBag,
      title: "Bước 2: Thêm Vào Giỏ Hàng",
      description:
        "Chọn size, màu sắc và số lượng, sau đó thêm sản phẩm vào giỏ hàng.",
      details: [
        "Chọn size phù hợp dựa trên bảng size chi tiết",
        "Chọn màu sắc và số lượng mong muốn",
        "Nhấn nút 'Thêm vào giỏ hàng' hoặc 'Mua ngay'",
        "Kiểm tra giỏ hàng và điều chỉnh số lượng nếu cần",
      ],
    },
    {
      icon: CreditCard,
      title: "Bước 3: Thanh Toán",
      description:
        "Điền thông tin giao hàng và chọn phương thức thanh toán phù hợp.",
      details: [
        "Điền đầy đủ thông tin: Họ tên, số điện thoại, địa chỉ giao hàng",
        "Chọn phương thức thanh toán: COD, chuyển khoản, ví điện tử, thẻ",
        "Sử dụng mã giảm giá hoặc điểm tích lũy (nếu có)",
        "Kiểm tra lại đơn hàng và xác nhận thanh toán",
      ],
    },
    {
      icon: Package,
      title: "Bước 4: Nhận Hàng",
      description:
        "Theo dõi đơn hàng và nhận sản phẩm tại địa chỉ đã cung cấp.",
      details: [
        "Nhận mã vận đơn qua email/SMS để theo dõi đơn hàng",
        "Thời gian giao hàng: 1-2 ngày (nội thành), 3-7 ngày (tỉnh)",
        "Kiểm tra sản phẩm khi nhận hàng trước khi thanh toán (COD)",
        "Liên hệ ngay nếu có vấn đề về chất lượng hoặc sai hàng",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="grow">
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h1 className="text-3xl font-light tracking-wide text-gray-900 mb-4 text-center">
              HƯỚNG DẪN MUA HÀNG
            </h1>
            <p className="text-gray-600 font-light text-center mb-16 max-w-2xl mx-auto">
              Quy trình mua hàng đơn giản, nhanh chóng và an toàn tại X-Store
            </p>

            {/* Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-6 p-8 bg-gray-50 rounded-sm"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-900 rounded-sm flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-medium text-gray-900 mb-3 tracking-wide">
                      {step.title}
                    </h2>
                    <p className="text-gray-600 font-light mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-start gap-2 text-gray-600 font-light text-sm"
                        >
                          <span className="text-gray-900 mt-1.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="mt-16 p-8 bg-gray-50 rounded-sm">
              <h2 className="text-2xl font-medium text-gray-900 mb-6 tracking-wide">
                Phương Thức Thanh Toán
              </h2>
              <div className="grid md:grid-cols-2 gap-6 text-gray-600 font-light">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Thanh toán khi nhận hàng (COD)
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Thanh toán trực tiếp cho nhân viên giao hàng</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Kiểm tra sản phẩm trước khi thanh toán</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Phí COD: Miễn phí (đơn từ 500k)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Chuyển khoản ngân hàng
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Chuyển khoản trước, giao hàng sau</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Được ưu tiên xử lý đơn hàng nhanh hơn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Giảm thêm 2% cho đơn hàng trên 1 triệu</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Ví điện tử</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Hỗ trợ: Momo, ZaloPay, VNPay, ShopeePay</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Thanh toán nhanh chóng, an toàn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Thường có ưu đãi hoàn tiền từ ví</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Thẻ tín dụng/ghi nợ
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Visa, Mastercard, JCB, Amex</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Thanh toán quốc tế được hỗ trợ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span>Bảo mật với công nghệ 3D Secure</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-16 p-8 border border-gray-200 rounded-sm">
              <h2 className="text-2xl font-medium text-gray-900 mb-6 tracking-wide">
                Mẹo Mua Hàng Thông Minh
              </h2>
              <ul className="space-y-3 text-gray-600 font-light">
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 font-medium mt-0.5">💡</span>
                  <span>
                    <strong className="text-gray-900">
                      Đăng ký tài khoản:
                    </strong>{" "}
                    Để tích điểm, nhận ưu đãi và theo dõi đơn hàng dễ dàng
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 font-medium mt-0.5">💡</span>
                  <span>
                    <strong className="text-gray-900">
                      Theo dõi khuyến mãi:
                    </strong>{" "}
                    Like fanpage và bật thông báo để không bỏ lỡ flash sale
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 font-medium mt-0.5">💡</span>
                  <span>
                    <strong className="text-gray-900">
                      Mua nhiều giảm nhiều:
                    </strong>{" "}
                    Đơn từ 3 sản phẩm thường có giá tốt hơn
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 font-medium mt-0.5">💡</span>
                  <span>
                    <strong className="text-gray-900">Đọc đánh giá:</strong>{" "}
                    Tham khảo review và hình ảnh từ khách hàng đã mua
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 font-medium mt-0.5">💡</span>
                  <span>
                    <strong className="text-gray-900">Chat tư vấn:</strong> Liên
                    hệ để được tư vấn size và phối đồ miễn phí
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="mt-16 text-center p-8 bg-gray-900 text-white rounded-sm">
              <h2 className="text-2xl font-light tracking-wide mb-4">
                Cần Hỗ Trợ?
              </h2>
              <p className="font-light mb-6 text-gray-300">
                Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình
                mua hàng
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-8 py-3 bg-white text-gray-900 font-light tracking-wide hover:bg-gray-100 transition-colors"
                >
                  Liên Hệ Ngay
                </a>
                <a
                  href="/faq"
                  className="px-8 py-3 border border-white text-white font-light tracking-wide hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Xem Câu Hỏi Thường Gặp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
