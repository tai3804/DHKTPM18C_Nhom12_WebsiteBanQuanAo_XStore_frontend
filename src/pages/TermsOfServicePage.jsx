import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="grow">
        {/* Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-3xl font-light tracking-wide text-gray-900 mb-10 text-center">
              ĐIỀU KHOẢN DỊCH VỤ
            </h1>
            <div className="space-y-12 text-gray-600 font-light leading-relaxed">
              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  1. Chấp Nhận Điều Khoản
                </h2>
                <p>
                  Bằng việc truy cập và sử dụng website X-Store, bạn đồng ý tuân
                  thủ các điều khoản và điều kiện sử dụng được quy định dưới
                  đây.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  2. Sử Dụng Dịch Vụ
                </h2>
                <p>
                  Bạn cam kết sử dụng dịch vụ của chúng tôi một cách hợp pháp và
                  không vi phạm bất kỳ quyền lợi nào của các bên thứ ba hoặc
                  pháp luật hiện hành.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  3. Đặt Hàng và Thanh Toán
                </h2>
                <p>
                  Khi đặt hàng, bạn đồng ý cung cấp thông tin chính xác và đầy
                  đủ. Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong một số
                  trường hợp đặc biệt.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  4. Chính Sách Đổi Trả
                </h2>
                <p>
                  Sản phẩm có thể được đổi trả trong vòng 7 ngày kể từ ngày nhận
                  hàng, với điều kiện sản phẩm còn nguyên vẹn, chưa qua sử dụng
                  và có đầy đủ tem mác.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  5. Quyền Sở Hữu Trí Tuệ
                </h2>
                <p>
                  Tất cả nội dung trên website bao gồm văn bản, hình ảnh, logo
                  và thiết kế đều thuộc quyền sở hữu của X-Store và được bảo vệ
                  bởi luật sở hữu trí tuệ.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  6. Giới Hạn Trách Nhiệm
                </h2>
                <p>
                  X-Store không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp
                  hoặc gián tiếp nào phát sinh từ việc sử dụng hoặc không thể sử
                  dụng dịch vụ của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
