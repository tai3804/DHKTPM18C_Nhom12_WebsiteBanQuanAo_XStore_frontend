import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="grow">
        {/* Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-3xl font-light tracking-wide text-gray-900 mb-10 text-center">
              CHÍNH SÁCH ĐỔI TRẢ
            </h1>
            <div className="space-y-12 text-gray-600 font-light leading-relaxed">
              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  1. Điều Kiện Đổi Trả
                </h2>
                <p className="mb-3">
                  Sản phẩm được chấp nhận đổi trả trong vòng 30 ngày kể từ ngày
                  nhận hàng nếu đáp ứng các điều kiện sau:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Sản phẩm còn nguyên tem mác, chưa qua sử dụng</li>
                  <li>Không có dấu hiệu bẩn, rách hoặc hư hỏng</li>
                  <li>Đầy đủ hóa đơn và phụ kiện đi kèm</li>
                  <li>Không thuộc danh mục sản phẩm sale trên 50%</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  2. Quy Trình Đổi Trả
                </h2>
                <p className="mb-3">
                  Để đổi trả sản phẩm, vui lòng thực hiện theo các bước sau:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>
                    Liên hệ với bộ phận chăm sóc khách hàng qua hotline hoặc
                    email
                  </li>
                  <li>
                    Cung cấp mã đơn hàng và lý do đổi trả (sai size, lỗi sản
                    phẩm...)
                  </li>
                  <li>Đóng gói sản phẩm cẩn thận và gửi về địa chỉ kho hàng</li>
                  <li>Chờ xác nhận từ bộ phận kiểm tra (1-3 ngày làm việc)</li>
                  <li>
                    Nhận sản phẩm mới hoặc hoàn tiền vào tài khoản (3-7 ngày)
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  3. Phí Đổi Trả
                </h2>
                <p className="mb-3">
                  Chính sách về phí vận chuyển khi đổi trả:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Miễn phí:</strong> Nếu lỗi do nhà sản xuất hoặc giao
                    sai hàng
                  </li>
                  <li>
                    <strong>Khách hàng chịu phí:</strong> Nếu đổi size hoặc đổi
                    ý không mua
                  </li>
                  <li>
                    <strong>Miễn phí lần đầu:</strong> Đối với thành viên VIP
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  4. Hoàn Tiền
                </h2>
                <p className="mb-3">Thời gian và hình thức hoàn tiền:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Chuyển khoản ngân hàng: 5-7 ngày làm việc kể từ khi xác nhận
                    đổi trả
                  </li>
                  <li>
                    Hoàn vào ví điện tử (Momo, ZaloPay): 3-5 ngày làm việc
                  </li>
                  <li>
                    Hoàn dưới dạng voucher: Ngay lập tức, giá trị tăng thêm 10%
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  5. Trường Hợp Không Được Đổi Trả
                </h2>
                <p className="mb-3">Các trường hợp sau không được chấp nhận:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Sản phẩm đã qua sử dụng hoặc giặt tẩy</li>
                  <li>Quá thời hạn 30 ngày kể từ ngày nhận hàng</li>
                  <li>Sản phẩm bị hư hỏng do lỗi người dùng</li>
                  <li>Sản phẩm sale/khuyến mãi đặc biệt (giảm trên 50%)</li>
                  <li>Không còn tem mác hoặc thiếu phụ kiện đi kèm</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  6. Liên Hệ Hỗ Trợ
                </h2>
                <p className="mb-3">
                  Nếu có bất kỳ thắc mắc nào về chính sách đổi trả, vui lòng
                  liên hệ:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Hotline: 1900 xxxx (8h - 22h hàng ngày)</li>
                  <li>Email: support@xstore.com</li>
                  <li>Chat trực tuyến: Trên website (góc phải màn hình)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
