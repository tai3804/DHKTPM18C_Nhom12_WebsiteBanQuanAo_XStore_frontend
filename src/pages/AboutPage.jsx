import React from "react";
import { Award, Users, Target, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="grow">
        {/* About Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-6">
                  Câu Chuyện Của Chúng Tôi
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4">
                  X-Store được thành lập với niềm đam mê mang đến những sản phẩm
                  thời trang chất lượng cao, kết hợp giữa phong cách hiện đại và
                  sự tinh tế trong từng chi tiết.
                </p>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  Chúng tôi tin rằng thời trang không chỉ là trang phục, mà là
                  cách bạn thể hiện bản thân, phong cách sống và giá trị cá
                  nhân.
                </p>
              </div>

              {/* Values Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
                <div className="space-y-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-sm w-fit">
                    <Award className="h-6 w-6 text-gray-900 dark:text-gray-300" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    Chất Lượng
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    Mỗi sản phẩm được chọn lọc kỹ càng, đảm bảo chất lượng cao
                    nhất cho khách hàng.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-sm w-fit">
                    <Users className="h-6 w-6 text-gray-900 dark:text-gray-300" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    Khách Hàng
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    Sự hài lòng của khách hàng là ưu tiên hàng đầu trong mọi
                    dịch vụ của chúng tôi.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-sm w-fit">
                    <Target className="h-6 w-6 text-gray-900 dark:text-gray-300" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    Đổi Mới
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    Luôn cập nhật xu hướng mới nhất và không ngừng cải tiến trải
                    nghiệm mua sắm.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-sm w-fit">
                    <Heart className="h-6 w-6 text-gray-900 dark:text-gray-300" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    Tận Tâm
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    Chúng tôi phục vụ với tất cả sự tận tâm và đam mê với nghề.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
