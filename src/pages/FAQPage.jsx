import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Đặt Hàng & Thanh Toán",
      questions: [
        {
          question: "Làm thế nào để đặt hàng trên website?",
          answer:
            "Bạn chỉ cần chọn sản phẩm yêu thích, thêm vào giỏ hàng, sau đó điền thông tin giao hàng và chọn phương thức thanh toán. Chúng tôi sẽ xác nhận đơn hàng qua email hoặc điện thoại trong vòng 1-2 giờ.",
        },
        {
          question: "Website hỗ trợ những hình thức thanh toán nào?",
          answer:
            "Chúng tôi chấp nhận thanh toán qua: Thẻ tín dụng/ghi nợ (Visa, Mastercard), Ví điện tử (Momo, ZaloPay, VNPay), Chuyển khoản ngân hàng, và Thanh toán khi nhận hàng (COD).",
        },
        {
          question: "Có thể thay đổi hoặc hủy đơn hàng sau khi đặt không?",
          answer:
            "Có thể, bạn có thể thay đổi hoặc hủy đơn hàng trong vòng 2 giờ sau khi đặt. Vui lòng liên hệ ngay với bộ phận chăm sóc khách hàng qua hotline 1900 xxxx hoặc email support@xstore.com.",
        },
      ],
    },
    {
      category: "Giao Hàng",
      questions: [
        {
          question: "Thời gian giao hàng là bao lâu?",
          answer:
            "Thời gian giao hàng phụ thuộc vào khu vực: Nội thành TP.HCM và Hà Nội: 1-2 ngày. Các tỉnh thành khác: 3-5 ngày. Khu vực xa: 5-7 ngày. Bạn sẽ nhận được mã vận đơn để theo dõi đơn hàng.",
        },
        {
          question: "Phí giao hàng như thế nào?",
          answer:
            "Miễn phí giao hàng cho đơn hàng trên 500.000đ. Đơn hàng dưới 500.000đ: Phí 30.000đ (nội thành), 40.000đ (ngoại thành). Miễn phí toàn quốc cho thành viên VIP.",
        },
        {
          question: "Có thể chọn thời gian giao hàng cụ thể không?",
          answer:
            "Có, bạn có thể ghi chú thời gian mong muốn khi đặt hàng (sáng/chiều/tối). Chúng tôi sẽ cố gắng sắp xếp theo yêu cầu của bạn, tuy nhiên không đảm bảo 100% trong trường hợp có vấn đề bất khả kháng.",
        },
      ],
    },
    {
      category: "Sản Phẩm & Size",
      questions: [
        {
          question: "Làm sao để chọn đúng size?",
          answer:
            "Mỗi sản phẩm đều có bảng size chi tiết kèm hướng dẫn đo. Bạn có thể tham khảo hoặc liên hệ với tư vấn viên để được hỗ trợ chọn size phù hợp nhất. Nếu không vừa, bạn có thể đổi size miễn phí.",
        },
        {
          question: "Sản phẩm có giống hình ảnh trên website không?",
          answer:
            "Chúng tôi cam kết 100% hình ảnh thật của sản phẩm. Tuy nhiên màu sắc có thể chênh lệch nhẹ do ánh sáng và màn hình. Nếu không hài lòng, bạn có thể đổi trả trong vòng 30 ngày.",
        },
        {
          question: "Có nhận may đo theo yêu cầu không?",
          answer:
            "Hiện tại chúng tôi chưa có dịch vụ may đo. Tuy nhiên với bảng size đa dạng (XS-XXXL) và dịch vụ đổi size miễn phí, chúng tôi tin rằng bạn sẽ tìm được sản phẩm phù hợp.",
        },
      ],
    },
    {
      category: "Tài Khoản & Ưu Đãi",
      questions: [
        {
          question: "Lợi ích khi đăng ký tài khoản là gì?",
          answer:
            "Thành viên được hưởng nhiều ưu đãi: Tích điểm mỗi lần mua hàng (1 điểm = 1.000đ), Voucher sinh nhật 200.000đ, Ưu tiên được thông báo về sản phẩm mới và sale, Miễn phí đổi size lần đầu, Chương trình khách hàng thân thiết với nhiều quà tặng.",
        },
        {
          question: "Làm sao để trở thành thành viên VIP?",
          answer:
            "Bạn sẽ tự động được nâng hạng VIP khi: Tổng giá trị đơn hàng đạt 5.000.000đ trong 6 tháng, hoặc mua 10 đơn hàng trở lên trong năm. Thành viên VIP được giảm 10% mọi đơn hàng và miễn phí ship toàn quốc.",
        },
        {
          question: "Điểm tích lũy có thời hạn sử dụng không?",
          answer:
            "Điểm tích lũy có thời hạn 12 tháng kể từ ngày tích. Bạn có thể dùng điểm để giảm giá đơn hàng tiếp theo (100 điểm = 100.000đ). Điểm sẽ được cộng tự động vào tài khoản sau khi nhận hàng thành công.",
        },
      ],
    },
    {
      category: "Bảo Hành & Chất Lượng",
      questions: [
        {
          question: "Sản phẩm có được bảo hành không?",
          answer:
            "Tất cả sản phẩm đều được bảo hành 3 tháng với các lỗi: Sờn/phai màu sau lần giặt đầu tiên, Đường may bung/rách không do tác động vật lý, Lỗi phụ kiện (khuy, khóa kéo). Bạn cần giữ hóa đơn để được bảo hành.",
        },
        {
          question: "Làm thế nào để bảo quản sản phẩm tốt nhất?",
          answer:
            "Nên giặt tay hoặc giặt máy ở chế độ nhẹ, nhiệt độ dưới 30°C. Không dùng nước tẩy có chứa Clo. Phơi ở nơi thoáng mát, tránh ánh nắng trực tiếp. Ủi ở nhiệt độ thấp-trung bình. Có thể giặt khô cho những sản phẩm cao cấp.",
        },
        {
          question: "Sản phẩm có xuất xứ từ đâu?",
          answer:
            "Sản phẩm của X-Store được thiết kế tại Việt Nam và sản xuất tại các nhà máy đạt chuẩn quốc tế tại Việt Nam, Trung Quốc và Hàn Quốc. Chúng tôi cam kết về chất lượng vải và đường may.",
        },
      ],
    },
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="grow">
        {/* FAQ Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-10 text-center">
              CÂU HỎI THƯỜNG GẶP
            </h1>
            <div className="space-y-10">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6 tracking-wide">
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((faq, questionIndex) => {
                      const index = `${categoryIndex}-${questionIndex}`;
                      const isOpen = openIndex === index;
                      return (
                        <div
                          key={questionIndex}
                          className="border border-gray-200 dark:border-gray-700 rounded-sm overflow-hidden"
                        >
                          <button
                            onClick={() =>
                              toggleFAQ(categoryIndex, questionIndex)
                            }
                            className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                          >
                            <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">
                              {faq.question}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400 shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800 rounded-sm text-center">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3 tracking-wide">
                Không tìm thấy câu trả lời?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light mb-6">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-8 py-3 bg-gray-900 dark:bg-gray-700 text-white font-light tracking-wide hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                >
                  Liên Hệ Ngay
                </a>
                <a
                  href="tel:1900xxxx"
                  className="px-8 py-3 border border-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-light tracking-wide hover:bg-gray-900 dark:hover:bg-gray-700 hover:text-white dark:hover:text-white transition-colors"
                >
                  Gọi Hotline: 1900 xxxx
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
