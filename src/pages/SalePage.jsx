import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import ProductCard from "../components/product/ProductCard";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { selectThemeMode } from "../slices/ThemeSlice";

export default function SalePage() {
  const allProducts = useSelector((state) => state.product.products) || [];
  const themeMode = useSelector(selectThemeMode);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20; // 4 sản phẩm x 5 dòng = 20 sản phẩm

  // Lấy sản phẩm sale (giả sử tất cả sản phẩm đều sale, hoặc có thể filter theo điều kiện)
  const saleProducts = useMemo(() => {
    return [...allProducts].sort((a, b) => b.id - a.id); // Sắp xếp theo ID giảm dần (mới nhất)
  }, [allProducts]);

  // Tính toán phân trang
  const totalPages = Math.ceil(saleProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = saleProducts.slice(startIndex, endIndex);

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
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        themeMode === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <Header />
      <main className="grow">
        {/* Hero Section with minimal design */}
        <section className="pt-12 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Title Section - Minimalist */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-4 bg-linear-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent">
                Sale Collection
              </h1>
              <p
                className={`text-lg font-light max-w-2xl transition-colors ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Ưu đãi đặc biệt - Giảm giá khủng cho những sản phẩm thời trang
                chọn lọc
              </p>
            </div>

            <div
              className={`mb-12 border-b transition-colors ${
                themeMode === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            ></div>
          </div>
        </section>

        {/* Products Section */}
        <section className="px-4">
          <div className="container mx-auto max-w-6xl">
            {currentProducts.length === 0 ? (
              <div className="text-center py-20">
                <Tag
                  className={`h-16 w-16 mx-auto mb-4 transition-colors ${
                    themeMode === "dark" ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <p
                  className={`text-lg font-light transition-colors ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Chưa có sản phẩm Sale nào
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
                            ? themeMode === "dark"
                              ? "text-gray-600 cursor-not-allowed"
                              : "text-gray-300 cursor-not-allowed"
                            : themeMode === "dark"
                            ? "text-gray-300 hover:bg-gray-800"
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
                                className={`px-2 py-1 font-light text-sm transition-colors ${
                                  themeMode === "dark"
                                    ? "text-gray-600"
                                    : "text-gray-400"
                                }`}
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
                                  ? themeMode === "dark"
                                    ? "text-white border-b-2 border-white"
                                    : "text-gray-900 border-b-2 border-gray-900"
                                  : themeMode === "dark"
                                  ? "text-gray-400 hover:text-gray-200"
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
                            ? themeMode === "dark"
                              ? "text-gray-600 cursor-not-allowed"
                              : "text-gray-300 cursor-not-allowed"
                            : themeMode === "dark"
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Page Info */}
                    <div
                      className={`text-xs font-light transition-colors ${
                        themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Hiển thị {startIndex + 1} -{" "}
                      {Math.min(endIndex, saleProducts.length)} của{" "}
                      {saleProducts.length} sản phẩm
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
