import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="grow">
        {/* Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-3xl font-light tracking-wide text-gray-900 mb-10 text-center">
              CHÍNH SÁCH BẢO MẬT
            </h1>
            <div className="space-y-12 text-gray-600 font-light leading-relaxed">
              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  1. Thu Thập Thông Tin
                </h2>
                <p>
                  Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài
                  khoản, đặt hàng, hoặc liên hệ với chúng tôi. Thông tin có thể
                  bao gồm tên, địa chỉ email, số điện thoại và địa chỉ giao
                  hàng.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  2. Sử Dụng Thông Tin
                </h2>
                <p>
                  Thông tin của bạn được sử dụng để xử lý đơn hàng, cải thiện
                  dịch vụ, và gửi thông tin về sản phẩm mới hoặc ưu đãi đặc biệt
                  (với sự đồng ý của bạn).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  3. Bảo Mật Thông Tin
                </h2>
                <p>
                  Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ
                  thông tin cá nhân của bạn khỏi truy cập trái phép, thay đổi
                  hoặc tiết lộ.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  4. Chia Sẻ Thông Tin
                </h2>
                <p>
                  Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá
                  nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn, trừ
                  khi cần thiết để hoàn thành giao dịch hoặc theo yêu cầu của
                  pháp luật.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  5. Quyền Của Bạn
                </h2>
                <p>
                  Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân
                  của mình bất cứ lúc nào. Vui lòng liên hệ với chúng tôi để
                  thực hiện các quyền này.
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
