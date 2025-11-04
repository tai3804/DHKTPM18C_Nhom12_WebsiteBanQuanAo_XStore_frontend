import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import ProductCard from "../components/product/ProductCard";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";

export default function HotPage() {
  const allProducts = useSelector((state) => state.product.products) || [];
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20; // 4 sản phẩm x 5 dòng = 20 sản phẩm

  // Lấy sản phẩm hot (giả sử tất cả sản phẩm đều hot, hoặc có thể filter theo điều kiện)
  const hotProducts = useMemo(() => {
    return [...allProducts].sort((a, b) => b.id - a.id); // Sắp xếp theo ID giảm dần (mới nhất)
  }, [allProducts]);

  // Tính toán phân trang
  const totalPages = Math.ceil(hotProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = hotProducts.slice(startIndex, endIndex);

  // Xử lý chuyển trang
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Tạo danh sách số trang để hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="grow">
        {/* Hero Section with minimal design */}
        <section className="pt-12 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Title Section - Minimalist */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-4 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Hot Collection
              </h1>
              <p className="text-lg text-gray-600 font-light max-w-2xl">
                Khám phá những sản phẩm được yêu thích nhất, xu hướng thời trang
                mới nhất
              </p>
            </div>

            <div className="mb-12 border-b border-gray-200"></div>
          </div>
        </section>

        {/* Products Section */}
        <section className="px-4">
          <div className="container mx-auto max-w-6xl">
            {currentProducts.length === 0 ? (
              <div className="text-center py-20">
                <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-light">
                  Chưa có sản phẩm HOT nào
                </p>
              </div>
            ) : (
              <>
                {/* Products Grid - More spacing */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination - Minimalist Design */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-1">
                      {/* Previous Button */}
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-1 transition-all ${
                          currentPage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-0.5">
                        {getPageNumbers().map((page, index) => {
                          if (page === "...") {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-2 py-1 text-gray-400 font-light text-sm"
                              >
                                ...
                              </span>
                            );
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`min-w-8 h-8 text-sm font-light transition-all ${
                                currentPage === page
                                  ? "text-gray-900 border-b-2 border-gray-900"
                                  : "text-gray-500 hover:text-gray-900"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-1 transition-all ${
                          currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Page Info */}
                    <div className="text-xs text-gray-500 font-light">
                      Hiển thị {startIndex + 1} -{" "}
                      {Math.min(endIndex, hotProducts.length)} của{" "}
                      {hotProducts.length} sản phẩm
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
